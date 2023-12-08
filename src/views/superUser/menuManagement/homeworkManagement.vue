<template>
  <div class="homework-management">
    <div class="header">
      <el-button type="primary" size="small" @click="addexper">添加作业</el-button>
      <el-button type="danger" size="small" @click="delexper">批量删除</el-button>
      <el-button type="primary" size="small" @click="returnexper">返回章节</el-button>
    </div>
    <el-table
      ref="multipleTable"
      height="410"
      v-loading="$store.state.isLoading"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      border
      @selection-change="handleSelectionChange"
      class="custom-table"
    >
      <el-table-column type="selection" width="50"></el-table-column>
      <el-table-column prop="name" label="作业名称" width="80"></el-table-column>
      <el-table-column prop="content" label="作业内容"></el-table-column>
      <el-table-column prop="answer" label="参考答案"></el-table-column>
      <el-table-column prop="status" label="状态" width="80">
        <template slot-scope="scope">
          <div v-if="scope.row.status" class="user">启用</div>
          <div v-else class="forbidden">禁用</div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="editexrept(scope.row)">编辑</el-button>
          <el-button type="danger" size="mini" @click="del(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="block">
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="10"
        layout="total,  prev, pager, next"
        :total="tableData.length"
      ></el-pagination>
    </div>

    <!-- 添加/编辑实验 -->
    <el-dialog
      :visible.sync="dialogVisible"
      width="30%"
      :title="edit ? '添加作业' : '修改作业'"
      :before-close="closeDialog"
      :close-on-click-modal="false"
    >
      <el-form :model="revise" :rules="rules" ref="formModel">
        <el-form-item label="作业名称" prop="name">
          <el-input placeholder="请输入作业名称" v-model="revise.name"> </el-input>
        </el-form-item>
        <el-form-item label="作业内容" prop="content">
          <el-input placeholder="请输入作业内容" v-model="revise.content" type="textarea"> </el-input>
        </el-form-item>
        <el-form-item label="参考答案" prop="answer">
          <el-input placeholder="请输入参考答案" v-model="revise.answer" type="textarea"> </el-input>
        </el-form-item>
        <el-form-item label="状态" class="form-status">
          <el-radio-group v-model="revise.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item class="form-btn">
          <el-button size="small" @click="serve" type="primary">{{ edit ? '添加' : '修改' }}</el-button>
          <el-button size="small" @click="closeDialog">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { addHomeWork, editHomeWork, delHomeWork, delAllHomeWork } from '@/utils/api';
import { getHomeWorkListService } from '@/api/homework.js';
export default {
  data() {
    return {
      tableData: [],
      currentPage: 1,
      input: '',
      dialogVisible: false,
      edit: true,
      id: '',
      idArr: [],
      revise: {
        name: '',
        content: '',
        answer: '',
        status: 0,
      },
      rules: {
        name: { required: true, message: '课程名称不能为空', trigger: 'blur' },
        content: {
          required: true,
          message: '课程内容不能为空',
          trigger: 'blur',
        },
        answer: {
          required: true,
          message: '参考答案不能为空',
          trigger: 'blur',
        },
      },
    };
  },
  methods: {
    // 关闭弹框
    closeDialog() {
      this.dialogVisible = false;
      this.$refs['formModel'].resetFields();
    },
    // 添加实验
    addexper() {
      this.revise = {
        name: '',
        content: '',
        answer: '',
        status: 0,
      };
      this.dialogVisible = true;
      this.edit = true;
    },

    // 编辑实验
    editexrept(e) {
      const data = JSON.parse(JSON.stringify(e));
      this.revise = {
        name: data.name,
        content: data.content,
        answer: data.answer,
        status: data.status,
      };
      this.id = data.id;
      this.dialogVisible = true;
      this.edit = false;
    },
    // 保存
    serve() {
      this.$refs['formModel'].validate(async (valid) => {
        if (valid) {
          if (this.edit) {
            // 添加实验
            const data = { articleId: this.$route.query.id, ...this.revise };
            await addHomeWork(data);
            this.$message.success('作业添加成功');
          } else {
            // 编辑实验
            const data = { id: this.id, ...this.revise };
            await editHomeWork(data);
            this.$message.success('作业修改成功');
          }
          this.getDataList();
          this.dialogVisible = false;
        }
      });
    },
    // 删除
    del(id) {
      this.$confirm('你确定要删除么?', '提示', {
        type: 'warning',
      })
        .then(async () => {
          await delHomeWork(id);
          this.$message.success('作业删除成功');
          this.getDataList();
        })
        .catch(() => {});
    },
    //批量删除
    delexper() {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        type: 'warning',
      })
        .then(async () => {
          const ids = this.idArr.join(',');
          await delAllHomeWork(ids);
          this.$message.success('作业删除成功');
          this.getDataList();
        })
        .catch(() => {});
    },
    //返回章节
    returnexper() {
      history.back();
    },
    // 分页
    handleCurrentChange(val) {
      this.currentPage = val;
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      const ids = [];
      val.map((item) => {
        ids.push(item.id);
      });
      this.idArr = ids;
    },
    // 获取数据
    async getDataList() {
      const res = await getHomeWorkListService(this.$route.query.id);
      this.tableData = res.data;
    },
  },
  created() {
    this.getDataList();
  },
};
</script>

<style scoped>
.block {
  margin-top: 10px;
}
.header {
  width: 100%;
  height: 30px;
  line-height: 30px;
  display: flex;
  margin-bottom: 10px;
}
.title {
  width: 80px;
  line-height: 30px;
}
.but {
  position: relative;
  text-align: center;
  line-height: 30px;
  width: 40px !important;
  background-color: #409eff;
  border: none;
  margin-left: 5px;
  border-radius: 5px;
  color: white;
  left: 150px;
  cursor: pointer;
}
.exper {
  position: relative;
  left: 155px;
  text-align: center;
  line-height: 7px;
}
.inputw {
  width: 300px;
  margin-top: 10px;
}
.form-status,
.form-btn {
  margin-bottom: 10px;
}
</style>
<style>
#inputh {
  height: 30px !important;
  width: 150px !important;
}
.homework-management .header .el-input {
  width: 150px;
  margin-right: 10px;
}
.homework-management .el-dialog__body .el-form-item {
  display: flex;
}
.homework-management .el-dialog__body .el-form-item .el-form-item__content {
  flex: 1;
}
.homework-management .el-dialog__body .form-status .el-form-item__label {
  width: 70px;
  text-align: left;
  padding-left: 10px;
}
.homework-management .el-dialog__body .form-status .el-form-item__content {
  display: flex;
  align-items: center;
  padding-left: 10px;
}
.homework-management .el-dialog__body .form-btn .el-form-item__content {
  display: flex;
  align-items: center;
  justify-content: space-evenly;
}
.el-input-group__prepend {
  width: 55px;
}
.custom-table {
  overflow: hidden !important;
  white-space: nowrap !important;
  text-overflow: ellipsis !important;
}
.user {
  color: #08b1e4;
}
.forbidden {
  color: rgb(223, 6, 6);
}
</style>

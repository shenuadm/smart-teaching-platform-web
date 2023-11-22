<template>
  <div class="homework-management">
    <div class="header">
      <div class="title">作业名称:</div>
      <el-input v-model="input" id="inputh" placeholder="请输入内容"></el-input>
      <el-button type="primary" size="small" @click="search">搜索</el-button>
      <el-button type="primary" size="small" @click="resetting">重置</el-button>
      <el-button type="primary" size="small" @click="addexper">添加作业</el-button>
      <el-button type="danger" size="small" @click="delexper">批量删除</el-button>
      <el-button type="primary" size="small" @click="returnexper">返回</el-button>
    </div>

    <el-table
      ref="multipleTable"
      height="410"
      :data="tableData.slice((currentPage - 1) * pageSize, currentPage * pageSize)"
      tooltip-effect="dark"
      style="width: 100%"
      border
      @selection-change="handleSelectionChange"
      class="custom-table"
    >
      <el-table-column type="selection" width="50"></el-table-column>
      <el-table-column
        prop="name"
        label="作业名称"
        width="80"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="content"
        label="作业内容"
        align="center"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="answer"
        label="参考答案"
        align="center"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column prop="status" label="状态" width="80" align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.status" class="user">启用</div>
          <div v-else class="forbidden">禁用</div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="editexrept(scope.row)"
            >编辑</el-button
          >
          <el-button type="danger" size="mini" @click="del(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tableData.length"
      ></el-pagination>
    </div>

    <!-- 添加/编辑实验 -->
    <el-dialog
      :visible.sync="dialogVisible"
      width="30%"
      :title="edit ? '添加作业' : '修改作业'"
      :before-close="closeDialog"
    >
      <el-form :model="revise" :rules="rules" ref="formModel">
        <el-form-item label="作业名称" prop="name">
          <el-input placeholder="请输入作业名称" v-model="revise.name"> </el-input>
        </el-form-item>
        <el-form-item label="作业内容" prop="content">
          <el-input placeholder="请输入作业内容" v-model="revise.content" type="textarea">
          </el-input>
        </el-form-item>
        <el-form-item label="参考答案" prop="answer">
          <el-input placeholder="请输入参考答案" v-model="revise.answer" type="textarea">
          </el-input>
        </el-form-item>
        <el-form-item label="状态" class="form-status">
          <el-radio-group v-model="revise.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item class="form-btn">
          <el-button size="small" @click="serve" type="primary">{{
            edit ? "添加" : "修改"
          }}</el-button>
          <el-button size="small" @click="closeDialog">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import {
  getHomeWorkList,
  addHomeWork,
  editHomeWork,
  delHomeWork,
  delAllHomeWork,
} from "@/utils/api";
export default {
  data() {
    return {
      tableData: [],
      currentPage: 1,
      pageSize: 5,
      input: "",
      dialogVisible: false,
      articleId: 0,
      edit: true,
      id: "",
      idArr: [],
      revise: {
        name: "",
        content: "",
        answer: "",
        status: 0,
      },
      rules: {
        name: { required: true, message: "课程名称不能为空", trigger: "blur" },
        content: { required: true, message: "课程内容不能为空", trigger: "blur" },
        answer: { required: true, message: "参考答案不能为空", trigger: "blur" },
      },
    };
  },
  methods: {
    // 关闭弹框
    closeDialog() {
      this.dialogVisible = false;
      this.$refs["formModel"].resetFields();
    },
    //搜索
    async search() {
      if (!this.input) return;
      const res = await getHomeWorkList(this.articleId, { name: this.input });
      this.tableData = res.data;
    },
    //重置
    resetting() {
      this.getDataList();
    },
    // 添加实验
    addexper() {
      this.revise = {
        name: "",
        content: "",
        answer: "",
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
      this.$refs["formModel"].validate(async (valid) => {
        if (valid) {
          if (this.edit) {
            // 添加实验
            const data = { articleId: this.articleId, ...this.revise };
            const res = await addHomeWork(data);
            if (res.code === 0) {
              this.$message({
                message: "作业添加成功",
                type: "success",
              });
              this.getDataList();
              this.dialogVisible = false;
            } else {
              this.$message.error(res.msg);
            }
          } else {
            // 编辑实验
            const data = { id: this.id, ...this.revise };
            const res = await editHomeWork(data);
            if (res.code === 0) {
              this.$message({
                message: "作业修改成功",
                type: "success",
              });
              this.getDataList();
              this.dialogVisible = false;
            } else {
              this.$message.error(res.msg);
            }
          }
        } else {
          return false;
        }
      });
    },
    // 删除
    del(id) {
      this.$confirm("你确定要删除么?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const res = await delHomeWork(id);
          if (res.code === 0) {
            this.$message({
              message: "作业删除成功",
              type: "success",
            });
            this.getDataList();
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch(() => {});
    },
    //批量删除
    delexper() {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const ids = this.idArr.join(",");
          const res = await delAllHomeWork(ids);
          if (res.code === 0) {
            this.$message({
              message: "作业删除成功",
              type: "success",
            });
            this.getDataList();
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch(() => {});
    },
    //返回章节
    returnexper() {
      history.back();
    },
    // 分页
    handleSizeChange(val) {
      this.pageSize = val;
    },
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
    getDataList() {
      const id = this.$route.query.id;
      this.articleId = id;
      getHomeWorkList(id).then((res) => {
        this.tableData = res.data;
      });
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

<template>
  <div class="experimentManagement">
    <div class="header mb-20">
      <!-- <div class="title">实验标题:</div> -->
      <!-- <el-input v-model="input" id="inputh" placeholder="请输入实验标题"></el-input> -->
      <!-- <el-button size="small" type="primary" @click="search">搜索</el-button> -->
      <!-- <el-button size="small" type="primary" @click="resetting">重置</el-button> -->
      <el-button size="small" type="primary" @click="addexper">添加实验</el-button>
      <el-button size="small" type="danger" @click="delexper">批量删除</el-button>
      <el-button size="small" type="primary" @click="returnexper">返回章节</el-button>
    </div>
    <el-table
      ref="multipleTable"
      height="410"
      border
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
      class="custom-table"
      v-loading="$store.state.isLoading">
      <el-table-column type="selection" width="50"> </el-table-column>
      <el-table-column prop="title" label="实验标题" width="200" show-overflow-tooltip> </el-table-column>
      <el-table-column prop="sort" label="排序" width="80"> </el-table-column>
      <el-table-column prop="classHour" label="课时" width="80"> </el-table-column>
      <el-table-column prop="description" label="实验描述" text-align: center> </el-table-column>
      <el-table-column label="操作" width="250">
        <template #default="{ row }">
          <el-button type="primary" size="mini" class="opertea" @click="exreport(row)">实验报告</el-button>
          <el-button type="primary" size="mini" @click="editexrept(row)">编辑</el-button>
          <el-button type="danger" size="mini" @click="del(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      :visible.sync="dialogVisible"
      width="30%"
      :title="edit ? '添加实验' : '编辑实验'"
      :before-close="closeDialog"
      :close-on-click-modal="false"
      v-loading="$store.state.isLoading">
      <el-form :model="revise" :rules="rules" ref="revise" label-width="80px" class="demo-ruleForm">
        <el-form-item label="实验标题" prop="title">
          <el-input v-model="revise.title" placeholder="请输入实验标题"></el-input>
        </el-form-item>
        <el-form-item label="实验排序" prop="sort">
          <el-input placeholder="请输入序号" type="number" v-model.number="revise.sort"> </el-input>
        </el-form-item>
        <el-form-item label="实验课时" prop="classHour">
          <el-input v-model.number="revise.classHour" placeholder="请输入实验课时" type="number"></el-input>
        </el-form-item>
        <el-form-item label="实验描述" prop="description">
          <el-input type="textarea" v-model="revise.description" placeholder="请输入实验描述" :rows="8"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="primary" @click="serve">保存</el-button>
        <el-button @click="closeDialog" type="info">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { exper, experadd, experdel, experedit, mexperdel } from '@/utils/api';
export default {
  data() {
    return {
      tableData: [],
      arr: [],
      input: '',
      dialogVisible: false,
      id: 0,
      edit: '',
      revise: {
        title: '',
        classHour: '',
        description: '',
        fileUrl: '',
        sort: undefined,
      },
      // 表单校验
      rules: {
        title: [{ required: true, message: '请输入实验标题', trigger: 'blur' }],
        classHour: [{ required: true, message: '请输入实验课时', trigger: 'blur' }],
        description: [{ required: true, message: '请输入实验描述', trigger: 'blur' }],
        sort: [
          { required: true, message: '请输入实验排序', trigger: 'blur' },
          { type: 'number', message: '实验排序应为数字' },
        ],
      },
    };
  },
  methods: {
    // 关闭弹框
    closeDialog() {
      // this.$refs['revise'].resetFields();
      this.dialogVisible = false;
    },
    //实验报告
    exreport(e) {
      this.$router.push({
        path: '/laboratoryReport',
        query: {
          id: e.id,
          sort: e.sort,
        },
      });
    },
    //搜索
    search() {
      this.tableData = this.tableData.filter((item) => {
        return item.title.includes(this.input);
      });
    },
    //重置
    resetting() {
      this.input = '';
      // this.break();
    },
    //添加实验
    addexper() {
      this.dialogVisible = true;
      this.edit = true;
      this.revise = {};
    },
    //编辑实验
    editexrept(data) {
      this.revise = JSON.parse(JSON.stringify(data));
      this.dialogVisible = true;
      this.edit = false;
    },
    async break() {
      const res = await exper(this.id);
      this.tableData = res.data;
    },
    //保存
    serve() {
      this.$refs['revise'].validate(async (valid) => {
        if (valid) {
          const data = { ...this.revise, articleId: this.id };
          if (this.edit) {
            // 新增实验
            await experadd(data);
            await this.break();
            this.$message.success('添加实验成功');
          } else {
            // 编辑实验
            await experedit(data);
            await this.break();
            this.$message.success('编辑实验成功');
          }
          this.edit = false;
          this.dialogVisible = false;
        }
      });
    },
    //删除
    del(id) {
      this.$confirm('您确认要删除该实验吗?', '提示', { type: 'warning' })
        .then(async () => {
          await experdel(id);
          this.$message.success('删除实验成功');
          await this.break();
        })
        .catch(() => {});
    },
    //批量删除
    delexper() {
      if (this.arr.length === 0) return this.$message.warning('您还没有选中要删除的实验');
      this.$confirm('您确认要删除选中的实验吗?', '提示', { type: 'warning' })
        .then(async () => {
          await mexperdel(this.arr);
          this.$message.success('删除成功');
          await this.break();
        })
        .catch(() => {});
    },
    //返回章节
    returnexper() {
      history.back();
    },
    handleSelectionChange(val) {
      this.arr = val.map((item) => item.id);
    },
    async getData() {
      const { data } = await exper(this.id);
      this.tableData = data;
    },
  },
  mounted() {
    this.id = +this.$route.query.id;
    this.getData();
  },
};
</script>

<style scoped>
.header {
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
}
.header .el-input {
  width: 200px;
  margin-right: 10px;
}
</style>
<style>
.experimentManagement #inputh {
  height: 30px !important;
  width: 200px !important;
}
.experimentManagement .el-input-group__prepend {
  width: 55px;
}
.experimentManagement #inputwd {
  width: 195px !important;
  margin-left: 160px;
  margin-top: -89px;
  height: 72px !important;
  border-radius: none;
}
.experimentManagement .form-btn .el-form-item__content {
  margin-left: 0 !important;
  display: flex;
  justify-content: space-around;
}
</style>

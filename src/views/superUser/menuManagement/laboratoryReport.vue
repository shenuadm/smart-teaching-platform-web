<!--suppress CssUnusedSymbol -->
<template>
  <div class="laboratory-report">
    <div class="header mb-20">
      <el-button type="primary" class="exper" @click="addreport">添加实验报告</el-button>
      <el-button type="primary" class="exper" @click="returnexper">返回实验</el-button>
      <el-button type="danger" class="exper" @click="delexper">批量删除</el-button>
    </div>
    <el-table
      height="410"
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
      class="custom-table"
      border
      v-loading="$store.state.isLoading">
      <el-table-column align="center" type="selection" width="50"> </el-table-column>
      <el-table-column align="center" prop="title" label="实验报告标题" width="150"> </el-table-column>
      <el-table-column align="center" prop="classHour" label="课时" width="80"> </el-table-column>
      <el-table-column prop="description" label="实验描述" width="300" align="center"> </el-table-column>
      <!-- <el-table-column prop="fileUrl" label="实验课件" width="200"  align="center">
        <template #default="scope">
          <a :href="scope.row.fileUrl" v-if="scope.row.fileUrl">查看课件</a>
        </template>
      </el-table-column> -->
      <el-table-column prop="result" label="实验结果"></el-table-column>
      <el-table-column label="操作" width="250">
        <template #default="scope">
          <el-button type="primary" size="small" class="opertea" @click="exreport(scope.row)">实验步骤</el-button>
          <el-button type="primary" size="small" @click="editexrept(scope.row)">编辑</el-button>
          <el-button type="danger" size="small" @click="del(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 添加/编辑实验 -->
    <el-dialog
      :title="revise.id ? '修改实验报告' : '添加实验报告'"
      :visible.sync="dialogVisible"
      width="40%"
      :before-close="closeAddReport"
      :close-on-click-modal="false">
      <el-form
        :model="revise"
        :rules="rules"
        label-width="110px"
        ref="formRule"
        label-position="right"
        v-loading="$store.state.isLoading">
        <el-form-item label="实验报告标题" prop="title" class="laboratory-from">
          <el-input placeholder="请输入实验报告标题" v-model="revise.title"></el-input>
        </el-form-item>
        <el-form-item label="实验报告课时" prop="classHour" class="laboratory-from">
          <el-input placeholder="请输入实验报告课时" v-model="revise.classHour"></el-input>
        </el-form-item>
        <el-form-item label="实验报告描述" prop="description" class="laboratory-from">
          <el-input
            placeholder="请输入实验报告描述"
            type="textarea"
            :autosize="{ minRows: 4, maxRows: 4 }"
            v-model="revise.description"></el-input>
        </el-form-item>
        <el-form-item label="实验报告结果" prop="result" class="laboratory-from">
          <el-input
            v-model="revise.result"
            placeholder="请输入实验报告结果"
            type="textarea"
            :autosize="{ minRows: 4, maxRows: 4 }"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="serve" type="primary">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { report, reportadd, reportupdate, reportdelete, mreportdelete } from '@/utils/api';
export default {
  data() {
    return {
      fileList: [],
      multipleSelection: [],
      tableData: [],
      reportdata: [],
      arr: [],
      currentPage: 1,
      pageSize: 5,
      input: '',
      exdialogtabledata: false,
      dialogVisible: false,
      report: '',
      id: 0, // 实验id
      revise: {
        title: '',
        classHour: '',
        description: '',
        result: '',
      },
      rules: {
        title: [{ required: true, message: '请输入实验标题', trigger: 'blur' }],
        classHour: [{ required: true, message: '请输入课时', trigger: 'blur' }],
        description: [{ required: true, message: '请输入实验描述', trigger: 'blur' }],
        result: [{ required: true, message: '请输入实验报告结果', trigger: 'blur' }],
      },
    };
  },
  methods: {
    // 关闭dialog弹框
    closeAddReport() {
      this.dialogVisible = false;
    },
    //添加实验报告
    addreport() {
      this.empty(this.revise);
      this.dialogVisible = true;
    },
    //跳转至实验步骤
    exreport(e) {
      this.$router.push({
        path: '/laboratoryStep',
        name: 'laboratoryStep',
        query: {
          id: e.id,
        },
      });
    },
    //保存
    serve() {
      this.$refs['formRule'].validate(async (valid) => {
        if (valid) {
          if (!this.revise.id) {
            await reportadd({ ...this.revise, experimentId: this.id });
            this.$message.success('添加实验报告成功');
          } else {
            await reportupdate(this.revise);
            this.$message.success('修改实验报告成功');
          }
          await this.break();
          this.dialogVisible = false;
        }
      });
    },
    //取消
    cancel() {
      this.$refs['formRule'].resetFields();
      this.dialogVisible = false;
    },
    //返回实验
    returnexper() {
      history.back();
    },
    //编辑实验
    editexrept(data) {
      this.revise = JSON.parse(JSON.stringify(data));
      this.dialogVisible = true;
      this.report = false;
    },
    //删除
    del(e) {
      this.$confirm('您确认要删除该实验吗?', '提示', { type: 'warning' })
        .then(async () => {
          await reportdelete(e);
          await this.break();
          this.$message.success('删除成功');
        })
        .catch(() => {});
    },
    //批量删除
    delexper() {
      if (this.arr.length === 0) return this.$message.warning('请选择实验后再进行删除');
      this.$confirm('您确认要删除选中的实验吗?', '提示', { type: 'warning' })
        .then(async () => {
          await mreportdelete(this.arr);
          await this.break();
          this.$message.success('删除成功');
        })
        .catch(() => {});
    },
    handleSelectionChange(val) {
      this.arr = val.map((item) => item.id);
    },
    empty(obj) {
      for (const prop of Object.keys(obj)) {
        obj[prop] = '';
      }
    },
    async break() {
      const res = await report(this.id);
      this.tableData = res.data;
    },
  },
  mounted() {
    this.id = this.$route.query.id;
    this.break();
  },
};
</script>

<style>
/* 弹框表单每项标题与表单内容间的外间距 */
.laboratory-from > div {
  margin-left: 0 !important;
}
</style>

<style scoped>
.header {
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
}
.title {
  width: 120px;
  line-height: 30px;
}
.exper {
  position: relative;
  margin-left: 5px;
  text-align: center;
  line-height: 7px;
}
.el-input {
  width: 200px;
}
</style>
<style>
/* 表格 */
.laboratory-report .el-table__header-wrapper .el-table__header .el-table__cell,
.laboratory-report .el-table__body-wrapper .el-table__row .el-table__cell {
  text-align: center;
}
/* dialog框 */
.laboratory-report .el-dialog__body .el-form-item {
  display: flex;
}
.laboratory-report .el-dialog__body .el-form-item .el-form-item__content {
  width: 100%;
  flex: 1;
}
.laboratory-report .el-dialog__body .el-form-item .el-form-item__content .el-input {
  width: 100% !important;
}
.laboratory-report .el-dialog__body .upload-file .el-form-item__label {
  width: 78px;
}
.laboratory-report .el-dialog__body .upload-file .el-form-item__content {
  display: flex;
  text-align: left;
}
.laboratory-report .el-dialog__body .upload-file .el-form-item__content .el-upload__tip,
.laboratory-report .el-dialog__body .upload-file .el-form-item__content .el-upload__tip .el-upload-list__item {
  margin-top: 0 !important;
  height: 30px;
}
.laboratory-report .el-dialog__body .form-btn {
  margin-bottom: 0;
}
.laboratory-report .el-dialog__body .form-btn .el-form-item__content {
  display: flex;
  justify-content: space-evenly;
}
.laboratory-report .el-input-group__prepend {
  width: 55px;
}
</style>

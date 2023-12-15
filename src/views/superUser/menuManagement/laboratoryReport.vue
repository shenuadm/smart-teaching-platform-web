<template>
  <div class="laboratory-report">
    <div class="header">
      <div class="title">实验报告标题:</div>
      <el-input v-model="input" id="inputh" placeholder="请输入实验报告标题"></el-input>
      <button class="but" @click="search">搜索</button>
      <button class="but" @click="resetting">重置</button>
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
      v-loading="$store.state.isLoading"
    >
      <el-table-column align="center" type="selection" width="50"> </el-table-column>
      <el-table-column align="center" prop="title" label="实验报告标题" width="150"> </el-table-column>
      <el-table-column align="center" prop="classHour" label="课时" width="80"> </el-table-column>
      <el-table-column prop="description" label="实验描述" width="300" align="center"> </el-table-column>
      <!-- <el-table-column prop="fileUrl" label="实验课件" width="200"  align="center">
        <template slot-scope="scope">
          <a :href="scope.row.fileUrl" v-if="scope.row.fileUrl">查看课件</a>
        </template>
      </el-table-column> -->
      <el-table-column prop="result" label="实验结果"></el-table-column>
      <el-table-column label="操作" width="250">
        <template slot-scope="scope">
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
      :close-on-click-modal="false"
    >
      <el-form
        :model="revise"
        :rules="rules"
        label-width="110px"
        ref="formRule"
        label-position="right"
        v-loading="$store.state.isLoading"
      >
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
            v-model="revise.description"
          ></el-input>
        </el-form-item>
        <el-form-item label="实验报告结果" prop="result" class="laboratory-from">
          <el-input
            v-model="revise.result"
            placeholder="请输入实验报告结果"
            type="textarea"
            :autosize="{ minRows: 4, maxRows: 4 }"
          ></el-input>
        </el-form-item>
        <!-- <el-form-item :label="isAddReport ? '上传课件' : '修改课件'" class="upload-file laboratory-from">
          <el-upload action="" :auto-upload="false" :file-list="fileList" :limit="1" :on-change="handlePreview">
            <el-button size="small" type="primary" plain v-if="fileList.length === 0">{{
              isAddReport ? '点击上传' : '点击修改'
            }}</el-button>
            <div slot="tip" class="el-upload__tip">只能上传单个文件</div>
          </el-upload>
          <a :href="revise.fileUrl" v-if="revise.fileUrl" class="pdf-view">查看课件</a>
        </el-form-item> -->
        <el-form-item class="form-btn">
          <el-button @click="serve" type="primary">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </el-form-item>
      </el-form>
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
    // 上传报告文件
    handlePreview(file) {
      console.log(file);
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
    //搜索
    search() {
      this.exdialogtabledata = true;
      this.reportdata = this.tableData.filter((item) => {
        // 根据实际需求编写模糊搜索的逻辑，例如使用正则表达式
        return item.title.includes(this.input);
      });
    },
    //重置
    resetting() {
      this.exdialogtabledata = false;
      this.input = '';
      this.reportdata = [];
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
    handleSizeChange(val) {
      this.pageSize = val;
    },
    handleCurrentChange(val) {
      this.currentPage = val;
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach((row) => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      this.multipleSelection.forEach((obj) => {
        const id = obj.id;
        this.arr.push(id);
        const arrdel = [...new Set(this.arr)];
        this.arr = arrdel;
        console.log(arrdel);
      });
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
  height: 30px;
  display: flex;
  top: -10px;
}
.title {
  width: 120px;
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
  cursor: pointer;
}
.exper {
  position: relative;
  margin-left: 5px;
  text-align: center;
  line-height: 7px;
}
.inputw {
  width: 300px !important;
  margin-top: 10px;
}
.el-input {
  width: 200px;
}
.dec {
  position: relative;
  width: 101px;
  height: 70px;
  top: 10px;
  margin-left: 127px;
  border: 1px solid #dcdfe6;
  line-height: 70px;
  color: #909399;
}
.custom-file-button {
  position: relative;
  display: block;
  top: 10px;
  left: 125px;
  width: 100px;
  height: 37px !important;
  border: 1px solid #dcdfe6;
  color: #909399;
  line-height: 37px;
}
.custom-file-buttont {
  position: relative;
  top: -53px;
}
.status {
  position: relative;
  width: 300px;
  height: 100px;
  margin-left: 122px;
  line-height: 40px;
  top: 10px;
}
.statusx {
  position: relative;
  width: 100px;
  height: 38px;
  border: 1px solid #dcdfe6;
  left: 3px;
}
.type {
  position: relative;
  top: -30px;
}
.el-radio-group {
  position: relative;
  top: -74px;
  left: 85px;
}
.pdf-view {
  color: #409eff;
  padding-left: 50px;
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
.laboratory-report #inputh {
  height: 30px !important;
  width: 200px !important;
}
.laboratory-report #inputwd {
  position: relative;
  width: 200px !important;
  margin-left: 228px;
  top: -62px;
  height: 72px !important;
}
.laboratory-report .el-input-group__prepend {
  width: 55px;
}
</style>

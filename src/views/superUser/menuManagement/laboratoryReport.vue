<template>
  <div class="laboratory-report">
    <div class="header">
      <div class="title">实验名称:</div>
      <el-input v-model="input" id="inputh" placeholder="请输入内容"></el-input>
      <button class="but" @click="search">搜索</button>
      <button class="but" @click="resetting">重置</button>
      <el-button type="primary" class="exper" @click="addreport">添加实验报告</el-button>
      <el-button type="primary" class="exper" @click="returnexper">返回实验</el-button>
      <el-button type="danger" class="exper" @click="delexper">批量删除</el-button>
    </div>
    <el-table
      height="410"
      ref="multipleTable"
      :data="tableData.slice((currentPage - 1) * pageSize, currentPage * pageSize)"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
      class="custom-table"
      v-if="dialogtabledata"
    >
      <el-table-column type="selection" width="50"> </el-table-column>
      <el-table-column prop="title" label="实验标题" width="100"> </el-table-column>
      <el-table-column prop="classHour" label="课时" width="60"> </el-table-column>
      <el-table-column
        prop="description"
        label="实验描述"
        width="260"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column prop="fileUrl" label="实验课件" width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          <a :href="scope.row.fileUrl" v-if="scope.row.fileUrl">查看课件</a>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="small"
            class="opertea"
            @click="exreport(scope.row)"
            >实验步骤</el-button
          >
          <el-button type="primary" size="small" @click="editexrept(scope.row)"
            >编辑</el-button
          >
          <el-button type="danger" size="small" @click="del(scope.row.id)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 搜索 -->
    <el-table
      ref="multipleTable"
      :data="reportdata.slice((currentPage - 1) * pageSize, currentPage * pageSize)"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
      class="custom-table"
      v-if="exdialogtabledata"
    >
      <el-table-column type="selection" width="50"> </el-table-column>
      <el-table-column prop="title" label="实验标题" width="100"> </el-table-column>
      <el-table-column prop="classHour" label="课时" width="60"> </el-table-column>
      <el-table-column
        prop="description"
        label="实验描述"
        width="260"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column prop="fileUrl" label="实验课件" width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          <a :href="scope.row.fileUrl" v-if="scope.row.fileUrl">查看课件</a>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="small"
            class="opertea"
            @click="exreport(scope.row)"
            >实验步骤</el-button
          >
          <el-button type="primary" size="small" @click="editexrept(scope.row)"
            >编辑</el-button
          >
          <el-button type="danger" size="small" @click="del(scope.row.id)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 添加/编辑实验 -->
    <el-dialog
      :title="isAddReport ? '添加实验报告' : '修改实验报告'"
      :visible.sync="dialogVisible"
      width="40%"
      :before-close="closeAddReport"
    >
      <el-form :model="revise" :rules="rules" ref="formRule">
        <el-form-item label="实验标题" prop="title">
          <el-input placeholder="请输入实验标题" v-model="revise.title"></el-input>
        </el-form-item>
        <el-form-item label="实验课时" prop="classHour">
          <el-input placeholder="请输入课时" v-model="revise.classHour"></el-input>
        </el-form-item>
        <el-form-item label="实验描述" prop="description">
          <el-input
            placeholder="请输入实验描述"
            type="textarea"
            :autosize="{ minRows: 4, maxRows: 4 }"
            v-model="revise.description"
          ></el-input>
        </el-form-item>
        <el-form-item :label="isAddReport ? '上传课件' : '修改课件'" class="upload-file">
          <el-upload
            action=""
            :auto-upload="false"
            :file-list="fileList"
            :limit="1"
            :on-change="handlePreview"
          >
            <el-button size="small" type="primary" plain v-if="fileList.length === 0">{{
              isAddReport ? "点击上传" : "点击修改"
            }}</el-button>
            <div slot="tip" class="el-upload__tip">只能上传单个文件</div>
          </el-upload>
          <a :href="revise.fileUrl" v-if="revise.fileUrl" class="pdf-view">查看课件</a>
        </el-form-item>
        <el-form-item class="form-btn">
          <el-button @click="serve" type="primary">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="this.tableData.length"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import {
  report,
  reportadd,
  reportupdate,
  reportdelete,
  mreportdelete,
} from "@/utils/api";
export default {
  data() {
    return {
      isAddReport: true, //是否添加报告
      fileList: [],
      multipleSelection: [],
      tableData: [],
      reportdata: [],
      arr: [],
      currentPage: 1,
      pageSize: 5,
      input: "",
      dialogtabledata: true,
      exdialogtabledata: false,
      dialogVisible: false,
      report: "",
      experimentId: "",
      id: 0,
      revise: {
        title: "",
        classHour: "",
        description: "",
      },
      rules: {
        title: [{ required: true, message: "请输入实验标题", trigger: "blur" }],
        classHour: [{ required: true, message: "请输入课时", trigger: "blur" }],
        description: [{ required: true, message: "请输入实验描述", trigger: "blur" }],
      },
    };
  },
  methods: {
    // 关闭dialog弹框
    closeAddReport() {
      this.dialogVisible = false;
      this.$refs["formRule"].resetFields();
    },
    //添加实验报告
    addreport() {
      this.isAddReport = true;
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
        path: "/laboratoryStep",
        name: "laboratoryStep",
        query: {
          id: e.id,
        },
      });
    },
    //保存
    serve() {
      this.$refs["formRule"].validate((valid) => {
        if (valid) {
          let data = {
            title: this.revise.title,
            classHour: this.revise.classHour,
            description: this.revise.description,
            type: 0,
            status: 0,
            experimentId: this.experimentId,
            file: "",
          };
          if (this.isAddReport) {
            reportadd(data).then((res) => {
              if (res.code === 0) {
                this.break();
                this.$message({
                  message: "添加报告成功",
                  type: "success",
                });
                this.dialogVisible = false;
              } else {
                this.$message.error(res.msg);
              }
            });
          } else {
            console.log(1);
            reportupdate(data).then((res) => {
              console.log(res);
              this.break();
              this.dialogVisible = false;
            });
          }
        } else {
          return false;
        }
      });
    },
    //取消
    cancel() {
      this.$refs["formRule"].resetFields();
      this.dialogVisible = false;
    },
    //搜索
    search() {
      this.dialogtabledata = false;
      this.exdialogtabledata = true;
      this.reportdata = this.tableData.filter((item) => {
        // 根据实际需求编写模糊搜索的逻辑，例如使用正则表达式
        return item.title.includes(this.input);
      });
    },
    //重置
    resetting() {
      this.dialogtabledata = true;
      this.exdialogtabledata = false;
      this.input = "";
      this.reportdata = [];
    },
    //返回实验
    returnexper() {
      history.back();
    },
    //编辑实验
    editexrept(e) {
      const data = JSON.parse(JSON.stringify(e));
      this.revise = data;
      this.isAddReport = false;
      this.dialogVisible = true;
      this.report = false;
    },
    //删除
    del(e) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          reportdelete(e).then((res) => {
            this.break();
            this.$message({
              type: "success",
              message: "删除成功!",
            });
          });
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
        .then(() => {
          let data = this.arr;
          mreportdelete(data).then((res) => {
            this.break();
            this.$message({
              type: "success",
              message: "删除成功!",
            });
          });
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
        obj[prop] = "";
      }
    },
    break() {
      report(this.id).then((res) => {
        this.tableData = res.data;
        console.log(this.tableData);
      });
    },
  },
  mounted() {
    this.id = this.$route.query.id;
    this.experimentId = parseInt(this.id);
    this.break();
  },
};
</script>

<style scoped>
.header {
  position: relative;
  width: 100%;
  height: 30px;
  display: flex;
  top: -10px;
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
  width: 150px;
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
.laboratory-report
  .el-dialog__body
  .upload-file
  .el-form-item__content
  .el-upload__tip
  .el-upload-list__item {
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
  width: 150px !important;
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

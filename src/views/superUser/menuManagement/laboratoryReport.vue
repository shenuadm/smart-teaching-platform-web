<template>
  <div class="laboratoryReport">
    <div class="header">
      <div class="title">实验名称:</div>
      <el-input v-model="input" id="inputh" placeholder="请输入内容"></el-input>
      <button class="but" @click="search">搜索</button>
      <button class="but" @click="resetting">重置</button>
      <el-button type="primary" class="exper" @click="addreport"
        >添加实验报告</el-button
      >
      <el-button type="primary" class="exper" @click="returnexper"
        >返回实验</el-button
      >
      <el-button type="danger" class="exper" @click="delexper"
        >批量删除</el-button
      >
    </div>
    <el-table
      height="410"
      ref="multipleTable"
      :data="
        tableData.slice((currentPage - 1) * pageSize, currentPage * pageSize)
      "
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
      class="custom-table"
      v-if="dialogtabledata"
    >
      <el-table-column type="selection" width="50"> </el-table-column>
      <el-table-column prop="title" label="实验标题" width="100">
      </el-table-column>
      <el-table-column prop="type" label="用户类型" width="100">
        <template slot-scope="scope">
          <div v-if="scope.row.type == 0">系统</div>
          <div v-if="scope.row.type == 1">老师</div>
          <div v-if="scope.row.type == 2">学生</div>
        </template>
      </el-table-column>
      <el-table-column prop="classHour" label="课时" width="60">
      </el-table-column>
      <el-table-column
        prop="description"
        label="实验描述"
        width="260"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column prop="status" label="状态" width="80">
        <template slot-scope="scope">
          <div v-if="scope.row.status === 0">已保存</div>
          <div v-else-if="scope.row.status === 1">已提交</div>
          <div v-else-if="scope.row.status === 2">已评阅</div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="240">
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
      :data="
        reportdata.slice((currentPage - 1) * pageSize, currentPage * pageSize)
      "
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
      class="custom-table"
      v-if="exdialogtabledata"
    >
      <el-table-column type="selection" width="50"> </el-table-column>
      <el-table-column prop="title" label="实验标题" width="100">
      </el-table-column>
      <el-table-column prop="type" label="用户类型" width="100">
        <template slot-scope="scope">
          <div v-if="scope.row.type == 0">系统</div>
          <div v-if="scope.row.type == 1">老师</div>
          <div v-if="scope.row.type == 2">学生</div>
        </template>
      </el-table-column>
      <el-table-column prop="classHour" label="课时" width="60">
      </el-table-column>
      <el-table-column
        prop="description"
        label="实验描述"
        width="260"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column prop="status" label="状态" width="80">
        <template slot-scope="scope">
          <div v-if="scope.row.status === 0">已保存</div>
          <div v-else-if="scope.row.status === 1">已提交</div>
          <div v-else-if="scope.row.status === 2">已评阅</div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="240">
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
    <el-dialog :visible.sync="dialogVisible" width="40%">
      <template v-if="report">
        <span slot="title">添加实验报告</span>
      </template>
      <template v-else>
        <span slot="title">修改实验报告</span>
      </template>
      <el-input
        class="inputw"
        placeholder="请输入实验标题"
        v-model="revise.title"
      >
        <template slot="prepend"
          >实验标题<span style="color: red">*</span></template
        >
      </el-input>
      <el-input
        class="inputw"
        placeholder="请输入课时"
        v-model="revise.classHour"
      >
        <template slot="prepend"
          >实验课时<span style="color: red">*</span></template
        >
      </el-input>
      <div v-if="report == false" class="status">
        <div class="statusx">类型</div>
        <el-select v-model="revise.type" placeholder="请选择">
          <el-option :label="0" :value="0"> 系统 </el-option>
          <el-option :label="1" :value="1"> 老师 </el-option>
          <el-option :label="2" :value="2"> 学生 </el-option>
        </el-select>
        <div class="statusx type">状态</div>
        <el-radio-group v-model="revise.status">
          <el-radio :label="0">已保存</el-radio>
          <el-radio :label="1">已提交</el-radio>
          <el-radio :label="2">已评阅</el-radio>
        </el-radio-group>
      </div>
      <div class="dec">实验描述</div>
      <el-input
        id="inputwd"
        type="textarea"
        placeholder="请输入实验描述"
        v-model="revise.description"
      >
      </el-input>
      <label for="fileInput" class="custom-file-buttont custom-file-button">
        实验课件<span style="color: red">*</span>
      </label>
      <el-input
        class="inputw"
        placeholder="请输入课件"
        v-model="revise.fileUrl"
        type="file"
        id="fileInput"
        style="display: none"
      >
      </el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button @click="serve">保 存</el-button>
      </span>
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
        type: "",
        classHour: "",
        description: "",
        status: "",
      },
    };
  },
  methods: {
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
      if (this.report == true) {
        let data = {
          title: this.revise.title,
          classHour: this.revise.classHour,
          description: this.revise.description,
          type: 0,
          status: 0,
          experimentId: this.experimentId,
          file: "",
        };
        console.log(data);
        reportadd(data).then((res) => {
          console.log(res);
          this.dialogVisible = false;
          this.report == "";
          this.break();
        });
      } else {
        let data = {
          title: this.revise.title,
          classHour: this.revise.classHour,
          description: this.revise.description,
          type: this.revise.type,
          status: this.revise.status,
          experimentId: this.revise.experimentId,
          file: "",
          id: this.revise.id,
        };
        console.log(data);
        reportupdate(data).then((res) => {
          console.log(res);
          this.dialogVisible = false;
          this.report == "";
          this.break();
        });
      }
    },
    //取消
    cancel() {
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
    //添加实验报告
    addreport() {
      this.dialogVisible = true;
      this.report = true;
    },
    //编辑实验
    editexrept(e) {
      this.revise = e;
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
    break() {
      report(this.id).then((res) => {
        this.tableData = res.data;
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
span {
  position: relative;
  left: -100px;
}
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
</style>
<style>
.laboratoryReport #inputh {
  height: 30px !important;
  width: 150px !important;
}
.laboratoryReport #inputwd {
  position: relative;
  width: 200px !important;
  margin-left: 228px;
  top: -62px;
  height: 72px !important;
}
.laboratoryReport .el-input-group__prepend {
  width: 55px;
}
</style>
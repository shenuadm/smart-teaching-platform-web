<template>
  <div class="experimentManagement">
    <div class="header">
      <div class="title">课程名称:</div>
      <el-input v-model="input" id="inputh" placeholder="请输入内容"></el-input>
      <button class="but" @click="search">搜索</button>
      <button class="but" @click="resetting">重置</button>
      <el-button type="primary" class="exper" @click="addexper">添加实验</el-button>
      <el-button type="danger" class="exper" @click="delexper">批量删除</el-button>
      <el-button type="primary" class="exper" @click="returnexper">返回章节</el-button>
    </div>
    <el-table
      ref="multipleTable"
      height="410"
      border
      :data="tableData.slice((currentPage - 1) * pageSize, currentPage * pageSize)"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
      class="custom-table"
      v-if="dialogtabledata"
    >
      <el-table-column type="selection" width="50"> </el-table-column>
      <el-table-column prop="title" label="实验标题" width="120"> </el-table-column>
      <el-table-column prop="classHour" label="课时" width="120"> </el-table-column>
      <el-table-column prop="description" label="实验描述" text-align: center>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="small"
            class="opertea"
            @click="exreport(scope.row)"
            >实验报告</el-button
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
    <!-- 添加/编辑实验 -->
    <el-dialog
      :visible.sync="dialogVisible"
      width="30%"
      :title="edit ? '添加实验' : '编辑实验'"
      :before-close="closeDialog"
    >
      <el-form
        :model="revise"
        :rules="rules"
        ref="revise"
        label-width="80px"
        class="demo-ruleForm"
      >
        <el-form-item label="实验标题" prop="title">
          <el-input v-model="revise.title" placeholder="请输入实验标题"></el-input>
        </el-form-item>
        <el-form-item label="实验课时" prop="classHour">
          <el-input v-model="revise.classHour" placeholder="请输入实验课时"></el-input>
        </el-form-item>
        <el-form-item label="实验描述" prop="description">
          <el-input
            type="textarea"
            v-model="revise.description"
            placeholder="请输入实验描述"
          ></el-input>
        </el-form-item>
        <el-form-item class="form-btn">
          <el-button type="primary" @click="serve">保 存</el-button>
          <el-button @click="closeDialog">取 消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { exper, experadd, experdel, experedit, mexperdel } from "@/utils/api";
export default {
  data() {
    return {
      multipleSelection: [],
      tableData: [],
      searchdata: [],
      arr: [],
      currentPage: 1,
      pageSize: 5,
      input: "",
      dialogtabledata: true,
      exdialogtabledata: false,
      dialogVisible: false,
      articleId: 0,
      id: 0,
      edit: "",
      revise: {
        title: "",
        classHour: "",
        description: "",
        fileUrl: "",
      },
      // 表单校验
      rules: {
        title: [{ required: true, message: "请输入实验标题", trigger: "blur" }],
        classHour: [{ required: true, message: "请输入实验课时", trigger: "blur" }],
        description: [{ required: true, message: "请输入实验描述", trigger: "blur" }],
      },
    };
  },
  created() {
    this.id = this.$route.query.id;
  },
  methods: {
    // 关闭弹框
    closeDialog() {
      this.$refs["revise"].resetFields();
      this.dialogVisible = false;
    },
    //实验报告
    exreport(e) {
      this.$router.push({
        path: "/laboratoryReport",
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
      this.input = "";
      this.break();
    },
    //添加实验
    addexper() {
      this.dialogVisible = true;
      this.edit = true;
      this.revise = {};
    },
    //编辑实验
    editexrept(e) {
      this.revise = e;
      this.dialogVisible = true;
      this.edit = false;
    },
    break() {
      exper(this.id).then((res) => {
        this.tableData = res.data;
      });
    },
    //保存
    serve() {
      this.$refs["revise"].validate((valid) => {
        if (valid) {
          let data = {
            title: this.revise.title,
            classHour: this.revise.classHour,
            description: this.revise.description,
            file: this.revise.fileUrl,
            articleId: this.articleId,
          };
          if (this.edit) {
            experadd(data).then((res) => {
              this.dialogVisible = false;
              this.edit = false;
              this.break();
            });
          } else {
            experedit(data).then((res) => {
              this.dialogVisible = false;
              this.edit = false;
              this.break();
            });
          }
        } else {
          return false;
        }
      });
    },
    //删除
    del(e) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          experdel(e).then((res) => {
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
          mexperdel(data).then((res) => {
            this.break();
            this.$message({
              type: "success",
              message: "删除成功!",
            });
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    //返回章节
    returnexper() {
      history.back();
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
  },
  mounted() {
    const id = this.$route.query.id;
    this.articleId = parseInt(id);
    exper(id).then((res) => {
      this.tableData = res.data;
    });
  },
};
</script>

<style scoped>
.span {
  position: relative;
  left: -100px;
}
.dec {
  width: 105px;
  height: 70px;
  margin-top: 10px;
  margin-left: 53px;
  border: 1px solid #dcdfe6;
  line-height: 70px;
  color: #909399;
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
.header .el-input {
  width: 200px;
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
.experimentManagement .el-table .el-table__cell {
  text-align: center !important;
}
.experimentManagement .form-btn .el-form-item__content {
  margin-left: 0 !important;
  display: flex;
  justify-content: space-around;
}
.but {
  cursor: pointer;
}
</style>

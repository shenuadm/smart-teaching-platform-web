<template>
  <div class="course-manage">
    <div class="header-course">
      <div class="title">课程名称:</div>
      <el-input
        v-model="input"
        class="zh-mgl-10 zh-mgr-10 input-content"
        placeholder="请输入内容"
      ></el-input>
      <el-button type="primary" size="small" @click="search">搜索</el-button>
      <el-button type="primary" size="small" @click="resetting">重置</el-button>
      <el-button type="primary" size="small" @click="addcourse">添加课程</el-button>
      <el-button type="primary" size="small" @click="batchdel">删除</el-button>
    </div>
    <el-table
      ref="multipleTable"
      :data="tableData.slice((currentPage - 1) * pageSize, currentPage * pageSize)"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
      class="custom-table"
      v-if="dialogtabledata"
      border
    >
      <el-table-column type="selection" width="50"> </el-table-column>
      <el-table-column prop="name" label="课程名称" width="120"> </el-table-column>
      <el-table-column prop="title" label="课程标题" width="160"> </el-table-column>
      <el-table-column prop="credit" label="学分" width="60"> </el-table-column>
      <el-table-column
        prop="description"
        label="课程描述"
        width="150"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <div v-if="scope.row.status" class="user">启用</div>
          <div v-else class="forbidden">禁用</div>
        </template>
      </el-table-column>
      <el-table-column label="封面图片" width="120">
        <template slot-scope="scope">
          <el-image
            v-if="scope.row.picture"
            :src="'data:image/png;base64,' + scope.row.picture"
            alt="图片未找到"
          />
          <el-image v-else alt="图片未找到" />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="250">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="chapter(scope.row)"
            >章节管理</el-button
          >
          <el-button type="primary" size="small" @click="updatacour(scope.row)"
            >修改</el-button
          >
          <el-button type="danger" size="small" @click="del(scope.row.id)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 搜索页面 -->
    <el-table
      ref="multipleTable"
      :data="searchdata.slice((currentPage - 1) * pageSize, currentPage * pageSize)"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
      class="custom-table"
      v-if="dialogtable"
    >
      <el-table-column type="selection" width="50"> </el-table-column>
      <el-table-column prop="name" label="课程名称" width="120"> </el-table-column>
      <el-table-column prop="title" label="课程标题" width="160"> </el-table-column>
      <el-table-column prop="credit" label="学分" width="60"> </el-table-column>
      <el-table-column
        prop="description"
        label="课程描述"
        width="150"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column prop="status" label="状态">
        <template slot-scope="scope">
          <div v-if="scope.row.status === true" class="user">启用</div>
          <div v-else-if="scope.row.status === false" class="forbidden">禁用</div>
        </template>
      </el-table-column>
      <el-table-column label="封面图片" width="120">
        <template>
          <el-image :src="imgSrc" alt="图片未找到" />
        </template>
        <!-- <template slot-scope="scope"
          ><el-image
            :src="imgurl(scope.row.imageStorePath)"
            :preview-src-list="[imgurl(scope.row.imageStorePath)]"
            style="width: 50px; height: 50px"
          ></el-image
        ></template> -->
      </el-table-column>
      <el-table-column label="操作" width="250">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="chapter(scope.row)"
            >章节管理</el-button
          >
          <el-button type="primary" size="small" @click="updatacour(scope.row)"
            >修改</el-button
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
    <!-- 新增课程 -->
    <el-dialog
      :visible.sync="dialogVisible"
      width="40%"
      center
      :before-close="cancel"
      :title="cour ? '添加课程' : '修改课程'"
    >
      <el-form :model="revise" :rules="rules" ref="ruleForm">
        <el-form-item label="课程名称" prop="name">
          <el-input class="inputw" placeholder="请输入课程名称" v-model="revise.name">
          </el-input>
        </el-form-item>
        <el-form-item label="课程标题" prop="title">
          <el-input class="inputw" placeholder="请输入课程标题" v-model="revise.title">
          </el-input>
        </el-form-item>
        <el-form-item label="课程学分" prop="credit">
          <el-input class="inputw" placeholder="请输入学分" v-model="revise.credit">
          </el-input>
        </el-form-item>
        <el-form-item label="课程描述" prop="description">
          <el-input
            class="inputw"
            type="textarea"
            :autosize="{ minRows: 4, maxRows: 4 }"
            placeholder="请输入课程描述"
            v-model="revise.description"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="状态" class="status">
          <el-radio-group v-model="revise.status">
            <el-radio :label="true">启用</el-radio>
            <el-radio :label="false">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="选择图片" class="select-pic">
          <el-upload
            class="avatar-uploader"
            action="#"
            :on-change="handleChange"
            :show-file-list="false"
            :auto-upload="false"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item class="form-btn">
          <el-button type="primary" @click="serve">确定</el-button>
          <el-button @click="cancel">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { course, addcourse, delcourse, delcoursem, updatecourse } from "@/utils/api";
import teacherVue from "../../teacher/teacher.vue";
export default {
  data() {
    return {
      dialogtabledata: true,
      dialogtable: false,
      dialogVisible: false,
      cour: "",
      currentPage: 1,
      pageSize: 10,
      input: "",
      imgSrc: "",
      revise: {
        name: "",
        title: "",
        credit: "",
        description: "",
        status: false,
        picture: "",
      },
      searchdata: [],
      tableData: [],
      multipleSelection: [],
      arr: [],
      id: "",
      imageUrl: "", //图片路径
      file: "", //图片文件
      rules: {
        name: [{ required: true, message: "请输入课程名称", trigger: "blur" }],
        title: [{ required: true, message: "请输入课程标题", trigger: "blur" }],
        credit: [{ required: true, message: "请输入学分", trigger: "blur" }],
        description: [{ required: true, message: "请输入课程描述", trigger: "blur" }],
      },
    };
  },
  methods: {
    // 图片上传回显
    handleChange(file) {
      this.file = file.raw;
      const fileReader = new FileReader();
      fileReader.onload = (e) => {
        this.imageUrl = e.target.result;
      };
      fileReader.readAsDataURL(file.raw);
    },
    //修改课程
    updatacour(e) {
      const data = JSON.parse(JSON.stringify(e));
      this.revise = data;
      console.log(data);
      this.imageUrl = "data:image/png;base64," + data.picture;
      this.dialogVisible = !this.dialogVisible;
      this.cour = false;
    },
    //添加课程
    addcourse() {
      this.empty(this.revise);
      this.imageUrl = "";
      this.dialogVisible = !this.dialogVisible;
      this.revise.status = false;
      this.cour = true;
    },
    //课程搜索
    search() {
      if (!this.input) return;
      this.dialogtable = true;
      this.dialogtabledata = false;
      this.searchdata = this.tableData.filter((item) => {
        // 根据实际需求编写模糊搜索的逻辑，例如使用正则表达式
        return item.title.includes(this.input);
      });
    },
    //保存
    serve() {
      this.$refs["ruleForm"].validate((valid) => {
        if (valid) {
          this.revise.status = this.revise.status ? 1 : 0;
          const fd = new FormData();
          fd.append("name", this.revise.name);
          fd.append("title", this.revise.title);
          fd.append("credit", this.revise.credit);
          fd.append("status", this.revise.status);
          fd.append("description", this.revise.description);
          fd.append("file", this.file);
          console.log(this.revise);
          if (this.cour) {
            addcourse(fd)
              .then((res) => {
                this.break();
                this.$message({
                  message: "添加课程成功",
                  type: "success",
                });
              })
              .catch((error) => {
                // 处理错误
                // console.error(error);
                this.$message({
                  message: "添加课程失败",
                  type: "warning",
                });
              });
          } else {
            fd.append("id", this.revise.id);
            updatecourse(fd)
              .then((res) => {
                this.break();
                this.$message({
                  message: "修改课程成功",
                  type: "success",
                });
              })
              .catch((error) => {
                // 处理错误
                this.break();
                this.$message({
                  message: "修改课程失败",
                  type: "warning",
                });
              });
          }
          this.dialogVisible = false;
        } else {
          return false;
        }
      });
    },
    //取消
    cancel() {
      this.$refs["ruleForm"].resetFields();
      this.dialogVisible = !this.dialogVisible;
    },
    //删除
    del(e) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          delcourse(e).then((res) => {
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
    batchdel() {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let data = this.arr;
          delcoursem(data).then((res) => {
            this.break();
            this.$message({
              type: "success",
              message: "删除成功!",
            });
          });
        })
        .catch(() => {});
    },
    //重置按钮
    resetting() {
      this.input = "";
      this.searchdata.length = 0;
      this.dialogtable = false;
      this.dialogtabledata = teacherVue;
    },
    //章节管理
    chapter(e) {
      this.$router.push({
        path: "/chapterManagemet",
        name: "chapterManagemet",
        query: {
          id: e.id,
          sort: e.sort,
        },
      });
    },
    //清空对象
    empty(obj) {
      for (const prop of Object.keys(obj)) {
        obj[prop] = "";
      }
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
      course().then((res) => {
        this.tableData = res.data.map((item) => {
          return { ...item, picture: item.picture.split(",")[1] };
        });
        console.log(this.tableData);
      });
    },
  },
  mounted() {
    this.break();
  },
};
</script>

<style scoped>
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
}
.avatar {
  width: 100px;
  height: 100px;
  display: block;
}
.input-content {
  width: 150px;
}
.user {
  background-color: #08b1e4;
  color: white;
}
.forbidden {
  background-color: rgb(166, 2, 2);
  color: white;
}
.img {
  width: 100px;
  height: 80px;
  margin-left: 30px;
}
.header-course {
  position: relative;
  width: 100%;
  height: 30px;
  display: flex;
}
.title {
  width: 80px;
  line-height: 30px;
}
.but {
  text-align: center;
  line-height: 30px;
  width: 40px !important;
  /* background-color: #45c864; */
  background-color: #409eff;
  border: none;
  margin-left: 5px;
  border-radius: 5px;
  color: white;
}
.buttow {
  position: relative;
  /* background-color: #05d1d1; */
  background-color: #409eff;
  color: white;
  border: none;
  border-radius: 5px;
  margin-left: 10px;
}
.block {
  margin-top: 20px;
}
.dec {
  width: 105px;
  height: 70px;
  margin-top: 10px;
  margin-left: 85px;
  border: 1px solid #dcdfe6;
  line-height: 70px;
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
  background-color: #f5f7fa;
  color: #909399;
}
.el-table {
  margin-top: 20px;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.input-content .el-input__inner {
  height: 31px;
}
.course-manage .el-form-item {
  display: flex;
  align-items: center;
}
.course-manage .el-form-item .el-form-item__content {
  flex: 1;
}
.course-manage .status .el-form-item__label,
.course-manage .select-pic .el-form-item__label {
  text-align: left;
  padding-left: 10px;
  width: 80px;
}
.course-manage .status,
.course-manage .select-pic,
.course-manage .form-btn {
  margin-bottom: 0;
}
.course-manage .form-btn .el-form-item__content {
  width: 100%;
  padding: 0 100px;
  display: flex;
  justify-content: space-between;
}
.el-table th.el-table__cell > .cell,
.el-table__body td.el-table__cell {
  text-align: center;
}
.el-checkbox__inner {
  border: 1px solid #0944cd !important;
}
#inputh {
  height: 30px !important;
  width: 150px !important;
}
.el-input-group__prepend {
  width: 66px !important;
}
#inputwd {
  width: 292px !important;
  margin-left: 191px;
  margin-top: -89px;
  height: 72px !important;
  border-top-left-radius: 0px;
  border-bottom-left-radius: 0px;
}
</style>

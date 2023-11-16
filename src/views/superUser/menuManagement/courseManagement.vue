<template>
  <div>
    <div class="header">
      <div class="title">课程名称:</div>
      <el-input v-model="input" class="zh-mgl-10 zh-mgr-10 input-content" placeholder="请输入内容"></el-input>
      <el-button type="primary" size="small" @click="search">搜索</el-button>
      <el-button type="primary" size="small" @click="resetting">重置</el-button>
      <el-button type="primary" size="small" @click="addcourse">添加课程</el-button>
      <el-button type="primary" size="small" @click="batchdel">删除</el-button>
    </div>
    <el-table
      ref="multipleTable"
      :data="
        tableData.slice((currentPage - 1) * pageSize, currentPage * pageSize)
      "
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
      class="custom-table"
      v-if="dialogtabledata"
      border
    >
      <el-table-column type="selection" width="50"> </el-table-column>
      <el-table-column prop="name" label="课程名称" width="120">
      </el-table-column>
      <el-table-column prop="title" label="课程标题" width="160">
      </el-table-column>
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
          <div v-else-if="scope.row.status === false" class="forbidden">
            禁用
          </div>
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
    <!-- 搜索页面 -->
    <el-table
      ref="multipleTable"
      :data="
        searchdata.slice((currentPage - 1) * pageSize, currentPage * pageSize)
      "
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
      class="custom-table"
      v-if="dialogtable"
    >
      <el-table-column type="selection" width="50"> </el-table-column>
      <el-table-column prop="name" label="课程名称" width="120">
      </el-table-column>
      <el-table-column prop="title" label="课程标题" width="160">
      </el-table-column>
      <el-table-column prop="credit" label="学分" width="60"> </el-table-column>
      <el-table-column
        prop="description"
        label="课程描述"
        width="210"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column prop="status" label="状态" width="80">
        <template slot-scope="scope">
          <div v-if="scope.row.status === true" class="user">启用</div>
          <div v-else-if="scope.row.status === false" class="forbidden">
            禁用
          </div>
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
      <el-table-column label="操作" width="240">
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
    <el-dialog :visible.sync="dialogVisible" width="40%">
      <template v-if="cour">
        <span slot="title">添加课程</span>
      </template>
      <template v-else>
        <span slot="title">修改课程</span>
      </template>
      <el-input
        class="inputw"
        placeholder="请输入课程名称"
        v-model="revise.name"
      >
        <template slot="prepend"
          >课程名称
          <span style="color: red">*</span>
        </template>
      </el-input>
      <el-input
        class="inputw"
        placeholder="请输入课程标题"
        v-model="revise.title"
      >
        <template slot="prepend"
          >课程标题<span style="color: red">*</span></template
        >
      </el-input>
      <el-input class="inputw" placeholder="请输入学分" v-model="revise.credit">
        <template slot="prepend"
          >课程学分<span style="color: red">*</span></template
        >
      </el-input>
      <div class="dec">课程描述<span style="color: red">*</span></div>
      <el-input
        id="inputwd"
        type="textarea"
        placeholder="请输入课程描述"
        v-model="revise.description"
      >
      </el-input>
      <div class="status">
        <div class="statusx">
          状态
          <!-- <span style="color: red">*</span> -->
        </div>
        <el-radio-group v-model="revise.status">
          <el-radio :label="true">启用</el-radio>
          <el-radio :label="false">禁用</el-radio>
        </el-radio-group>
      </div>
      <button @click="handleChooseFile" class="custom-file-button">
        添加封面图片
      </button>
      <img :src="revise.picture" class="img" v-if="revise.picture" />
      <input
        type="file"
        ref="fileInput"
        style="display: none"
        @change="handleFileChange"
      />
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button @click="serve">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  course,
  addcourse,
  delcourse,
  delcoursem,
  updatecourse,
} from "@/utils/api";
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
    };
  },
  methods: {
    //修改课程
    updatacour(e) {
      this.revise = e;
      this.dialogVisible = !this.dialogVisible;
      this.cour = false;
    },
    //添加课程
    addcourse() {
      this.dialogVisible = !this.dialogVisible;
      this.revise.status = false;
      this.cour = true;
    },
    //课程搜索
    search() {
      this.dialogtable = true;
      this.dialogtabledata = false;
      this.searchdata = this.tableData.filter((item) => {
        // 根据实际需求编写模糊搜索的逻辑，例如使用正则表达式
        return item.title.includes(this.input);
      });
    },
    //保存
    serve() {
      if (this.cour == true) {
        let data = {
          name: this.revise.name,
          title: this.revise.title,
          credit: this.revise.credit,
          description: this.revise.description,
          status: this.revise.status,
          picture: this.revise.picture,
        };
        addcourse(data)
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
        let data = {
          name: this.revise.name,
          title: this.revise.title,
          credit: this.revise.credit,
          description: this.revise.description,
          status: this.revise.status,
          picture: this.revise.picture,
        };
        updatecourse(data)
          .then((res) => {
            this.break();
            this.$message({
              message: "修改课程成功",
              type: "success",
            });
          })
          .catch((error) => {
            // 处理错误
            // console.error(error);
            this.break();
            this.$message({
              message: "修改课程失败",
              type: "warning",
            });
          });
      }
      this.empty(this.revise);
      this.dialogVisible = !this.dialogVisible;
    },
    //取消
    cancel() {
      this.empty(this.revise);
      this.dialogVisible = !this.dialogVisible;
      this.break();
    },
    //删除
    del(e) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        delcourse(e).then((res) => {
          this.break();
          this.$message({
            type: "success",
            message: "删除成功!",
          });
        });
      });
    },

    //批量删除
    batchdel() {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        let data = this.arr;
        delcoursem(data).then((res) => {
          this.break();
          this.$message({
            type: "success",
            message: "删除成功!",
          });
        });
      });
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
    //图片上传
    handleChooseFile() {
      this.$refs.fileInput.click();
    },
    handleFileChange(event) {
      const file = event.target.files[0];
      const reader = new FileReader();
      if (file) {
        this.revise.picture = file.name; // 仅保留文件名
      }
      reader.onload = (e) => {
        this.revise.picture = e.target.result;
      };
      reader.readAsDataURL(file);
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
        this.tableData = res.data;
        console.log(res.data);
      });
    },
  },
  mounted() {
    course().then((res) => {
      this.tableData = res.data;
    });
  },
};
</script>

<style scoped>
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
.custom-file-button {
  position: absolute;
  top: 407px;
  left: 148px;
  width: 105px;
  height: 40px;
  border: 1px solid #dcdfe6;
  color: #909399;
  background-color: white;
}
.el-dialog .el-input {
  padding: 8px;
}
.header {
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
.status {
  border: 1px solid #dcdfe6;
  width: 400px;
  height: 40px;
  margin-left: 86px;
  line-height: 40px;
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
}
.statusx {
  width: 106px;
  height: 40px;
  border-right: 1px solid #dcdfe6;
  background-color: #F5F7FA;
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
  background-color: #F5F7FA;
  color: #909399;
}
.el-radio-group {
  margin-top: -77px;
  margin-left: 90px;
}
.inputw {
  width: 400px !important;
}
span {
  position: relative;
  left: -100px;
}
.el-table{
  margin-top: 20px;
}
</style>
<style>
.el-table th.el-table__cell > .cell,
.el-table__body td.el-table__cell {
  text-align: center;
}
.el-input__inner {
  height: 33px;
}
.el-checkbox__inner {
  border: 1px solid #0944cd !important;
}
#inputh {
  height: 30px !important;
  width: 150px !important;
}
.el-input {
  width: 150px;
}
.el-input-group__prepend {
  width: 66px !important;
}
.el-input {
  width: 150px;
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
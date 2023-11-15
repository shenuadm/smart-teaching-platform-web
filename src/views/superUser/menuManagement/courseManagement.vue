<template>
  <div>
    <div class="header">
      <div class="title">课程名称:</div>
      <el-input v-model="input" id="inputh" placeholder="请输入内容"></el-input>
      <button class="but btn-bg-b" @click="search">搜索</button>
      <button class="but btn-bg-b" @click="resetting">重置</button>
      <button class="buttow btn-bg-b" @click="addcourse">添加课程</button>
      <button class="buttow btn-bg-r" @click="batchdel">删除</button>
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
          <el-image :src="imgSrc" alt="图片" />
        </template>
        <!-- <template slot-scope="scope"
          ><el-image
            :src="imgurl(scope.row.imageStorePath)"
            :preview-src-list="[imgurl(scope.row.imageStorePath)]"
            style="width: 50px; height: 50px"
          ></el-image
        ></template> -->
      </el-table-column>
      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="chapter(scope.row)"
            >章节管理</el-button
          >
        </template>
      </el-table-column>
    </el-table>
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
          <el-image :src="imgSrc" alt="图片" />
        </template>
        <!-- <template slot-scope="scope"
          ><el-image
            :src="imgurl(scope.row.imageStorePath)"
            :preview-src-list="[imgurl(scope.row.imageStorePath)]"
            style="width: 50px; height: 50px"
          ></el-image
        ></template> -->
      </el-table-column>
      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="chapter(scope.row)"
            >章节管理</el-button
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
    <el-dialog title="请输入课程信息" :visible.sync="dialogVisible" width="30%">
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
import { course, addcourse, delcourse, delcoursem } from "@/utils/api";
import teacherVue from "../../teacher/teacher.vue";
export default {
  data() {
    return {
      dialogtabledata: true,
      dialogtable: false,
      dialogVisible: false,
      currentPage: 1,
      pageSize: 5,
      input: "",
      imgSrc: "",
      revise: {
        name: "",
        title: "",
        credit: "",
        description: "",
        status: "",
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
    //添加课程
    addcourse() {
      this.dialogVisible = !this.dialogVisible;
    },
    //课程搜索
    search() {
      for (let i = 0; i < this.tableData.length; i++) {
        const item = this.tableData[i];

        // 判断条件，这里假设满足 condition 为 true 的对象
        if (item.title === this.input) {
          // 将满足条件的对象添加到 newArray 数组中
          this.searchdata.push(item);
          this.dialogtable = true;
          this.dialogtabledata = false;
        }
      }
    },
    //保存
    serve() {
      let data = {
        name: this.revise.name,
        title: this.revise.title,
        credit: this.revise.credit,
        description: this.revise.description,
        status: Boolean(this.revise.status),
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
      this.empty(this.revise);
      this.dialogVisible = !this.dialogVisible;
    },
    //取消
    cancel() {
      this.empty(this.revise);
      this.dialogVisible = !this.dialogVisible;
    },
    //删除
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
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
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
    empty: function (obj) {
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
    break: function () {
      course().then((res) => {
        this.tableData = res.data;
        console.log(res.data);
      });
    },
  },
  mounted() {
    course().then((res) => {
      this.tableData = res.data;
      console.log(res.data);
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
  top: 372px;
  left: 72px;
  width: 95px;
  height: 40px;
  border: 1px solid #dcdfe6;
  color: #909399;
}
.el-dialog .el-input {
  padding: 8px;
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
/* .el-table__header-wrapper {
  border: 1px solid rgb(217, 216, 216);
}
.el-table__body-wrapper,
.is-scrolling-none {
  border: 1px solid rgb(214, 214, 214);
} */
.status {
  border: 1px solid #dcdfe6;
  width: 300px;
  height: 40px;
  margin-left: 50px;
  line-height: 40px;
}
.statusx {
  width: 106px;
  height: 40px;
  border-right: 1px solid #dcdfe6;
}
.dec {
  width: 102px;
  height: 40px;
  margin-top: 10px;
  margin-left: 50px;
  border: 1px solid #dcdfe6;
  line-height: 40px;
}

.el-radio-group {
  margin-top: -77px;
  margin-left: 90px;
}
.inputw {
  width: 300px;
}
span {
  position: relative;
  left: -100px;
}
</style>
<style>
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
.el-input {
  width: 150px;
}
.el-input-group__prepend {
  width: 66px !important;
}
#inputwd {
  width: 200px !important;
  margin-left: 152px;
  margin-top: -59px;
  height: 42px !important;
}
</style>
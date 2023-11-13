<template>
  <div>
    <div class="header">
      <div class="title">课程名称:</div>
      <el-input v-model="input" id="inputh" placeholder="请输入内容"></el-input>
      <button class="but" @click="search">搜索</button>
      <button class="but" @click="resetting">重置</button>
      <el-button type="primary" class="exper" @click="addexper"
        >添加实验</el-button
      >
      <el-button type="danger" class="exper" @click="delexper"
        >批量删除</el-button
      >
      <el-button type="primary" class="exper" @click="returnexper"
        >返回实验</el-button
      >
    </div>
    <el-table
      ref="multipleTable"
      height="410"
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
      <el-table-column prop="title" label="实验标题" width="120">
      </el-table-column>
      <el-table-column prop="classHour" label="课时" width="60">
      </el-table-column>
      <el-table-column
        prop="description"
        label="实验描述"
        width="300"
        text-align:
        center
      >
      </el-table-column>
      <el-table-column label="操作" width="280">
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
    <!-- 搜索 -->
    <el-table
      ref="multipleTable"
      :data="
        searchdata.slice((currentPage - 1) * pageSize, currentPage * pageSize)
      "
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
      class="custom-table"
      v-if="exdialogtabledata"
    >
      <el-table-column type="selection" width="50"> </el-table-column>
      <el-table-column prop="title" label="实验标题" width="120">
      </el-table-column>
      <el-table-column prop="classHour" label="课时" width="60">
      </el-table-column>
      <el-table-column prop="description" label="实验描述" width="300">
      </el-table-column>
      <el-table-column label="操作" width="280">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="small"
            class="opertea"
            @click="exreport(scope.row)"
            >实验报告</el-button
          >
          <el-button type="primary" size="small">编辑</el-button>
          <el-button type="danger" size="small">删除</el-button>
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
    <el-dialog :visible.sync="dialogVisible" width="30%">
      <template v-if="edit">
        <span slot="title">添加实验</span>
      </template>
      <template v-else>
        <span slot="title">编辑实验</span>
      </template>
      <el-input
        class="inputw"
        placeholder="请输入实验标题"
        v-model="revise.title"
      >
        <template slot="prepend"
          >实验标题<span class="span" style="color: red">*</span></template
        >
      </el-input>
      <el-input
        class="inputw"
        placeholder="请输入课时"
        v-model="revise.classHour"
      >
        <template slot="prepend"
          >实验课时<span class="span" style="color: red">*</span></template
        >
      </el-input>
      <div class="dec">实验描述</div>
      <el-input
        id="inputwd"
        type="textarea"
        placeholder="请输入实验描述"
        v-model="revise.description"
      >
      </el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button @click="serve">保 存</el-button>
      </span>
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
    };
  },
  methods: {
    //实验报告
    exreport(e) {
      this.$router.push({
        path: "/laboratoryReport",
        name: "laboratoryReport",
        query: {
          id: e.id,
          sort: e.sort,
        },
      });
    },
    //搜索
    search() {
      for (let i = 0; i < this.tableData.length; i++) {
        const item = this.tableData[i];

        // 判断条件，这里假设满足 condition 为 true 的对象
        if (item.title === this.input) {
          // 将满足条件的对象添加到 newArray 数组中
          this.searchdata.push(item);
          this.dialogtabledata = false;
          this.exdialogtabledata = true;
        }
      }
    },
    //重置
    resetting() {
      this.dialogtabledata = true;
      this.exdialogtabledata = false;
      this.input = "";
      this.searchdata = [];
    },
    //添加实验
    addexper() {
      this.dialogVisible = true;
      this.edit = true;
      console.log(this.articleId);
    },
    //编辑实验
    editexrept(e) {
      this.revise = e;
      this.dialogVisible = true;
      this.edit = false;
    },
    //保存
    serve() {
      if (this.edit == true) {
        let data = {
          title: this.revise.title,
          classHour: this.revise.classHour,
          description: this.revise.description,
          file: this.revise.fileUrl,
          articleId: this.articleId,
        };
        experadd(data).then((res) => {
          console.log(res);
          this.dialogVisible = false;
          this.edit == "";
          this.break();
        });
      } else {
        let data = {
          title: this.revise.title,
          classHour: this.revise.classHour,
          description: this.revise.description,
          file: this.revise.fileUrl,
          articleId: this.articleId,
          id: this.revise.id,
        };
        experedit(data).then((res) => {
          console.log(res);
          this.dialogVisible = false;
          this.edit == "";
          this.break();
        });
      }
    },
    //取消
    cancel() {
      this.dialogVisible = false;
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
      this.$router.push({
        path: "/chapterManagemet",
        name: "chapterManagemet",
      });
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
      exper(this.id).then((res) => {
        this.tableData = res.data;
        console.log(res);
      });
    },
  },
  mounted() {
    const id = this.$route.query.id;
    this.articleId = parseInt(id);
    exper(id).then((res) => {
      this.tableData = res.data;
      console.log(res);
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
  width: 104px;
  height: 40px;
  margin-top: 10px;
  margin-left: 50px;
  border: 1px solid #dcdfe6;
  line-height: 40px;
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

.el-input {
  width: 150px;
}
</style>
<style>
#inputh {
  height: 30px !important;
  width: 150px !important;
}
.el-input-group__prepend {
  width: 55px;
}
#inputwd {
  width: 198px !important;
  margin-left: 154px;
  margin-top: -59px;
  height: 42px !important;
}
</style>
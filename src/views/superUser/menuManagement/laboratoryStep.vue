<template>
  <div>
    <div class="header">
      <div class="title">步骤名称:</div>
      <el-input v-model="input" id="inputh" placeholder="请输入内容"></el-input>
      <button class="but" @click="search">搜索</button>
      <button class="but" @click="resetting">重置</button>
      <el-button type="primary" class="step" @click="addstep"
        >添加步骤</el-button
      >
      <el-button type="primary" class="step" @click="returnstep"
        >返回实验报告</el-button
      >
      <el-button type="danger" class="step" @click="delstep"
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
      <el-table-column prop="name" label="步骤名称" width="100">
      </el-table-column>
      <el-table-column label="步骤内容" width="350">
        <template slot-scope="scope">
          <div class="edit" v-html="scope.row.content"></div>
        </template>
      </el-table-column>
      <el-table-column prop="sort" label="顺序" width="60"> </el-table-column>
      <el-table-column label="操作" width="235">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="editstep(scope.row)"
            >编辑</el-button
          >
          <el-button
            type="primary"
            size="small"
            @click="todetails(scope.row.id)"
            >查看详情</el-button
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
        stepdata.slice((currentPage - 1) * pageSize, currentPage * pageSize)
      "
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
      class="custom-table"
      v-if="exdialogtabledata"
    >
      <el-table-column type="selection" width="50"> </el-table-column>
      <el-table-column prop="name" label="步骤名称" width="100">
      </el-table-column>
      <el-table-column prop="content" label="内容" width="100">
      </el-table-column>
      <el-table-column prop="sort" label="顺序" width="60"> </el-table-column>
      <el-table-column
        prop="description"
        label="描述"
        width="190"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column prop="status" label="实验步骤图片" width="120">
        <template>
          <el-image :src="imgSrc" alt="图片" />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="235">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="editstep(scope.row)"
            >编辑</el-button
          >
          <el-button
            type="primary"
            size="small"
            @click="todetails(scope.row.id)"
            >查看详情</el-button
          >
          <el-button type="danger" size="small" @click="del(scope.row.id)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 添加/编辑实验 -->
    <el-dialog :visible.sync="dialogVisible" width="40%">
      <template v-if="step">
        <span slot="title">添加实验步骤</span>
      </template>
      <template v-else>
        <span slot="title">修改实验步骤</span>
      </template>
      <el-input
        class="inputw"
        placeholder="请输入实验名称"
        v-model="revise.name"
      >
        <template slot="prepend"
          >步骤名称<span style="color: red">*</span></template
        >
      </el-input>
      <el-input
        class="inputw"
        placeholder="请输入实验顺序"
        v-model="revise.sort"
      >
        <template slot="prepend"
          >步骤顺序<span style="color: red">*</span></template
        >
      </el-input>
      <div class="editor">
        <Editor ref="editor" :value="this.revise.content"></Editor>
      </div>
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
import { step, addstep, updatestep, mdelstep, delstep } from "@/utils/api";
import editor from "../../../components/editor.vue";
export default {
  components: { editor },
  data() {
    return {
      multipleSelection: [],
      tableData: [],
      stepdata: [],
      arr: [],
      currentPage: 1,
      pageSize: 5,
      input: "",
      dialogtabledata: true,
      exdialogtabledata: false,
      dialogVisible: false,
      step: "",
      imgSrc: "",
      id: 0,
      revise: {
        description: "",
        name: "",
        content: "",
        sort: "",
        imageStorePath: "",
      },
    };
  },
  methods: {
    //查看详情
    todetails() {
      this.$router.path({
        url: "",
        name: "",
      });
    },
    //保存
    serve() {
      if (this.step == true) {
        let data = {
          experimentReportId: parseInt(this.id),
          name: this.revise.name,
          content: this.$refs.editor.html,
          sort: parseInt(this.revise.sort),
        };
        console.log(data);
        addstep(data).then((res) => {
          console.log(res);
          this.dialogVisible = false;
          this.step = "";
          this.break();
        });
      } else {
        let data = {
          id: this.revise.id,
          experimentReportId: this.revise.experimentReportId,
          name: this.revise.name,
          content: this.$refs.editor.html,
          sort: this.revise.sort,
        };
        console.log(data);
        updatestep(data).then((res) => {
          console.log(res);
          this.dialogVisible = false;
          this.step = "";
          this.break();
        });
      }
    },
    //取消
    cancel() {
      this.dialogVisible = false;
      if (this.step == true) {
        this.$refs.editor.html = "";
      }
    },
    //返回实验报告
    returnstep() {
      this.$router.push({
        path: "/laboratoryReport",
        name: "laboratoryReport",
      });
    },
    //添加实验步骤
    addstep() {
      this.dialogVisible = true;
      this.step = true;
    },
    //编辑实验
    editstep(e) {
      this.revise = e;
      console.log(this.revise);
      this.dialogVisible = true;
      this.step = false;
      // this.$refs.editor.txt.html(this.revise.content);
      this.$refs.editor = this.revise.content;
    },
    //搜索
    search() {
      for (let i = 0; i < this.tableData.length; i++) {
        const item = this.tableData[i];

        // 判断条件，这里假设满足 condition 为 true 的对象
        if (item.name === this.input) {
          // 将满足条件的对象添加到 newArray 数组中
          this.stepdata.push(item);
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
      this.stepdata = [];
    },
    //返回实验
    returnstep() {
      this.$router.push({
        path: "/chapterManagemet",
        name: "chapterManagemet",
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
          delstep(e).then((res) => {
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
    delstep() {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let data = this.arr;
          mdelstep(data).then((res) => {
            this.break();
            this.$message({
              type: "success",
              message: "删除成功!",
            });
          });
        })
        .catch(() => {});
    },
    //图片上传
    handleChooseFile() {
      this.$refs.fileInput.click();
    },
    handleFileChange(event) {
      const file = event.target.files[0];
      const reader = new FileReader();
      if (file) {
        this.revise.imageStorePath = file.name; // 仅保留文件名
      }
      reader.onload = (e) => {
        this.revise.imageStorePath = e.target.result;
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
      step(this.id).then((res) => {
        console.log(res);
        this.tableData = res.data;
      });
    },
  },
  mounted() {
    this.id = this.$route.query.id;
    step(this.id).then((res) => {
      console.log(res);
      this.tableData = res.data;
    });
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
}
.step {
  position: relative;
  margin-left: 5px;
  text-align: center;
  line-height: 7px;
}
.inputw {
  width: 445px !important;
  margin-top: 10px;
}
.el-input {
  width: 150px;
}
.dec {
  width: 105px;
  height: 40px;
  margin-top: 10px;
  margin-left: 54px;
  border: 1px solid #dcdfe6;
  line-height: 40px;
  color: #909399;
}
span {
  position: relative;
  left: -100px;
}
.editor {
  position: relative;
  width: 450px;
  top: 10px;
  left: 52px;
}
</style>
<style>
.edit > p > img {
  width: 350px !important;
  height: 100px !important;
}
#inputh {
  height: 30px !important;
  width: 150px !important;
}
#inputwd {
  width: 200px !important;
  margin-left: 155px;
  margin-top: -59px;
  height: 42px !important;
}
.el-input-group__prepend {
  width: 55px;
}
.img {
  width: 100px;
  height: 80px;
  margin-left: 30px;
}
.custom-file-button {
  position: absolute;
  top: 292px;
  left: 73px;
  width: 103px;
  height: 40px;
  border: 1px solid #dcdfe6;
  color: #909399;
}
</style>
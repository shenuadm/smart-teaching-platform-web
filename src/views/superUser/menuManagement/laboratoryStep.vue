<template>
  <div class="Step">
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
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
      class="custom-table"
      v-if="dialogtabledata"
      border:true
    >
      <el-table-column type="selection" width="50"> </el-table-column>
      <el-table-column prop="name" label="步骤名称" width="550">
      </el-table-column>
      <el-table-column prop="sort" label="顺序" width="100"> </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="editstep(scope.row)"
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
      height="410"
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
      <el-table-column prop="name" label="步骤名称" width="140">
      </el-table-column>

      <el-table-column prop="sort" label="顺序" width="60"> </el-table-column>
      <el-table-column
        prop="content"
        label="步骤内容"
        width="250"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="editstep(scope.row)"
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
      <div class="stepcontent">步骤内容</div>
      <div class="editor">
        <Editor ref="editor" :style="{ textAlign: 'left' }"></Editor>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button @click="serve">保 存</el-button>
      </span>
      <!-- <el-form label-position:left label-width="80px">
        <el-form-item label="步骤名称" hide-required-asterisk:true>
          <el-input
            class="inputw"
            placeholder="请输入实验名称"
            v-model="revise.name"
          >
            <span style="color: red">*</span>
          </el-input>
        </el-form-item>
        <el-form-item label="步骤顺序">
          <el-input
            class="inputw"
            placeholder="请输入实验顺序"
            v-model="revise.sort"
          >
            <span style="color: red">*</span>
          </el-input>
        </el-form-item>
        <el-form-item label="步骤内容">
          <Editor
            ref="editor"
            :style="{ textAlign: 'left', width: '445px', marginLeft: '8px' }"
          ></Editor>
        </el-form-item>
      </el-form> -->
    </el-dialog>
  </div>
</template>

<script>
import {
  step,
  addstep,
  updatestep,
  mdelstep,
  delstep,
  getdetail,
  experplan,
} from "@/utils/api";
import editor from "../../../components/editor.vue";
export default {
  components: { editor },
  data() {
    return {
      multipleSelection: [],
      tableData: [],
      stepdata: [],
      detailsdata: [],
      arr: [],
      detailsData: [],
      currentPage: 1,
      pageSize: 5,
      input: "",
      dialogtabledata: true,
      exdialogtabledata: false,
      dialogVisible: false,
      dialogTableVisible: false,
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
    // todetails(e) {
    //   console.log(e);
    //   getdetail(e).then((res) => {
    //     this.detailsdata = res.data;
    //   });
    //   this.detailsdata = e;
    //   this.dialogTableVisible = true;
    // },
    //保存
    serve() {
      if (this.step == true) {
        let data = {
          experimentReportId: parseInt(this.id),
          name: this.revise.name,
          content: this.$refs.editor.html,
          sort: parseInt(this.revise.sort),
          updateTime: new Date().toISOString(),
        };
        addstep(data).then((res) => {
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
          updateTime: new Date().toISOString(),
        };
        updatestep(data).then((res) => {
          this.dialogVisible = false;
          this.step = "";
          this.break();
        });
      }
    },
    //取消
    cancel() {
      this.dialogVisible = false;
      this.revise.name = "";
      this.revise.description = "";
      this.revise.content = "";
      this.revise.sort = "";
      this.revise.imageStorePath = "";
      this.$refs.editor.html = "";
    },
    //返回实验报告
    returnstep() {
      history.back();
    },
    //添加实验步骤
    addstep() {
      this.dialogVisible = true;
      this.step = true;
    },
    //编辑实验
    editstep(e) {
      experplan(e.id).then((res) => {
        this.revise = res.data;
        this.$refs.editor.html = res.data.content;
      });
      // if (this.revise.content !== null) {
      //   setTimeout(() => {
      //     this.$nextTick(() => {
      //       this.$refs.editor.html = this.revise.content;
      //     });
      //   });
      // }
      this.dialogVisible = true;
      this.step = false;
    },
    //搜索
    search() {
      this.dialogtabledata = false;
      this.exdialogtabledata = true;
      this.stepdata = this.tableData.filter((item) => {
        // 根据实际需求编写模糊搜索的逻辑，例如使用正则表达式
        return item.name.includes(this.input);
      });
    },
    //重置
    resetting() {
      this.dialogtabledata = true;
      this.exdialogtabledata = false;
      this.input = "";
      this.stepdata = [];
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
        this.tableData = res.data;
      });
    },
  },
  mounted() {
    this.id = this.$route.query.id;
    step(this.id).then((res) => {
      this.tableData = res.data;
    });
  },
};
</script>

<style scoped>
.Step .header {
  position: relative;
  width: 100%;
  height: 30px;
  display: flex;
  top: -10px;
}
.Step .title {
  width: 80px;
  line-height: 30px;
}
.Step .but {
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
.Step .step {
  position: relative;
  margin-left: 5px;
  text-align: center;
  line-height: 7px;
}
.Step .inputw {
  width: 445px !important;
  margin-top: 10px;
}
.Step .el-input {
  width: 150px;
}
.Step .dec {
  width: 105px;
  height: 40px;
  margin-top: 10px;
  margin-left: 54px;
  border: 1px solid #dcdfe6;
  line-height: 40px;
  color: #909399;
}
.Step span {
  position: relative;
  left: -100px;
}
.Step .editor {
  position: relative;
  width: 444px;
  top: 10px;
  left: 84px;
}
.Step .box > p {
  text-align: left;
}
.Step .stepcontent {
  width: 102px;
  height: 38px;
  border: 1px solid #dcdfe6;
  color: #909399;
  background-color: #f5f7fa;
  text-align: center;
  line-height: 38px;
  margin-left: 84px;
  margin-top: 10px;
  border-radius: 4px;
}
.Step .inputshow {
  display: none;
}
</style>
<style>
.Step .edit > p > img {
  width: 350px !important;
  height: 100px !important;
}
.Step #inputh {
  height: 30px !important;
  width: 150px !important;
}
.Step #inputwd {
  width: 200px !important;
  margin-left: 155px;
  margin-top: -59px;
  height: 42px !important;
}
.Step .el-input-group__prepend {
  width: 55px;
}
.Step .img {
  width: 100px;
  height: 80px;
  margin-left: 30px;
}
.Step .custom-file-button {
  position: absolute;
  top: 292px;
  left: 73px;
  width: 103px;
  height: 40px;
  border: 1px solid #dcdfe6;
  color: #909399;
}

.Step .pimg > p > img {
  width: 100% !important;
  height: 350px !important;
}
</style>

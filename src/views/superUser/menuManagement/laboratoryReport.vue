<template>
  <div>
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
          <div v-else-if="scope.row.status === 1">未保存</div>
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
      <el-table-column prop="classHour" label="用户类型" width="100">
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
          <div v-if="scope.row.status === true" class="user">启用</div>
          <div v-else-if="scope.row.status === false" class="forbidden">
            禁用
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="240">
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
    <!-- 添加/编辑实验 -->
    <el-dialog :visible.sync="dialogVisible" width="30%">
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
        <template slot="prepend">实验标题</template>
      </el-input>
      <el-input
        class="inputw"
        placeholder="请输入(1/2/3) 1:系统2:老师3:学生"
        v-model="revise.type"
      >
        <template slot="prepend">用户类型</template>
      </el-input>
      <el-input
        class="inputw"
        placeholder="请输入课时"
        v-model="revise.classHour"
      >
        <template slot="prepend">课时</template>
      </el-input>
      <el-input
        type="textarea"
        class="inputw"
        placeholder="请输入描述"
        v-model="revise.description"
      >
        <template slot="prepend">描述</template>
      </el-input>
      <el-input class="inputw" placeholder="请输入状态" v-model="revise.status">
        <template slot="prepend">状态</template>
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
    //保存
    serve() {
      if (this.report == true) {
        let data = {
          title: this.revise.title,
          classHour: this.revise.classHour,
          description: this.revise.description,
          type: this.revise.type,
          status: "",
          experimentId: this.experimentId,
          file: "",
        };
        console.log(data);
        reportadd(data).then((res) => {
          console.log(res);
          this.dialogVisible = false;
          this.report == "";
          window.location.reload();
        });
      } else {
        let data = {
          title: this.revise.title,
          classHour: this.revise.classHour,
          description: this.revise.description,
          type: this.revise.type,
          status: "",
          experimentId: this.revise.experimentId,
          file: "",
          id: this.revise.id,
        };
        console.log(data);
        reportupdate(data).then((res) => {
          console.log(res);
          this.dialogVisible = false;
          this.report == "";
          window.location.reload();
        });
      }
    },
    //取消
    cancel() {
      this.dialogVisible = false;
      window.location.reload();
    },
    //搜索
    search() {
      for (let i = 0; i < this.tableData.length; i++) {
        const item = this.tableData[i];

        // 判断条件，这里假设满足 condition 为 true 的对象
        if (item.title === this.input) {
          // 将满足条件的对象添加到 newArray 数组中
          this.reportdata.push(item);
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
      this.reportdata = [];
    },
    //返回实验
    returnexper() {
      this.$router.push({
        path: "/chapterManagemet",
        name: "chapterManagemet",
      });
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
            window.location.reload();
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
            window.location.reload();
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
  },
  mounted() {
    const id = this.$route.query.id;
    this.experimentId = parseInt(id);
    console.log(id);
    report(id).then((res) => {
      this.tableData = res.data;
      console.log(res);
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
  left: 150px;
}
.exper {
  position: relative;
  left: 155px;
  text-align: center;
  line-height: 7px;
}
.inputw {
  width: 300px;
  margin-top: 10px;
}
/* .opertea {
  margin-left: -330px;
} */
</style>
<style>
#inputh {
  height: 30px !important;
  width: 150px !important;
}
.el-color-picker__icon,
.el-input,
.el-textarea {
  width: 0px;
}
.el-input-group__prepend {
  width: 55px;
}
</style>
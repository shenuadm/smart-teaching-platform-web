<template>
  <div>
    <div class="header">
      <el-button type="primary" @click="addchapter">添加章</el-button>
      <el-button type="primary" @click="returncourse">返回课程</el-button>
    </div>
    <el-table
      height="410"
      :data="tableData"
      style="width: 100%; margin-bottom: 20px"
      row-key="id"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      <el-table-column
        prop="name"
        label="章节标题"
        width="200"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column prop="classHour" label="课时" width="80">
      </el-table-column>
      <el-table-column prop="sort" label="排序" width="80"> </el-table-column>
      <el-table-column
        prop="fileUrl"
        label="课件"
        width="120"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <a :href="scope.row.fileUrl" v-if="scope.row.fileUrl">查看课件</a>
        </template>
      </el-table-column>
      <el-table-column
        prop="description"
        label="描述"
        width="130"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column label="操作" width="280">
        <template slot-scope="scope">
          <el-button
            type="primary"
            @click="addchapterji(scope.row.id)"
            size="small"
            v-if="scope.row.isExpanded"
            >添加节</el-button
          >
          <el-button
            type="primary"
            @click="homework(scope.row.id)"
            size="small"
            v-if="!scope.row.isExpanded"
            >作业管理</el-button
          >
          <el-button
            type="primary"
            @click="exper(scope.row.id)"
            size="small"
            v-if="!scope.row.isExpanded"
            >实验管理</el-button
          >
          <el-button
            type="primary"
            size="small"
            @click="revisechapter(scope.row)"
            v-if="!scope.row.isExpanded"
            >修改</el-button
          >
          <el-button
            type="danger"
            size="small"
            @click="deletechapter(scope.row.id)"
            v-if="!scope.row.isExpanded"
            >删除</el-button
          >
          <el-button
            type="primary"
            size="small"
            @click="revisechapter(scope.row)"
            v-if="scope.row.isExpanded"
            >修改</el-button
          >
          <el-button
            type="danger"
            size="small"
            @click="deletechapter(scope.row.id)"
            v-if="scope.row.isExpanded"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="添加章" :visible.sync="dialogVisible" width="30%">
      <el-input
        class="inputw"
        placeholder="请输入章节标题"
        v-model="revise.name"
      >
        <template slot="prepend">章节标题</template>
      </el-input>
      <el-input
        class="inputw"
        placeholder="请输入课时"
        v-model="revise.classHour"
      >
        <template slot="prepend">课时</template>
      </el-input>
      <el-input class="inputw" placeholder="请输入序号" v-model="revise.sort">
        <template slot="prepend">排序</template>
      </el-input>
      <el-input
        class="inputw"
        placeholder="请输入课程描述"
        v-model="revise.description"
      >
        <template slot="prepend">描述</template>
      </el-input>
      <label for="fileInput" class="custom-file-button"> 上传课件 </label>
      <el-input
        class="inputw"
        placeholder="请输入课件"
        v-model="revise.fileUrl"
        type="file"
        id="fileInput"
        style="display: none"
      >
      </el-input>
      <el-input class="inputwh" v-model="revise.fileUrl"> </el-input>

      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button @click="serve">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加节 -->
    <el-dialog title="添加节" :visible.sync="dialogVisibleji" width="30%">
      <el-input
        class="inputw"
        placeholder="请输入章节标题"
        v-model="revise.name"
      >
        <template slot="prepend">章节标题</template>
      </el-input>
      <el-input
        class="inputw"
        placeholder="请输入课时"
        v-model="revise.classHour"
      >
        <template slot="prepend">课时</template>
      </el-input>
      <el-input class="inputw" placeholder="请输入序号" v-model="revise.sort">
        <template slot="prepend">排序</template>
      </el-input>
      <el-input
        class="inputw"
        type="textarea"
        placeholder="请输入课程描述"
        v-model="revise.description"
      >
        <template slot="prepend">描述</template>
      </el-input>
      <label for="fileInput" class="custom-file-button"> 上传课件 </label>
      <el-input
        class="inputw"
        placeholder="请输入课件"
        v-model="revise.fileUrl"
        type="file"
        id="fileInput"
        style="display: none"
      >
      </el-input>
      <el-input class="inputwh" v-model="revise.fileUrl"> </el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelji">取 消</el-button>
        <el-button @click="serveji">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="修改章节信息" :visible.sync="rdialogVisible" width="30%">
      <el-input
        class="inputw"
        placeholder="请输入章节标题"
        v-model="revise.name"
      >
        <template slot="prepend">章节标题</template>
      </el-input>
      <el-input
        class="inputw"
        placeholder="请输入课时"
        v-model="revise.classHour"
      >
        <template slot="prepend">课时</template>
      </el-input>
      <el-input class="inputw" placeholder="请输入序号" v-model="revise.sort">
        <template slot="prepend">排序</template>
      </el-input>
      <el-input
        type="textarea"
        class="inputw"
        placeholder="请输入课程描述"
        v-model="revise.description"
      >
        <template slot="prepend">描述</template>
      </el-input>
      <label for="fileInput" class="custom-file-buttont custom-file-button">
        上传课件
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
      <el-input class="inputwh" v-model="revise.fileUrl" v-if="revise.fileUrl">
      </el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="rcancel">取 消</el-button>
        <el-button @click="rserve">保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { chapter, addchapter, rchapter, dalchapter } from "@/utils/api";
export default {
  data() {
    return {
      rdialogVisible: false,
      dialogVisible: false,
      dialogVisibleji: false,
      revise: {
        name: "",
        classHour: "",
        sort: "",
        description: "",
        file: "",
      },
      tableData: [],
      courseId: 0,
      pid: 0,
    };
  },
  methods: {
    //实验管理
    exper(e) {
      this.$router.push({
        path: "/experManagemet",
        name: "experManagemet",
        query: {
          id: e,
        },
      });
    },
    //作业管理
    homework(e) {
      this.$router.push({
        path: "/homeworkManagement",
        name: "homeworkManagement",
        query: {
          id: e,
        },
      });
    },
    //添加节
    addchapterji(e) {
      this.pid = e;
      this.dialogVisibleji = true;
    },
    cancelji() {
      this.dialogVisibleji = !this.dialogVisibleji;
    },
    //保存节
    serveji() {
      let article = {
        title: this.revise.name,
        classHour: this.revise.classHour,
        sort: this.revise.sort,
        description: this.revise.description,
        file: this.revise.file,
        courseId: this.courseId,
        name: this.revise.name,
        pid: this.pid,
      };

      addchapter(article)
        .then((res) => {
          console.log(article);
          window.location.reload();
        })
        .catch((error) => {
          // 处理错误
          console.error(error);
        });
      this.empty(this.revise);
      this.dialogVisibleji = !this.dialogVisibleji;
    },
    //添加章
    addchapter() {
      this.dialogVisible = true;
    },
    //取消
    cancel() {
      this.dialogVisible = !this.dialogVisible;
    },
    //保存
    serve() {
      let article = {
        title: this.revise.name,
        classHour: this.revise.classHour,
        sort: this.revise.sort,
        description: this.revise.description,
        file: this.revise.file,
        courseId: this.courseId,
        name: this.revise.name,
      };
      console.log(article);
      addchapter(article)
        .then((res) => {
          window.location.reload();
        })
        .catch((error) => {
          // 处理错误
          console.error(error);
        });
      this.empty(this.revise);
      this.dialogVisible = !this.dialogVisible;
    },
    //修改章节
    revisechapter(e) {
      this.rdialogVisible = true;
      this.revise = e;
    },
    //取消修改
    rcancel() {
      this.empty(this.revise);
      this.rdialogVisible = !this.rdialogVisible;
      window.location.reload();
    },
    //保存修改
    rserve() {
      let article = {
        title: this.revise.name,
        classHour: this.revise.classHour,
        sort: this.revise.sort,
        description: this.revise.description,
        file: this.revise.file,
        courseId: this.courseId,
        name: this.revise.name,
        id: this.revise.id,
      };
      console.log(article);
      rchapter(article)
        .then((res) => {
          console.log(res);
          console.log(article);
          window.location.reload();
        })
        .catch((error) => {
          // 处理错误
          console.error(error);
        });
      this.rdialogVisible = !this.rdialogVisible;
    },
    //删除章节
    deletechapter(e) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          dalchapter(e).then((res) => {
            window.location.reload();
            this.$message({
              type: "success",
              message: "删除成功!",
            });
          });
        })
        .catch(() => {});
    },
    handleChooseFile() {
      this.$refs.fileInput.click();
    },
    //返回课程
    returncourse() {
      this.$router.push({
        path: "/courseManagement",
        name: "courseManagement",
      });
    },
    empty: function (obj) {
      for (const prop of Object.keys(obj)) {
        obj[prop] = "";
      }
    },
    handleRowClick(row) {
      console.log(row); // 输出所选行的数据
    },
  },
  mounted() {
    const id = this.$route.query.id;
    const sort = this.$route.query.sort;
    this.sort = sort;
    this.courseId = id;
    chapter(id).then((res) => {
      this.tableData = res.data;
    });
  },
};
</script>

<style>
.el-input-group__prepend {
  width: 56px;
}
</style>
<style scoped>
a {
  color: #606266;
}
.inputw {
  width: 300px;
  margin-top: 10px;
}
.inputwh {
  width: 205px;
  margin-top: 10px;
  margin-left: 95px;
}
.header {
  width: 220px;
}
.custom-file-button {
  position: absolute;
  top: 294px;
  left: 72px;
  width: 95px;
  height: 37px;
  border: 1px solid #dcdfe6;
  color: #909399;
  line-height: 37px;
}
.custom-file-buttont {
  top: 308px !important;
}
</style>
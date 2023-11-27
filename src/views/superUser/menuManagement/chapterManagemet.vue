<template>
  <div class="chapter-managemet">
    <div class="header">
      <el-button type="primary" size="small" @click="addchapter"
        >添加章</el-button
      >
      <el-button type="primary" size="small" @click="returncourse"
        >返回课程</el-button
      >
    </div>
    <!-- 表格数据 -->
    <el-table
      border
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
        <template slot-scope="scope">
          <div class="ellipsis">
            {{ scope.row.order }}：{{ scope.row.name }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="classHour"
        label="课时"
        width="50"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="sort"
        label="排序"
        width="50"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="fileUrl"
        label="课件"
        width="100"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <!-- <a :href="scope.row.fileUrl" v-if="scope.row.fileUrl">查看课件</a> -->
          <a
            href="javascript:void(0);"
            @click="goPdf(scope.row.fileUrl)"
            v-if="scope.row.fileUrl"
            >查看课件</a
          >
        </template>
      </el-table-column>
      <el-table-column prop="description" label="描述" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="操作" width="350">
        <template slot-scope="scope">
          <el-button
            v-if="!scope.row.pid"
            type="primary"
            @click="addchapterji(scope.row.id)"
            size="mini"
            >添加节</el-button
          >
          <el-button
            v-if="scope.row.pid"
            type="primary"
            @click="homework(scope.row.id)"
            size="mini"
            >作业管理</el-button
          >
          <el-button
            v-if="scope.row.pid"
            type="primary"
            @click="exper(scope.row.id)"
            size="mini"
            >实验管理</el-button
          >
          <el-button
            type="primary"
            size="mini"
            @click="revisechapter(scope, scope.row)"
            >修改</el-button
          >
          <el-button
            type="danger"
            size="mini"
            @click="deletechapter(scope.row.id)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 添加章 -->
    <el-dialog
      :title="isAddChapter ? '添加章' : '修改章'"
      :visible.sync="dialogVisible"
      width="40%"
      :before-close="closeAddChapter"
    >
      <el-form :model="revise" :rules="rules" ref="formRule">
        <el-form-item label="章节标题" prop="name">
          <el-input placeholder="请输入章节标题" v-model="revise.name">
          </el-input>
        </el-form-item>
        <el-form-item label="章节课时" prop="classHour">
          <el-input
            placeholder="请输入课时"
            v-model="revise.classHour"
            type="number"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="章节排序" prop="sort">
          <el-input
            placeholder="请输入序号"
            v-model="revise.sort"
            type="number"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="章节描述" prop="description">
          <el-input
            type="textarea"
            :autosize="{ minRows: 4, maxRows: 4 }"
            placeholder="请输入课程描述"
            v-model="revise.description"
          >
          </el-input>
        </el-form-item>
        <el-form-item class="form-btn">
          <el-button size="small" @click="serve" type="primary"
            >确 定</el-button
          >
          <el-button size="small" @click="closeAddChapter">取 消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 添加/修改节 -->
    <el-dialog
      :title="isAddJoint ? '添加节' : '修改节'"
      :visible.sync="dialogVisibleji"
      width="40%"
      :before-close="closeAddJoint"
    >
      <el-form :model="revise" :rules="rules" ref="formRule">
        <el-form-item label="章节标题" prop="name">
          <el-input
            placeholder="请输入章节标题"
            v-model="revise.name"
          ></el-input>
        </el-form-item>
        <el-form-item label="章节课时" prop="classHour">
          <el-input placeholder="请输入课时" v-model="revise.classHour">
          </el-input>
        </el-form-item>
        <el-form-item label="章节排序" prop="sort">
          <el-input placeholder="请输入序号" v-model="revise.sort"> </el-input>
        </el-form-item>
        <el-form-item label="章节描述" prop="description">
          <el-input
            type="textarea"
            :autosize="{ minRows: 4, maxRows: 4 }"
            placeholder="请输入课程描述"
            v-model="revise.description"
          >
          </el-input>
        </el-form-item>
        <el-form-item
          :label="isAddJoint ? '上传课件' : '修改课件'"
          class="upload-file"
        >
          <el-upload
            action=""
            :auto-upload="false"
            :file-list="fileList"
            :limit="1"
            :on-change="handlePreview"
          >
            <el-button
              size="mini"
              type="primary"
              plain
              v-if="fileList.length === 0"
              >{{ isAddJoint ? '点击上传' : '点击修改' }}</el-button
            >
            <div slot="tip" class="el-upload__tip">只能上传单个文件</div>
          </el-upload>
          <a :href="revise.fileUrl" v-if="revise.fileUrl" class="pdf-view"
            >查看课件</a
          >
        </el-form-item>
        <el-form-item class="form-btn">
          <el-button size="small" @click="serveji" type="primary"
            >确 定</el-button
          >
          <el-button size="small" @click="dialogVisibleji = false"
            >取 消</el-button
          >
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { chapter, addchapter, rchapter, dalchapter } from '@/utils/api';
export default {
  data() {
    return {
      rdialogVisible: false,
      dialogVisible: false, //章dilog显示
      isAddChapter: true, //是否为添加章否修改章
      dialogVisibleji: false, //节dilog显示
      isAddJoint: true, //是否为添加节否修改节
      revise: {
        name: '',
        classHour: '',
        sort: '',
        description: '',
        file: '',
      },
      tableData: [],
      courseId: 0,
      id: 0,
      fileList: [],
      rules: {
        name: [{ required: true, message: '请输入课程名称', trigger: 'blur' }],
        classHour: [
          { required: true, message: '请输入课程名称', trigger: 'blur' },
        ],
        sort: [{ required: true, message: '请输入课程名称', trigger: 'blur' }],
        description: [
          { required: true, message: '请输入课程名称', trigger: 'blur' },
        ],
      },
      chapterId: '', //修改的章节id变量
      file: '', //上传pdf文件
    };
  },
  methods: {
    // 查看pdf
    goPdf(url) {
      console.log(url);
      window.open(`${window.location.origin}/#/pdf?url=${url}`);
    },
    // 关闭章dilog
    closeAddChapter() {
      this.dialogVisible = false;
      this.$refs['formRule'].resetFields();
    },
    // 关闭节dilog
    closeAddJoint() {
      this.dialogVisibleji = false;
      this.$refs['formRule'].resetFields();
    },
    //添加章
    addchapter() {
      this.isAddChapter = true;
      this.empty(this.revise);
      this.dialogVisible = true;
    },
    //添加节
    addchapterji(id) {
      this.chapterId = id;
      this.isAddJoint = true;
      this.empty(this.revise);
      this.dialogVisibleji = true;
    },
    //修改章节回显
    revisechapter(q, e) {
      console.log(q);
      if (e.pid) {
        // 修改节
        this.isAddJoint = false;
        this.dialogVisibleji = true;
        const data = JSON.parse(JSON.stringify(e));
        this.revise = data;
      } else {
        //修改章
        this.isAddChapter = false;
        this.dialogVisible = true;
        const data = JSON.parse(JSON.stringify(e));
        this.revise = data;
      }
    },
    // 上传文件
    handlePreview(file) {
      this.file = file.raw;
    },
    //实验管理
    exper(e) {
      this.$router.push({
        path: '/experManagemet',
        query: {
          id: e,
        },
      });
    },
    //作业管理
    homework(e) {
      this.$router.push({
        path: '/homeworkManagement',
        query: {
          id: e,
        },
      });
    },
    //保存节
    async serveji() {
      const fd = new FormData();
      fd.append('title', this.revise.name);
      fd.append('classHour', this.revise.classHour);
      fd.append('sort', this.revise.sort);
      fd.append('description', this.revise.description);
      fd.append('file', this.file);
      if (this.isAddJoint) {
        // 添加结点
        fd.append('pid', this.chapterId);
        fd.append('courseId', this.id);
        const res = await addchapter(fd);
        if (res.code === 0) {
          this.$message({
            message: '添加节点成功',
            type: 'success',
          });
          this.break();
          this.dialogVisibleji = false;
        } else {
          this.$message.error(res.msg);
        }
      } else {
        // 修改节点
        fd.append('id', this.revise.id);
        const res = await rchapter(fd);
        if (res.code === 0) {
          this.$message({
            message: '修改节点成功',
            type: 'success',
          });
          this.break();
          this.dialogVisibleji = false;
        } else {
          this.$message.error(res.msg);
        }
      }
    },
    //保存章
    serve() {
      this.$refs['formRule'].validate(async (valid) => {
        if (valid) {
          const fd = new FormData();
          fd.append('title', this.revise.name);
          fd.append('classHour', this.revise.classHour);
          fd.append('sort', this.revise.sort);
          fd.append('description', this.revise.description);
          if (this.isAddChapter) {
            //添加章
            fd.append('courseId', this.courseId);
            const res = await addchapter(fd);
            if (res.code === 0) {
              this.$message({
                message: '添加章节成功',
                type: 'success',
              });
              this.break();
              this.dialogVisible = false;
            } else {
              this.$message.error(res.msg);
            }
          } else {
            // 修改章
            fd.append('id', this.revise.id);
            const res = await rchapter(fd);
            if (res.code === 0) {
              this.$message({
                message: '修改章节成功',
                type: 'success',
              });
              this.break();
              this.dialogVisible = false;
            } else {
              this.$message.error(res.msg);
            }
          }
        } else {
          return false;
        }
      });
    },
    //删除章节
    deletechapter(id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          const res = await dalchapter(id);
          if (res.code === 0) {
            this.$message({
              type: 'success',
              message: '删除成功!',
            });
            this.break();
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch(() => {});
    },
    handleChooseFile() {
      this.$refs.fileInput.click();
    },
    //返回课程
    returncourse() {
      history.back();
    },
    empty(obj) {
      for (const prop of Object.keys(obj)) {
        obj[prop] = '';
      }
    },
    handleRowClick(row) {
      console.log(row); // 输出所选行的数据
    },
    break() {
      this.id = parseInt(this.$route.query.id);
      const sort = this.$route.query.sort;
      this.sort = sort;
      this.courseId = this.id;
      chapter(this.id).then((res) => {
        // 为每一章每一节添加标题
        res.data.forEach((item, index) => {
          item.order = `第${index + 1}章`;
          item.children &&
            item.children.forEach((it, idx) => {
              it.order = `第${idx + 1}节`;
            });
        });
        this.tableData = res.data;
      });
    },
  },
  created() {
    this.break();
  },
};
</script>

<style>
/* 表格 */
.chapter-managemet .el-table__header-wrapper .el-table__header .el-table__cell,
.chapter-managemet .el-table__body-wrapper .el-table__row .el-table__cell {
  text-align: center;
}
.chapter-managemet
  .el-table__header-wrapper
  .el-table__header
  .el-table__cell:first-child,
.chapter-managemet
  .el-table__body-wrapper
  .el-table__row
  .el-table__cell:first-child,
.chapter-managemet
  .el-table__body-wrapper
  .el-table__row
  .el-table__cell:last-child {
  text-align: left;
}
.chapter-managemet .el-form .is-required {
  display: flex;
  align-items: center;
}
.chapter-managemet .el-form .is-required .el-form-item__content {
  flex: 1;
}
.chapter-managemet .el-form .upload-file,
.chapter-managemet .el-form .form-btn {
  display: flex;
  margin-bottom: 10px;
}
.chapter-managemet .el-form .form-btn .el-form-item__content {
  padding: 0 100px;
  width: 100%;
  display: flex;
  justify-content: space-around;
}
.chapter-managemet .el-form .upload-file .el-form-item__label {
  width: 75px;
  text-align: right;
}
.chapter-managemet .el-form .upload-file .el-form-item__content {
  display: flex;
  text-align: left;
}
.chapter-managemet
  .el-form
  .upload-file
  .el-form-item__content
  .el-upload__tip {
  margin: 0;
  height: 30px;
}
.chapter-managemet
  .el-form
  .upload-file
  .el-form-item__content
  .el-upload__tip
  .el-upload-list__item {
  margin-top: 0 !important;
}
.el-input-group__prepend {
  width: 65px;
}
#inputwd {
  width: 195px !important;
  margin-left: 234px;
  margin-top: -89px;
  height: 72px !important;
}
</style>
<style scoped>
.pdf-view {
  margin-left: 50px;
  color: #409eff;
}
.dec {
  width: 105px;
  height: 70px;
  margin-top: 10px;
  margin-left: 128px;
  border: 1px solid #dcdfe6;
  line-height: 70px;
  color: #909399;
}

a {
  color: #606266;
}
.inputw {
  width: 300px;
  margin-top: 10px;
}
.inputwh {
  width: 192px;
  margin-top: -9px;
  margin-left: 105px;
}
.header {
  display: flex;
  margin-bottom: 10px;
}
.custom-file-button {
  position: absolute;
  top: 324px;
  left: 148px;
  width: 105px;
  height: 37px;
  border: 1px solid #dcdfe6;
  color: #909399;
  line-height: 37px;
}
.custom-file-buttont {
  top: 325px !important;
}
span {
  position: relative;
  left: -100px;
}
</style>

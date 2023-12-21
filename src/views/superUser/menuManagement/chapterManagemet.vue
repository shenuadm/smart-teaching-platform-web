<template>
  <div class="chapter-managemet">
    <div class="header">
      <el-button type="primary" size="small" @click="addchapter">添加章</el-button>
      <el-button type="primary" size="small" @click="returncourse">返回课程</el-button>
    </div>
    <!-- 表格数据 -->
    <el-table
      border
      v-loading="$store.state.isLoading"
      :data="tableData"
      style="width: 100%; margin-bottom: 20px"
      row-key="id"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }">
      <el-table-column
        prop="name"
        label="章节标题"
        width="300"
        show-overflow-tooltip
        class-name="chapter-management-tree">
        <template #default="{ row }">
          <div class="ellipsis">{{ row.order }}：{{ row.name }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="classHour" label="课时" width="50"> </el-table-column>
      <el-table-column prop="sort" label="排序" width="50"> </el-table-column>
      <el-table-column prop="fileUrl" label="课件" width="100">
        <template #default="{ row }">
          <!-- <a :href="row.fileUrl" v-if="row.fileUrl">查看课件</a> -->
          <a href="javascript:void(0);" @click="goPdf(row.fileUrl)" v-if="row.fileUrl">查看课件</a>
        </template>
      </el-table-column>
      <el-table-column prop="description" label="描述"> </el-table-column>
      <el-table-column label="操作" width="370px">
        <template #default="{ row }">
          <el-button v-if="!row.pid" type="primary" @click="addchapterji(row.id)" size="mini">添加节</el-button>
          <el-button v-if="row.pid" type="primary" @click="homework(row.id)" size="mini">作业管理</el-button>
          <el-button v-if="row.pid" type="primary" @click="exper(row.id)" size="mini">实验管理</el-button>
          <el-button type="primary" size="mini" @click="revisechapter(row)">修改</el-button>
          <el-button type="danger" size="mini" @click="deletechapter(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 添加章 -->
    <el-dialog
      :title="isAddChapter ? '添加章' : '修改章'"
      :visible.sync="dialogVisible"
      width="40%"
      :before-close="closeAddChapter"
      :close-on-click-modal="false">
      <el-form :model="revise" :rules="rules" ref="formRule" v-loading="$store.state.isLoading" label-width="100px">
        <el-form-item label="章节标题" prop="name">
          <el-input placeholder="请输入章节标题" v-model="revise.name"> </el-input>
        </el-form-item>
        <el-form-item label="章节课时" prop="classHour">
          <el-input placeholder="请输入课时" v-model.number="revise.classHour" type="number"> </el-input>
        </el-form-item>
        <el-form-item label="章节排序" prop="sort">
          <el-input placeholder="请输入序号" v-model.number="revise.sort" type="number"> </el-input>
        </el-form-item>
        <el-form-item label="章节描述" prop="description">
          <el-input
            type="textarea"
            :autosize="{ minRows: 4, maxRows: 4 }"
            placeholder="请输入课程描述"
            v-model="revise.description">
          </el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="serve" type="primary">确定</el-button>
        <el-button @click="closeAddChapter">取消</el-button>
      </template>
    </el-dialog>
    <!-- 添加/修改节 -->
    <el-dialog
      :title="isAddJoint ? '添加节' : '修改节'"
      :visible.sync="dialogVisibleji"
      width="40%"
      :before-close="closeAddJoint"
      :close-on-click-modal="false">
      <el-form :model="revise" :rules="rules" ref="formRule" label-width="100px" class="chapter-dialog-form">
        <el-form-item label="章节标题" prop="name">
          <el-input placeholder="请输入章节标题" v-model="revise.name"></el-input>
        </el-form-item>
        <el-form-item label="章节课时" prop="classHour">
          <el-input placeholder="请输入课时" type="number" v-model.number="revise.classHour"> </el-input>
        </el-form-item>
        <el-form-item label="章节排序" prop="sort">
          <el-input placeholder="请输入序号" type="number" v-model.number="revise.sort"> </el-input>
        </el-form-item>
        <el-form-item label="章节描述" prop="description">
          <el-input
            type="textarea"
            :autosize="{ minRows: 4, maxRows: 4 }"
            placeholder="请输入课程描述"
            v-model="revise.description">
          </el-input>
        </el-form-item>
        <el-form-item :label="isAddJoint ? '上传课件' : '修改课件'" class="upload-file">
          <el-upload
            action=""
            class="upload"
            :auto-upload="false"
            :file-list="fileList"
            :limit="1"
            :on-change="handlePreview">
            <el-button size="mini" type="primary" plain v-if="fileList.length === 0">{{
              isAddJoint ? '点击上传' : '点击修改'
            }}</el-button>
            <div slot="tip" class="el-upload__tip">只能上传单个文件</div>
          </el-upload>
          <a :href="revise.fileUrl" v-if="revise.fileUrl" class="pdf-view">查看课件</a>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="serveji" type="primary">确定</el-button>
        <el-button @click="closeAddChapter">取消</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { addchapter, chapter, dalchapter, rchapter } from '@/utils/api';

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
        classHour: [{ required: true, message: '请输入课程名称', trigger: 'blur' }],
        sort: [{ required: true, message: '请输入课程名称', trigger: 'blur' }],
        description: [{ required: true, message: '请输入课程名称', trigger: 'blur' }],
      },
      chapterId: '', //修改的章节id变量
      file: '', //上传pdf文件
    };
  },
  methods: {
    // 查看pdf
    goPdf(url) {
      window.open(`${window.location.origin}/#/pdf?url=${url}`);
      // window.open(`${window.location.origin}/#/pdf?url=/static/test.pdf`);
    },
    // 关闭章dilog
    closeAddChapter() {
      this.dialogVisible = false;
      this.dialogVisibleji = false;
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
    revisechapter(e) {
      if (e.pid) {
        // 修改节
        this.isAddJoint = false;
        this.dialogVisibleji = true;
        this.revise = JSON.parse(JSON.stringify(e));
      } else {
        //修改章
        this.isAddChapter = false;
        this.dialogVisible = true;
        this.revise = JSON.parse(JSON.stringify(e));
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
        await addchapter(fd);
        this.$message.success('添加节点成功');
      } else {
        // 修改节点
        fd.append('id', this.revise.id);
        await rchapter(fd);
        this.$message.success('修改节点成功');
      }
      this.break();
      this.dialogVisibleji = false;
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
            await addchapter(fd);
            this.$message.success('添加章节成功');
          } else {
            // 修改章
            fd.append('id', this.revise.id);
            await rchapter(fd);
            this.$message.success('修改章节成功');
          }
          this.dialogVisible = false;
          this.break();
        }
      });
    },
    //删除章节
    deletechapter(id) {
      this.$confirm('您确认要删除该章节吗?', '提示', { type: 'warning' })
        .then(async () => {
          await dalchapter(id);
          this.$message.success('删除成功');
          this.break();
        })
        .catch(() => {});
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
    // 获取数据
    break() {
      this.id = parseInt(this.$route.query.id);
      this.sort = this.$route.query.sort;
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

<!--suppress CssUnusedSymbol -->
<style>
.el-input-group__prepend {
  width: 65px;
}

/* 文件上传表单左侧标题不缩小 */
.upload-file .el-form-item__label {
  flex-shrink: 0;
}
/* 限制文件上传的文件名显示长度 */
.upload-file .el-upload-list__item {
  width: 20vw;
}

/* 章节标题靠左显示 */
.chapter-managemet .el-tooltip {
  justify-content: initial;
}
</style>
<style scoped>
.pdf-view {
  color: #409eff;
  text-align: initial;
}
a {
  color: #606266;
}

.header {
  display: flex;
  margin-bottom: 10px;
  align-items: center;
}

.upload,
.upload-file {
  text-align: initial;
}

span {
  position: relative;
  left: -100px;
}
</style>

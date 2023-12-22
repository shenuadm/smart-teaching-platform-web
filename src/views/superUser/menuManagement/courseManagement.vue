<template>
  <div class="course-manage">
    <div class="header-course mb-20">
      <!--      <div class="title">课程名称:</div>-->
      <!--      <el-input v-model="input" class="ml-10 mr-10 input-content" placeholder="请输入内容"></el-input>-->
      <!--      <el-button type="primary" size="small" @click="search">搜索</el-button>-->
      <!--      <el-button type="primary" size="small" @click="resetting">重置</el-button>-->
      <el-button type="primary" size="small" @click="addcourse">添加课程</el-button>
      <el-button type="danger" size="small" @click="batchdel">批量删除</el-button>
    </div>
    <el-table
      v-loading="$store.state.isLoading"
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
      class="custom-table"
      border>
      <el-table-column type="selection" width="50"> </el-table-column>
      <el-table-column prop="name" label="课程名称" width="120"> </el-table-column>
      <el-table-column prop="title" label="课程标题" width="160"> </el-table-column>
      <el-table-column prop="credit" label="学分" width="60"> </el-table-column>
      <el-table-column prop="description" label="课程描述"> </el-table-column>
      <el-table-column label="状态" width="80">
        <template #default="scope">
          <div v-if="scope.row.status" class="user">启用</div>
          <div v-else class="forbidden">禁用</div>
        </template>
      </el-table-column>
      <el-table-column label="封面图片" width="120" class-name="table-image">
        <template #default="scope">
          <el-image v-if="scope.row.picture" :src="'data:image/png;base64,' + scope.row.picture" alt="图片未找到" />
          <el-image v-else alt="图片未找到" />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="250">
        <template #default="scope">
          <el-button type="primary" size="mini" @click="chapter(scope.row)">章节管理</el-button>
          <el-button type="primary" size="mini" @click="updatacour(scope.row)">修改</el-button>
          <el-button type="danger" size="mini" @click="del(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="block">
      <el-pagination
        @current-change="getData"
        :current-page.sync="currentPage"
        :page-size="10"
        layout="total, prev, pager, next, jumper"
        :total="count"
        :hide-on-single-page="count <= 10">
      </el-pagination>
    </div>
    <!-- 新增课程 -->
    <el-dialog
      :visible.sync="dialogVisible"
      width="40%"
      center
      :before-close="cancel"
      :title="revise.id ? '修改课程' : '添加课程'"
      :close-on-click-modal="false">
      <el-form :model="revise" :rules="rules" ref="ruleForm" v-loading="$store.state.isLoading" label-width="80px">
        <el-form-item label="课程名称" prop="name">
          <el-input placeholder="请输入课程名称" v-model="revise.name"> </el-input>
        </el-form-item>
        <el-form-item label="课程标题" prop="title">
          <el-input placeholder="请输入课程标题" v-model="revise.title"> </el-input>
        </el-form-item>
        <el-form-item label="课程学分" prop="credit">
          <el-input placeholder="请输入学分" v-model="revise.credit"> </el-input>
        </el-form-item>
        <el-form-item label="课程描述" prop="description">
          <el-input
            type="textarea"
            :autosize="{ minRows: 4, maxRows: 4 }"
            placeholder="请输入课程描述"
            v-model="revise.description">
          </el-input>
        </el-form-item>
        <el-form-item label="状态" class="status" required>
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
            :auto-upload="false">
            <img alt="网络错误" v-if="imageUrl" :src="imageUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" @click="serve">确定</el-button>
        <el-button @click="cancel">取消</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { course, addcourse, delcourse, delcoursem, updatecourse } from '@/utils/api';

const defaultData = {
  name: '',
  title: '',
  credit: '',
  description: '',
  status: false,
  picture: '',
};

export default {
  data() {
    return {
      dialogVisible: false,
      currentPage: 1,
      count: 0,
      input: '',
      revise: { ...defaultData },
      tableData: [],
      arr: [],
      imageUrl: '', //图片路径
      file: '', //图片文件
      rules: {
        name: [{ required: true, message: '请输入课程名称', trigger: 'blur' }],
        title: [{ required: true, message: '请输入课程标题', trigger: 'blur' }],
        credit: [{ required: true, message: '请输入学分', trigger: 'blur' }],
        description: [{ required: true, message: '请输入课程描述', trigger: 'blur' }],
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
    updatacour(data) {
      this.revise = JSON.parse(JSON.stringify(data));
      this.imageUrl = 'data:image/png;base64,' + this.revise.picture;
      this.dialogVisible = true;
    },
    //添加课程
    addcourse() {
      this.revise = { ...defaultData };
      this.imageUrl = '';
      this.dialogVisible = true;
    },
    //保存
    serve() {
      this.$refs['ruleForm'].validate(async (valid) => {
        if (valid) {
          this.revise.status = this.revise.status ? 1 : 0;
          const fd = new FormData();
          fd.append('name', this.revise.name);
          fd.append('title', this.revise.title);
          fd.append('credit', this.revise.credit);
          fd.append('status', this.revise.status);
          fd.append('description', this.revise.description);
          fd.append('file', this.file);
          if (!this.revise.id) {
            await addcourse(fd);
            this.$message.success('添加课程成功');
          } else {
            fd.append('id', this.revise.id);
            await updatecourse(fd);
            this.$message.success('修改课程成功');
          }
          this.dialogVisible = false;
          this.getData();
        }
      });
    },
    //取消
    cancel() {
      this.$refs['ruleForm'].resetFields();
      this.dialogVisible = false;
    },
    //删除
    del(id) {
      this.$confirm('您确认要删除该课程吗?', '提示', { type: 'warning' })
        .then(async () => {
          await delcourse(id);
          this.$message.success('删除课程成功');
          this.getData();
        })
        .catch(() => {});
    },
    //批量删除
    batchdel() {
      if (this.arr.length === 0) return this.$message.warning('请选中课程后再进行删除');
      this.$confirm('您确认要删除选中的课程吗?', '提示', { type: 'warning' })
        .then(async () => {
          await delcoursem(this.arr);
          this.$message.success('删除课程成功');
          this.getData();
        })
        .catch(() => {});
    },
    //章节管理
    chapter(e) {
      this.$router.push({
        path: '/chapterManagemet',
        name: 'chapterManagemet',
        query: {
          id: e.id,
          sort: e.sort,
        },
      });
    },
    handleSelectionChange(val) {
      this.arr = val.map((item) => item.id);
    },
    async getData() {
      const res = await course({ page: this.currentPage });
      this.count = res.count;
      this.tableData = res.data.map((item) => {
        return { ...item, picture: item.picture.split(',')[1] };
      });
    },
  },
  mounted() {
    this.getData();
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
  color: #08b1e4;
}
.forbidden {
  color: #f56c6c;
}
.header-course {
  position: relative;
  width: 100%;
  height: 30px;
  display: flex;
  align-items: center;
}

.block {
  margin-top: 20px;
}
</style>

<style>
.course-manage .el-table__row .table-image .cell .el-image {
  display: flex;
  height: 40px;
  width: 100%;
}
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
.course-manage .select-pic {
  margin-bottom: 0;
}
.el-checkbox__inner {
  border: 1px solid #0944cd !important;
}
.el-input-group__prepend {
  width: 66px !important;
}
</style>

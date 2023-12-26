<template>
  <el-dialog
    :title="(formData.id ? '修改' : '新增') + '章节'"
    :visible="visible"
    width="40%"
    :before-close="cancel"
    :close-on-click-modal="false">
    <el-form
      :model="formData"
      :rules="rules"
      ref="formRef"
      v-loading="$store.state.isLoading"
      label-width="100px"
      class="text-initial">
      <el-form-item label="章节标题" prop="title">
        <el-input placeholder="请输入章节标题" v-model="formData.title"> </el-input>
      </el-form-item>
      <el-form-item label="章节课时" prop="classHour">
        <el-input placeholder="请输入课时" v-model.number="formData.classHour" type="number"> </el-input>
      </el-form-item>
      <el-form-item label="章节排序" prop="sort">
        <el-input placeholder="请输入序号" v-model.number="formData.sort" type="number"> </el-input>
      </el-form-item>
      <el-form-item label="章节描述" prop="description">
        <el-input
          type="textarea"
          :autosize="{ minRows: 4, maxRows: 4 }"
          placeholder="请输入课程描述"
          v-model="formData.description">
        </el-input>
      </el-form-item>
      <el-form-item label="章节课件" class="upload-file" v-if="formData.pid !== 0">
        <el-upload
          action=""
          class="chapter-edit-upload flex"
          :auto-upload="false"
          :file-list="fileList"
          ref="upload"
          :on-change="handleFileChange">
          <el-button size="mini" type="primary" plain>选择文件</el-button>
        </el-upload>
        <a v-if="formData.fileUrl" :href="formData.fileUrl">查看课件</a>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submit" type="primary">确定</el-button>
      <el-button @click="cancel">取消</el-button>
    </template>
  </el-dialog>
</template>
<script>
import { addChapterService, updateChapterService } from '@/api/courseManage';

const defaultForm = {
  title: '', // 课程标题
  classHour: '', // 课时
  sort: 0, // 排序
  description: '', // 课程描述
  file: '', // 课件
};

export default {
  data() {
    return {
      formData: { ...defaultForm }, // 编辑数据
      fileList: [], // 文件列表
      rules: {
        title: [{ required: true, message: '请输入课程名称', trigger: 'blur' }],
        classHour: [{ required: true, message: '请输入课程名称', trigger: 'blur' }],
        sort: [{ required: true, message: '请输入课程名称', trigger: 'blur' }],
        description: [{ required: true, message: '请输入课程名称', trigger: 'blur' }],
      },
    };
  },
  props: ['visible', 'editData'],
  methods: {
    cancel() {
      this.$emit('update:visible', false);
      this.fileList = [];
      this.$refs.formRef.resetFields();
    },
    handleFileChange(file) {
      console.log(file, 'file');
      const upload = this.$refs.upload.uploadFiles;
      console.log(upload);
      if (upload.length === 2) {
        upload.shift();
      }
      // this.formData.file = file.row;
    },
    submit() {
      this.$refs.formRef.validate(async (valid) => {
        if (valid) {
          if (this.$refs.upload) {
            if (this.$refs.upload.uploadFiles.length === 0) {
              return this.$message.error('请选择文件');
            } else {
              this.formData.file = this.$refs.upload.uploadFiles[0].raw;
            }
          }

          const fd = new FormData();
          for (const key in this.formData) {
            fd.append(key, this.formData[key]);
          }
          delete fd['fileUrl'];
          if (this.formData.id) await updateChapterService(fd);
          else await addChapterService(fd);
          this.$message.success((this.formData.id ? '编辑' : '新增') + '章节成功');
          this.cancel();
          this.$emit('success');
        }
      });
    },
  },
  watch: {
    editData(newVal) {
      console.log(newVal, 'newVal');
      this.formData = { ...defaultForm, courseId: this.$route.query.id, ...newVal };
      console.log(this.formData, 'formData');
    },
  },
};
</script>

<style scoped>
a {
  color: #606266;
}
</style>

<style>
/* 文件上传表单左侧标题不缩小 */
.upload-file .el-form-item__label {
  flex-shrink: 0;
}
/* 限制文件上传的文件名显示长度 */
.upload-file .el-upload-list__item {
  width: 10vw;
}
/* 章节标题靠左显示 */
.chapter-managemet .el-tooltip {
  justify-content: initial;
}
.chapter-edit-upload .el-upload-list {
  display: flex;
  align-items: center;
}
.chapter-edit-upload .el-upload-list .el-upload-list__item {
  margin-top: 0 !important;
}
</style>

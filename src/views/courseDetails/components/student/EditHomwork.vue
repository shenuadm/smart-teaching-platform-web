<template>
  <el-drawer title="编辑作业" :with-header="false" :visible="visible" direction="rtl" :before-close="cancel" size="50%">
    <el-form :model="formData" ref="homeworkForm" class="ml-20 student-edit-homework-form" label-position="top">
      <el-form-item label="作业名称">
        <div>{{ formData.name }}</div>
      </el-form-item>
      <el-form-item label="作业内容">
        <div>{{ formData.content }}</div>
      </el-form-item>
      <el-form-item label="作业结果">
        <el-input
          v-if="isCanEdit"
          v-model="formData.answer"
          placeholder="请输入您作业的结果"
          type="textarea"
          :rows="10"
        ></el-input>
        <el-input v-else :value="formData.answer" type="textarea" autosize></el-input>
      </el-form-item>
      <template v-if="!isCanEdit">
        <el-form-item label="分数">
          <div>{{ formData.score }}</div>
        </el-form-item>
        <el-form-item label="评语">
          <div>{{ formData.comments }}</div>
        </el-form-item>
      </template>
      <el-form-item v-if="isCanEdit">
        <el-button type="primary" @click="submit">保存</el-button>
        <el-button type="info" @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>

<script>
import { studentSaveHomeworkService, stuEditHomewrokService } from '@/api/homework.js';
export default {
  data() {
    return {
      formData: {
        name: '',
        content: '',
        endTime: '',
        answer: '',
      },
      rules: [],
    };
  },
  props: ['visible', 'editData'],
  methods: {
    cancel() {
      this.$refs.homeworkForm.clearValidate();
      this.$emit('update:visible', false);
    },
    // 保存作业
    submit() {
      console.log(this.formData.answer);
      if (this.formData.answer === '' || this.formData.answer === undefined) {
        this.$confirm('您当前的作业结果为空，您确认要保存吗？', '提示', { type: 'warning' })
          .then(() => {
            this.confrimSave();
          })
          .catch(() => {});
      } else {
        this.confrimSave();
      }
    },
    // 确认保存
    async confrimSave() {
      if (this.formData.status === -1) {
        await studentSaveHomeworkService(this.formData.id, this.formData);
        this.$emit('assign');
      } else if (this.formData.status === 0) {
        await stuEditHomewrokService(this.formData);
      }
      this.$message.success('保存作业成功');
      this.cancel();
      this.$emit('mine');
    },
  },
  watch: {
    editData(newVal) {
      this.formData = JSON.parse(JSON.stringify(newVal));
    },
  },
  computed: {
    // 是否可编辑状态
    isCanEdit() {
      return this.formData.status === -1 || this.formData.status === 0;
    },
  },
  mounted() {
    this.editData && (this.formData = JSON.parse(JSON.stringify(this.editData)));
  },
};
</script>

<style>
.student-edit-homework-form .el-form-item .el-form-item__label {
  font-weight: 700;
  font-size: 1rem;
}
</style>

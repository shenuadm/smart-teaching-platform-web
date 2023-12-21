<template>
  <el-drawer title="评阅学生作业" :visible="visible" :with-header="false" size="50%" :before-close="cancel">
    <el-form
      :model="formData"
      ref="formRef"
      :rules="rules"
      class="ml-20 tea-edit-stu-home"
      label-position="top"
      v-loading="$store.state.isLoading">
      <el-form-item label="作业名称">
        <div>{{ formData.name }}</div>
      </el-form-item>
      <el-form-item label="作业内容">
        <div>{{ formData.content }}</div>
      </el-form-item>
      <el-form-item label="作业结果">
        <div>{{ formData.answer }}</div>
      </el-form-item>
      <el-form-item label="作业成绩" prop="score">
        <el-input
          v-model.number="formData.score"
          placeholder="请输入学生成绩"
          type="number"
          style="width: 200px"></el-input>
      </el-form-item>
      <el-form-item label="评语" prop="comments">
        <el-input v-model="formData.comments" type="textarea" :rows="4" placeholder="请输入学生评语"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit">提交</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>

<script>
import { teaSaveStuHomeworkService } from '@/api/homework.js';
export default {
  data() {
    return {
      rules: {
        score: [{ required: true, message: '请输入学生该作业的成绩' }],
      },
      formData: {},
    };
  },
  props: ['visible', 'editData'],
  methods: {
    cancel() {
      this.$refs.formRef.clearValidate();
      this.$emit('update:visible', false);
    },
    submit() {
      this.$refs.formRef.validate(async (validate) => {
        if (validate) {
          await teaSaveStuHomeworkService(this.formData);
          this.$message.success('评阅学生作业成功');
          this.cancel();
          this.$emit('success');
        }
      });
    },
  },
  mounted() {
    this.formData = this.editData;
  },
  watch: {
    editData(newVal) {
      this.formData = newVal;
    },
  },
};
</script>

<style>
/* 表单标题 */
.tea-edit-stu-home .el-form-item .el-form-item__label {
  font-weight: 700;
  font-size: 1rem;
}
</style>

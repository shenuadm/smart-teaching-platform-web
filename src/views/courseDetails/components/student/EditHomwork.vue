<template>
  <el-drawer title="编辑作业" :visible="visible" direction="rtl" :before-close="cancel">
    <el-form :model="formData" ref="homeworkForm">
      <el-form-item label="作业名称">
        <div>{{ formData.name }}</div>
      </el-form-item>
      <el-form-item label="作业内容">
        <div>{{ formData.content }}</div>
      </el-form-item>
      <el-form-item label="作业结果">
        <el-input v-model="formData.result" placeholder="请输入您作业的结果" type="textarea" :rows="6"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit">保存</el-button>
        <el-button type="primary" @cancel="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>

<script>
export default {
  data() {
    return {
      formData: {
        name: '',
        content: '',
        endTime: '',
        result: '',
      },
      rules: [],
    };
  },
  props: ['visible', 'editData'],
  methods: {
    cancel() {
      this.$emit('update:visible', false);
    },
    submit() {
      if (this.formData.result === '') {
        this.$confirm('您当前的作业结果为空，您确认要保存吗？', '提示', { type: 'warning' })
          .then(() => {})
          .catch(() => {});
      }
    },
    async confrimSave() {},
  },
  watch: {
    editData(newVal) {
      this.formData = JSON.parse(JSON.stringify(newVal));
    },
  },
  mounted() {
    this.editData && (this.formData = JSON.parse(JSON.stringify(this.editData)));
  },
};
</script>

<style></style>

<template>
  <el-dialog
    :title="formData.id ? '编辑' : '新增'"
    :visible="visible"
    center
    width="30%"
    :before-close="cancel"
    :close-on-click-modal="false">
    <el-form :model="formData" ref="formRef" :rules="rules" label-position="top" v-loading="$store.state.isLoading">
      <el-form-item label="名称" prop="name">
        <el-input v-model="formData.name" placeholder="请输入名称"></el-input>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-switch v-model="formData.status" active-text="启用" inactive-text="禁用"></el-switch>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" @click="submit">确认</el-button>
      <el-button @click="cancel">取消</el-button>
    </template>
  </el-dialog>
</template>

<script>
import { addLearService, updateLearService } from '@/api/systemSetting.js';
const defaultData = {
  name: '',
  status: false,
};

export default {
  data() {
    return {
      formData: { ...defaultData },
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          { min: 1, max: 20, message: '名称长度在50个字符以内', trigger: 'blur' },
        ],
        status: [{ required: true, message: '请选择状态', trigger: 'change' }],
      },
    };
  },
  methods: {
    cancel() {
      this.$refs.formRef.clearValidate();
      this.$emit('update:visible', false);
    },
    submit() {
      this.$refs.formRef.validate(async (validate) => {
        if (validate) {
          if (this.formData.id) {
            await updateLearService(this.formData);
            this.$message.success('编辑成功');
          } else {
            await addLearService(this.formData);
            this.$message.success('新增成功');
          }
          this.cancel();
          this.$emit('success', {});
        }
      });
    },
  },
  props: ['visible', 'editData'],
  watch: {
    editData(newVal) {
      this.formData = { ...defaultData, ...newVal };
    },
  },
};
</script>

<style></style>

<template>
  <el-dialog :title="title + '虚拟机'" :visible="true" width="30%" :close-on-click-modal="false" :before-close="cancel">
    <el-form :model="formData" :rules="rules" ref="vmForm" v-loading="$store.state.isLoading" label-width="100px">
      <el-form-item label="名称" prop="name">
        <el-input :disabled="title === '编辑'" v-model="formData.name" placeholder="请输入虚拟机名称"></el-input>
      </el-form-item>
      <el-form-item label="登录账号" prop="username">
        <el-input v-model="formData.username" placeholder="请输入虚拟机登陆账号"></el-input>
      </el-form-item>
      <el-form-item label="登录密码" prop="pwd">
        <el-input v-model="formData.pwd" placeholder="请输入虚拟机登录密码"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" @click="submit">确认</el-button>
      <el-button @click="cancel">取消</el-button>
    </template>
  </el-dialog>
</template>

<script>
import Bus from '@/utils/eventBus';
export default {
  data() {
    return {
      formData: {},
      rules: {
        name: [{ required: true, message: '请输入虚拟机名称', trigger: 'blur' }],
        username: [{ required: true, message: '请输入虚拟机登录账号', trigger: 'blur' }],
        pwd: [{ required: true, message: '请输入虚拟机登录密码', trigger: 'blur' }],
      },
    };
  },
  props: ['title', 'editForm'],
  methods: {
    cancel() {
      this.$refs.vmForm.clearValidate();
      Bus.$emit('vmClear');
    },
    submit() {
      this.$refs['vmForm'].validate((validate) => {
        if (validate) {
          this.$emit('submitEvent', this.formData);
        } else {
          return this.$message.error('请输入正确的虚拟机信息');
        }
      });
    },
  },
  mounted() {
    this.editForm && (this.formData = JSON.parse(JSON.stringify(this.editForm)));
  },
};
</script>

<style></style>

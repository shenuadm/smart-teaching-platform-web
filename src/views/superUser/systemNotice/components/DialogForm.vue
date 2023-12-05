<template>
  <el-dialog :title="title + '通知'" :visible="true" width="30%" :close-on-click-modal="false" :before-close="cancel">
    <el-form :model="formData" :rules="rules" ref="noticeForm" v-loading="$store.state.isLoading" label-width="100px">
      <el-form-item label="通知标题" prop="title">
        <el-input v-model="formData.title" placeholder="请输入通知的标题"></el-input>
      </el-form-item>
      <el-form-item label="通知状态" prop="status" class="notice-select">
        <el-select v-model="formData.status" placeholder="请选择该通知的状态">
          <el-option v-for="item in noticeStatus" :key="item[0]" :label="item[1]" :value="item[0]"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="通知内容" prop="content">
        <el-input type="textarea" :rows="6" v-model="formData.content" placeholder="请输入通知内容"></el-input>
      </el-form-item>
      <el-form-item class="flex justify-around">
        <el-button size="small" type="primary" @click="confirm">确 定</el-button>
        <el-button size="small" @click="cancel">取 消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import Bus from '@/utils/eventBus';
import { noticeStatus } from '@/constant/status.js';
export default {
  data() {
    return {
      // 显示数据
      formData: {},
      noticeStatus, // 通知状态
      // 校验规则
      rules: {
        title: [
          { required: true, message: '请输入通知标题', trigger: 'blur' },
          {
            min: 1,
            max: 50,
            message: '标题长度在50个字符以内',
            trigger: 'blur',
          },
        ],
        content: [
          { required: true, message: '请输入通知标题', trigger: 'blur' },
          { min: 1, max: 3000, message: '您输入的内容过长', trigger: 'blur' },
        ],
        status: [{ required: true, message: '请选择该通知的状态', trigger: 'blur' }],
      },
    };
  },
  methods: {
    cancel() {
      Bus.$emit('clearDialog');
    },
    // 确认
    confirm() {
      this.$refs['noticeForm'].validate((valid) => {
        if (valid) {
          // 通过校验通知父组件处理
          this.$emit('formEvent', this.formData);
        } else {
          return this.$message.error('请输入正确的通知信息');
        }
      });
    },
  },
  props: {
    title: String,
    editFrom: Object || null,
  },
  mounted() {
    // 如果传入了值就表示是修改
    this.editFrom && (this.formData = JSON.parse(JSON.stringify(this.editFrom)));
  },
};
</script>

<style>
/* 弹框中多选框不长度不够 */
.notice-select .el-select {
  display: block;
}
</style>

<template>
  <DialogForm :title="'新增'" @formEvent="addNotice" :visible="visible" :editFrom="{}"></DialogForm>
</template>

<script>
import { addSystemNoticeService } from '@/api/notice';
import DialogForm from './DialogForm.vue';

export default {
  components: {
    DialogForm,
  },
  methods: {
    // 新增通知
    async addNotice(form) {
      await addSystemNoticeService(form);
      this.$message.success('新增通知成功');
      this.$emit('update:visible', false);
      this.$emit('getData');
    },
  },
  props: ['visible'],
};
</script>

<style></style>

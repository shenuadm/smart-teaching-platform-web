<template>
  <DialogForm :title="'新增'" @formEvent="addNotice"></DialogForm>
</template>

<script>
import DialogForm from './DialogForm.vue';
import Bus from '@/utils/eventBus';
import { addNotice } from '@/utils/api.js';
export default {
  components: {
    DialogForm,
  },
  methods: {
    // 新增通知
    async addNotice(form) {
      await addNotice(form);
      this.$message.success('新增通知成功');
      Bus.$emit('clearDialog');
      this.$emit('getData');
    },
  },
};
</script>

<style></style>

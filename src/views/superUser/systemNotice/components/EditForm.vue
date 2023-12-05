<template>
  <DialogForm :title="'编辑'" :editFrom="editForm" @formEvent="editNotice"></DialogForm>
</template>

<script>
import DialogForm from './DialogForm.vue';
import { editNotice } from '@/utils/api.js';
import Bus from '@/utils/eventBus';
export default {
  components: {
    DialogForm,
  },
  props: {
    editForm: Object,
  },
  methods: {
    // 编辑通知
    async editNotice(form) {
      await editNotice(form);
      this.$message.success('编辑通知成功');
      Bus.$emit('clearDialog');
    },
  },
};
</script>

<style></style>

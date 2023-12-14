<template>
  <DialogForm :title="'编辑'" :editFrom="editForm" @formEvent="editNotice" :visible="visible"></DialogForm>
</template>

<script>
import { editSystemNoticeService } from '@/api/notice';
import DialogForm from './DialogForm.vue';
export default {
  components: {
    DialogForm,
  },
  props: {
    editForm: Object,
    visible: Boolean,
  },
  methods: {
    // 编辑通知
    async editNotice(form) {
      await editSystemNoticeService(form);
      this.$message.success('编辑通知成功');
      this.$emit('getData');
      this.$emit('update:visible', false);
    },
  },
};
</script>

<style></style>

<template>
  <DialogForm
    :title="'编辑'"
    :editFrom="editForm"
    @formEvent="editNotice"
    :loading="loading"
  ></DialogForm>
</template>

<script>
import DialogForm from './DialogForm.vue';
import { editNotice } from '@/utils/api.js';
import Bus from '@/utils/eventBus';
export default {
  data() {
    return { loading: false };
  },
  components: {
    DialogForm,
  },
  props: {
    editForm: Object,
  },
  methods: {
    // 编辑通知
    async editNotice(form) {
      this.loading = true;
      await editNotice(form);
      this.$message.success('编辑通知成功');
      this.loading = false;
      Bus.$emit('clearDialog');
    },
  },
};
</script>

<style></style>

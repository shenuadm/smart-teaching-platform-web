<template>
  <DialogForm
    :title="'新增'"
    @formEvent="addNotice"
    :loading="loading"
  ></DialogForm>
</template>

<script>
import DialogForm from './DialogForm.vue';
import Bus from '@/utils/eventBus';
import { addNotice } from '@/utils/api.js';
export default {
  data() {
    return { loading: false };
  },
  components: {
    DialogForm,
  },
  methods: {
    // 新增通知
    async addNotice(form) {
      this.loading = true;
      await addNotice(form);
      this.loading = false;
      this.$message.success('新增通知成功');
      Bus.$emit('clearDialog');
      this.$emit('getData');
    },
  },
};
</script>

<style></style>

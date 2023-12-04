<template>
  <VmForm :title="'编辑'" :editForm="editForm" @submitEvent="editVm" :loading="loading"></VmForm>
</template>

<script>
import Bus from '@/utils/eventBus';
import VmForm from './VmForm.vue';
export default {
  data() {
    return { loading: false };
  },
  components: { VmForm },
  props: ['editForm'],
  methods: {
    async editVm(data) {
      this.loading = true;
      console.log(data, '编辑');
      await this.$message.success('编辑虚拟机成功');
      this.loading = false;
      Bus.$emit('vmClear');
      this.$emit('getData');
    },
  },
};
</script>

<style></style>

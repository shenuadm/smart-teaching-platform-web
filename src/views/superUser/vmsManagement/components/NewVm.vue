<template>
  <VmForm :title="'新增'" @submitEvent="addVm" :loading="loading"></VmForm>
</template>

<script>
import Bus from '@/utils/eventBus';
import VmForm from './VmForm.vue';
import { addVmService } from '@/api/vm.js';
export default {
  data() {
    return { loading: false };
  },
  components: { VmForm },
  methods: {
    async addVm(data) {
      this.loading = true;
      console.log(data);
      await addVmService(data);
      this.$message.success('添加虚拟机成功');
      this.loading = false;
      Bus.$emit('vmClear');
      this.$emit('getData');
    },
  },
};
</script>

<style></style>

<template>
  <VmForm :title="'新增'" @submitEvent="addVm"></VmForm>
</template>

<script>
import Bus from '@/utils/eventBus';
import VmForm from './VmForm.vue';
import { addVmService } from '@/api/vm.js';
export default {
  components: { VmForm },
  methods: {
    async addVm(data) {
      await addVmService(data);
      this.$message.success('添加虚拟机成功');
      Bus.$emit('vmClear');
      this.$emit('getData');
    },
  },
};
</script>

<style></style>

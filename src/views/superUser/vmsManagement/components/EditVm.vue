<template>
  <VmForm :title="'编辑'" :editForm="editForm" @submitEvent="editVm"></VmForm>
</template>

<script>
import Bus from '@/utils/eventBus';
import VmForm from './VmForm.vue';
import { updateVmService } from '@/api/vm.js';
export default {
  components: { VmForm },
  props: ['editForm'],
  methods: {
    async editVm(data) {
      await updateVmService(data);
      this.$message.success('编辑虚拟机成功');
      Bus.$emit('vmClear');
      this.$emit('getData');
    },
  },
};
</script>

<style></style>

<template>
  <el-dialog :title="'日志详情'" :visible="visible" width="30%" :before-close="cancel" :close-on-click-modal="false">
    <el-descriptions
      title="日志详情"
      label-class-name="min-width-1-3"
      border
      direction="vertical"
      v-loading="$store.state.isLoading">
      <el-descriptions-item label="操作账户">{{ data.account }}</el-descriptions-item>
      <el-descriptions-item label="IP地址">{{ data.ip }}</el-descriptions-item>
      <el-descriptions-item label="操作标题">{{ data.message }}</el-descriptions-item>
      <el-descriptions-item label="操作类型">{{ data.operation }}</el-descriptions-item>
      <el-descriptions-item label="操作时间">{{ dateToSecond(data.createTime) }}</el-descriptions-item>
      <el-descriptions-item label="操作耗时(ms)">{{ data.totalTime }}</el-descriptions-item>
      <el-descriptions-item label="请求地址">{{ data.url }}</el-descriptions-item>
      <el-descriptions-item label="请求方法">{{ data.httpMethod }}</el-descriptions-item>
      <el-descriptions-item label="方法">{{ data.method }}</el-descriptions-item>
      <el-descriptions-item label="返回值">{{ data.returnValue }}</el-descriptions-item>
      <el-descriptions-item label="请求参数">{{ data.params }}</el-descriptions-item>
    </el-descriptions>
    <template #footer>
      <el-button @click="cancel">关闭</el-button>
    </template>
  </el-dialog>
</template>
<script>
import { getLogDetailService } from '@/api/log';
import { dateToSecond } from '@/utils/date';

export default {
  data() {
    return {
      data: {},
    };
  },
  props: ['id', 'visible'],
  methods: {
    cancel() {
      this.$emit('update:visible', false);
    },
    async getDetailData() {
      const { data } = await getLogDetailService(this.id);
      this.data = data;
    },
    dateToSecond,
  },
  watch: {
    id(newVal) {
      console.log(newVal);
      this.getDetailData();
    },
  },
};
</script>

<style scoped></style>

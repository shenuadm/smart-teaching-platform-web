<template>
  <div class="vms-container" v-loading="$store.state.isLoading">
    <div class="vms-title">
      <el-button type="primary" size="mini" @click="updateStudentVms">更新实验虚拟机</el-button>
      <i class="el-icon-info ml-20"></i>
      <span style="font-size: 0.75rem; color: grey">如果没有分配实验虚拟机，请点击该按钮更新分配实验虚拟机。</span>
    </div>
    <div class="vms-list">
      <div v-for="item in vmsData" :key="item.id" class="vms-item">
        <div>
          <div>学生姓名：</div>
          <div>{{ item.userName }}</div>
        </div>
        <div>
          <div>虚拟机名称：</div>
          <div>{{ item.host }}</div>
        </div>
        <div>
          <div>虚拟机账户：</div>
          <div>{{ item.hostName }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getStudentVms, shareStudentVms } from '@/api/vm.js';
export default {
  data() {
    return {
      vmsData: [],
    };
  },
  methods: {
    // 更新学生虚拟机
    async updateStudentVms() {
      await shareStudentVms(this.$route.query.id);
      await this.getStudentVmsData();
      this.$message.success('更新实验虚拟机成功');
    },
    // 获取学生虚拟机信息
    async getStudentVmsData() {
      const res = await getStudentVms(this.$route.query.id);
      this.vmsData = res.data;
    },
  },
  mounted() {
    this.getStudentVmsData();
  },
};
</script>

<style scoped>
/* 学生虚拟机列表 */
.vms-container {
  background: #fff;
  padding: 0 20px;
  min-height: 100vh;
}
.vms-title {
  padding: 10px 0;
  display: flex;
  align-items: center;
}
.vms-list {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  column-gap: 20px;
  row-gap: 20px;
}
.vms-item {
  padding: 10px 10px;
  text-align: left;
  border-radius: 15px;
  background: #eeeff1;
}
.vms-item > div {
  display: flex;
  height: 30px;
  line-height: 30px;
}
.vms-item > div :first-of-type {
  width: 115px;
  text-align: right;
}
</style>

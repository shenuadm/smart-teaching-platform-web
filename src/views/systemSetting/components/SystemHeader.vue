<template>
  <div class="system-header" :class="$route.query.name ? 'bg-white raduis-15' : ''">
    <header v-if="$route.query.name">{{ backTitle + '：' }}{{ $route.query.name }}</header>
    <div class="flex action" :class="$route.query.name ? 'py-10 px-30' : ''">
      <el-button size="small" type="primary" @click="add">新增{{ title }}</el-button>
      <el-button v-if="backTitle" size="small" type="primary" @click="backHistory">返回{{ backTitle }}</el-button>
    </div>
  </div>
</template>

<script>
import { systemSettingStatus } from '@/constant/status.js';
export default {
  data() {
    return {
      systemSettingStatus,
      searchInfo: '',
      searchStatus: '',
    };
  },
  methods: {
    search() {
      if (this.searchInfo === '' && this.searchStatus === '')
        return this.$message.warning('请输入搜索名称或选择搜索状态后再进行搜索');
      this.$emit('getData', { searchInfo: this.searchInfo, searchStatus: this.searchStatus });
    },
    add() {
      this.$emit('add');
    },
    backHistory() {
      history.back();
    },
  },
  props: ['title', 'backTitle', 'header'],
};
</script>

<style scoped>
.title {
  width: 100px;
}
.system-header {
  margin-bottom: 20px;
}
header {
  height: 60px;
  padding: 0 50px;
  display: flex;
  align-items: center;
  /* font-size: 1.125rem; */
  font-size: 20px;
  border-bottom: 2px solid #efefef;
}
.action {
  align-items: center;
}
</style>

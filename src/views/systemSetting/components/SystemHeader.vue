<template>
  <div class="flex header">
    <div class="title">{{ title }}名称：</div>
    <el-input
      v-model="searchInfo"
      @keydown.enter="search"
      :placeholder="`请输入${title}名称`"
      style="width: 200px"
      @click="search"
    ></el-input>
    <div class="title">{{ title }}状态：</div>
    <el-select v-model="searchStatus" :placeholder="`请选择您要搜索的${title}状态`" clearable>
      <el-option v-for="item in systemSettingStatus" :key="item[0]" :label="item[1]" :value="item[0]"></el-option>
    </el-select>
    <el-button size="small" type="primary" class="ml-10" @click="search">搜索</el-button>
    <el-button size="small" type="primary" @click="reset">重置</el-button>
    <el-button size="small" type="primary" @click="add">新增{{ title }}</el-button>
    <el-button v-if="backTitle" size="small" type="primary" @click="backHistory">返回{{ backTitle }}</el-button>
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
    reset() {
      this.$emit('getData', {});
    },
    backHistory() {
      history.back();
    },
  },
  props: ['title', 'backTitle'],
};
</script>

<style scoped>
.title {
  width: 100px;
}
.header {
  align-items: center;
  margin-bottom: 20px;
}
</style>

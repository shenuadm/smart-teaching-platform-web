<template>
  <div class="chapter-details warpper">
    <!-- 头部面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/courseCenter' }">课程中心</el-breadcrumb-item>
      <el-breadcrumb-item>《WEB安全》</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 信息表格 -->
    <div class="chapter-table">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="title" label="章节标题"> </el-table-column>
        <el-table-column prop="time" label="课时"> </el-table-column>
        <el-table-column prop="order" label="排序"> </el-table-column>
        <el-table-column prop="courseware" label="课件"> </el-table-column>
        <el-table-column prop="describe" label="描述"> </el-table-column>
        <el-table-column prop="operate" label="操作"> </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import adapter from "./adapter.js";
export default {
  data() {
    return {
      ...adapter.data,
      tableTitle: ["章节标题", "课时", "排序", "课件", "描述", "操作"],
      tableData: [
        {
          title: "信息收集",
          time: 3,
          order: 1,
          courseware: "",
          describe: "信息收集、威胁建模、漏洞分析...",
          operate: "",
        },
      ],
    };
  },
  methods: {
    ...adapter.methods,
  },
};
</script>

<style scoped>
.chapter-details {
}
/* 头部面包屑导航 */
.chapter-details .el-breadcrumb {
  padding: 0 20px;
  height: 100%;
  line-height: 40px;
}
/* 信息表格 */
.chapter-table {
  padding: 20px;
  background-color: #fff;
}
</style>

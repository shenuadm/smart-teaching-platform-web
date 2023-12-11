<template>
  <el-table :data="tableData" border>
    <el-table-column label="作业名称"></el-table-column>
    <el-table-column label="作业内容"></el-table-column>
    <el-table-column label="类型"></el-table-column>
    <el-table-column label="结果"></el-table-column>
    <el-table-column label="截止时间"></el-table-column>
    <el-table-column label="分数"></el-table-column>
    <el-table-column label="评语"></el-table-column>
    <el-table-column label="操作">
      <template slot-scope="{ row }">
        <el-button type="primary">保存</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  props: [],
  data() {
    return {
      tableData: [], // 学生成绩
    };
  },
  methods: {
    getData() {},
  },
};
</script>

<style></style>

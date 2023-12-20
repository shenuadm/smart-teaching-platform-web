<template>
  <el-table border :data="tableData" v-loading="$store.state.isLoading">
    <el-table-column label="学生账号" prop="account"></el-table-column>
    <el-table-column label="学生姓名" prop="userName"></el-table-column>
    <el-table-column label="学生专业" prop="major"></el-table-column>
    <el-table-column label="学生年级" prop="grade"></el-table-column>
    <el-table-column label="学生班级" prop="clazz"></el-table-column>
  </el-table>
</template>

<script>
import { teaGetCourseStuService } from '@/api/course';

export default {
  data() {
    return {
      tableData: [],
      page: 1,
      total: 0,
    };
  },
  methods: {
    async getData() {
      const { data } = await teaGetCourseStuService(this.$route.query.id, this.page);
      console.log(data);
      this.tableData = data;
    },
  },
  mounted() {
    this.getData();
  },
};
</script>

<style scoped></style>

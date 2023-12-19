<template>
  <el-table border :data="tableData">
    <el-table-column></el-table-column>
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

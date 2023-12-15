<template>
  <div>
    <el-table :data="tableData" border v-loading="$store.state.isLoading">
      <el-table-column label="作业名称" prop="name"></el-table-column>
      <el-table-column label="结果" prop="answer"></el-table-column>
      <el-table-column label="截止时间">
        <template slot-scope="{ row }">{{ dateToSecond(row.endTime) }}</template>
      </el-table-column>
      <el-table-column label="分数" prop="score">
        <template slot-scope="{ row }">{{ Number.isInteger(row.score) ? row.score : row.score.toFixed(1) }}</template>
      </el-table-column>
      <el-table-column label="状态" width="100px">
        <template slot-scope="{ row }">{{ row.status === 1 ? '未评阅' : '已评阅' }}</template>
      </el-table-column>
      <el-table-column label="评语" prop="comments"></el-table-column>
      <el-table-column label="评阅时间">
        <template slot-scope="{ row }">{{ row.commentTime === null ? '' : dateToSecond(row.commentTime) }}</template>
      </el-table-column>
      <el-table-column label="操作" width="100px">
        <template slot-scope="{ row }">
          <el-button type="primary" size="small" @click="editHomework(row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <TeacherEdit :visible.sync="visible" :editData="editData" @success="changeStudentSuccess"></TeacherEdit>
  </div>
</template>

<script>
import { teaGetStuHomeworkService } from '@/api/homework.js';
import { dateToSecond } from '@/utils/date.js';
import TeacherEdit from './TeacherEdit.vue';

export default {
  props: ['studentId', 'articleId'],
  data() {
    return {
      tableData: [], // 学生成绩
      visible: false,
      editData: {},
    };
  },
  methods: {
    changeStudentSuccess() {
      this.getData();
      this.$emit('success');
    },
    async getData() {
      const res = await teaGetStuHomeworkService(this.articleId, this.$route.query.id, this.studentId);
      this.tableData = res.data;
    },
    editHomework(row) {
      this.editData = row;
      console.log(row);
      this.visible = true;
    },
    dateToSecond,
  },
  mounted() {
    this.getData();
  },
  components: {
    TeacherEdit,
  },
};
</script>

<style></style>

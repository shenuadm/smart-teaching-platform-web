<template>
  <div>
    <el-table :data="tableData" border v-loading="$store.state.isLoading">
      <el-table-column label="作业名称" prop="name"></el-table-column>
      <el-table-column label="结果" prop="answer"></el-table-column>
      <el-table-column label="截止时间">
        <template #default="{ row }">{{ dateToSecond(row.endTime) }}</template>
      </el-table-column>
      <el-table-column label="分数" prop="score">
        <template #default="{ row }">{{ Number.isInteger(row.score) ? row.score : row.score.toFixed(1) }}</template>
      </el-table-column>
      <el-table-column label="状态" width="100px">
        <template #default="{ row }">{{ row.status === 1 ? '未评阅' : '已评阅' }}</template>
      </el-table-column>
      <el-table-column label="评语" prop="comments"></el-table-column>
      <el-table-column label="评阅时间">
        <template #default="{ row }">{{ row.commentTime === null ? '' : dateToSecond(row.commentTime) }}</template>
      </el-table-column>
      <el-table-column label="操作" width="100px">
        <template #default="{ row }">
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
    // 修改单一学生某个作业后，重新获取该学生作业表，并通知父组件更新学生列表中的平均成绩
    changeStudentSuccess() {
      this.getData();
      this.$emit('success');
    },
    // 获取学生作业列表数据
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

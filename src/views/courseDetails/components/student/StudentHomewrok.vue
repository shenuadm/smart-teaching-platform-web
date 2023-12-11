<template>
  <div class="homework-list">
    <el-tabs v-model="tabActive" @tab-click="handleTabs">
      <el-tab-pane label="布置的作业" name="0">
        <el-table v-if="isPickup" :data="assignData" border>
          <el-table-column type="selection" width="50"> </el-table-column>
          <el-table-column label="作业名称" prop="name"></el-table-column>
          <el-table-column label="作业内容" prop="content"></el-table-column>
          <el-table-column label="截止时间" prop="endTime"> </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="{ row }">
              <el-button type="primary" @click="editHomework(row)">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="自己的作业" name="1">
        <el-table v-if="isMyHomework" :data="myHomeworkData" border>
          <el-table-column type="selection" width="50"> </el-table-column>
          <el-table-column label="作业名称" prop="name"></el-table-column>
          <el-table-column label="作业内容" prop="content"></el-table-column>
          <el-table-column label="类型" prop="answer"></el-table-column>
          <el-table-column label="截止时间" prop="endTime">
            <template slot-scope="{ row }">
              <el-date-picker v-model="row.endTime" type="datetime" placeholder="选择日期时间"> </el-date-picker>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="{ row }">
              <el-button type="primary" size="small" @click="homeworkDetail(row)">详情</el-button>
              <el-button type="danger" size="small" @click="deleteHomework(row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
// import dayjs from 'dayjs';
import { studentGetAssignHomeworkService } from '@/api/homework.js';
// import { isAfterNow } fgerom '@/utils/date.js';

export default {
  data() {
    return {
      tabActive: '0', // 选择的页面展示
      assignData: [], // 布置的作业数据
      myHomeworkData: [], // 自己的作业数据
      visible: false, // 编辑作业弹框
      editData: {}, // 编辑的作业信息
    };
  },
  props: ['articleId'], // 节id
  methods: {
    // 页面切换
    async handleTabs() {
      if (this.isPickup && this.assignData.length === 0) {
        this.getAssignData();
      } else if (this.isMyHomework && this.myHomeworkData.length === 0) {
        console.log('自己的作业');
      }
    },
    // 获取布置的作业数据
    async getAssignData() {
      const res = await studentGetAssignHomeworkService(this.articleId, this.$route.query.courseId);
      console.log(res.data, 'stu');
      this.assignData = res.data;
    },
    // 编辑作业
    editHomework(row) {
      console.log(row);
    },
    // 查看作业详情
    homeworkDetail(row) {
      console.log(row);
    },
    // 查看学生作业列表
    studentHomeWork(row) {
      console.log(row);
    },
  },
  mounted() {
    this.getAssignData();
  },
  computed: {
    // 当前页面是否是布置的作业
    isPickup() {
      return this.tabActive === '0';
    },
    // 当前页面是否是自己的作业
    isMyHomework() {
      return this.tabActive === '1';
    },
  },
};
</script>

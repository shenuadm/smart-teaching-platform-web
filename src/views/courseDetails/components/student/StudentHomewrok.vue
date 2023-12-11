<template>
  <div class="homework-list">
    <el-tabs v-model="tabActive" @tab-click="handleTabs">
      <el-tab-pane label="布置的作业" name="0">
        <el-table v-if="isPickup" :data="systemData" border>
          <el-table-column type="selection" width="50"> </el-table-column>
          <el-table-column label="作业名称" prop="name"></el-table-column>
          <el-table-column label="作业内容" prop="content"></el-table-column>
          <el-table-column label="参考答案" prop="answer"></el-table-column>
          <el-table-column label="截止时间" prop="endTime">
            <template slot-scope="{ row }">
              <el-date-picker v-model="row.endTime" type="datetime" :editable="false" placeholder="选择日期时间">
              </el-date-picker>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="{ row }">
              <!-- <el-button type="primary" size="small" @click="submitHomework(row)">布置</el-button> -->
              <el-button type="primary" @click="editHomework(row)">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="自己的作业" name="1">
        <el-table v-if="isMyHomework" :data="arrangeData" border>
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
import { teacherGetHomeworkService, pickupHomeworkService } from '@/api/homework.js';
// import { isAfterNow } from '@/utils/date.js';

export default {
  data() {
    return {
      tabActive: '0', // 选择的页面展示
      allDate: '', // 一键发布选择的时间
      selectionList: '', // 选择的作业列表
      arrangeData: [], // 布置的作业数据
      systemData: [], // 系统作业数据
      studentData: [], // 学生作业数据
      homeworkDetailVisible: false, // 作业详情弹框状态
    };
  },
  props: ['articleId'], // 节id
  methods: {
    // 页面切换
    async handleTabs() {
      if (this.tabActive === '0' && this.systemData.length === 0) {
        this.getSystemData();
      } else if (this.tabActive === '1' && this.arrangeData.length === 0) {
        this.getSubmitData();
      }
    },
    // 获取系统作业数据
    async getSystemData() {
      const res = await teacherGetHomeworkService(this.articleId, 0, 0);
      this.systemData = res.data;
    },
    // 获取布置的作业数据
    async getSubmitData() {
      const res = await teacherGetHomeworkService(this.articleId, this.$route.query.courseId, 0);
      console.log(res);
      this.arrangeData = res.data;
    },

    // 编辑作业
    editHomework(row) {
      console.log(row);
    },

    // 布置作业
    async assignHomework(id, time) {
      await pickupHomeworkService(id, time);
      this.$message.success('发布作业成功');
      await this.getSubmitData();
      await this.getSystemData();
    },

    // 新增作业
    addHomework() {},
    // 查看作业详情
    homeworkDetail(row) {
      console.log(row);
    },
    // 查看学生作业列表
    studentHomeWork(row) {
      console.log(row);
    },
    // 删除
    deleteHomework({ id }) {
      console.log(id);
    },
  },
  mounted() {
    this.getSystemData();
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

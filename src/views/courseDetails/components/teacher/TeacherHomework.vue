<template>
  <div class="homework-list">
    <el-tabs v-model="tabActive" @tab-click="handleTabs">
      <el-tab-pane label="系统作业" name="0">
        <el-table v-if="isSystem" :data="systemData" border @selection-change="handleTable">
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
              <el-button
                :type="row.assign ? 'info' : 'primary'"
                :disabled="row.assign"
                size="small"
                @click="submitHomework(row)"
                >布置</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="布置的作业" name="1">
        <el-table v-if="isAssign" :data="arrangeData" border>
          <el-table-column label="作业名称" prop="name"></el-table-column>
          <el-table-column label="作业内容" prop="content"></el-table-column>
          <el-table-column label="类型" prop="custom">
            <template slot-scope="{ row }">
              {{ row.custom ? '自定义' : '系统' }}
            </template>
          </el-table-column>
          <el-table-column label="截止时间" prop="endTime"> </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="{ row }">
              <el-button type="primary" size="small" @click="homeworkDetail(row)">编辑</el-button>
              <el-button type="danger" size="small" @click="deleteHomework(row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="学生作业" name="2">
        <el-table v-if="isSutdent" :data="studentData" border>
          <el-table-column label="账号"></el-table-column>
          <el-table-column label="姓名"></el-table-column>
          <el-table-column label="专业"></el-table-column>
          <el-table-column label="年级"></el-table-column>
          <el-table-column label="分数"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="{ row }">
              <el-button type="primary" @click="studentHomeWork(row)">详情</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
    <div class="action">
      <el-button type="primary" @click="addHomework" v-if="isAssign">新增作业</el-button>
      <el-date-picker v-if="isSystem" v-model="allDate" type="datetime" placeholder="请选择发布的时间">
      </el-date-picker>
      <el-button v-if="isSystem" type="primary" @click="allSubmit">一键发布</el-button>
    </div>
    <HomeworkDetail
      :visible.sync="homeworkDetailVisible"
      :editData="editHomeworkData"
      :articleId="articleId"
      @success="getSubmitData"
    ></HomeworkDetail>
  </div>
</template>

<script>
import dayjs from 'dayjs';
import {
  teacherGetHomeworkService,
  pickupHomeworkService,
  teacherGetStudentHomeworkService,
  getAssignHomeworkService,
  teaDelHomeworkService,
} from '@/api/homework.js';
import HomeworkDetail from './HomeworkDetail.vue';
import { isAfterNow } from '@/utils/date.js';

// 编辑新增作业默认数据
const defaultData = {
  answer: '',
  content: '',
  name: '',
  date: '',
};

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
      editHomeworkData: { ...defaultData }, // 编辑的作业
    };
  },
  props: ['articleId'], // 节id
  methods: {
    // 页面切换
    async handleTabs() {
      if (this.isSystem && this.systemData.length === 0) {
        this.getSystemData();
      } else if (this.isAssign && this.arrangeData.length === 0) {
        this.getSubmitData();
      } else if (this.isSutdent && this.studentData.length === 0) {
        this.getStudentData();
      }
    },
    // 获取系统作业数据
    async getSystemData() {
      const res = await teacherGetHomeworkService(this.articleId, this.$route.query.courseId);
      this.systemData = res.data;
    },
    // 获取布置的作业数据
    async getSubmitData() {
      const res = await getAssignHomeworkService(this.articleId, this.$route.query.courseId);
      this.arrangeData = res.data;
    },
    // 获取学生作业列表
    async getStudentData() {
      const res = await teacherGetStudentHomeworkService(this.articleId, this.$route.query.courseId);
      console.log(res, 'student');
    },
    // 表格中的布置作业
    submitHomework({ id, endTime }) {
      if (endTime === null || endTime === '') return this.$message.warning('请选择截至时间后再发布');
      if (!isAfterNow(endTime)) return this.$message.warning('截止日期至少在当前时间半小时之后');
      this.assignHomework(id, dayjs(endTime).format('YYYY-MM-DD HH:mm:ss'));
    },
    // 布置作业
    async assignHomework(id, time) {
      await pickupHomeworkService(id, this.$route.query.courseId, time);
      this.$message.success('发布作业成功');
      await this.getSubmitData();
      await this.getSystemData();
    },

    // 新增作业
    addHomework() {
      this.editHomeworkData = { ...defaultData };
      this.homeworkDetailVisible = true;
    },
    // 编辑作业
    homeworkDetail(row) {
      this.editHomeworkData = row;
      this.homeworkDetailVisible = true;
    },
    // 查看学生作业列表
    studentHomeWork(row) {
      console.log(row);
    },
    // 删除
    deleteHomework({ id }) {
      this.$confirm('您确认要删除选中的作业吗？', '提示', { type: 'warning' })
        .then(async () => {
          await teaDelHomeworkService(id);
          this.$message.success('删除作业成功');
          this.getSubmitData();
        })
        .catch(() => {});
    },
    // 一键布置作业
    allSubmit() {
      if (this.selectionList.length === 0 || this.allDate === '')
        return this.$message.warning('请选择作业和截止时间后再进行发布');
      if (!isAfterNow(this.allDate)) return this.$message.warning('截止日期至少在当前时间半小时之后');
      this.assignHomework(this.selectionList, dayjs(this.allDate).format('YYYY-MM-DD HH:mm:ss'));
    },

    // 表格选择
    handleTable(val) {
      this.selectionList = val
        .reduce((a, b) => {
          a.push(b.id);
          return a;
        }, [])
        .join(',');
    },
  },
  mounted() {
    this.editHomeworkData = { ...defaultData };
    this.getSystemData();
  },
  computed: {
    // 是否是系统作业页面
    isSystem() {
      return this.tabActive === '0';
    },
    // 是否是布置的作业页面
    isAssign() {
      return this.tabActive === '1';
    },
    // 是否是学生作业页面
    isSutdent() {
      return this.tabActive === '2';
    },
  },
  components: {
    HomeworkDetail,
  },
};
</script>

<style scoped>
.homework-list {
  position: relative;
}
.action {
  position: absolute;
  display: flex;
  gap: 20px;
  top: 0;
  /* right: 20vw; */
  right: 0;
}
</style>
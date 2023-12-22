<template>
  <div class="teacher-homework-list">
    <template v-if="studentHomeworkVisible">
      <div class="student-homework-action">
        <el-button type="primary" @click="() => (studentHomeworkVisible = false)">返回</el-button>
      </div>
      <StudentHomeworkTable
        :studentId="studentId"
        :articleId="articleId"
        @success="getStudentData"></StudentHomeworkTable>
    </template>
    <template v-else>
      <div class="flex align-center">
        <el-tabs v-model="tabActive" @tab-click="handleTabs">
          <el-tab-pane label="系统作业" name="0"></el-tab-pane>
          <el-tab-pane label="布置的作业" name="1"></el-tab-pane>
          <el-tab-pane label="学生作业" name="2"></el-tab-pane>
        </el-tabs>
        <div class="flex ml-30 gap-10" style="margin-bottom: 15px">
          <template v-if="isAssign">
            <el-button type="primary" @click="addHomework" v-if="isAssign">新增作业</el-button>
            <el-button style="margin-left: 0">下载模板</el-button>
            <el-upload
              action=""
              :auto-upload="false"
              class="teacher-homework-list-upload flex"
              :file-list="fileList"
              ref="upload"
              :on-change="uploadChange">
              <el-button type="primary" slot="trigger">导入作业文件</el-button>
              <el-button type="primary" class="ml-10">确认上传</el-button>
            </el-upload>
          </template>
          <el-date-picker v-if="isSystem" v-model="allDate" type="datetime" placeholder="请选择作业截止时间">
          </el-date-picker>
          <el-button v-if="isSystem" type="primary" @click="allSubmit">一键发布</el-button>
        </div>
      </div>
      <!--   学生列表   -->
      <el-table v-if="isSutdent" :data="studentData" border v-loading="$store.state.isLoading">
        <el-table-column label="账号" prop="account"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="专业" prop="major"></el-table-column>
        <el-table-column label="年级" prop="grade"></el-table-column>
        <el-table-column label="班级" prop="clazz"></el-table-column>
        <el-table-column label="分数" prop="score">
          <template #default="{ row }">{{ Number.isInteger(row.score) ? row.score : row.score.toFixed(1) }}</template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="studentHomeWork(row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--   布置的作业表格   -->
      <el-table v-if="isAssign" :data="arrangeData" border v-loading="$store.state.isLoading">
        <el-table-column label="作业名称" prop="name"></el-table-column>
        <el-table-column label="作业内容" prop="content"></el-table-column>
        <el-table-column label="类型" prop="custom">
          <template #default="{ row }">
            {{ row.custom ? '老师' : '系统' }}
          </template>
        </el-table-column>
        <el-table-column label="截止时间" prop="endTime"> </el-table-column>
        <el-table-column label="操作">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="homeworkDetail(row)">编辑</el-button>
            <el-button type="danger" size="small" @click="deleteHomework(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--   系统作业表格   -->
      <el-table
        v-if="isSystem"
        :data="systemData"
        border
        @selection-change="handleTable"
        v-loading="$store.state.isLoading">
        <el-table-column type="selection" width="50"> </el-table-column>
        <el-table-column label="作业名称" prop="name"></el-table-column>
        <el-table-column label="作业内容" prop="content"></el-table-column>
        <el-table-column label="参考答案" prop="answer"></el-table-column>
        <el-table-column label="截止时间" prop="endTime">
          <template #default="{ row }">
            <el-date-picker v-model="row.endTime" type="datetime" :editable="false" placeholder="选择作业截止时间">
            </el-date-picker>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="{ row }">
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
    </template>
    <!--  作业详情弹框  -->
    <HomeworkDetail
      :visible.sync="homeworkDetailVisible"
      :editData="editHomeworkData"
      :articleId="articleId"
      @success="getSubmitData"></HomeworkDetail>
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
import StudentHomeworkTable from './StudentHomeworkTable.vue';
import { isAllowFile } from '@/utils/upload';

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
      studentHomeworkVisible: false, // 学生作业列表显示状态
      studentId: '', // 查看学生作业的学生id
      fileList: [],
    };
  },
  props: ['articleId'], // 节id
  methods: {
    // 页面切换
    async handleTabs() {
      if (this.isSystem && this.systemData.length === 0) {
        await this.getSystemData();
      } else if (this.isAssign && this.arrangeData.length === 0) {
        await this.getSubmitData();
      } else if (this.isSutdent && this.studentData.length === 0) {
        await this.getStudentData();
      }
    },
    // 获取系统作业数据
    async getSystemData() {
      const res = await teacherGetHomeworkService(this.articleId, this.$route.query.id);
      this.systemData = res.data;
    },
    // 获取布置的作业数据
    async getSubmitData() {
      const res = await getAssignHomeworkService(this.articleId, this.$route.query.id);
      this.arrangeData = res.data;
    },
    // 获取学生作业列表
    async getStudentData() {
      const { data } = await teacherGetStudentHomeworkService(this.articleId, this.$route.query.id);
      if (!Array.isArray(data)) return (this.studentData = []);
      this.studentData = data;
    },
    // 表格中的布置作业
    submitHomework({ id, endTime }) {
      if (endTime === null || endTime === '') return this.$message.warning('请选择截至时间后再发布');
      if (!isAfterNow(endTime)) return this.$message.warning('截止日期至少在当前时间半小时之后');
      this.assignHomework(id, dayjs(endTime).format('YYYY-MM-DD HH:mm:ss'));
    },
    // 布置作业
    async assignHomework(id, time) {
      await pickupHomeworkService(id, this.$route.query.id, time);
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
    studentHomeWork({ userId }) {
      this.studentId = userId;
      this.studentHomeworkVisible = true;
    },
    // 删除
    deleteHomework({ id }) {
      this.$confirm('您确认要删除选中的作业吗？', '提示', { type: 'warning' })
        .then(async () => {
          await teaDelHomeworkService(id);
          this.$message.success('删除作业成功');
          await this.getSubmitData();
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
    uploadChange(file) {
      console.log(this.fileList);
      console.log(this.$refs.upload.uploadFiles);
      if (!isAllowFile(file.raw.name, ['.xls', '.xlsx'])) {
        this.$refs.upload.uploadFiles.pop();
        return this.$message.error('请上传excel类型文件');
      }
      if (this.$refs.upload.uploadFiles.length === 2) {
        this.$refs.upload.uploadFiles.shift();
      }
      console.log(this.$refs.upload.uploadFiles);
    },
  },
  mounted() {
    this.editHomeworkData = { ...defaultData };
    this.getSystemData();
  },
  watch: {
    articleId() {
      this.tabActive = '0';
      this.getSystemData();
    },
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
    StudentHomeworkTable,
  },
};
</script>

<style scoped>
.teacher-homework-list {
  position: relative;
}
.student-homework-action {
  height: 40px;
  margin-bottom: 15px;
}
</style>
<style>
.teacher-homework-list-upload .el-upload-list {
  display: flex;
  align-items: center;
}
.teacher-homework-list-upload .el-upload-list li {
}
</style>

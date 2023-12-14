<template>
  <div class="student-homework-list">
    <el-tabs v-model="tabActive" @tab-click="handleTabs">
      <el-tab-pane label="布置的作业" name="0">
        <el-table v-if="isPickup" :data="assignData" border>
          <el-table-column label="作业名称" prop="name"></el-table-column>
          <el-table-column label="作业内容" prop="content"></el-table-column>
          <el-table-column label="截止时间" prop="endTime">
            <template slot-scope="{ row }">
              {{ dateToSecond(row.endTime) }}
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="{ row }">
              <el-button
                :type="row.status !== -1 ? 'info' : 'primary'"
                :disabled="row.status !== -1"
                @click="editHomework(row)"
                size="small"
                >{{ assignStatusConvent(row.status) }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="自己的作业" name="1">
        <el-table v-if="isMyHomework" :data="myHomeworkData" border>
          <el-table-column label="作业名称" prop="name"></el-table-column>
          <el-table-column label="作业内容" prop="content"></el-table-column>
          <el-table-column label="截止时间" prop="endTime">
            <template slot-scope="{ row }">
              {{ dateToSecond(row.endTime) }}
            </template>
          </el-table-column>
          <el-table-column label="作业状态">
            <template slot-scope="{ row }">
              {{ assignStatusConvent(row.status) }}
            </template>
          </el-table-column>
          <el-table-column label="分数" prop="score">
            <template slot-scope="{ row }">{{ row.score.toFixed(1) }}</template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="{ row }">
              <el-button type="primary" size="small" @click="editHomework(row)">{{
                row.status === 0 ? '编辑' : '详情'
              }}</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
    <div class="action" v-if="isMyHomework">
      <el-button type="primary" @click="submitSendHomework">提交作业</el-button>
    </div>
    <EditHomwork :visible.sync="visible" :editData="editData" @assign="getAssignData" @mine="getMineData"></EditHomwork>
  </div>
</template>

<script>
import { studentGetAssignHomeworkService, stuGetMineHomeworkService, stuSendHomeworkService } from '@/api/homework.js';
// import { isAfterNow } fgerom '@/utils/date.js';
import EditHomwork from './EditHomwork.vue';
import { dateToSecond } from '@/utils/date.js';
import { studentHomeworkStatus } from '@/constant/status.js';

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
        this.getMineData();
      }
    },
    // 获取布置的作业数据
    async getAssignData() {
      const res = await studentGetAssignHomeworkService(this.articleId, this.$route.query.teacherCourseId);
      // console.log(res.data, 'stu');
      this.assignData = res.data;
    },
    // 获取自己的作业数据
    async getMineData() {
      const res = await stuGetMineHomeworkService(this.articleId, this.$route.query.teacherCourseId);
      console.log(res.data, 'my');
      this.myHomeworkData = res.data;
    },
    // 编辑作业
    editHomework(row) {
      this.editData = row;
      this.visible = true;
      console.log(row);
    },
    // 时间转换
    dateToSecond,
    // 获取作业状态
    assignStatusConvent(status) {
      return studentHomeworkStatus.get(status);
    },
    // 提交作业
    submitSendHomework() {
      if (this.assignData.length !== this.myHomeworkData.length)
        return this.$message.warning('请完成该节的所有作业再进行提交');
      this.$confirm('此操作将会提交该节所有作业，且提交后不能修改，您确认提交吗？', '提示', { type: 'warning' })
        .then(async () => {
          await stuSendHomeworkService(this.articleId, this.$route.query.teacherCourseId);
          this.$message.success('提交作业成功');
        })
        .catch(() => {});
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
  watch: {
    articleId() {
      this.tabActive = '0';
      this.getAssignData();
    },
  },
  components: {
    EditHomwork,
  },
};
</script>

<style scoped>
.student-homework-list {
  position: relative;
}
.action {
  position: absolute;
  display: flex;
  top: 0;
  right: 0;
}
</style>

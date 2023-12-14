<template>
  <div class="content warpper" id="courseDeatils" v-loading="$store.state.isLoading">
    <div class="mb-20">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: 'myCourse' }">返回上一级</el-breadcrumb-item>
        <el-breadcrumb-item>{{ courseObj.name }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="course-info bg-white radius-5 mb-20 p-10">
      <img src="@/assets/addbg.jpg" alt="" />
      <div class="info-content ml-30">
        <div class="info-content-left">
          <div class="info-name">
            <div>
              课程名称：<span>{{ courseObj.name }}</span>
            </div>
          </div>
          <div>
            <p>
              选课开始日期：<span>{{ courseObj.selectStartDate }}</span>
            </p>
            <p>
              授课开始日期：<span>{{ courseObj.startDate }}</span>
            </p>
            <p>
              课程状态：<span ref="status">{{ courseObj.status }}</span>
            </p>
          </div>
        </div>
        <div class="info-content-right">
          <p>
            任课教师：<span>{{ courseObj.userName }}</span>
          </p>
          <p>
            选课结束日期：<span>{{ courseObj.selectEndDate }}</span>
          </p>
          <p>
            授课结束日期：<span>{{ courseObj.endDate }}</span>
          </p>
          <p>
            授课地点：<span>{{ courseObj.address }}</span>
          </p>
        </div>
      </div>
    </div>

    <CourseList :treeEvent="handleNodeClick">
      <!-- 实验报告插槽 -->
      <template #experiment>
        <div class="sumbit-status">
          <img src="@/assets/notsubmit.png" alt="" class="status-img" />
          <div v-if="submitStatus" class="submitStatus">
            <p class="already-submit">已提交</p>
            <p class="already-submit">{{ studentScore }}</p>
          </div>
          <div v-else class="submitStatus">未提交</div>
        </div>
        <div class="experiment-title">
          <p>【实验报告】</p>
          <div class="experiment-report-result">
            <p class="experiment-report-title zh-fs-16 font-bold">实验结果:</p>
            <Editor ref="editor"></Editor>
          </div>
          <div class="experiment-report-step">
            <p class="experiment-report-title zh-fs-16 font-bold">实验步骤:</p>
            <ul class="step-all">
              <li class="step-item" v-for="(item, index) in experimentStep" :key="index">
                <p>步骤{{ index + 1 }} {{ item.name }}</p>
                <Editor ref="editors"></Editor>
              </li>
            </ul>
          </div>
          <div class="experiment-report-operate">
            <el-button :disabled="submitStatus" :type="submitStatus ? 'info' : 'primary'" @click="saveContent(0)"
              >保存</el-button
            >
            <el-button :disabled="submitStatus" :type="submitStatus ? 'info' : 'primary'" @click="submit"
              >提交</el-button
            >
          </div>
        </div>
      </template>
      <!-- 实验成绩插槽 -->
      <template #experimentAchement>
        <el-table :data="tableData" height="auto" border style="width: 100%">
          <el-table-column prop="updateTime" label="提交时间" width="200"> </el-table-column>
          <el-table-column prop="title" label="实验标题" width="120"> </el-table-column>
          <el-table-column prop="result" label="实验结果">
            <template slot-scope="{ row }">
              <div v-html="row.result"></div>
            </template>
          </el-table-column>
          <el-table-column prop="score" label="实验成绩" width="80">
            <template slot-scope="{ row }">{{ row.score.toFixed(1) }}</template>
          </el-table-column>
          <el-table-column prop="comment" label="评语"> </el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="200"> </el-table-column>
        </el-table>
        <div class="block mt-20">
          <el-pagination
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-size="10"
            layout="total, prev, pager, next, jumper"
            :total="tableData.length"
          >
          </el-pagination>
        </div>
      </template>
    </CourseList>
  </div>
</template>

<script>
import { getExperimentStudentData, courseDetails } from '@/utils/api.js';
import { saveExperimentReportService, studentGetScoreService } from '@/api/experiment.js';
import { courseStatusConvert } from '@/utils/status.js';
import CourseList from './components/CourseList.vue';
export default {
  data() {
    return {
      courseObj: {}, //课程信息
      data: [], //存储树形数据,
      defaultProps: {
        children: 'children', //data当中的children的字段名
        label: 'title', //data当中的label的字段名
      },
      experimentId: '', //实验id
      teacherId: '', //教师课程id
      courseId: '', //课程的id
      studentCourseId: '', //学生实验id
      experimentContent: {}, //实验内容
      experimentStep: [], //实验步骤
      tableData: [], //学生成绩
      currentPage: 1, //当前页
      submitStatus: false, //学生实验提交状态
      studentScore: '', //学生实验成绩
      total: 1,
    };
  },
  created() {
    //学生查看课程详情
    this.teacherId = this.$route.query.teacherCourseId;
    this.studentCourseId = this.$route.query.studentCourseId;
    // 课程详情
    courseDetails(this.teacherId).then((res) => {
      this.courseObj = courseStatusConvert(res.course);
    });
    this.courseId = this.$route.query.courseId;
  },
  methods: {
    // 树形控件的点击事件
    async handleNodeClick(id) {
      this.experimentId = id;
      // 学生端实验结果、实验步骤
      await this.getExperimentData();
      // 下载实验模版
      // console.log(this.$refs.downLoadTemplate);
      // this.$refs.downLoadTemplate.href = data.fileUrl;
      // 查询学生的实验成绩列表
      const res = await studentGetScoreService(this.studentCourseId);
      this.tableData = res.data;
    },
    // 获取实验结果，实验步骤
    async getExperimentData() {
      const res = await getExperimentStudentData(this.experimentId, this.studentCourseId);
      this.$nextTick(() => {
        //学生是否提交实验
        if (res.experimentReport.type === 2 && res.experimentReport.status !== 0) {
          this.submitStatus = true;
          this.studentScore = res.experimentReport.score;
        } else {
          this.submitStatus = false;
          this.studentScore = '';
        }
        // 实验结果
        if (res.experimentReport.result === null) this.$refs.editor.html = '';
        else this.$refs.editor.html = res.experimentReport.result;
        // 实验步骤
        if (res.experimentReportPlans !== null) {
          this.experimentStep = res.experimentReportPlans;
          this.$nextTick(() => {
            res.experimentReportPlans.forEach((ritem, rindex) => {
              // 实验步骤是否有内容, 为富文本赋值为null为报错
              if (ritem.content === null) this.$refs.editors[rindex].html = '';
              else this.$refs.editors[rindex].html = ritem.content;
            });
          });
        }
      });
    },
    // 提交或保存实验报告 1表示提交 0表示保存
    async saveContent(status) {
      const planContent = this.$refs.editors.map((item) => item.html);
      const data = {
        experimentId: this.experimentId, //实验id
        teacherCourseId: this.teacherId, //课程id
        experimentContent: this.$refs.editor.html, //实验结果
        planContent, //实验步骤
      };
      status === 1 && Object.assign(data, { status: 1 });
      await saveExperimentReportService(data);
      status === 0 && this.$message.success('保存实验成功');
      this.handleNodeClick(this.experimentId);
    },
    // 提交实验报告
    submit() {
      this.$confirm('实验报告提交后无法修改，确定提交吗？', '提交实验', { type: 'warning' })
        .then(async () => {
          await this.saveContent(1);
          this.$message.success('提交成功');
        })
        .catch(() => {
          this.$message.info('取消提交');
        });
    },
    // 分页
    handleCurrentChange(val) {
      this.currentPage = val;
    },
  },
  components: {
    CourseList,
  },
};
</script>

<style scoped>
.info-content-left {
  display: flex;
  flex-direction: column;
}
.info-content-left .info-name {
  margin-bottom: 16px;
}

.content {
  margin: 20px auto;
}
.course-info {
  border: 1px solid #dedede;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  text-align: left;
  padding: 20px;
}

.course-info {
  height: 200px;
}
.course-info img {
  width: 200px;
  height: 160px;
}
.info-content {
  display: flex;
  flex-direction: row;
}
.info-content p {
  margin-top: 0 !important;
}
.info-content-right {
  margin-left: 50px;
}

.experiment-title > p {
  font-size: 18px;
  font-weight: 700;
}

.experiment-report-result,
.experiment-report-step {
  padding-left: 10px;
}
.step-all {
  padding: 0 !important;
}
.experiment-report-operate {
  text-align: center;
}

.block {
  text-align: center;
}

.sumbit-status {
  position: absolute;
  top: -39px;
  right: 140px;
  transform: scale(0.8);
}
.status-img {
  display: inline-block;
  width: 200px;
  height: 140px;
  transform: rotate(35deg);
}
.submitStatus {
  position: absolute;
  font-size: 24px;
  font-weight: 500;
  color: red;
  top: 42px;
  right: 63px;
  transform: rotate(17deg);
}
.submitStatus > p {
  margin: 0;
  text-align: center;
}
.already-submit {
  color: rgb(11, 139, 11);
}
</style>
<style>
#courseDeatils .el-tabs__item {
  background-color: #b2d5f1 !important;
  color: #000 !important;
  padding: 0 20px !important;
  border-right: 1px solid #fff;
}
#courseDeatils .el-tabs__item.is-active {
  background-color: #409eff !important;
  color: #fff !important;
}
</style>

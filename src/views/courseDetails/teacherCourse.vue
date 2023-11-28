<template>
  <div class="content warpper" id="courseDeatils">
    <div class="zh-mgb-20">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: path }">课程详情</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/courseDetails' }">{{
          courseObj.name
        }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!-- 课程信息 -->
    <div class="course-info theme-bg-white btn-radius-5 zh-mgb-20 zh-pd-10">
      <img src="@/assets/addbg.jpg" alt="" />
      <div class="info-content zh-mgl-30">
        <div class="info-content-left">
          <div class="info-name">
            <div>
              课程名称：<span>{{ courseObj.name }}</span>
            </div>
            <div v-if="isTeachCenter" class="info-des">
              {{ courseObj.description }}
            </div>
          </div>
          <div v-if="!isTeachCenter">
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
        <div class="info-content-right" v-if="!isTeachCenter">
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
        <div v-if="roleId === '2' && $route.query.id">
          选课人数：{{ courseObj.selectedNumber }}
        </div>
      </div>
    </div>
    <!-- 实验内容 -->
    <CourseList :treeEvent="handleNodeClick" :teacherId="teacherId">
      <!-- 实验报告插槽 -->
      <template #experiment>
        <div class="experiment-title">
          <p>【实验报告】</p>
          <div class="experiment-res">
            <div class="res-title">
              <p class="zh-fs-16 zh-fw-m">实验结果：</p>
              <el-button type="primary" @click="targgleRes" size="mini"
                >{{ experResult.show ? '隐藏' : '显示' }}实验结果</el-button
              >
            </div>
            <div
              class="experiment-content"
              v-html="experResult.content"
              v-if="experResult.show"
            ></div>
            <div v-else class="experiment-content experiment-prompt">
              点击上方按钮显示实验结果
            </div>
          </div>
          <div class="step-all">
            <p class="zh-fs-16 zh-fw-m">实验步骤：</p>
            <div
              v-for="(item, index) in experimentStep"
              :key="item.id"
              @click="targgleStep"
            >
              <div class="step-title">
                <div>步骤{{ index + 1 }}&nbsp;{{ item.name }}</div>
                <el-button type="primary" :data-id="item.id" size="mini">{{
                  item.show ? '隐藏' : '显示'
                }}</el-button>
              </div>
              <div
                class="experiment-content"
                v-html="item.content"
                v-if="item.show"
              ></div>
              <div v-else class="experiment-content experiment-prompt">
                点击上方按钮显示实验步骤
              </div>
            </div>
          </div>
        </div>
      </template>
      <!-- 实验成绩插槽 -->
      <template #experimentAchement>
        <!-- 教师端 -->
        <el-table
          :data="
            tableData.slice(
              (currentPage - 1) * pageSize,
              currentPage * pageSize,
            )
          "
          height="auto"
          border
          style="width: 100%"
        >
          <el-table-column
            align="center"
            prop="username"
            label="学生姓名"
            width="100"
          >
          </el-table-column>
          <el-table-column
            align="center"
            prop="title"
            label="实验标题"
            width="150"
          >
          </el-table-column>
          <el-table-column prop="result" label="实验结果">
            <template slot-scope="scope">
              <div v-html="scope.row.result"></div>
            </template>
          </el-table-column>
          <el-table-column prop="score" label="成绩" width="80">
          </el-table-column>
          <el-table-column prop="comment" label="评语"> </el-table-column>
          <el-table-column prop="updateTime" label="更新日期" width="100">
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="200">
            <template slot-scope="scope">
              <el-button
                @click="checkDetails(scope.row)"
                type="text"
                size="middle"
                >查看详情</el-button
              >
              <el-button
                @click="checkReport(scope.row)"
                type="text"
                size="middle"
                >查看报告</el-button
              >
              <el-button
                @click="editContent(scope.row)"
                type="text"
                size="middle"
                >编辑</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </template>
    </CourseList>
    <!-- 教师端，点击查看报告，弹出学生的实验报告 -->
    <el-dialog
      title="实验报告"
      :visible.sync="showReportVisible"
      width="30%"
      :before-close="handleCloseReport"
      :close-on-click-modal="false"
    >
      <div class="stuExperimentReport" style="text-align: initial">
        <div class="stuInfo zh-fs-16">
          <span>学生姓名:{{ stuForm.username }}</span>
          <span>学生成绩:{{ stuForm.score }}</span>
        </div>
        <div class="stuExperimentContent">
          <div class="exTitle zh-fs-16">
            <p class="title zh-fw-m">实验标题：</p>
            <div>sql注入</div>
          </div>
          <div class="exResult zh-fs-16">
            <p class="title zh-fw-m">实验结果:</p>
            <div>111</div>
          </div>
          <div class="exSteps zh-fs-16">
            <p class="title zh-fw-m">实验步骤:</p>
            <ul>
              <li>
                <p>步骤一</p>
                <div>111</div>
              </li>
              <li>
                <p>步骤二</p>
                <div>222</div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="showReportVisible = false"
          >关 闭</el-button
        >
      </span>
    </el-dialog>
    <!-- 教师端，点击查看详情，弹出学生的成绩详情 -->
    <el-dialog
      title="成绩详情"
      :visible.sync="showDetailsVisible"
      width="30%"
      :before-close="handleCloseDetsils"
      :close-on-click-modal="false"
    >
      <div class="stuScoreDetails" style="text-align: initial">
        <div class="stuInfo zh-fs-16">
          <span>学生姓名:{{ stuForm.username }}</span>
          <span>成绩:{{ stuForm.score }}</span>
        </div>
        <div class="exTitle zh-fs-16">
          <p class="zh-fw-m">实验标题:</p>
          <div>{{ stuForm.title }}</div>
        </div>
        <div class="exResult zh-fs-16">
          <p class="zh-fw-m">实验结果:</p>
          <div>{{ stuForm.result }}</div>
        </div>
        <div class="exComment zh-fs-16">
          <p class="zh-fw-m">评语:</p>
          <div>{{ stuForm.comment }}</div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="showDetailsVisible = false"
          >关 闭</el-button
        >
      </span>
    </el-dialog>
    <!-- 教师端，点击编辑，可以编辑学生的成绩以及评语 -->
    <el-dialog
      title="编辑学生成绩评语"
      :visible.sync="showEditVisible"
      width="30%"
      :before-close="handleCloseEdit"
      :close-on-click-modal="false"
    >
      <div class="form" style="text-align: initial">
        <el-form ref="stuForm" :model="stuForm" label-width="80px">
          <el-form-item label="学生姓名">
            <el-input v-model="stuForm.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="实验标题">
            <el-input v-model="stuForm.title" disabled></el-input>
          </el-form-item>
          <el-form-item label="学生成绩">
            <el-input v-model="stuForm.score"></el-input>
          </el-form-item>
          <el-form-item label="评语">
            <el-input type="textarea" v-model="stuForm.comment"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel('stuForm')">取 消</el-button>
        <el-button type="primary" @click="determine">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getTreeData,
  getExperimentContent,
  getExperimentData,
  getExperimentStudentData,
  courseDetails,
  teacherCourseDetails,
  getExperimentResult,
  getStudentScore,
  scoreList,
  saveExperimentReport,
  checkChapter,
} from '@/utils/api.js';
import { courseStatusConvert } from '@/utils/status.js';
import { handleDate } from '@/utils/date.js';
import CourseList from './components/CourseList.vue';
export default {
  data() {
    return {
      path: '', //面包屑路由跳转
      courseObj: {}, //课程信息
      defaultProps: {
        children: 'children', //data当中的children的字段名
        label: 'title', //data当中的label的字段名
      },
      experimentId: '', //实验id
      teacherId: '', //教师课程id
      roleId: '', //角色id--2表示教师角色，3表示学生角色
      courseId: '', //课程的id
      experimentStep: [], //实验步骤
      tableData: [], //学生成绩
      currentPage: 1, //当前页
      pageSize: 5, //每页的条数
      showReportVisible: false, //是否显示实验报告
      showDetailsVisible: false, //是否显示成绩详情
      showEditVisible: false, //是否显示编辑框
      stuForm: {}, //学生成绩详情
      // 实验结果
      experResult: {
        content: '', // 实验结果内容
        show: false, // 实验结果显示状态
      },
    };
  },
  async created() {
    this.roleId = localStorage.getItem('roleId');
    // 获取数据
    this.path = '/myTeaching';
    this.teacherId = this.$route.query.id;
    const courseId = this.$route.query.courseId;
    const res = await teacherCourseDetails(courseId, this.teacherId);
    this.courseObj = courseStatusConvert(res.data);
  },
  methods: {
    // 切换实验步骤的显示与隐藏
    targgleStep(e) {
      let { id } = e.target.dataset;
      if (id === undefined) id = e.target.parentNode.dataset.id;
      if (id === undefined) return;
      const item = this.experimentStep.find((item) => item.id == id);
      item.show = !item.show;
    },
    // 切换实验结果显示与隐藏
    targgleRes() {
      this.experResult.show = !this.experResult.show;
    },
    // 树形控件的点击事件
    async handleNodeClick(id) {
      this.experimentId = id;
      // 教师端实验步骤
      const res = await getExperimentData(this.experimentId, this.courseId);
      // 为每个实验步骤添加显示隐藏状态属性
      res.experimentReportPlans.forEach((item) => (item.show = false));
      this.experimentStep = res.experimentReportPlans;
      // 实验结果
      this.experResult.content = res.experimentReport.result;
      // 成绩表格(教师端)
      scoreList(this.experimentId, this.teacherId).then((res) => {
        // this.tableData = handleDate(res.data)
        this.tableData = res.data;
      });
    },
    // 教师端，成绩表格
    // 查看详情
    checkDetails(row) {
      this.showDetailsVisible = true;
      this.stuForm = row;
    },
    handleCloseDetsils() {
      this.showDetailsVisible = false;
    },
    // 查看学生实验报告
    checkReport(row) {
      this.showReportVisible = true;
      this.stuForm = row;
    },
    handleCloseReport() {
      this.showReportVisible = false;
    },
    // 编辑学生成绩、评语
    editContent(row) {
      this.showEditVisible = true;
      this.stuForm = row;
    },
    handleCloseEdit() {
      this.showEditVisible = false;
    },
    // 取消编辑
    cancel(formName) {
      this.$refs[formName].resetFields();
      this.showEditVisible = false;
    },
    // 确定编辑
    determine() {
      // this.stuForm = this.stuForm;
      this.showEditVisible = false;
    },
    // 分页
    // pageSize 改变时会触发
    handleSizeChange(val) {
      this.pageSize = val;
    },
    // currentPage 改变时会触发
    handleCurrentChange(val) {
      this.currentPage = val;
    },
  },
  computed: {
    // 是否是课程中心进入,如果是教师端进入，并且url中没有携带id参数，就是从课程中心进入，返回true，不显示课程的除名称外的信息
    isTeachCenter() {
      return !this.$route.query.id;
    },
  },
  components: {
    CourseList,
  },
};
</script>

<style scoped>
/* 实验报告插槽内容 */
/* 大标题 */
.experiment-title > p {
  font-size: 18px;
  font-weight: 700;
}
/* 小标题 */
.experiment-res,
.step-all {
  padding-left: 10px;
}
/* 切换显示按钮 */
.step-title,
.res-title {
  display: flex;
  align-items: center;
  gap: 20px;
}
/* 不显示实验内容时提示 */
.experiment-prompt {
  color: #ddd;
}
/* 实验内容区域 */
.experiment-content {
  padding: 10px 10px;
  margin: 10px 0;
  min-height: 200px;
  border: 1px solid #ddd;
}
.info-content-left {
  display: flex;
  flex-direction: column;
}
.info-content-left .info-name {
  margin-bottom: 16px;
}
.info-des {
  margin-top: 20px;
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
#vt100 #scrollable {
  overflow-y: hidden !important;
}

.stuInfo {
  display: flex;
  justify-content: space-between;
}

.exSteps > ul {
  padding: 0;
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
#courseDeatils .el-button--primary {
  background-color: #4faff0;
  border-color: #4faff0;
}
/* #courseDeatils .el-table .el-table__cell {
  text-align: center;
} */
#courseDeatils .el-table .cell {
  display: -webkit-box;
  -webkit-line-clamp: 1; /* 指定要显示的行数 */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>

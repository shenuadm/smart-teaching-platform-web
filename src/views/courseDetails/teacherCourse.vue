<template>
  <div class="content warpper" id="courseDeatils">
    <div class="mb-20">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/myTeaching' }">返回上一级</el-breadcrumb-item>
        <el-breadcrumb-item>{{ courseObj.name }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!-- 课程信息 -->
    <div class="course-info bg-white radius-5 mb-20 p-10" v-loading="$store.state.isLoading">
      <img src="@/assets/addbg.jpg" alt="" />
      <div class="info-content ml-30">
        <div class="info-content-left">
          <div>课程名称：{{ courseObj.name }}</div>
          <!-- <div>选课开始日期：{{ courseObj.selectStartDate }}</div> -->
          <div>授课开始日期：{{ courseObj.startDate }}</div>
          <div>课程状态：{{ courseObj.status }}</div>
          <div>选课人数：{{ courseObj.selectedNumber }}</div>
        </div>
        <div class="info-content-right">
          <div>任课教师：{{ courseObj.userName }}</div>
          <!-- <div>选课结束日期：{{ courseObj.selectEndDate }}</div> -->
          <div>授课结束日期：{{ courseObj.endDate }}</div>
          <div>授课地点：{{ courseObj.address }}</div>
          <div>
            <el-button type="primary" size="mini" @click="queryVms">{{
              pageShow ? '查看实验虚拟机' : '查看课程章节'
            }}</el-button>
            <!-- <el-button type="info" size="mini" @click=""></el-button> -->
          </div>
        </div>
      </div>
    </div>
    <!-- 实验内容 -->
    <CourseList v-if="pageShow" :treeEvent="handleNodeClick">
      <!-- 实验报告插槽 -->
      <template #experiment>
        <div class="experiment-title">
          <p>【实验报告】</p>
          <div class="experiment-res">
            <div class="res-title">
              <p class="zh-fs-16 font-bold">实验结果：</p>
              <el-button type="primary" @click="targgleRes" size="mini"
                >{{ experResult.show ? '隐藏' : '显示' }}实验结果</el-button
              >
            </div>
            <div class="experiment-content" v-html="experResult.content" v-if="experResult.show"></div>
            <div v-else class="experiment-content experiment-prompt">点击上方按钮显示实验结果</div>
          </div>
          <div class="step-all">
            <p class="zh-fs-16 font-bold">实验步骤：</p>
            <div v-for="(item, index) in experimentStep" :key="item.id" @click="targgleStep">
              <div class="step-title">
                <div class="mb-10">{{ index + 1 }}、&nbsp;{{ item.name }}</div>
                <el-button type="primary" :data-id="item.id" size="mini">{{ item.show ? '隐藏' : '显示' }}</el-button>
              </div>
              <div class="experiment-content" v-html="item.content" v-if="item.show"></div>
              <div v-else class="experiment-content experiment-prompt">点击上方按钮显示实验步骤</div>
            </div>
          </div>
        </div>
      </template>
      <!-- 实验成绩插槽 -->
      <template #experimentAchement>
        <!-- 教师端 -->
        <el-table :data="tableData" height="auto" border style="width: 100%">
          <el-table-column align="center" prop="username" label="学生姓名" width="120"> </el-table-column>
          <el-table-column align="center" prop="title" label="实验标题"> </el-table-column>
          <el-table-column prop="score" label="成绩" width="80">
            <template #default="{ row }">{{ Number.isInteger(row.score) ? row.score : row.score.toFixed(1) }}</template>
          </el-table-column>
          <el-table-column prop="updateTime" label="更新日期" width="200"> </el-table-column>
          <el-table-column label="状态" width="100">
            <template #default="{ row }">{{ row.status === 1 ? '未评阅' : '已评阅' }}</template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="200">
            <template #default="scope">
              <el-button @click="checkDetails(scope.row)" type="text" size="middle">查看详情</el-button>
              <el-button @click="checkReport(scope.row)" type="text" size="middle">查看报告</el-button>
              <el-button @click="editContent(scope.row)" type="text" size="middle">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- <div class="text-center">
          <el-pagination
            :current-page="currentPage"
            :page-size="10"
            layout="total, prev, pager, next, jumper"
            :total="tableData.length"
            :hide-on-single-page="tableData.length <= 10"
          >
          </el-pagination>
        </div> -->
      </template>
    </CourseList>
    <VmsList v-else ref="vmsList"></VmsList>
    <!-- 教师端，点击查看报告，弹出学生的实验报告 -->
    <el-drawer :visible.sync="showReportVisible" v-if="showReportVisible" direction="rtl" size="60%">
      <template slot="title">
        <div class="zh-fs-20 font-bold">实验报告</div>
      </template>
      <div class="stuExperimentReport mx-20" style="text-align: initial">
        <div class="stuInfo">
          <div><span class="font-bold">学生姓名：</span>{{ stuForm.result.username }}</div>
          <div><span class="font-bold">学生成绩：</span>{{ stuForm.result.score }}</div>
        </div>
        <div class="stuExperimentContent">
          <div class="exTitle">
            <p class="title font-bold">实验标题：</p>
            <div>{{ stuForm.result.title }}</div>
          </div>
          <div class="exResult">
            <p class="title font-bold">实验结果:</p>
            <div class="px-10 py-5 border-grey" v-html="stuForm.result.result"></div>
          </div>
          <div class="exSteps">
            <p class="title font-bold">实验步骤:</p>
            <ul>
              <li v-for="(item, index) in stuForm.step" :key="item.id">
                <p>{{ index + 1 }}、{{ item.name }}</p>
                <div class="px-10 py-5 border-grey" v-html="item.content"></div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </el-drawer>
    <!-- 教师端，点击查看详情，弹出学生的成绩详情 -->
    <el-dialog
      :visible.sync="showDetailsVisible"
      width="30%"
      :before-close="handleCloseDetsils"
      :close-on-click-modal="false">
      <div slot="title" class="font-bold">成绩详情</div>
      <div class="stuScoreDetails" style="text-align: initial">
        <div class="stuInfo zh-fs-16">
          <div><span class="font-bold">学生姓名：</span>{{ stuForm.username }}</div>
          <div><span class="font-bold">成绩：</span>{{ stuForm.score }}</div>
        </div>
        <div class="exTitle zh-fs-16">
          <p class="font-bold">实验标题:</p>
          <div>{{ stuForm.title }}</div>
        </div>
        <div class="exResult zh-fs-16">
          <p class="font-bold">实验结果:</p>
          <div v-html="stuForm.result"></div>
        </div>
        <div class="exComment zh-fs-16">
          <p class="font-bold">评语:</p>
          <div>{{ stuForm.comment }}</div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="showDetailsVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
    <!-- 教师端，点击编辑，可以编辑学生的成绩以及评语 -->
    <el-dialog
      title="编辑学生成绩评语"
      :visible.sync="showEditVisible"
      width="30%"
      :before-close="handleCloseEdit"
      :close-on-click-modal="false">
      <div class="form" style="text-align: initial">
        <el-form ref="stuForm" :rules="editRule" :model="stuForm" label-width="80px" v-loading="$store.state.isLoading">
          <el-form-item label="学生姓名">
            <el-input v-model="stuForm.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="实验标题">
            <el-input v-model="stuForm.title" disabled></el-input>
          </el-form-item>
          <el-form-item label="学生成绩" prop="score">
            <el-input type="number" v-model.number="stuForm.score"></el-input>
          </el-form-item>
          <el-form-item label="评语" prop="comment">
            <el-input type="textarea" v-model="stuForm.comment" :rows="6" maxlength="200" show-word-limit></el-input>
          </el-form-item>
        </el-form>
      </div>
      <template slot="footer">
        <el-button type="info" @click="cancel('stuForm')">取 消</el-button>
        <el-button type="primary" @click="determine">确 定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { teacherCourseDetails, scoreList, getStudentExperiment } from '@/utils/api.js';
import { teachEditExperimentService, getExperimentStepService } from '@/api/experiment.js';
import { courseStatusConvert } from '@/utils/status.js';
import CourseList from './components/CourseList.vue';
import VmsList from './components/VmsList.vue';
export default {
  data() {
    return {
      courseObj: {}, //课程信息
      defaultProps: {
        children: 'children', //data当中的children的字段名
        label: 'title', //data当中的label的字段名
      },
      experimentId: '', //实验id
      courseId: '', //课程的id
      experimentStep: [], //实验步骤
      tableData: [], //学生成绩
      currentPage: 1, //当前页
      showReportVisible: false, //是否显示实验报告
      showDetailsVisible: false, //是否显示成绩详情
      showEditVisible: false, //是否显示编辑框
      stuForm: {}, //学生成绩详情
      // 实验结果
      experResult: {
        content: '', // 实验结果内容
        show: false, // 实验结果显示状态
      },
      vmsData: [], // 学生实验机列表
      pageShow: true,
      editRule: {
        comment: [{ min: 0, max: 200, message: '实验评语长度最多为200个文字', trigger: 'blur' }],
        score: [{ required: true, message: '实验成绩不能为空', trigger: 'blur' }],
      },
    };
  },
  async created() {
    // 获取数据
    const courseId = this.$route.query.courseId;
    const res = await teacherCourseDetails(courseId, this.$route.query.id);
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
      const res = await getExperimentStepService(this.experimentId, this.courseId);
      // 为每个实验步骤添加显示隐藏状态属性
      res.experimentReportPlans.forEach((item) => (item.show = false));
      this.experimentStep = res.experimentReportPlans;
      // 实验结果
      this.experResult.content = res.experimentReport.result;
      // 成绩表格(教师端)
      // scoreList(this.experimentId, this.$route.query.id).then((res) => {
      //   this.tableData = res.data;
      // });
      this.getScroeData();
    },
    // 获取成绩表格
    async getScroeData() {
      const res = await scoreList(this.experimentId, this.$route.query.id);
      this.tableData = res.data;
    },
    // 查看学生虚拟机
    async queryVms() {
      this.pageShow = !this.pageShow;
      this.$nextTick(() => {
        this.$refs.vmsList.getStudentVmsData();
      });
    },
    // 教师端，成绩表格
    // 查看详情
    checkDetails(row) {
      console.log(row);
      this.showDetailsVisible = true;
      this.stuForm = row;
    },
    handleCloseDetsils() {
      this.showDetailsVisible = false;
    },
    // 查看学生实验报告
    async checkReport(row) {
      const { uid, id } = row;
      const res = await getStudentExperiment(uid, id);
      this.stuForm = { result: row, step: res.data };
      this.showReportVisible = true;
    },
    handleCloseReport() {
      this.showReportVisible = false;
    },
    // 编辑学生成绩、评语
    editContent(row) {
      this.showEditVisible = true;
      this.stuForm = row;
      console.log(row);
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
      this.$refs['stuForm'].validate(async (validate) => {
        if (validate) {
          await teachEditExperimentService(this.stuForm);
          await this.getScroeData();
          this.showEditVisible = false;
          this.$message.success('修改学生成绩评语成功');
        }
      });
    },
    // 分页
    // currentPage 改变时会触发
    handleCurrentChange(val) {
      this.currentPage = val;
    },
  },
  components: {
    CourseList,
    VmsList,
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
.info-content > div {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.info-content-left {
  min-width: 200px;
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
.course-info img {
  height: 174px;
  width: 200px;
}
.info-content {
  display: flex;
  flex-direction: row;
}
.info-content div {
  margin-top: 0 !important;
}
.info-content-right {
  margin-left: 50px;
  min-width: 200px;
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
#courseDeatils .el-table .el-table__cell {
  text-align: center;
}
</style>

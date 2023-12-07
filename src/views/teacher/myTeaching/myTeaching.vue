<template>
  <div class="myTeaching global-container" v-loading="$store.state.isLoading">
    <!-- 标题 -->
    <div class="person-title">我的授课</div>
    <el-tabs v-model="activeCourseType" @tab-click="courseTypeChange" class="mt-20">
      <el-tab-pane label="所有课程" name="-1"></el-tab-pane>
      <el-tab-pane label="选课中" name="2"></el-tab-pane>
      <el-tab-pane label="授课中" name="4"></el-tab-pane>
      <el-tab-pane label="已结束" name="6"></el-tab-pane>
    </el-tabs>
    <div class="my-teaching">
      <div v-for="item in myTeachList" :key="item.id">
        <div class="my-teaching-item zh-pd-10 zh-mgt-20 zh-mgb-20">
          <img :src="'data:image/png;base64,' + item.picture" alt="图片加载失败" />
          <div class="my-teaching-text">
            <div class="title">{{ item.name }}</div>
            <div class="status">课程状态：{{ courseStatusConvert(item.status) }}</div>
            <div class="created-date">创建日期：{{ item.createTime }}</div>
          </div>
          <div class="my-teaching-btn">
            <el-button type="primary" @click="editCourseClick(item)">编辑课程</el-button>
            <el-button type="primary" @click="lookDetails(item)">查看详情</el-button>
            <!-- <el-button type="primary" @click="lookScore(item)">查看成绩</el-button> -->
          </div>
        </div>
        <!-- 学生成绩列表 -->
        <div class="stuScore theme-bg-white zh-pd-10" v-show="showScore">
          <div class="downloadScoreList">
            <el-button type="primary" class="zh-mgb-20">下载成绩列表</el-button>
          </div>
          <el-table :data="scoreTable" border style="width: 100%">
            <el-table-column prop="stuName" label="学生姓名" width="120"> </el-table-column>
            <el-table-column prop="stuScoreFirst" label="实验一"> </el-table-column>
            <el-table-column prop="stuScoreSecond" label="实验二"> </el-table-column>
            <el-table-column prop="stuScoreThird" label="实验三"> </el-table-column>
            <el-table-column prop="totalScore" label="总分"> </el-table-column>
            <el-table-column prop="averageScore" label="平均分"> </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <el-pagination
      @current-change="getCourseData"
      :current-page="page"
      :page-size="10"
      layout="total, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
    <!-- 编辑框 -->
    <el-dialog
      :close-on-click-modal="false"
      title="编辑课程"
      :visible.sync="dialogVisible"
      :before-close="closeDialog"
      width="30%"
    >
      <el-form ref="ruleForm" :model="editCourse" :rules="rules" label-width="100px" v-loading="$store.state.isLoading">
        <!-- 课程名称 -->
        <el-form-item label="课程名称：" prop="name">
          <el-input v-model="editCourse.name" placeholder="课程名称"></el-input>
        </el-form-item>
        <!-- 选课日期 -->
        <!-- <div class="choose-date">
          <el-form-item label="选课日期：" prop="selectStartDate">
            <el-date-picker
              type="date"
              placeholder="选课开始日期"
              v-model="editCourse.selectStartDate"
            ></el-date-picker>
          </el-form-item>
          <span>至</span>
          <el-form-item prop="selectEndDate" class="end-date">
            <el-date-picker type="date" placeholder="选课结束日期" v-model="editCourse.selectEndDate"></el-date-picker>
          </el-form-item>
        </div> -->
        <el-form-item label="选课日期：">
          <el-date-picker
            v-model="chooseDate"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
        </el-form-item>
        <!-- <div class="input-small"> -->
        <!-- 最多选课人数 -->
        <el-form-item label="选课人数：" prop="maxTaker" class="more-person">
          <el-input v-model="editCourse.maxTaker" placeholder="课程最大人数"></el-input>
        </el-form-item>
        <!-- 授课地点 -->
        <el-form-item label="授课地点：" prop="address" class="course-address">
          <el-input v-model="editCourse.address" placeholder="授课地点"></el-input>
        </el-form-item>
        <!-- </div> -->
        <!-- 授课日期 -->
        <!-- <div class="choose-date"> -->
        <!-- <el-form-item label="授课日期：" prop="startDate">
            <el-date-picker type="date" placeholder="授课开始日期" v-model="editCourse.startDate"></el-date-picker>
          </el-form-item>
          <span>至</span>
          <el-form-item prop="endDate" class="end-date">
            <el-date-picker type="date" placeholder="授课结束日期" v-model="editCourse.endDate"></el-date-picker>
          </el-form-item> -->
        <el-form-item label="授课日期：">
          <el-date-picker
            v-model="teachDate"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
        </el-form-item>
        <!-- </div> -->
        <!-- 课程状态 -->
        <el-form-item label="课程状态：">
          <el-radio-group v-model="editCourse.status">
            <el-radio disabled label="选课中">选课中</el-radio>
            <el-radio disabled label="选课结束">选课结束</el-radio>
            <el-radio disabled label="授课中">授课中</el-radio>
            <el-radio disabled label="评阅中">评阅中</el-radio>
            <el-radio label="未启用">未启用</el-radio>
            <el-radio label="启用">启用</el-radio>
            <el-radio label="已结束">已结束</el-radio>
            <el-radio label="已关闭">已关闭</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="primary" @click="submitForm('ruleForm')">修改</el-button>
        <el-button @click="closeDialog">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { myTeaching } from '@/utils/api.js';
import { teacherCourseStatus } from '@/constant/course.js';
export default {
  data() {
    return {
      // 表单校验
      rules: {
        name: [{ required: true, message: '请输入您的课程名称', trigger: 'blur' }],
        selectStartDate: [
          {
            required: true,
            message: '请选择您的选课开始日期',
            trigger: 'blur',
          },
        ],
        selectEndDate: [
          {
            required: true,
            message: '请选择您的选课结束日期',
            trigger: 'blur',
          },
        ],
        maxTaker: [
          {
            required: true,
            message: '请输入您的最多选课人数',
            trigger: 'blur',
          },
        ],
        address: [{ required: true, message: '请输入您的授课地点', trigger: 'blur' }],
        startDate: [
          {
            required: true,
            message: '请选择您的授课开始日期',
            trigger: 'blur',
          },
        ],
        endDate: [
          {
            required: true,
            message: '请选择您的授课结束日期',
            trigger: 'blur',
          },
        ],
      },
      page: 1, // 页数
      total: 0, // 总数
      activeCourseType: '-1',
      myTeachList: [], //我的授课的全部课程
      courseForm: {}, //课程的详细信息
      showScore: false, //是否显示成绩列表
      chooseDate: [], // 课程选课日期
      teachDate: [], // 课程授课日期
      scoreTable: [
        //成绩列表
        {
          id: 1,
          stuName: '张三',
          stuScoreFirst: 98,
          stuScoreSecond: 90,
          stuScoreThird: 95,
          totalScore: 98,
          averageScore: 94.5,
        },
        {
          id: 2,
          stuName: '李四',
          stuScoreFirst: 90,
          stuScoreSecond: 85,
          stuScoreThird: 93,
          totalScore: 90,
          averageScore: 89.5,
        },
      ],
      dialogVisible: false, //弹框显示隐藏
      editCourse: {
        name: '', //课程名
        selectStartDate: '', //选课开始日期
        selectEndDate: '', //选课结束日期
        maxTaker: '', //最大人数
        address: '', //课程地点
        startDate: '', //授课开始时间
        endDate: '', //授课结束时间
        status: '未启用',
      },
    };
  },
  created() {
    this.getCourseData();
  },
  methods: {
    // 选择课程类型变化
    courseTypeChange() {
      console.log(1, this.activeCourseType, typeof this.activeCourseType);
      this.page = 1;
      this.getCourseData();
    },
    async getCourseData() {
      const data = { page: this.page };
      this.activeCourseType !== '-1' && Object.assign(data, { status: this.activeCourseType });
      const res = await myTeaching(data);
      this.total = res.count;
      this.myTeachList = res.data.map((item) => {
        return { ...item, picture: item.picture.split(',')[1] };
      });
    },
    // 关闭弹框
    closeDialog() {
      this.dialogVisible = false;
      this.$refs['ruleForm'].resetFields();
    },
    //保存修改
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!');
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    // 编辑课程
    editCourseClick(item) {
      const data = JSON.parse(JSON.stringify(item));
      this.editCourse = data;
      this.dialogVisible = true;
    },
    // 查看课程详情
    lookDetails(e) {
      localStorage.setItem('hostName', e.hostName); //登录名
      localStorage.setItem('hostPwd', e.hostPwd); //登录密码
      this.$router.push({
        path: '/teacherCourse',
        name: 'teacherCourse',
        query: {
          courseId: e.courseId,
          id: e.id,
        },
      });
    },
    // 查看成绩
    lookScore(e) {
      console.log(e);
      if (this.scoreTable.length > 0) {
        this.showScore = !this.showScore;
      }
    },
    handleClose() {
      this.showScoreVisible = false;
    },
    courseStatusConvert(status) {
      return teacherCourseStatus.get(status);
    },
  },
};
</script>

<style scoped>
.person-title {
  height: 60px;
  line-height: 60px;
  padding: 0 50px;
  text-align: left;
  font-size: 20px;
  border-bottom: 2px solid #efefef;
  background-color: #fff;
}
.my-teaching-item {
  display: flex;
  align-content: center;
  border: 1px solid #ededed;
  background-color: #fff;
}
.my-teaching-item img {
  padding: 10px;
  width: 220px;
  height: 120px;
  cursor: pointer;
}
/* .stuScore{
  background-color: #fff;
} */
.downloadScoreList {
  width: 100%;
  text-align: right;
}
.my-teaching-text {
  flex: 1;
  padding: 20px;
  text-align: left;
}
.title {
  font-size: 20px;
}
.status,
.created-date {
  margin-top: 20px;
  font-size: 15px;
  color: #666;
}
.created-date {
  margin-top: 10px;
}
.my-teaching-btn {
  padding: 20px;
  display: flex;
  align-items: center;
  transform: translateY(20px);
}
.choose-date {
  display: flex;
  gap: 10px;
}
.choose-date span {
  padding-top: 10px;
}
.input-small {
  display: flex;
}
.more-person {
  width: 320px;
}
.el-radio-group {
  display: flex;
  flex-wrap: wrap;
}
.el-radio-group label {
  margin: 10px 0;
  margin-right: 20px;
}
.el-form-item .el-button--default {
  margin-left: 30px;
}
</style>
<style>
.myTeaching .my-teaching .end-date .el-form-item__content {
  margin-left: 0 !important;
}
.myTeaching .el-table .cell {
  text-align: center !important;
}

/* tab切换栏 */
.myTeaching .el-tabs__item {
  background-color: #b2d5f1 !important;
  color: #000 !important;
  padding: 0 20px !important;
  border-right: 1px solid #fff;
}
.myTeaching .el-tabs__item.is-active {
  background-color: #409eff !important;
  color: #fff !important;
}
.myTeaching .el-button--primary {
  background-color: #4faff0;
  border-color: #4faff0;
}
.myTeaching .el-table .el-table__cell {
  text-align: center;
}
.myTeaching .el-table .cell {
  display: -webkit-box;
  -webkit-line-clamp: 1; /* 指定要显示的行数 */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>

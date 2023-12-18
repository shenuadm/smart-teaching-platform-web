<template>
  <div v-loading="$store.state.isLoading" class="myTeaching global-container">
    <!-- 标题 -->
    <div class="person-title">我的授课</div>
    <el-tabs
      v-model="activeCourseType"
      class="mt-20"
      @tab-click="courseTypeChange"
    >
      <el-tab-pane label="所有课程" name="-1"></el-tab-pane>
      <el-tab-pane label="选课中" name="2"></el-tab-pane>
      <el-tab-pane label="授课中" name="4"></el-tab-pane>
      <el-tab-pane label="已结束" name="6"></el-tab-pane>
    </el-tabs>
    <template v-if="myTeachList.length > 0">
      <div class="my-teaching">
        <div v-for="item in myTeachList" :key="item.id">
          <div class="my-teaching-item p-10 mt-20 mb-20">
            <img
              :src="'data:image/png;base64,' + item.picture"
              alt="图片加载失败"
            />
            <div class="my-teaching-text">
              <div class="title">{{ item.name }}</div>
              <div class="status">
                课程状态：{{ courseStatusConvert(item.status) }}
              </div>
              <div class="created-date">创建日期：{{ item.createTime }}</div>
            </div>
            <div class="my-teaching-btn">
              <el-button type="primary" @click="editCourseClick(item)"
                >编辑课程
              </el-button>
              <el-button type="primary" @click="lookDetails(item)"
                >查看详情
              </el-button>
              <!-- <el-button type="primary" @click="lookScore(item)">查看成绩</el-button> -->
            </div>
          </div>
          <!-- 学生成绩列表 -->
          <div v-show="showScore" class="stuScore bg-white p-10">
            <div class="downloadScoreList">
              <el-button class="mb-20" type="primary">下载成绩列表</el-button>
            </div>
            <el-table :data="scoreTable" border style="width: 100%">
              <el-table-column label="学生姓名" prop="stuName" width="120">
              </el-table-column>
              <el-table-column label="实验一" prop="stuScoreFirst">
              </el-table-column>
              <el-table-column label="实验二" prop="stuScoreSecond">
              </el-table-column>
              <el-table-column label="实验三" prop="stuScoreThird">
              </el-table-column>
              <el-table-column label="总分" prop="totalScore">
              </el-table-column>
              <el-table-column label="平均分" prop="averageScore">
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </template>
    <el-empty
      v-else
      class="bg-white"
      description="您还没有选择的授课"
    ></el-empty>

    <el-pagination
      :current-page="page"
      :hide-on-single-page="total <= 10"
      :page-size="10"
      :total="total"
      layout="total, prev, pager, next, jumper"
      @current-change="getCourseData"
    >
    </el-pagination>
    <!-- 编辑框 -->
    <EditCourse
      :dialogVisible.sync="dialogVisible"
      :formData="editCourse"
      @success="getCourseData"
    ></EditCourse>
  </div>
</template>

<script>
import { teacherCourseStatus } from "@/constant/course.js";
import { getMyTeachingService } from "@/api/course.js";
import EditCourse from "./components/EditCourse.vue";

export default {
  data() {
    return {
      page: 1, // 页数
      total: 0, // 总数
      activeCourseType: "-1", // 选择的课程类型
      myTeachList: [], //我的授课的全部课程
      courseForm: {}, //课程的详细信息
      showScore: false, //是否显示成绩列表
      scoreTable: [
        //成绩列表
        {
          id: 1,
          stuName: "张三",
          stuScoreFirst: 98,
          stuScoreSecond: 90,
          stuScoreThird: 95,
          totalScore: 98,
          averageScore: 94.5,
        },
        {
          id: 2,
          stuName: "李四",
          stuScoreFirst: 90,
          stuScoreSecond: 85,
          stuScoreThird: 93,
          totalScore: 90,
          averageScore: 89.5,
        },
      ],
      dialogVisible: false, //弹框显示隐藏
      editCourse: {}, // 编辑的信息
    };
  },
  created() {
    this.getCourseData();
  },
  methods: {
    // 选择课程类型变化
    courseTypeChange() {
      this.page = 1;
      this.getCourseData();
    },
    // 获取课程信息
    async getCourseData() {
      const data = { page: this.page };
      // 如果当前选中类型不是所有授课，则添加搜搜条件
      this.activeCourseType !== "-1" &&
        Object.assign(data, { status: this.activeCourseType });
      const res = await getMyTeachingService(data);
      this.total = res.count;
      this.myTeachList = res.data.map((item) => {
        return { ...item, picture: item.picture.split(",")[1] };
      });
    },
    // 编辑课程
    editCourseClick(item) {
      this.editCourse = {
        ...item,
        date: [item.startDate, item.endDate],
        selectDate: [item.selectStartDate, item.selectEndDate],
      };
      this.dialogVisible = true;
    },
    // 查看课程详情
    lookDetails({ hostName, hostPwd, courseId, id }) {
      localStorage.setItem("hostName", hostName); //登录名
      localStorage.setItem("hostPwd", hostPwd); //登录密码
      this.$router.push({
        path: "/teacherCourse",
        name: "teacherCourse",
        query: { courseId, id },
      });
    },
    // 查看成绩
    lookScore(e) {
      console.log(e);
      if (this.scoreTable.length > 0) {
        this.showScore = !this.showScore;
      }
    },
    // 课程状态数据转换
    courseStatusConvert(status) {
      return teacherCourseStatus.get(status);
    },
  },
  components: {
    EditCourse,
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
</style>

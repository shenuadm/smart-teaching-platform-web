<template>
  <div class="my-course global-container" v-loading="$store.state.isLoading">
    <div class="person-title">我的课程</div>
    <el-tabs v-model="activeCourseType" @tab-click="courseTypeChange" class="mt-20">
      <el-tab-pane label="所有课程" name="-1"></el-tab-pane>
      <el-tab-pane label="选课中" name="2"></el-tab-pane>
      <el-tab-pane label="授课中" name="4"></el-tab-pane>
      <el-tab-pane label="已结束" name="6"></el-tab-pane>
    </el-tabs>
    <ul class="list mt-20">
      <li class="list-item zh-pd-10 zh-mgb-20" v-for="item in courseList" :key="item.id">
        <img :src="'data:image/png;base64,' + item.picture" alt="课程图片" />
        <div class="list-item-info zh-mgl-20 flex">
          <div class="zh-fs-20 zh-fw-m">{{ item.name }}</div>
          <div class="course-info">
            <div>任课教师：{{ item.teacherName }}</div>
            <div>课程状态：{{ chooseStatusConvent(item.teacherCourseStatus) }}</div>
            <div>选课状态：{{ courseStatusConvent(item.status) }}</div>
            <div>创建时间：{{ dateFormat(item.createTime) }}</div>
          </div>
        </div>
        <div class="btn study">
          <el-button
            :type="item.teacherCourseStatus === 2 ? 'info' : 'primary'"
            :disabled="item.teacherCourseStatus === 2"
            @click="toCheckDetails(item)"
            >查看详情</el-button
          >
          <!-- <el-button type="primary">查看成绩</el-button> -->
          <el-button
            type="primary"
            v-if="item.status === 1 && item.teacherCourseStatus === 2"
            @click="recoverCourse(item.id)"
          >
            恢复选课
          </el-button>
          <el-button
            type="danger"
            v-if="item.status === 0 && item.teacherCourseStatus === 2"
            @click="revokeCourse(item)"
            >撤销课程</el-button
          >
        </div>
      </li>
    </ul>
    <el-pagination
      @current-change="getCourse"
      :current-page="page"
      :page-size="10"
      layout="total, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
  </div>
</template>

<script>
import dayjs from 'dayjs';
import { getMyCourse, ClickRevokeCourse } from '@/utils/api.js';
import { courseStatus, teacherCourseStatus } from '@/constant/course.js';
import { recoverCourseService } from '@/api/student.js';
export default {
  components: {},
  data() {
    return {
      courseList: [], //课程列表
      page: 1, //当前页
      total: 0,
      activeCourseType: '-1',
    };
  },
  mounted() {
    this.getCourse();
  },
  methods: {
    // 查看详情
    toCheckDetails(e) {
      console.log(e);
      if (e.teacherCourseStatus === 2) return;
      localStorage.setItem('hostName', e.hostName); //登录名
      localStorage.setItem('hostPwd', e.hostPwd); //登录密码
      // 路由跳转
      this.$router.push({
        path: '/courseDetails',
        // 这里的name必须与路由index.js的name相同
        name: 'courseDetails',
        query: {
          teacherCourseId: e.teacherCourseId, //用于渲染课程头部详情
          courseId: e.courseId, //用户渲染树形
          studentCourseId: e.id, //学生实验
        },
      });
    },
    async getCourse() {
      const res = await getMyCourse();
      this.courseList = res.data.map((item) => {
        let picture = item.picture.split(',')[1];
        if (!picture) {
          picture = '';
        }
        return { ...item, picture };
      });
    },
    // 撤销课程
    async revokeCourse(e) {
      // 如果当前课程状态是已撤回或不是选课中，不能进行撤回
      const { status, teacherCourseStatus } = e;
      if (status === 1 || teacherCourseStatus !== 2) return;
      const data = {
        id: e.id,
        teacherCourseId: e.teacherCourseId,
      };
      await ClickRevokeCourse(data);
      await this.getCourse();
      this.$message.success('课程撤销成功！');
    },
    // 恢复选课
    async recoverCourse(id) {
      await recoverCourseService(id);
      await this.getCourse();
      this.$message.success('恢复选课成功！');
    },
    // 课程类型变化
    courseTypeChange() {},
    // 课程状态数据转换
    courseStatusConvent(status) {
      return courseStatus.get(status);
    },
    // 选课状态数据转换
    chooseStatusConvent(status) {
      return teacherCourseStatus.get(status);
    },
    dateFormat(date) {
      return dayjs(date).format('YYYY年MM月DD日HH时mm分ss秒');
    },
    // 分页
    // currentPage 改变时会触发
    handleCurrentChange(val) {
      this.currentPage = val;
    },
  },
};
</script>

<style scoped>
.my-course {
  background-color: #f8f6f6 !important;
}
.list {
  padding: 0 !important;
}
.course-info {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  flex-grow: 1;
}
.list-item {
  height: 150px;
  display: flex;
  background-color: #fff;
  position: relative;
  border: 1px solid #dedede;
}
.list-item img {
  width: 250px;
  height: 150px;
}
.list-item-info {
  text-align: left;
  flex-direction: column;
}
.list-item-info p {
  margin-top: 0 !important;
}
.study {
  width: 350px;
  height: 35px;
  border: 0;
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
}

.person-title {
  height: 60px;
  line-height: 60px;
  padding: 0 50px;
  text-align: left;
  font-size: 20px;
  border-bottom: 2px solid #efefef;
  background-color: #fff;
}
</style>

<style>
/* tab切换栏 */
.my-course .el-tabs__item {
  background-color: #b2d5f1 !important;
  color: #000 !important;
  padding: 0 20px !important;
  border-right: 1px solid #fff;
}
.my-course .el-tabs__item.is-active {
  background-color: #409eff !important;
  color: #fff !important;
}
.my-course .el-button--primary {
  background-color: #4faff0;
  border-color: #4faff0;
}
.my-course .el-table .el-table__cell {
  text-align: center;
}
.my-course .el-table .cell {
  display: -webkit-box;
  -webkit-line-clamp: 1; /* 指定要显示的行数 */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>

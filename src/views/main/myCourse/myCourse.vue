<template>
  <div class="content global-container" v-loading="loadingGlobal">
    <ul class="list">
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
          <el-button type="primary" v-if="item.status === 1 && item.teacherCourseStatus === 2"> 恢复选课 </el-button>
          <el-button
            type="danger"
            v-if="item.status === 0 && item.teacherCourseStatus === 2"
            @click="revokeCourse(item)"
            >撤销课程</el-button
          >
        </div>
      </li>
    </ul>
    <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[5, 10, 20]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="courseList.length"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs';
import { getMyCourse, ClickRevokeCourse } from '@/utils/api.js';
import { courseStatus, teacherCourseStatus } from '@/constant/course.js';
export default {
  components: {},
  data() {
    return {
      courseList: [], //课程列表
      currentPage: 1, //当前页
      pageSize: 5, //每页的条数
    };
  },
  mounted() {
    getMyCourse().then((res) => {
      this.courseList = res.data.map((item) => {
        let picture = item.picture.split(',')[1];
        if (!picture) {
          picture = '';
        }
        return { ...item, picture };
      });
      // this.courseList = selectStatusConvert(this.courseList);
      this.loadingGlobal = false;
    });
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
    // 撤销课程
    async revokeCourse(e) {
      // 如果当前课程状态是已撤回或不是选课中，不能进行撤回
      const { status, teacherCourseStatus } = e;
      if (status === 1 || teacherCourseStatus !== 2) return;
      let data = {
        id: e.id,
        teacherCourseId: e.teacherCourseId,
      };
      const res = await ClickRevokeCourse(data);
      if (res) this.$message.success('课程撤销成功');
    },
    // 恢复选课
    async resetCourse(data) {
      console.log(data);
    },
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
    // pageSize 改变时会触发
    handleSizeChange(val) {
      this.pageSize = val;
    },
    // currentPage 改变时会触发
    handleCurrentChange(val) {
      this.currentPage = val;
    },
  },
};
</script>

<style scoped>
.content {
  background-color: #f8f6f6 !important;
}
.list {
  margin: 0 !important;
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
</style>

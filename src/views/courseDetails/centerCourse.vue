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
    <CourseList :teacherId="teacherId"> </CourseList>
  </div>
</template>

<script>
import { checkChapter } from '@/utils/api.js';
import CourseList from './components/CourseList.vue';
export default {
  data() {
    return {
      path: '', //面包屑路由跳转
      courseObj: {}, //课程信息
      teacherId: '', //教师课程id
      roleId: '', //角色id--2表示教师角色，3表示学生角色
      courseId: '', //课程的id
    };
  },
  async created() {
    this.roleId = localStorage.getItem('roleId');
    // 获取数据
    this.path = '/courseCenter';
    const id = this.$route.query.courseId;
    const res = await checkChapter(id);
    this.courseObj = res.courseInfo;
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
</style>

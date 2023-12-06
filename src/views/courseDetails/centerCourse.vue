<template>
  <div class="content warpper" id="courseDeatils">
    <div class="zh-mgb-20">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: path }">返回上一级</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/courseDetails' }">{{ courseObj.name }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!-- 课程信息 -->
    <div class="course-info theme-bg-white btn-radius-5 zh-mgb-20 zh-pd-10">
      <img src="@/assets/addbg.jpg" alt="网络错误" />
      <div class="info-content zh-mgl-30">
        <div class="info-name font-bold">课程名称：{{ courseObj.name }}</div>
        <div class="mt-20">课程描述：{{ courseObj.description }}</div>
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
  components: {
    CourseList,
  },
};
</script>

<style scoped>
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

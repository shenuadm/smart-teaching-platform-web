<template>
  <div class="global-container" v-loading="$store.state.isLoading">
    <!-- 标题 -->
    <div class="person-title">课程中心</div>
    <!-- 内容 -->
    <!-- 搜索框 -->
    <!-- <div class="course-search p-10">
      <span>课程名称：</span>
      <input v-model="search" placeholder="请输入课程名称" />
      <el-button type="primary" size="small">搜索</el-button>
      <el-button type="primary" size="small">重置</el-button>
    </div> -->
    <!-- 每一项数据 -->
    <div class="course-center mt-20" v-if="courseList.length > 0">
      <div class="course-center-item mt-20" v-for="item in courseList" :key="item.id">
        <img :src="'data:image/png;base64,' + item.picture" alt="课程logo图片" />
        <div class="course-center-text">
          <div class="course-name">课程名称：{{ item.name }}</div>
          <div class="course-title">课程标题：{{ item.title }}</div>
          <div class="course-score">学分：{{ item.credit }}</div>
          <el-popover placement="bott om" width="400" trigger="hover" :content="item.description">
            <p slot="reference" class="course-describe">课程描述：{{ item.description }}</p>
          </el-popover>
        </div>
        <div class="pr-20">
          <el-button type="primary" @click="toChapterDetails(item)">查看章节</el-button>
          <el-button type="primary" @click="editCourseClick(item)">选择授课</el-button>
        </div>
      </div>
    </div>
    <el-empty
      class="bg-white"
      description="暂无课程"
      v-else-if="!$store.state.isLoading && courseList.length === 0"
    ></el-empty>
    <EditCourse :dialogVisible.sync="visible" @success="getData" :formData="chooseData"></EditCourse>
  </div>
</template>

<script>
import { teaGetCourseCenterService } from '@/api/course.js';
import EditCourse from '../myTeaching/components/EditCourse.vue';

export default {
  data() {
    return {
      courseList: [],
      chooseData: {},
      search: '', //搜索框
      visible: false,
    };
  },
  created() {
    this.getData();
  },
  methods: {
    // 选择授课
    editCourseClick(data) {
      const { id, name } = data;
      this.chooseData = { courseId: id, title: name };
      this.visible = true;
      console.log(this.visible, 'visible');
    },
    // 获取数据
    async getData() {
      const res = await teaGetCourseCenterService();
      this.courseList = res.data.map((item) => {
        const picture = item.picture.split(',')[1];
        return { ...item, picture };
      });
    },
    // 跳转到章节详情页面
    toChapterDetails({ id }) {
      this.$router.push({
        path: '/centerCourse',
        name: 'centerCourse',
        query: {
          courseId: id,
        },
      });
    },
  },
  components: {
    EditCourse,
  },
};
</script>

<style scoped>
/* 标题 */
.person-title {
  height: 60px;
  line-height: 60px;
  padding: 0 50px;
  text-align: left;
  font-size: 20px;
  border-bottom: 2px solid #efefef;
  background-color: #fff;
}
/* 搜索框 */
.course-search {
  display: flex;
  align-items: center;
  background-color: #fff;
}
.course-search input {
  padding: 0 10px;
  height: 33px;
  border: 1px solid #ccc;
  outline: none;
}
.course-search input::placeholder {
  color: #ccc;
}
.course-search button {
  margin-left: 10px;
  width: 82px;
  height: 33px;
  border: none;
  border-radius: 3px;
  transition: all 0.3s;
  color: #fff;
  cursor: pointer;
}
/* 每一项数据 */
.course-center-item {
  display: flex;
  align-items: center;
  border: 1px solid #ededed;
  background-color: #fff;
  border-radius: 15px;
}
.course-center-item img {
  padding: 10px;
  width: 220px;
  height: 120px;
  cursor: pointer;
}
.course-center-item .el-checkbox {
  width: 20px;
  margin-left: 5px;
}
.course-center-text {
  flex: 1;
  padding: 20px;
  text-align: left;
  font-size: 15px;
  color: #666;
}
.course-name {
  font-weight: 700;
  font-size: 16px;
  color: #000;
}
.course-describe {
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2; /* 将文本限制为两行 */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis; /* 显示省略号 */
  font-size: 14px;
  cursor: pointer;
}

.course-search button {
  box-shadow: 0 2px 5px #ccc;
}
</style>
<style>
.course-center .end-date .el-form-item__content {
  margin-left: 0 !important;
}
</style>

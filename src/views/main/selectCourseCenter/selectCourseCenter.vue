<template>
  <div class="content global-container" v-loading="$store.state.isLoading">
    <div class="person-title">选课中心</div>
    <div class="choose-list mt-20">
      <el-row class="choose-list-item zh-pd-10 zh-mgb-20" v-for="item in chooseCourse" :key="item.id">
        <el-col :span="6">
          <img :src="'data:image/png;base64,' + item.picture" alt="加载失败" />
        </el-col>
        <el-col :span="14" class="choose-item-info zh-mgl-20">
          <el-row class="info-container" :gutter="20">
            <el-col :span="12" class="item-info">
              <div>课程名称：{{ item.name }}</div>
              <div>已选人数：{{ item.selectedNumber }}</div>
              <div>授课地点：{{ item.address }}</div>
            </el-col>
            <el-col :span="12" class="item-info">
              <div>授课教师：{{ item.userName }}</div>
              <div>限制人数：{{ item.maxTaker }}</div>
              <div>课程状态：{{ item.status }}</div>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" size="small" @click="selectCourse(item)" class="choose">选课</el-button>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { getSelectCourse, clickSelectCourse } from '@/utils/api.js';
import { selectStatusConvert } from '@/utils/status.js';
export default {
  data() {
    return {
      chooseCourse: [],
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    // 选课
    async selectCourse(e) {
      await clickSelectCourse({ teacherCourseId: e.id });
      this.$message.success('选择课程成功');
      this.getData();
    },
    async getData() {
      const res = await getSelectCourse();
      this.chooseCourse = res.data.map((item) => {
        if (item.picture !== null) {
          var picture = item.picture.split(',')[1];
        }
        if (!picture) {
          picture = '';
        }
        return { ...item, picture };
      });
      this.chooseCourse = selectStatusConvert(this.chooseCourse);
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
.content {
  background-color: #f8f6f6 !important;
}
.title {
  text-align: left;
  border-bottom: 1px solid #dedede;
  padding-bottom: 20px;
}
.choose-list {
  padding: 0 !important;
}
.choose-list-item {
  border-radius: 20px;
  height: 170px;
  padding: 10px 0;
  display: flex;
  flex-direction: row;
  background-color: #fff;
  position: relative;
}
.choose-item-info {
  text-align: left;
}

.info-container,
.info-container > div {
  height: 100%;
}

.item-info > div {
  margin-top: 0 !important;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 2;
}
.item-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 15px;
}
.choose-list-item img {
  width: 250px;
  height: 150px;
}
.choose {
  border: 0;
  position: absolute;
  top: 50%;
  right: 80px;
  transform: translateY(-50%);
}
</style>

<template>
  <div class="content global-container" v-loading="$store.state.isLoading">
    <div class="person-title">选课中心</div>
    <div class="choose-list mt-20">
      <el-row class="choose-list-item zh-pd-10 zh-mgb-20" v-for="item in chooseCourse" :key="item.id">
        <el-col :span="6">
          <img :src="'data:image/png;base64,' + item.picture" alt="加载失败" />
        </el-col>
        <el-col :span="14" class="choose-item-info zh-mgl-20">
          <div class="info-container">
            <div>课程名称：{{ item.name }}</div>
            <div>已选人数：{{ item.selectedNumber }}</div>
            <div style="height: 42px">授课地点：{{ item.address }}</div>
            <div>授课教师：{{ item.userName }}</div>
            <div>限制人数：{{ item.maxTaker }}</div>
          </div>
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
      console.log(res);
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
.info-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr;
  column-gap: 10px;
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
.content {
  background-color: #f8f6f6 !important;
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

.info-container {
  height: 100%;
}

.info-container > div {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 2;
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

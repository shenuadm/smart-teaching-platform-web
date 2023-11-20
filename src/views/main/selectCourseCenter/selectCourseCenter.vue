<template>
  <div class="content zh-pdy-15">
    <ul class="choose-list">
      <li
        class="choose-list-item zh-pd-10 zh-mgb-20"
        v-for="item in chooseCourse"
      >
        <!-- <img :src="item.img" alt="" /> -->
        <img src="../../../assets/addbg.jpg" alt="" />
        <div class="choose-item-info zh-mgl-20">
          <div class="item-info-left">
            <p>
              课程名称：<span>{{ item.name }}</span>
            </p>

            <p>
              已选人数：<span>{{ item.selectedNumber }}</span>
            </p>
            <p>
              授课地点：<span>{{ item.address }}</span>
            </p>
          </div>
          <div class="item-info-right zh-mgl-30">
            <p>
              授课教师：<span>{{ item.userName }}</span>
            </p>
            <p>
              限制人数：<span>{{ item.maxTaker }}</span>
            </p>
            <p>
              课程状态：<span ref="status">{{ item.status }}</span>
            </p>
          </div>
        </div>
        <!-- <button
          class="choose zh-fc-white btn-radius-5 btn-bg-b"
          :data-id="item.id"
          @click="selectCourse"
        >
          选课
        </button> -->
        <el-button type="primary" size="small" @click="selectCourse(item)" class="choose">选课</el-button>
      </li>
    </ul>
  </div>
</template>

<script>
import { getSelectCourse, clickSelectCourse } from "@/utils/api.js";
import { selectStatusConvert } from "@/utils/status.js";
export default {
  data() {
    return {
      chooseCourse: [],
    };
  },
  mounted() {
    // 获取接口数据
    getSelectCourse().then((res) => {
      this.chooseCourse = selectStatusConvert(res.data);
    });
    // console.log(this.$refs.status);
    // this.$refs.status.map((item) => {
    //   if (item.innerText == "开课中") {
    //     item.style.color = "green";
    //   } else if (item.innerText == "已结束") {
    //     item.style.color = "red";
    //   } else {
    //     item.style.color = "blue";
    //   }
    // });
  },
  methods: {
    // 选课
    selectCourse(e) {
      console.log(e);
      let data = { teacherCourseId: e.id };
      // 请求接口
      clickSelectCourse(data).then((res) => {
        if (res.msg != "success") {
          this.$message({
            message: "该课程已经选了",
            type: "warning",
          });
        } else {
          this.$message({
            message: "课程选择成功",
            type: "success",
          });
        }
      });
    },
  },
};
</script>

<style scoped>
.content {
  background-color: #f8f6f6 !important;
}
.title {
  text-align: left;
  border-bottom: 1px solid #dedede;
  padding-bottom: 20px;
}
.choose-list {
  margin: 0 !important;
  padding: 0 !important;
}
.choose-list-item {
  height: 150px;
  display: flex;
  flex-direction: row;
  background-color: #fff;
  position: relative;
}
.choose-item-info {
  display: flex;
  flex-direction: row;
}
.choose-item-info > div {
  display: inline-block;
}
.choose-item-info p {
  margin-top: 0 !important;
  text-align: left;
}
.choose-list-item img {
  width: 250px;
  height: 150px;
}
.choose {
  /* width: 100px; */
  /* height: 35px; */
  border: 0;
  position: absolute;
  top: 50%;
  right: 80px;
  transform: translateY(-50%);
}
</style>
<template>
  <div class="content zh-pdy-15">
    <ul class="list">
      <li
        class="list-item zh-pd-10 zh-mgb-20"
        v-for="(item, index) in courseList"
      >
        <!-- <img src="@/assets/bg.jpg" alt="" /> -->
        <img src="@/assets/bg.jpg" alt="" />
        <!-- <img :src="item.picture" alt="" /> -->
        <div class="list-item-info zh-mgl-20">
          <p class="zh-fs-20 zh-fw-m">{{ item.name }}</p>
          <p>
            任课教师：<span>{{ item.teacherName }}</span>
          </p>
          <p>
            选课状态：<span ref="status">{{ item.status }}</span>
          </p>
        </div>
        <div class="btn study">
          <el-button type="primary" @click="toCheckDetails(item)"
            >查看详情</el-button
          >
          <!-- <el-button type="primary">查看成绩</el-button> -->
          <el-button type="danger" @click="revokeCourse(item)"
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
import { getMyCourse, ClickRevokeCourse } from "@/utils/api.js";
import { selectStatusConvert } from "@/utils/status.js";
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
      // console.log(res.data);
      this.courseList = selectStatusConvert(res.data);
    });
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
    // handleClick(tab, event) {
    //   console.log(tab, event);
    // },
    // 查看详情
    toCheckDetails(e) {
      console.log(e);
      localStorage.setItem("hostName", e.hostName); //登录名
      localStorage.setItem("hostPwd", e.hostPwd); //登录密码
      // 路由跳转
      this.$router.push({
        path: "/courseDetails",
        // 这里的name必须与路由index.js的name相同
        name: "courseDetails",
        query: {
          teacherCourseId: e.teacherCourseId, //用于渲染课程头部详情
          courseId: e.courseId, //用户渲染树形
        },
      });
    },
    // 撤销课程
    revokeCourse(e) {
      let data = {
        id: e.id,
        teacherCourseId: e.teacherCourseId,
      };
      ClickRevokeCourse(data).then((res) => {
        if (res.msg != "success") {
          this.$message({
            message: res.msg,
            type: "warning",
          });
        } else {
          this.$message({
            message: "撤销成功",
            type: "success",
          });
        }
      });
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
.content{
  background-color: #f8f6f6 !important;
}
.list {
  margin: 0 !important;
  padding: 0 !important;
}
.list-item {
  height: 150px;
  display: flex;
  flex-direction: row;
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
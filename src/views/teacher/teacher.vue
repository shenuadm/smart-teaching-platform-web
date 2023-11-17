<template>
  <div class="personalInfo warpper">
    <!-- 侧导航 -->
    <div class="person-nav">
      <div
        v-for="(item, index) in navList"
        :class="{ 'person-nav-item': true, active: activeIndex === index }"
        :key="index"
        @click="switchNav(index)"
      >
        {{ item }}
      </div>
    </div>
    <!-- 信息内容 -->
    <div class="person-container">
      <!-- 路由出口 -->
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      navList: [], //侧导航标题
      activeIndex: 0, //高亮的下标
    };
  },
  created() {
    // 从本地存储中取值
    let dataList = JSON.parse(localStorage.getItem("navData"));
    dataList.map((item) => {
      if (item.children == null) {
        this.navList.push(item.title);
      } else {
        item.children.map((i) => {
          this.navList.push(i.title);
        });
      }
    });
    // console.log(this.navList);
  },
  methods: {
    switchNav(index) {
      this.activeIndex = index;
      const routes = ["personalInfo", "courseCenter", "myTeaching"];
      const targetRoute = routes[index];
      if (this.$route.fullPath === `/${targetRoute}`) return; //防止连续点击，路由报错
      this.$router.push({ name: targetRoute });
    },
  },
};
</script>

<style scoped>
.personalInfo {
  min-height: 80vh;
  margin: 30px auto;
}
.person-nav {
  float: left;
  padding: 20px 0;
  width: 200px;
  margin-right: 10px;
  border-radius: 5px;
  background-color: #fff;
  border: 1px solid #e4ecf3;
}
.person-nav .person-nav-item {
  padding-left: 30px;
  height: 40px;
  line-height: 40px;
  text-align: left;
  font-size: 15px;
  cursor: pointer;
  font-weight: 700;
}
.active {
  color: #43bc60;
  border-left: 2px solid #43bc60;
}
.person-container {
  width: 1030px;
  float: right;
  flex: 1;
  border-radius: 5px;
}
</style>

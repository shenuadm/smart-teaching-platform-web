<template>
  <div class="container warpper">
    <!-- 侧边导航栏 -->
    <div class="aside-nav">
      <div
        v-for="(item, index) in navList"
        :class="{ 'aside-nav-item': true, active: activeIndex === index }"
        :key="index"
        @click="switchTo(index)"
      >
        {{ item }}
      </div>
    </div>
    <!-- 右侧主体内容 -->
    <div class="main-content">
      <div class="title">{{ navList[activeIndex] }}</div>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      navList: [], //侧边导航栏
      activeIndex: 0, //选择的下标
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
  },
  mounted() {},
  methods: {
    // 路由跳转
    switchTo(index) {
      this.activeIndex = index;
      const route = ['personInfo','myCourse','selectCourseCenter']
      const currentRoute = route[index]
      if(this.$route.fullPath === `/${currentRoute}`) return;//防止再次点击路由报错
      this.$router.push({name:currentRoute})
    },
  },
};
</script>

<style scoped>
.warp {
  width: 1200px;
}
.container {
  min-height: 80vh;
  margin: 30px auto;
}
.aside-nav {
  float: left;
  padding: 20px 0;
  width: 200px;
  margin-right: 10px;
  border-radius: 5px;
  background-color: #fff;
  border: 1px solid #e4ecf3;
}
.aside-nav .aside-nav-item {
  padding-left: 30px;
  height: 40px;
  line-height: 40px;
  text-align: left;
  font-size: 15px;
  cursor: pointer;
}
.active {
  color: #43bc60;
  border-left: 2px solid #43bc60;
}
.main-content {
  width: 1050px;
  float: right;
  flex: 1;
  border-radius: 5px;
  background-color: #fff;
  box-sizing: border-box;
}
.title {
  height: 60px;
  line-height: 60px;
  padding: 0 50px;
  text-align: left;
  font-size: 20px;
  background-color: #fff;
  border-bottom: 2px solid #efefef;
}
</style>
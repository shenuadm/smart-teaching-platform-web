<template>
  <div class="container warpper">
    <!-- 侧边导航栏 -->
    <el-col :span="4">
      <el-menu :default-active="$route.path" router>
        <el-menu-item
          v-for="item in navList"
          :key="item.id"
          :index="item.funurl"
        >
          <i class="iconfont" :class="item.icon"></i>
          <span slot="title">{{ item.title }}</span>
        </el-menu-item>
        <el-submenu index="">
          <el-menu-item index=""></el-menu-item>
        </el-submenu>
      </el-menu>
    </el-col>
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
    let dataList = JSON.parse(localStorage.getItem('navData'));
    dataList.forEach((item) => {
      if (item.children == null) {
        this.navList.push({
          icon: item.icon,
          funurl: item.funurl,
          title: item.title,
          id: item.id,
        });
      } else {
        item.children.forEach((i) => {
          this.navList.push({
            icon: i.icon,
            funurl: i.funurl,
            title: i.title,
            id: item.id,
          });
        });
      }
    });
    // console.log(this.navList, 'navList');

    console.log(dataList, 'dataList');
  },
  mounted() {},
  methods: {
    // 路由跳转
    switchTo(index) {
      this.activeIndex = index;
      const route = ['personInfo', 'myCourse', 'selectCourseCenter'];
      const currentRoute = route[index];
      if (this.$route.fullPath === `/${currentRoute}`) return; //防止再次点击路由报错
      this.$router.push({ name: currentRoute });
    },
  },
};
</script>

<style scoped>
.warp {
  width: 1200px;
}
.container {
  /* min-height: 80vh; */
  margin: 30px auto;
  display: flex;
}
.aside-nav {
  float: left;
  /* padding: 24px 0; */
  /* width: 200px; */
  padding: 16px 0;
  width: 188px;
  margin-right: 10px;
  border-radius: 5px;
  /* background-color: #fff; */
  /* background: #eeeff1; */
  background: #f8f6f6;
  /* border: 1px solid #e4ecf3; */
  height: auto;
}
.aside-nav .aside-nav-item {
  /* margin: 10px 0; */
  margin-bottom: 16px;
  /* padding-left: 30px; */
  padding-left: 24px;
  height: 40px;
  line-height: 40px;
  text-align: left;
  /* font-size: 15px; */
  cursor: pointer;
}
.aside-nav .aside-nav-item:hover {
  background: #e0e3eb;
}
.active {
  /* color: #43bc60; */
  /* border-left: 2px solid #43bc60; */
  color: #1f63f8;
  border-left: 2px solid #1f63f8;
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

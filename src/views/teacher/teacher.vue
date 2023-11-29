<template>
  <el-row :gutter="20" class="personalInfo warpper">
    <!-- 侧导航 -->
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
      </el-menu>
    </el-col>
    <!-- 信息内容 -->
    <el-col :span="20" class="person-container">
      <!-- 路由出口 -->
      <router-view></router-view>
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: 'teacherIndex',
  data() {
    return {
      navList: [], //侧导航标题
      activeIndex: 0, //高亮的下标
    };
  },
  created() {
    // 从本地存储中取值
    let dataList = JSON.parse(localStorage.getItem('navData'));
    // console.log(dataList, 'dataList');
    dataList.forEach((item) => {
      if (item.children == null) {
        // this.navList.push(item.title);
        this.navList.push({
          icon: item.icon,
          funurl: item.funurl,
          title: item.title,
          id: item.id,
        });
      } else {
        item.children.forEach((i) => {
          // this.navList.push(i.title);
          this.navList.push({
            icon: i.icon,
            funurl: i.funurl,
            title: i.title,
            id: i.id,
          });
        });
      }
    });
    console.log(this.navList);
  },
  methods: {
    switchNav(index) {
      this.activeIndex = index;
      const routes = ['personalInfo', 'courseCenter', 'myTeaching'];
      const targetRoute = routes[index];
      if (this.$route.fullPath === `/${targetRoute}`) return; //防止连续点击，路由报错
      this.$router.push({ name: targetRoute });
    },
  },
  computed: {
    defaultActive() {
      return this.$route.path;
    },
  },
};
</script>

<style scoped>
.personalInfo {
  display: flex;
  margin: 30px auto;
  height: auto;
}
.person-container {
  width: 1000px;
  flex: 1;
  border-radius: 5px;
}
</style>

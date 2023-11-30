<template>
  <el-container class="container warpper">
    <!-- 侧边导航栏 -->
    <el-col :span="4" class="mr-20">
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
    <!-- 右侧主体内容 -->
    <el-col :span="20" class="main-content">
      <router-view></router-view>
    </el-col>
  </el-container>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      navList: [], //侧边导航栏
    };
  },
  created() {
    // 从本地存储中取值
    const dataList = JSON.parse(localStorage.getItem('navData'));
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
  },
};
</script>

<style scoped>
.container {
  margin: 30px auto;
  height: auto !important;
}

.el-menu > li {
  font-weight: 700;
}

.main-content {
  width: 1050px;
  /* float: right; */
  flex: 1;
  border-radius: 20px;
  /* background-color: #fff; */
  box-sizing: border-box;
}
</style>

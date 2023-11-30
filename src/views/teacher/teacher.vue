<template>
  <el-container class="personalInfo warpper">
    <!-- 侧导航 -->
    <el-col :span="4" class="mr-20">
      <el-menu
        :default-active="$route.path"
        class="el-menu-vertical-demo"
        router
      >
        <el-menu-item
          v-for="item in test"
          :key="item.id"
          v-if="item.type === '菜单'"
          :index="item.funurl"
        >
          <span slot="title"
            ><i :class="item.icon" class="iconfont"></i>{{ item.title }}</span
          >
        </el-menu-item>

        <el-submenu
          index="2"
          v-for="item in test"
          :key="item.id"
          v-if="item.type === '目录'"
        >
          <span slot="title"
            ><i :class="item.icon" class="iconfont"></i>{{ item.title }}</span
          >
          <el-menu-item
            v-for="i in item.children"
            :index="i.funurl"
            v-if="i.type === '菜单'"
            :key="i.id"
            ><i class="iconfont" :class="i.icon"></i>{{ i.title }}</el-menu-item
          >
        </el-submenu>
      </el-menu>
    </el-col>
    <!-- 信息内容 -->
    <el-col :span="20" class="person-container">
      <!-- 路由出口 -->
      <router-view></router-view>
    </el-col>
  </el-container>
</template>

<script>
export default {
  name: 'teacherIndex',
  data() {
    return {
      navList: [], //侧导航标题
      test: [],
    };
  },
  created() {
    // 从本地存储中取值
    const dataList = JSON.parse(localStorage.getItem('navData'));
    this.test = dataList;
    console.log(dataList, 'datalist1111');
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
            id: i.id,
          });
        });
      }
    });
    console.log(this.navList);
  },
};
</script>

<style scoped>
.el-menu > li {
  font-weight: 700;
}
.personalInfo {
  margin: 30px auto;
  height: auto;
}
.person-container {
  width: 1000px;
  flex: 1;
  border-radius: 5px;
}
</style>

<template>
  <el-container class="warpper">
    <el-col :span="4" class="warpper-left">
      <el-menu
        :default-active="$route.path"
        class="el-menu-vertical-demo"
        router
      >
        <el-menu-item index="/personmsg">
          <span slot="title"><i class="el-icon-user"></i>个人信息</span>
        </el-menu-item>
        <el-submenu index="2">
          <span slot="title">系统管理</span>
          <el-menu-item index="/menuManagement" class="second"
            >菜单管理</el-menu-item
          >
          <el-menu-item index="/courseManagement" class="second"
            >课程管理</el-menu-item
          >
          <el-menu-item index="/roleManagement" class="second"
            >角色管理</el-menu-item
          >
        </el-submenu>
        <el-menu-item index="/UserManagement">
          <span slot="title">用户管理</span>
        </el-menu-item>
        <el-menu-item index="/systemNotice">
          <span slot="title">系统通知管理</span>
        </el-menu-item>
        <el-menu-item index="/aboutUS">
          <span slot="title">关于我们</span>
        </el-menu-item>
      </el-menu>
    </el-col>
    <el-main>
      <router-view></router-view>
    </el-main>
  </el-container>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      tabPosition: 'left', //侧边标签的位置（左侧）
    };
  },
  mounted() {},
  methods: {},
};
</script>

<style scoped>
.warpper-left {
  position: fixed;
  z-index: inherit;
}
.el-container {
  padding: 20px 0 20px 0;
}
.el-aside {
  width: 150px !important;
}

.el-main {
  margin-left: 220px;
  background-color: #fff;
}
/* 导航栏 */
.el-menu-vertical-demo {
  width: 200px;
}
.el-menu-item:hover {
  background-color: rgb(225, 227, 240) !important;
}
/* .el-menu > li {
  font-weight: 700;
} */
/* 二级目录 */
.second {
  padding: 0 0 0 46px;
}
</style>

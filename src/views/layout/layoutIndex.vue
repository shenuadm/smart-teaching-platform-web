<template>
  <el-container class="personalInfo layout-index warpper">
    <!-- 侧导航 -->
    <div class="mr-20">
      <el-menu
        :default-active="$route.path"
        class="el-menu-vertical-demo text-center"
        router
        :collapse="false"
        style="width: 200px">
        <div v-for="item in navList" :key="item.id">
          <el-menu-item v-if="item.type === '菜单'" :index="item.funurl">
            <!-- 系统通知，展示未读通知数 -->
            <span slot="title" v-if="item.funurl === '/userNotice'">
              <el-badge :value="$store.state.unreadNotice" :max="99" :hidden="$store.state.unreadNotice === 0">
                <i :class="item.icon" class="iconfont mr-5"></i>{{ item.title }}
              </el-badge>
            </span>
            <span slot="title" v-else><i :class="item.icon" class="iconfont mr-5"></i>{{ item.title }}</span>
          </el-menu-item>
          <el-submenu v-if="item.type === '目录'" :index="item.funurl">
            <span slot="title"><i :class="item.icon" class="iconfont mr-5"></i>{{ item.title }}</span>
            <div v-for="i in item.children" :key="i.id">
              <el-menu-item :index="i.funurl" v-if="i.type === '菜单'" class="second">
                <i class="iconfont mr-5" :class="i.icon"></i>{{ i.title }}
              </el-menu-item>
            </div>
          </el-submenu>
        </div>
        <div v-if="rolename === 'supper_admin'">
          <el-menu-item index="/aboutUS">
            <span slot="title"><i class="icon-guanyuwomen iconfont mr-5"></i>关于我们</span>
          </el-menu-item>
        </div>
      </el-menu>
    </div>
    <!-- 信息内容 -->
    <div class="person-container">
      <!-- 路由出口 -->
      <router-view></router-view>
    </div>
  </el-container>
</template>

<script>
export default {
  name: 'teacherIndex',
  data() {
    return {
      navList: [], //侧导航标题
      rolename: '',
    };
  },
  async created() {
    // 从本地存储中取值
    this.navList = JSON.parse(localStorage.getItem('navData'));
    this.rolename = sessionStorage.getItem('rolename');
    // 如果有系统通知选项，就获取未读的通知
    if (this.navList.find((item) => item.funurl === '/userNotice')) {
      await this.$store.dispatch('getUnreadNotice');
    }
  },
};
</script>

<style scoped>
.el-menu > li,
.el-menu > div > li {
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
.second {
  padding: 0 0 0 46px;
}
</style>

<!--suppress CssUnusedSymbol -->
<style>
.layout-index .el-badge__content {
  top: 15px;
  right: 0;
}
</style>

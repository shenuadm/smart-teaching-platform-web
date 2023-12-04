<template>
  <div>
    <el-container>
      <!-- 头部 -->
      <el-header style="position: fixed" class="header theme-bg-black">
        <div class="heder-container">
          <div class="logo">
            <img src="@/assets/logo2.png" alt="网络错误" />
          </div>
          <div>
            <div v-if="this.$store.state.username" class="login-info">
              <img src="@/assets/avatar.jpg" alt="网络错误" class="login-img" />
              <div class="login-name zh-fc-white">
                <el-menu
                  class="userInfo"
                  background-color="#212121"
                  text-color="#ffffff"
                  active-text-color="#409EFF"
                  mode="horizontal"
                  router
                >
                  <el-submenu index="1">
                    <template slot="title">{{ this.$store.state.username }}</template>
                    <!-- <el-menu-item v-if="roleId == 1" index="/personmsg">修改信息</el-menu-item>
                    <el-menu-item v-if="roleId == 2" index="/personalInfo">修改信息</el-menu-item>
                    <el-menu-item v-if="roleId == 3" index="/personInfo">修改信息</el-menu-item> -->
                    <el-menu-item @click="exitLogin">退出登录</el-menu-item>
                  </el-submenu>
                </el-menu>
              </div>
            </div>
            <div v-else></div>
          </div>
        </div>
      </el-header>
      <div class="main" style="padding: 60px 0 0 0">
        <!-- 侧导航 -->
        <AsideTem></AsideTem>
        <!-- 路由出口 -->
        <router-view></router-view>
      </div>
      <!-- 底部 -->
      <div class="footer theme-bg-black">
        <p class="footer-info-item zh-fc-white">技术支持：成都易腾创想智能科技有限公司</p>
        <p class="footer-info-item zh-fc-white">联系方式：028-62539515</p>
        <p class="footer-info-item zh-fc-white">公司地址：四川省成都市温江区海科路东段777号F栋11楼</p>
      </div>
    </el-container>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      roleId: 0,
      routes: '',
    };
  },
  computed: {},
  created() {},
  mounted() {
    let roleId = localStorage.getItem('roleId');
    console.log(roleId);
    this.roleId = roleId;
  },
  methods: {
    exitLogin() {
      sessionStorage.clear();
      localStorage.clear();
      this.$store.state.username = '';
      this.$router.push({
        path: '/',
        name: 'login',
      });
    },
  },
};
</script>

<style scoped>
/* 头部 */
.el-header {
  padding: 0;
  width: 100%;
  z-index: 9;
}
.header,
.heder-container {
  height: 60px;
}
.heder-container {
  display: flex;
  justify-content: space-between;
  margin: 0 20px;
}
.header,
.footer {
  width: calc(100vw + 10px);
}
.main {
  min-width: calc(100vw - 10px);
}
.logo,
.logo span {
  display: flex;
  align-items: center;
}
.logo img {
  height: 50px;
}
.logo span {
  height: 60px;
  margin-left: 20px;
}
.el-input {
  padding: 10px 0;
}
.login-info {
  display: flex;
  flex-direction: row;
  justify-content: right;
}
.login-img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  padding: 10px 0;
  margin-right: 20px;
}
.login-name,
.ex-name {
  height: 60px;
  line-height: 60px;
  text-align: right;
}
.ex-name {
  cursor: pointer;
}
.el-menu-item:hover {
  background-color: rgb(91, 92, 94) !important;
}
.main {
  /* min-height: 582px; */
  min-height: calc(100vh - 166px);
}
.footer > p {
  margin: 10px 0;
}
</style>

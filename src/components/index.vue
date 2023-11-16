<template>
  <div>
    <el-container>
      <!-- 头部 -->
      <el-header style="position: fixed">
        <el-row class="theme-bg-black">
          <el-col :span="7" class="logo">
            <img src="../assets/logo.png" alt="" />
            <span class="zh-fc-white zh-fs-20"
              >易腾智慧教学-网络安全实验平台</span
            >
          </el-col>
          <el-col :span="10">
            <el-menu
              default-active="1"
              class="el-menu-demo"
              mode="horizontal"
              active-text-color="#409EFF"
              text-color="#fff"
              background-color="#212121"
              router
            >
              <el-submenu index="1">
                <template slot="title">关于我们</template>
                <el-menu-item index="1-1">公司介绍</el-menu-item>
                <el-menu-item index="1-2">版本信息</el-menu-item>
              </el-submenu>
            </el-menu>
            <div class="line"></div>
          </el-col>
          <el-col :span="5">
            <div v-if="this.$store.state.username" class="login-name zh-fc-white">{{this.$store.state.username}}</div>
            <div v-else></div>
          </el-col>
          <el-col :span="2">
            <div v-if="this.$store.state.username" class="name zh-fc-white" @click="exitLogin">退出登录</div>
            <div v-else></div>
          </el-col>
        </el-row>
      </el-header>
      <div class="main" style="padding: 60px 0 90px 0">
        <!-- 路由出口 -->
        <router-view></router-view>
      </div>
      <!-- 底部 -->
      <div class="footer theme-bg-black">
        <p class="footer-info-item zh-fc-white">
          <span>智慧教学平台</span>
          <span>智慧教学平台</span>
          <span>智慧教学平台</span>
        </p>
        <p class="footer-info-item zh-fc-white">
          <span>智慧教学平台</span>
          <span>智慧教学平台</span>
          <span>智慧教学平台</span>
        </p>
      </div>
    </el-container>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
    };
  },
  computed:{
  },
  created() {
  },
  mounted() {
    
  },
  methods: {
    exitLogin() {
      localStorage.clear("account", "username");
      this.$store.state.username = ''
      this.$router.push({
        path: "/",
        name: "login",
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
.el-row {
  width: 100%;
  height: 60px;
  padding: 0 30px;
}
.logo {
  box-sizing: border-box;
}
.logo img {
  height: 60px;
}
.logo span {
  display: inline-block;
  height: 60px;
  line-height: 60px;
  margin-left: 20px;
}
.el-input {
  padding: 10px 0;
}
.login-tx img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  padding: 10px 0;
  margin-left: 20px;
}
.login-name,.name{
  height: 60px;
  line-height: 60px;
  text-align: right;
}
.el-menu-item:hover {
  background-color: rgb(91, 92, 94) !important;
}
.footer {
  position: fixed;
  z-index: 9;
  width: 100%;
  bottom: 0;
  z-index: 99;
}
</style>

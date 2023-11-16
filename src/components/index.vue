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
          <el-col :span="12">
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
                <el-menu-item index="/companyProfile">公司介绍</el-menu-item>
                <el-menu-item index="1-2">版本信息</el-menu-item>
              </el-submenu>
            </el-menu>
            <div class="line"></div>
          </el-col>
          <el-col :span="2" class="login-tx">
            <el-menu
              class="el-menu-demo"
              mode="horizontal"
              active-text-color="#409EFF"
              text-color="#fff"
              background-color="#212121"
              router
            >
              <el-submenu index="1">
                <template slot="title">
                  <img src="../assets/tx.jpg" alt="" />
                </template>
                <el-menu-item index="1-1">修改信息</el-menu-item>
                <el-menu-item @click="exitLogin">退出登录</el-menu-item>
              </el-submenu>
            </el-menu>
          </el-col>
          <el-col :span="3" class="name zh-fc-white">
            <div v-if="username">{{username}}</div>
            <div v-else>尚未登录</div>
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
      username:'',
    };
  },
  created() {
    this.username = localStorage.getItem("username")
  },
  mounted() {
  },
  methods: {
    exitLogin() {
      localStorage.clear("account", "username");
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
.el-col {
  display: flex;
  flex-direction: row;
  align-items: center;
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
.name{
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
}
.login-tx img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  padding: 10px 0;
  margin-left: 20px;
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

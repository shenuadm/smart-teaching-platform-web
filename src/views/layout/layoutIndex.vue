<template>
  <el-container class="personalInfo warpper">
    <!-- 侧导航 -->
    <el-col :span="4" class="mr-20">
      <el-menu :default-active="$route.path" class="el-menu-vertical-demo" router :collapse="false">
        <div v-for="item in navList" :key="item.id">
          <el-menu-item v-if="item.type === '菜单'" :index="item.funurl">
            <span slot="title"><i :class="item.icon" class="iconfont mr-5"></i>{{ item.title }}</span>
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
        <div v-if="roleId === 1">
          <el-menu-item index="/aboutUS">
            <span slot="title"><i class="icon-guanyuwomen iconfont mr-5"></i>关于我们</span>
          </el-menu-item>
        </div>
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
      roleId: '',
    };
  },
  created() {
    // 从本地存储中取值
    this.navList = JSON.parse(localStorage.getItem('navData'));
    this.roleId = JSON.parse(localStorage.getItem('roleId'));
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

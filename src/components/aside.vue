<template>
  <div class="aside">
    <div class="aside-nav" v-show="isShow">
      <ul>
        <li><i class="el-icon-service"></i>在线问答</li>
        <li><i class="el-icon-s-order"></i>公告</li>
        <li><i class="el-icon-chat-line-round"></i>公众号</li>
      </ul>
      <img src="@/assets/cancel.png" alt="" class="cancel-img" @click="retract" />
    </div>
    <img src="@/assets/robot.png" alt="" class="robot-img" @click="expand" />
  </div>
</template>

<script>
export default {
  name: 'asideIndex',
  data() {
    return {
      isShow: false,
    };
  },
  methods: {
    retract() {
      this.isShow = false;
    },
    expand() {
      this.isShow = true;
    },
  },
};
</script>

<style scoped>
.aside {
  position: fixed;
  z-index: 99;
  top: 100px;
  right: 20px;
}
.robot-img {
  width: 50px;
  height: 50px;
  position: fixed;
  bottom: 130px;
  right: 20px;
  cursor: pointer;
}
.aside-nav {
  position: relative;
}
.cancel-img {
  width: 20px;
  height: 20px;
  position: absolute;
  top: -8px;
  right: -8px;
  cursor: pointer;
}
ul {
  padding: 10px 0;
  background-color: #fff;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 10px #efefef;
}
li {
  height: 50px;
  width: 70px;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  font-size: 14px;
  margin-bottom: 10px;
  cursor: pointer;
}
li:last-child {
  margin-bottom: 0;
}
i {
  font-size: 24px;
  color: #409eff;
}
</style>

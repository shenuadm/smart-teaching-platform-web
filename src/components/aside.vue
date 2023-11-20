<template>
  <div class="aside">
    <ul>
      <li><i class="el-icon-service"></i>在线问答</li>
      <li><i class="el-icon-s-order"></i>公告</li>
      <li><i class="el-icon-chat-line-round"></i>公众号</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "asideIndex",
};
</script>

<style scoped>
.aside {
  position: fixed;
  z-index: 9999;
  top: 100px;
  right: 20px;
}
ul {
  padding: 10px 0;
  background-color: #fff;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0px 2px 10px #efefef;
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

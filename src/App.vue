<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
body {
  margin: 0;
  background-color: #f8f6f6;
}
.warpper {
  width: 1300px;
  margin: 0 auto;
}
.el-button{
  font-size: 14px !important;
}
.aside-nav .aside-nav-item{
  font-weight: 700 !important;
}
</style>

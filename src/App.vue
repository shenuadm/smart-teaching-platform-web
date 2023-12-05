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
  /* width: 1300px; */
  width: 84% !important;
  margin: 0 auto;
}
.el-button {
  font-size: 14px !important;
}
.aside-nav .aside-nav-item {
  font-weight: 700 !important;
}
/* 表格树状结构按钮与表格内容同一行显示 */
.el-tooltip {
  display: flex;
  justify-content: center;
}
/* 表格树状结构展开字体图标大小保持不变 */
.el-table__expand-icon,
/* 树状结构子行不缩小 */
.el-table__placeholder {
  flex-shrink: 0;
}
/*在谷歌下移除input[number]的上下箭头*/
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none !important;
  margin: 0;
}
/*在firefox下移除input[number]的上下箭头*/
input[type='number'] {
  -moz-appearance: textfield;
}
/* element表格组件单行超出部门省略号显示 */
.el-table__cell .cell {
  overflow: hidden;
  text-overflow: ellipsis !important;
  white-space: nowrap !important;
}
</style>

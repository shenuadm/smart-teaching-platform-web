<template>
  <div id="app">
    <router-view />
  </div>
</template>

<!--suppress CssUnusedSymbol, CssUnusedSymbol, CssUnusedSymbol, CssUnusedSymbol, CssUnusedSymbol -->
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
/* 树状结构 子行不缩小 */
.el-table__placeholder {
  flex-shrink: 0;
}

/* element表格组件单行超出部门省略号显示 */
.el-table__cell .cell {
  overflow: hidden;
  text-overflow: ellipsis !important;
  white-space: nowrap !important;
}
/*表格内容标题居中 */
.el-table th.el-table__cell > .cell,
.el-table__body td.el-table__cell {
  text-align: center;
}
.el-message {
  z-index: 2500 !important;
}

.el-notification {
  z-index: 2100 !important;
}
/*弹框footer插槽恢复默认*/
.el-dialog__footer {
  text-align: right !important;
}
</style>

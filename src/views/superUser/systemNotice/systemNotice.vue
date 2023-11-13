<template>
  <div class="content">
    <div class="header">
      <div class="title">标题:</div>
      <el-input
        v-model="input"
        placeholder="请输入标题"
        class="zh-mgl-10 zh-mgr-10"
      ></el-input>
      <el-button type="primary" size="small" @click="search">搜索</el-button>
      <el-button type="primary" size="small" @click="reset">重置</el-button>
      <el-button type="primary" size="small" @click="addNotice"
        >添加公告</el-button
      >
    </div>
    <div class="table">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="title" label="标题"></el-table-column>
        <el-table-column prop="content" label="内容"></el-table-column>
        <el-table-column prop="createTime" label="创建时间"></el-table-column>
        <el-table-column prop="updateTime" label="修改时间"></el-table-column>
        <el-table-column prop="publishTime" label="发布时间"></el-table-column>
        <el-table-column prop="updateBy" label="发布人"></el-table-column>
        <el-table-column
          prop="status"
          label="公告状态"
          ref="status"
        ></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              @click="editNotice(scope.$index, scope.row)"
              >编辑</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { systemNotice } from "@/utils/api.js";
import { noticeStatus } from "@/utils/status.js";
export default {
  data() {
    return {
      input: "",
      tableData: [],
    };
  },
  mounted() {
    systemNotice().then((res) => {
      this.tableData = noticeStatus(res.data);
    });
  },
  methods: {
    // 搜索
    search() {},
    // 重置
    reset() {},
    // 添加公告
    addNotice() {},
    // 编辑公告
    editNotice(index, row) {},
  },
};
</script>

<style scoped>
.header {
  text-align: left;
}
.title {
  display: inline-block;
}
.el-input {
  width: 200px;
}
</style>
<style>
.el-input__inner {
  height: 33px;
}
.el-button--primary {
  color: #fff;
  background-color: #409eff !important;
  border-color: #409eff !important;
}
.el-button--primary:hover {
  background-color: #7ebbf8;
  border-color: #7ebbf8;
}
</style>
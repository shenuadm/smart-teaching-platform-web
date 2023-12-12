<template>
  <div class="content">
    <div class="header">
      <div class="title">标题:</div>
      <el-input v-model="input" placeholder="请输入标题" class="ml-10 mr-10"></el-input>
      <el-button type="primary" size="small" @click="search">搜索</el-button>
      <el-button type="primary" size="small" @click="reset">重置</el-button>
      <el-button type="primary" size="small" @click="addNotice">添加公告</el-button>
    </div>
    <div class="table">
      <el-table :data="tableData" style="width: 100%" border v-loading="$store.state.isLoading">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="title" label="标题"></el-table-column>
        <el-table-column prop="content" label="内容"></el-table-column>
        <el-table-column prop="publishTime" label="发布时间"></el-table-column>
        <el-table-column prop="updateBy" label="发布人"></el-table-column>
        <el-table-column prop="status" label="公告状态" ref="status">
          <template slot-scope="scope">
            {{ statusConvent(scope.row.status) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="editNotice(scope.row)">编辑</el-button>
            <el-button type="danger" size="mini" @click="deleteNotice(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 编辑弹框 -->
    <EditForm v-if="editVisible" :editForm="editForm" @getData="getData"></EditForm>
    <!-- 新增弹框 -->
    <NewForm v-if="newVisible" @getData="getData"></NewForm>
  </div>
</template>

<script>
import { systemNotice, deleteNotice } from '@/utils/api.js';
import { noticeStatus } from '@/constant/status.js';
import EditForm from './components/EditForm.vue';
import NewForm from './components/NewForm.vue';
import Bus from '@/utils/eventBus';
export default {
  data() {
    return {
      input: '',
      tableData: [], // 渲染数据
      editForm: {}, // 编辑的内容
      editVisible: false, // 编辑弹框
      newVisible: false, // 新增弹框
    };
  },
  mounted() {
    this.getData();
    // 监听弹框关闭事件
    Bus.$on('clearDialog', () => {
      this.editVisible = false;
      this.newVisible = false;
    });
  },
  methods: {
    // 获取数据
    async getData() {
      const res = await systemNotice();
      this.tableData = res.data;
      console.log(this.tableData);
    },
    //
    statusConvent(status) {
      return noticeStatus.get(status);
    },
    // 搜索
    search() {},
    // 重置
    reset() {},
    // 添加公告
    addNotice() {
      this.newVisible = true;
    },
    // 编辑公告
    editNotice(row) {
      this.editVisible = true;
      this.editForm = row;
    },
    // 删除公告
    deleteNotice({ id }) {
      this.$confirm('您确认要删除该公告吗？')
        .then(async () => {
          await deleteNotice(id);
          this.$message.success('删除成功');
          // 根据id找到索引，并将其从页面数据中删除
          const index = this.tableData.findIndex((item) => item.id === id);
          this.tableData.splice(index, 1);
        })
        .catch(() => {});
    },
  },
  components: {
    EditForm,
    NewForm,
  },
  provide() {
    return { editForm: this.editForm };
  },
  // provide:
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
.table {
  margin-top: 20px;
}
</style>

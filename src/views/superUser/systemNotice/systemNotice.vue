<template>
  <div class="content">
    <div class="header">
      <div class="title">标题:</div>
      <el-input v-model="input" placeholder="请输入标题" class="ml-10 mr-10"></el-input>
      <el-button type="primary" size="small" @click="search">搜索</el-button>
      <el-button type="primary" size="small" @click="reset">重置</el-button>
      <el-button type="primary" size="small" @click="addNotice">添加通知</el-button>
      <el-button type="danger" size="small" @click="deletesNotice">批量删除</el-button>
    </div>
    <div class="table">
      <el-table
        :data="tableData"
        style="width: 100%"
        border
        v-loading="$store.state.isLoading"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="title" label="标题"></el-table-column>
        <el-table-column prop="content" label="内容"></el-table-column>
        <el-table-column prop="" label="发布时间">
          <template #default="{ row}">
            {{ row.publishTime !== null ? dateToSecond(row.publishTime) : '' }}
          </template>
        </el-table-column>
        <el-table-column prop="publishBy" label="发布人"></el-table-column>
        <el-table-column prop="status" label="状态" ref="status" width="80">
          <template #default="{ row }">
            {{ row.status | statusConvent }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button type="primary" size="mini" @click="editNotice(scope.row)">编辑</el-button>
            <el-button type="danger" size="mini" @click="deleteNotice(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-pagination
      :total="total"
      :current-page="page"
      :page-size="10"
      @current-change="getData"
      layout="total, prev, pager, next, jumper"
      :hide-on-single-page="total <= 10"
    ></el-pagination>
    <!-- 编辑弹框 -->
    <EditForm :visible.sync="editVisible" :editForm="editForm" @getData="getData"></EditForm>
    <!-- 新增弹框 -->
    <NewForm :visible.sync="newVisible" @getData="getData"></NewForm>
  </div>
</template>

<script>
import { getSystemNoticeService, deleteSystemNoticeService, deletesSystemNoticeService } from '@/api/notice.js';
import { noticeStatus } from '@/constant/status.js';
import EditForm from './components/EditForm.vue';
import NewForm from './components/NewForm.vue';
import Bus from '@/utils/eventBus';
import { dateToSecond } from '@/utils/date';

export default {
  data() {
    return {
      searchInfo: '', // 实际搜索信息
      tableData: [], // 渲染数据
      editForm: {}, // 编辑的内容
      editVisible: false, // 编辑弹框
      newVisible: false, // 新增弹框
      total: 0,
      page: 1,
      input: '', // 显示的input信息
      selectList: [], // 选中的通知列表
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
      const data = { page: this.page };
      this.searchInfo !== '' && Object.assign(data, { title: this.searchInfo });
      const res = await getSystemNoticeService(data);
      this.tableData = res.data;
      this.total = res.count;
    },
    // 搜索
    search() {
      if (this.input === '') return this.$message.warning('请输入查询信息后再搜索');
      this.page = 1;
      this.searchInfo = this.input;
      this.getData();
    },
    // 重置
    reset() {
      this.page = 1;
      this.searchInfo = '';
      this.input = '';
      this.getData();
    },
    // 添加通知
    addNotice() {
      this.newVisible = true;
    },
    // 编辑通知
    editNotice(row) {
      this.editVisible = true;
      this.editForm = row;
    },
    // 选择事件
    handleSelectionChange(data) {
      this.selectList = data.map((item) => item.id);
    },
    // 批量删除
    deletesNotice() {
      console.log(this.selectList);
      if (this.selectList.length === 0) return this.$message.warning('请选择通知后再进行删除');
      this.$confirm('你确认要删除选中的通知吗', '提示', { type: 'warning' })
        .then(async () => {
          await deletesSystemNoticeService(this.selectList);
          this.$message.success('删除通知成功');
          this.getData();
        })
        .catch(() => {});
    },
    // 删除通知
    deleteNotice({ id }) {
      this.$confirm('您确认要删除该通知吗？', '提示', { type: 'warning' })
        .then(async () => {
          await deleteSystemNoticeService(id);
          this.$message.success('删除成功');
          this.getData();
        })
        .catch(() => {});
    },
    dateToSecond,
  },
  filters: {
    //状态数据展示
    statusConvent(status) {
      return noticeStatus.get(status);
    },
  },
  components: {
    EditForm,
    NewForm,
  },
  provide() {
    return { editForm: this.editForm };
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
.table {
  margin-top: 20px;
}
</style>

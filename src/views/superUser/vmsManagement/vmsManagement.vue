<template>
  <div>
    <div class="header">
      <div class="title">账号：</div>
      <div class="search">
        <el-input v-model="searchInfo" placeholder="请输入虚拟机账号"></el-input>
      </div>
      <el-button type="primary" size="small" @click="search">搜素</el-button>
      <el-button type="primary" size="small" @click="reset">重置</el-button>
      <el-button type="primary" size="small" @click="addVm">添加</el-button>
      <el-button type="primary" size="small" @click="goManage">进入虚拟机管理门户</el-button>
    </div>
    <div class="table">
      <el-table :data="tableData" border v-loading="$store.state.isLoading">
        <el-table-column label="名称" prop="name"></el-table-column>
        <el-table-column label="登录账号" prop="username"></el-table-column>
        <el-table-column label="密码" prop="pwd"></el-table-column>
        <el-table-column label="操作" width="250">
          <template #default="{ row }">
            <el-button size="small" type="primary" @click="editVm(row)">编辑</el-button>
            <el-button size="small" type="danger" @click="delVm(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-pagination
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-size="pageSize"
      layout="total, prev, pager, next, jumper"
      :total="total"
      :hide-on-single-page="total <= 10">
    </el-pagination>
    <EditVm v-if="editVisible" @getData="handleCurrentChange" :editForm="editForm"></EditVm>
    <NewVm v-if="newVisible" @getData="handleCurrentChange"></NewVm>
  </div>
</template>

<script>
import Bus from '@/utils/eventBus';
import EditVm from './components/EditVm.vue';
import NewVm from './components/NewVm.vue';
import { getVmDataService, deleteVmService } from '@/api/vm.js';

export default {
  data() {
    return {
      tableData: [],
      searchInfo: '', // 搜索条件
      total: 0, // 总数
      currentPage: 1, // 当前页
      pageSize: 10, // 每页数量
      editVisible: false, // 编辑弹框
      newVisible: false, // 新增弹框
      editForm: {}, // 修改的数据
    };
  },
  methods: {
    // 搜索
    search() {},
    // 重置搜索
    reset() {
      this.handleCurrentChange();
    },
    addVm() {
      this.newVisible = true;
    },
    // 页数改变，获取数据
    async handleCurrentChange() {
      const res = await getVmDataService({ page: this.currentPage });
      this.tableData = res.data.data;
      this.total = res.data.count;
    },
    // 删除虚拟机
    delVm({ id }) {
      this.$confirm('您确认要删除该虚拟机吗', '删除')
        .then(async () => {
          await deleteVmService(id);
          await this.handleCurrentChange();
          this.$message.success('删除虚拟机成功');
        })
        .catch(() => {});
    },
    // 编辑虚拟机
    editVm(row) {
      this.editForm = row;
      this.editVisible = true;
    },
    goManage() {
      window.open('https://engine443.com/ovirt-engine/webadmin/?locale=zh_CN');
    },
  },
  mounted() {
    this.handleCurrentChange();
    Bus.$on('vmClear', () => {
      this.editVisible = false;
      this.newVisible = false;
    });
  },
  components: { EditVm, NewVm },
};
</script>

<style scoped>
.header {
  display: flex;
  align-items: center;
}
.search {
  width: 200px;
  margin-right: 10px;
}
.title {
  width: 50px;
}
.table {
  margin-top: 20px;
  margin-bottom: 20px;
}
</style>

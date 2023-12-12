<template>
  <div>
    <SystemHeader :title="'班级'" :backTitle="'年级'" @getData="getData" @add="addClass"></SystemHeader>
    <el-table :data="tableData" v-loading="$store.state.isLoading">
      <el-table-column label="班级名称" prop="name"></el-table-column>
      <el-table-column label="班级状态">
        <template slot-scope="{ row }"> {{ systemSettingStatus.get(+row.status) }}</template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="{ row }">
          <el-button type="primary" @click="editClass(row)">编辑</el-button>
          <el-button type="danger" @click="deleteClass(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <ClassDialog :visible.sync="visible" @success="getData" :editData="editData"></ClassDialog>
  </div>
</template>

<script>
import { getClassService, deleteClasService } from '@/api/systemSetting.js';
import { systemSettingStatus } from '@/constant/status.js';
import ClassDialog from './components/ClassDialog.vue';
import SystemHeader from '../components/SystemHeader.vue';

export default {
  data() {
    return {
      tableData: [], // 页面数据
      editData: {}, // 编辑的信息
      visible: false, // 弹框状态
      systemSettingStatus,
    };
  },
  methods: {
    async getData({ searchInfo, searchStatus }) {
      const data = {};
      searchInfo !== '' && Object.assign(data, { name: searchInfo });
      searchStatus !== '' && Object.assign(data, { status: searchStatus });
      const res = await getClassService(data);
      this.tableData = res.data;
    },
    editClass(row) {
      this.editData = row;
      this.visible = true;
    },
    deleteClass({ id }) {
      this.$confirm('您确认要删除该班级吗', '提示', { type: 'warning' })
        .then(async () => {
          await deleteClasService(id);
          this.$message.success('删除班级成功');
          this.getData();
        })
        .catch(() => {});
    },
    addClass() {
      this.editData = {};
      this.visible = true;
    },
  },
  created() {
    this.getData({});
  },
  components: {
    ClassDialog,
    SystemHeader,
  },
};
</script>

<style scoped>
.title {
  width: 100px;
}
.header {
  align-items: center;
  margin-bottom: 20px;
}
</style>

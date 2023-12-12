<template>
  <div>
    <SystemHeader :title="'专业'" @getData="getData" @add="addMajor"></SystemHeader>
    <el-table :data="tableData" v-loading="$store.state.isLoading">
      <el-table-column label="专业名称" prop="name"></el-table-column>
      <el-table-column label="专业状态">
        <template slot-scope="{ row }"> {{ systemSettingStatus.get(+row.status) }}</template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="{ row }">
          <el-button type="primary" @click="editMajor(row)">编辑</el-button>
          <el-button type="danger" @click="deleteMajor(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <MajorDialog :visible.sync="visible" @success="getData" :editData="editData"></MajorDialog>
  </div>
</template>

<script>
import { getMajorService, deleteMajorService } from '@/api/systemSetting.js';
import MajorDialog from './components/MajorDialog.vue';
import { systemSettingStatus } from '@/constant/status.js';
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
      const res = await getMajorService(data);
      this.tableData = res.data;
    },
    editMajor(row) {
      this.editData = row;
      this.visible = true;
    },
    deleteMajor({ id }) {
      this.$confirm('您确认要删除该专业吗', '提示', { type: 'warning' })
        .then(async () => {
          await deleteMajorService(id);
          this.$message.success('删除专业成功');
          this.getData();
        })
        .catch(() => {});
    },
    addMajor() {
      this.editData = {};
      this.visible = true;
    },
  },
  created() {
    this.getData({});
  },
  components: {
    MajorDialog,
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

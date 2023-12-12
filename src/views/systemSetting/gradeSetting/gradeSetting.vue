<template>
  <div>
    <SystemHeader :title="'年级'" @getData="getData" @add="addGrade" :backTitle="'专业'"></SystemHeader>
    <el-table :data="tableData" v-loading="$store.state.isLoading">
      <el-table-column label="年级名称" prop="name"></el-table-column>
      <el-table-column label="年级状态">
        <template slot-scope="{ row }"> {{ systemSettingStatus.get(+row.status) }}</template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="{ row }">
          <el-button type="primary" @click="editGrade(row)">编辑</el-button>
          <el-button type="danger" @click="deleteGrade(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <GradeDialog :visible.sync="visible" @success="getData" :editData="editData"></GradeDialog>
  </div>
</template>

<script>
import { getGradeService, deleteGradeService } from '@/api/systemSetting.js';
import { systemSettingStatus } from '@/constant/status.js';
import GradeDialog from './components/GradeDialog.vue';
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
      const res = await getGradeService(data);
      this.tableData = res.data;
    },
    editGrade(row) {
      this.editData = row;
      this.visible = true;
    },
    deleteGrade({ id }) {
      this.$confirm('您确认要删除该年级吗', '提示', { type: 'warning' })
        .then(async () => {
          await deleteGradeService(id);
          this.$message.success('删除年级成功');
          this.getData();
        })
        .catch(() => {});
    },
    addGrade() {
      this.editData = {};
      this.visible = true;
    },
  },
  created() {
    this.getData({});
  },
  components: {
    GradeDialog,
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

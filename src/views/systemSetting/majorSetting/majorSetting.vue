<template>
  <div>
    <SystemHeader :title="'专业'" @getData="getData" @add="addMajor"></SystemHeader>
    <el-table :data="tableData" v-loading="$store.state.isLoading" border>
      <el-table-column label="专业名称" prop="name"></el-table-column>
      <el-table-column label="专业状态">
        <template slot-scope="{ row }"> {{ systemSettingStatus.get(+row.status) }}</template>
      </el-table-column>
      <el-table-column label="操作" width="300px">
        <template slot-scope="{ row }">
          <el-button size="small" type="primary" @click="goGrade(row)">年级管理</el-button>
          <el-button size="small" type="primary" @click="editMajor(row)">编辑</el-button>
          <el-button size="small" type="danger" @click="deleteMajor(row)">删除</el-button>
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
    // 获取专业数据
    async getData({ searchInfo, searchStatus }) {
      const data = {};
      searchInfo !== '' && Object.assign(data, { name: searchInfo });
      searchStatus !== '' && Object.assign(data, { status: searchStatus });
      const res = await getMajorService(data);
      this.tableData = res.data;
    },
    // 编辑专业
    editMajor(row) {
      this.editData = row;
      this.visible = true;
    },
    // 删除专业
    deleteMajor({ id }) {
      this.$confirm('删除该专业将会删除该专业下的所有年级和班级，您确认要删除吗', '提示', { type: 'warning' })
        .then(async () => {
          await deleteMajorService(id);
          this.$message.success('删除专业成功');
          this.getData();
        })
        .catch(() => {});
    },
    // 新增专业
    addMajor() {
      this.editData = {};
      this.visible = true;
    },
    // 查看年级
    goGrade({ id, name }) {
      this.$router.push(`/grade/${id}?name=${name}`);
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

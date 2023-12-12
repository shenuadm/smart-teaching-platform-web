<template>
  <div>
    <SystemHeader :title="'年级'" @getData="getData" @add="addGrade" :backTitle="'专业'" border></SystemHeader>
    <el-table :data="tableData" v-loading="$store.state.isLoading">
      <el-table-column label="年级名称" prop="name"></el-table-column>
      <el-table-column label="年级状态">
        <template slot-scope="{ row }"> {{ systemSettingStatus.get(+row.status) }}</template>
      </el-table-column>
      <el-table-column label="操作" width="300px">
        <template slot-scope="{ row }">
          <el-button size="small" type="primary" @click="goClass(row)">班级管理</el-button>
          <el-button size="small" type="primary" @click="editGrade(row)">编辑</el-button>
          <el-button size="small" type="danger" @click="deleteGrade(row)">删除</el-button>
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
    // 获取年级数据
    // async getData({ searchInfo, searchStatus }) {
    // const data = {};
    // searchInfo !== '' && Object.assign(data, { name: searchInfo });
    // searchStatus !== '' && Object.assign(data, { status: searchStatus });
    // const res = await getGradeService(data);
    async getData() {
      const res = await getGradeService(this.$route.params.id);
      this.tableData = res.data;
    },
    // 编辑年级
    editGrade(row) {
      this.editData = row;
      this.visible = true;
    },
    // 删除年级
    deleteGrade({ id }) {
      this.$confirm('删除该年级将会删除该年级下的所有班级，您确认要删除吗', '提示', { type: 'warning' })
        .then(async () => {
          await deleteGradeService(id);
          this.$message.success('删除年级成功');
          this.getData();
        })
        .catch(() => {});
    },
    // 新增年级
    addGrade() {
      this.editData = { majorId: this.$route.params.id };
      this.visible = true;
    },
    // 管理班级
    goClass({ id, name }) {
      this.$router.push(`/clazz/${id}?name=${name}`);
    },
  },
  created() {
    this.getData();
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

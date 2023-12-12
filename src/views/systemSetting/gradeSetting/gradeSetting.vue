<template>
  <div>
    <div class="flex header">
      <div class="title">年级名称：</div>
      <el-input
        v-model="searchInfo"
        @keydown.enter="search"
        placeholder="请输入年级名称"
        style="width: 200px"
        @click="search"
      ></el-input>
      <div class="title">年级状态：</div>
      <el-select v-model="searchStatus" placeholder="请选择您要搜索的年级状态" clearable>
        <el-option v-for="item in systemSettingStatus" :key="item[0]" :label="item[1]" :value="item[0]"></el-option>
      </el-select>
      <el-button size="small" type="primary" class="ml-10" @click="search">搜索</el-button>
      <el-button size="small" type="primary" @click="reset">重置</el-button>
      <el-button size="small" type="primary" @click="addMajor">新增年级</el-button>
    </div>
    <el-table :data="tableData" v-loading="$store.state.isLoading">
      <el-table-column label="年级名称" prop="name"></el-table-column>
      <el-table-column label="年级状态">
        <template slot-scope="{ row }"> {{ systemSettingStatus.get(+row.status) }}</template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="{ row }">
          <el-button type="primary" @click="editMajor(row)">编辑</el-button>
          <el-button type="danger" @click="deleteMajor(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @current-change="getData"
      :current-page.sync="page"
      :page-size="10"
      layout="total, prev, pager, next, jumper"
      :total="total"
      :hide-on-single-page="total <= 10"
    >
    </el-pagination>
    <GradeDialog :visible.sync="visible" @success="getData" :editData="editData"></GradeDialog>
  </div>
</template>

<script>
import { getGradeService, deleteGradeService } from '@/api/systemSetting.js';
import { systemSettingStatus } from '@/constant/status.js';
import GradeDialog from './components/GradeDialog.vue';

export default {
  data() {
    return {
      tableData: [], // 页面数据
      searchInfo: '', // 搜索信息
      editData: {}, // 编辑的信息
      visible: false, // 弹框状态
      page: 1, // 当前页
      total: 0, // 总数
      searchStatus: '', // 搜索的年级状态
      systemSettingStatus,
    };
  },
  methods: {
    // 搜索
    search() {
      if (this.searchInfo === '' && this.searchStatus === '') return this.$message.warning('请输入年级名称再搜索');
      this.page = 1;
      this.getData();
    },
    async getData() {
      const data = { page: this.page };
      this.searchInfo !== '' && Object.assign(data, { name: this.searchInfo });
      this.searchStatus !== '' && Object.assign(data, { status: this.searchStatus });
      const res = await getGradeService(data);
      this.tableData = res.data;
      this.total = res.count;
    },
    reset() {
      this.searchInfo = '';
      this.searchStatus = '';
      this.page = 1;
      this.getData();
    },
    editMajor(row) {
      this.editData = row;
      this.visible = true;
    },
    deleteMajor({ id }) {
      this.$confirm('您确认要删除该年级吗', '提示', { type: 'warning' })
        .then(async () => {
          await deleteGradeService(id);
          this.$message.success('删除年级成功');
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
    this.getData();
  },
  components: {
    GradeDialog,
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

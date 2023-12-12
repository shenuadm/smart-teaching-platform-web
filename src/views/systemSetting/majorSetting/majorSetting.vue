<template>
  <div>
    <div class="flex header">
      <div class="title">专业名称：</div>
      <el-input
        v-model="searchInfo"
        @keydown.enter="search"
        placeholder="请输入专业名称"
        style="width: 200px"
        @click="search"
      ></el-input>
      <div class="title">专业状态：</div>
      <el-select v-model="searchStatus" placeholder="请选择您要搜索的专业状态" clearable>
        <el-option v-for="item in systemSettingStatus" :key="item[0]" :label="item[1]" :value="item[0]"></el-option>
      </el-select>
      <el-button size="small" type="primary" class="ml-10" @click="search">搜索</el-button>
      <el-button size="small" type="primary" @click="reset">重置</el-button>
      <el-button size="small" type="primary" @click="addMajor">新增专业</el-button>
    </div>
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
    <el-pagination
      @current-change="getData"
      :current-page.sync="page"
      :page-size="10"
      layout="total, prev, pager, next, jumper"
      :total="total"
      :hide-on-single-page="total <= 10"
    >
    </el-pagination>
    <MajorDialog :visible.sync="visible" @success="getData" :editData="editData"></MajorDialog>
  </div>
</template>

<script>
import { getMajorService, deleteMajorService } from '@/api/systemSetting.js';
import MajorDialog from './components/MajorDialog.vue';
import { systemSettingStatus } from '@/constant/status.js';

export default {
  data() {
    return {
      tableData: [], // 页面数据
      searchInfo: '', // 搜索信息
      editData: {}, // 编辑的信息
      visible: false, // 弹框状态
      page: 1, // 当前页
      total: 0, // 总数
      searchStatus: '', // 搜索的专业状态
      systemSettingStatus,
    };
  },
  methods: {
    // 搜索
    search() {
      if (this.searchInfo === '' && this.searchStatus === '') return this.$message.warning('请输入专业名称再搜索');
      this.page = 1;
      this.getData();
    },
    async getData() {
      const data = { page: this.page };
      this.searchInfo !== '' && Object.assign(data, { name: this.searchInfo });
      this.searchStatus !== '' && Object.assign(data, { status: this.searchStatus });
      const res = await getMajorService(data);
      this.tableData = res.data;
      this.total = res.count;
      console.log(res);
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
    this.getData();
  },
  components: {
    MajorDialog,
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

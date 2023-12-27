<template>
  <div>
    <div class="flex align-center mb-10 gap-10">
      <div class="flex-shark-0">账户：</div>
      <el-input placeholder="请输入用户账户" v-model="searchInput.account" size="small"></el-input>
      <div class="flex-shark-0">IP：</div>
      <el-input placeholder="请输入IP地址" v-model="searchInput.ip" size="small"></el-input>
      <div class="flex-shark-0">标题：</div>
      <el-input placeholder="请输入日志信息" v-model="searchInput.message" size="small"></el-input>
      <div class="flex-shark-0">类型：</div>
      <el-select v-model="searchInput.operation" style="width: 100%" size="small" placeholder="请输入操作类型">
        <el-option v-for="item in actionType" :key="item" :label="item" :value="item"></el-option>
      </el-select>
      <el-button size="small" type="primary" @click="search">搜索</el-button>
      <el-button size="small" type="primary" @click="reset">重置</el-button>
    </div>
    <div class="flex text-initial mb-10 gap-10">
      <el-button size="small" type="danger" @click="deleteLogs">批量删除</el-button>
      <el-date-picker
        size="small"
        v-model="deleteTime"
        type="datetimerange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期">
      </el-date-picker>
      <el-button size="small" @click="deleteByTime" type="danger">按时间删除</el-button>
    </div>
    <el-table :data="tableData" border v-loading="$store.state.isLoading" @selection-change="selectLog" ref="tableRef">
      <el-table-column type="selection" width="50"></el-table-column>
      <el-table-column label="时间">
        <template #default="{ row }">{{ dateToSecond(row.createTime) }}</template>
      </el-table-column>
      <el-table-column label="账户" prop="account"></el-table-column>
      <el-table-column label="ip地址" prop="ip"></el-table-column>
      <el-table-column label="信息" prop="message"></el-table-column>
      <el-table-column label="类型" prop="operation"></el-table-column>
      <el-table-column label="耗时(ms)" prop="totalTime"></el-table-column>
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button size="medium" type="primary" @click="getDetail(row.id)">详情</el-button>
          <el-button size="medium" type="danger" @click="deleteLog(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :total="total"
      :page-size="10"
      :current-page="page"
      @current-change="getData"
      layout="total, prev, pager, next, jumper"
      :hide-on-single-page="total <= 10"></el-pagination>
    <LogDetail :visible.sync="visible" :id="id"></LogDetail>
  </div>
</template>

<script>
import { getSearchInfo } from '@/utils';
import { deleteLogByTimeService, deleteLogService, deleteLogsService, getLogService } from '@/api/log';
import { dateToSecond } from '@/utils/date';
import LogDetail from '@/views/superUser/logManagement/components/LogDetail.vue';
import { actionType } from '@/constant/log';

const defaultSearch = {
  account: '',
  ip: '',
  message: '',
  operation: '',
};

export default {
  data() {
    return {
      tableData: [],
      searchInput: { ...defaultSearch },
      searchInfo: {},
      total: 0,
      page: 1,
      selectList: [],
      deleteTime: '',
      visible: false,
      id: 0,
      actionType,
    };
  },
  methods: {
    async getData() {
      const params = getSearchInfo({ ...this.searchInfo, page: this.page });
      const { data, count } = await getLogService(params);
      this.selectList = [];
      this.$refs.tableRef.clearSelection();
      this.tableData = data;
      this.total = count;
    },
    search() {
      if (Reflect.ownKeys(this.searchInput).length === 0) return this.$message.warning('请输入搜索条件');
      this.searchInfo = this.searchInput;
      this.page = 1;
      this.getData();
    },
    reset() {
      if (Object.values(getSearchInfo(this.searchInfo)).length === 0) return false;
      this.page = 1;
      this.searchInfo = { ...defaultSearch };
      this.searchInput = { ...defaultSearch };
      this.getData();
    },
    deleteLog(id) {
      this.$confirm('是否要删除当前该日志?', '提示', { type: 'warning' }).then(async () => {
        await deleteLogService(id);
        this.$message.success('删除日志成功');
        this.getData();
      });
    },
    selectLog(data) {
      this.selectList = data.map((item) => item.id);
    },
    deleteLogs() {
      if (this.selectList.length === 0) return this.message.warning('请选择要删除的日志');
      this.$confirm('是否要删除当前选中的日志?', '提示', { type: 'warning' }).then(async () => {
        await deleteLogsService(this.selectList);
        this.$message.success('删除日志成功');
        this.getData();
      });
    },
    getDetail(id) {
      this.id = id;
      this.visible = true;
    },
    deleteByTime() {
      if (this.deleteTime.length !== 2) return this.$message.warning('请选择删除时间');
      this.$confirm('是否要删除当前选中时间范围内的日志?', '提示', { type: 'warning' }).then(async () => {
        // const startTime = dateToSecond(this.deleteTime[0]);
        // const endTime = dateToSecond(this.deleteTime[1]);
        await deleteLogByTimeService(dateToSecond(this.deleteTime[0]), dateToSecond(this.deleteTime[1]));
        // await deleteLogByTimeService(startTime, endTime);
        this.$message.success('删除日志成功');
        this.deleteTime = [];
        this.getData();
      });
    },
    dateToSecond,
  },
  components: { LogDetail },
  mounted() {
    this.getData();
  },
};
</script>

<style scoped></style>

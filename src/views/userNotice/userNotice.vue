<template>
  <div>
    <el-table :data="noticeData" border v-loading="$store.state.isLoading" style="width: 100%">
      <el-table-column label="标题" prop="title"></el-table-column>
      <el-table-column label="发布时间">
        <template slot-scope="{ row }">{{ dateToSecond(row.publishTime) }}</template>
      </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="{ row }">{{ row.read ? '已读' : '未读' }}</template>
      </el-table-column>
      <el-table-column label="操作" width="100">
        <template slot-scope="{ row }">
          <el-button type="primary" size="small" @click="readDetail(row.id)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :total="total"
      :current-page="page"
      :page-size="10"
      @current-change="getData"
      layout="total, prev, pager, next, jumper"
      :hide-on-single-page="total <= 10"
    ></el-pagination>
  </div>
</template>

<script>
import { getNoticeService, readNoticeService } from '@/api/notice.js';
import { dateToSecond } from '@/utils/date.js';

export default {
  data() {
    return {
      noticeData: [],
      page: 1,
      total: 0,
    };
  },
  methods: {
    // 获取数据
    async getData() {
      const res = await getNoticeService({ page: this.page });
      // 为每项数据添加是否展示字段
      this.noticeData = res.data.map((item) => ({ ...item, show: false }));
      this.total = res.count;
    },
    // 查看通知
    async readDetail(id) {
      const item = this.noticeData.find((item) => item.id === id); // 当前查看项
      if (item.show) return; // 是展示状态就返回
      const res = await readNoticeService(id);
      if (!item.read) {
        this.$store.dispatch('getUnreadNotice'); // 如果是没有读过的状态更新未读通知数
        item.read = true;
      }
      item.show = true;
      const { title, content } = res.data;
      this.$notify.info({
        title,
        message: content,
        duration: 0,
        onClose: () => (item.show = false),
      });
    },
    dateToSecond,
  },
  mounted() {
    this.getData();
  },
};
</script>

<style></style>

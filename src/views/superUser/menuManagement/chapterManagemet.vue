<template>
  <div class="chapter-management">
    <div class="header">
      <!--      <el-button type="primary" size="small" @click="addchapter">添加章</el-button>-->
      <el-button type="primary" size="small" @click="add">添加章</el-button>
      <el-button type="primary" size="small" @click="returncourse">返回课程</el-button>
    </div>
    <!-- 表格数据 -->
    <el-table
      border
      v-loading="$store.state.isLoading"
      :data="tableData"
      style="width: 100%; margin-bottom: 20px"
      row-key="id"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }">
      <el-table-column
        prop="name"
        label="章节标题"
        width="300"
        show-overflow-tooltip
        class-name="chapter-management-tree">
        <template #default="{ row }">
          <div class="ellipsis">{{ row.order }}：{{ row.title }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="classHour" label="课时" width="50"> </el-table-column>
      <el-table-column prop="sort" label="排序" width="50"> </el-table-column>
      <el-table-column prop="fileUrl" label="课件" width="100">
        <template #default="{ row }">
          <a href="javascript:void(0);" @click="goPdf(row.fileUrl)" v-if="row.fileUrl">查看课件</a>
        </template>
      </el-table-column>
      <el-table-column prop="description" label="描述"> </el-table-column>
      <el-table-column label="操作" width="370px">
        <template #default="{ row }">
          <!--          <el-button v-if="!row.pid" type="primary" @click="addchapterji(row.id)" size="mini">添加节</el-button>-->
          <el-button v-if="!row.pid" type="primary" @click="add(row)" size="mini">添加节</el-button>
          <el-button v-if="row.pid" type="primary" @click="homework(row.id)" size="mini">作业管理</el-button>
          <el-button v-if="row.pid" type="primary" @click="exper(row.id)" size="mini">实验管理</el-button>
          <!--          <el-button type="primary" size="mini" @click="revisechapter(row)">修改</el-button>-->
          <el-button type="primary" size="mini" @click="edit(row)">修改</el-button>
          <el-button type="danger" size="mini" @click="deletechapter(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <EditChapter :visible.sync="visible" :edit-data="editData" @success="getData"></EditChapter>
  </div>
</template>

<script>
import EditChapter from '@/views/superUser/menuManagement/components/EditChapter.vue';
import { deleteChapterService, getChapterService } from '@/api/courseManage';

export default {
  data() {
    return {
      tableData: [], // 章节数据
      visible: false, // 弹框状态
      editData: {}, // 当前编辑的数据
    };
  },
  methods: {
    // 查看pdf
    goPdf(url) {
      window.open(`${window.location.origin}/#/pdf?url=${url}`);
      // window.open(`${window.location.origin}/#/pdf?url=/static/test.pdf`);
    },
    // 新增章节
    add({ id }) {
      const pid = id || 0;
      this.visible = true;
      this.editData = { pid };
    },
    // 编辑章节
    edit(row) {
      const { id, title, classHour, sort, description, fileUrl, pid = 0 } = row;
      this.editData = { id, title, classHour, sort, description, fileUrl, pid };
      this.visible = true;
    },
    //实验管理
    exper(id) {
      this.$router.push({
        path: '/experManagemet',
        query: { id },
      });
    },
    //作业管理
    homework(id) {
      this.$router.push({
        path: '/homeworkManagement',
        query: { id },
      });
    },
    //删除章节
    deletechapter(id) {
      this.$confirm('您确认要删除该章节吗?', '提示', { type: 'warning' })
        .then(async () => {
          await deleteChapterService(id);
          this.$message.success('删除成功');
          this.getData();
        })
        .catch(() => {});
    },
    //返回课程
    returncourse() {
      history.back();
    },
    // 获取数据
    async getData() {
      const { data } = await getChapterService(this.$route.query.id);
      data.forEach((item, index) => {
        item.order = `第${index + 1}章`;
        item.children && item.children.forEach((it, idx) => (it.order = `第${idx + 1}节`));
      });
      this.tableData = data;
    },
  },
  created() {
    this.getData();
  },
  components: {
    EditChapter,
  },
};
</script>

<!--suppress CssUnusedSymbol -->
<style>
.el-input-group__prepend {
  width: 65px;
}

/* 章节标题靠左显示 */
.chapter-management .el-tooltip {
  justify-content: initial;
}
/* 没有子元素的标题隔出空隙 */
.chapter-management .el-tooltip:not(:has(.el-table__expand-icon)) {
  margin-left: 20px;
}
</style>
<style scoped>
a {
  color: #606266;
}

.header {
  display: flex;
  margin-bottom: 10px;
  align-items: center;
}

span {
  position: relative;
  left: -100px;
}
</style>

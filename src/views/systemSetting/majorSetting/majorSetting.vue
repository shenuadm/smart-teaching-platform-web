<template>
  <div class="system-manage">
    <el-row class="title">
      <el-col :span="10">
        <span>名称</span>
      </el-col>
      <el-col :span="4">
        <span>状态</span>
      </el-col>
      <el-col :span="10">
        <span>操作</span>
      </el-col>
    </el-row>
    <el-tree :data="treeData" node-key="id" accordion :expand-on-click-node="false" :props="props" style="width: 100%">
      <template slot-scope="{ node }">
        <el-row class="tree-list">
          <el-col :span="10">{{ node.data.name }}</el-col>
          <el-col :span="4">{{ systemSettingStatus.get(+node.data.status) }}</el-col>
          <el-col :span="10">
            <el-button size="small" type="primary" @click="editMajor(node)">编辑</el-button>
            <el-button size="small" type="danger" @click="deleteMajor(node)">删除</el-button>
          </el-col>
        </el-row>
      </template>
    </el-tree>

    <!-- <el-table
      :data="treeData"
      border
      style="width: 100%"
      row-key="id"
      default-expand-all
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      <el-table-column label="名称" prop="name"></el-table-column>
      <el-table-column label="状态" prop="status">
        <template slot-scope="{ row }">{{ systemSettingStatus.get(+row.status) }}</template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="{ row }">
          <el-button size="small" type="primary" @click="editMajor(row)">编辑</el-button>
          <el-button size="small" type="danger" @click="deleteMajor(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table> -->
    <GradeDialog :visible.sync="gradeVisible" @success="getData" :editData="editData"></GradeDialog>
    <MajorDialog :visible.sync="majorVisible" @success="getData" :editData="editData"></MajorDialog>
    <ClassDialog :visible.sync="classVisible" @success="getData" :editData="editData"></ClassDialog>
  </div>
</template>

<script>
import { getMajorService, deleteMajorService, teaGetClassService } from '@/api/systemSetting.js';
import MajorDialog from './components/MajorDialog.vue';
import { systemSettingStatus } from '@/constant/status.js';
import SystemHeader from '../components/SystemHeader.vue';
import ClassDialog from '../classSetting/components/ClassDialog.vue';
import GradeDialog from '../gradeSetting/components/GradeDialog.vue';

export default {
  data() {
    return {
      tableData: [], // 页面数据
      editData: {}, // 编辑的信息
      majorVisible: false, // 专业弹框状态
      gradeVisible: false, // 年级弹框
      classVisible: false, // 班级弹框
      systemSettingStatus,
      treeData: [],
      props: {
        children: 'children',
        lable: 'name',
      },
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
    teaGetClassService().then((res) => {
      this.treeData = res.data;
      console.log(res);
    });
  },
  components: {
    MajorDialog,
    SystemHeader,
    ClassDialog,
    GradeDialog,
  },
};
</script>

<style scoped>
.title {
  /* width: 100px; */
  height: 50px;
  margin: 5px 0 0;
  line-height: 50px;
  background-color: #fafafa;
  box-shadow: 0 2px 2px #ddd;
  margin-top: 20px;
}
.tree-list {
  width: 900px;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 16px;
}

.el-tree {
  width: 992px;
}
.el-input-group {
  margin: 0 50px 20px 20px !important;
}
</style>

<style>
.system-manage .el-tree-node .el-tree-node__content {
  margin: 5px 0;
  height: 50px !important;
  background-color: #fafafa;
  box-shadow: 0 2px 2px #dddddd;
}
</style>

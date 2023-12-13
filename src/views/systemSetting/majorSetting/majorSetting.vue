<template>
  <div class="system-manage">
    <SystemHeader :title="'专业'" @add="add"></SystemHeader>
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
            <el-button size="small" type="primary" @click="add(node.data)">新增</el-button>
            <el-button size="small" type="primary" @click="edit(node.data)">编辑</el-button>
            <el-button size="small" type="danger" @click="del(node.data)">删除</el-button>
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
    <ClassDialog :visible.sync="visible" @success="getData" :editData="editData"></ClassDialog>
  </div>
</template>

<script>
import { getLearService, deleteLearService } from '@/api/systemSetting.js';
// import MajorDialog from './components/MajorDialog.vue';
import { systemSettingStatus } from '@/constant/status.js';
import SystemHeader from '../components/SystemHeader.vue';
import ClassDialog from './components/ClassDialog.vue';

export default {
  data() {
    return {
      editData: {}, // 编辑的信息
      visible: false, // 弹框状态
      systemSettingStatus,
      treeData: [], // 展示数据
      // 树状结构配置
      props: {
        children: 'children', // 子级属性名
        lable: 'name', // 展示名称
      },
    };
  },
  methods: {
    // 获取数据
    async getData() {
      const res = await getLearService();
      this.treeData = res.data;
    },
    // 编辑
    edit(data) {
      this.editData = data;
      this.visible = true;
    },
    // 删除
    del({ id }) {
      this.$confirm('您确认要删除吗', '提示', { type: 'warning' })
        .then(async () => {
          await deleteLearService(id);
          this.$message.success('删除成功');
          this.getData();
        })
        .catch(() => {});
    },
    // 新增专业
    add(data) {
      if (data) {
        // 新增子集
        const { id } = data;
        this.editData = { parentId: id };
      } else {
        // 新增专业
        this.editData = {};
      }
      this.visible = true;
    },
  },
  created() {
    this.getData();
  },
  components: {
    // MajorDialog,
    SystemHeader,
    ClassDialog,
    // GradeDialog,
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

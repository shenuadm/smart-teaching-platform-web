<template>
  <div class="menu-management" v-loading="$store.state.isLoading">
    <div class="text-initial mb-20">
      <el-button type="primary" size="small" @click="addMenu({})">添加根节点</el-button>
    </div>
    <el-row class="top flex align-center" style="width: 100%">
      <el-col :span="4" class="text-initial"> 显示名称 </el-col>
      <el-col :span="5"> 菜单名称 </el-col>
      <el-col :span="2"> 菜单类型 </el-col>
      <el-col :span="5"> 菜单路径 </el-col>
      <el-col :span="2"> 菜单排序 </el-col>
      <el-col :span="6" class="menu-action"> 操作 </el-col>
    </el-row>
    <el-tree :data="menuData" node-key="id" accordion :expand-on-click-node="false">
      <template #default="{ node }">
        <el-row style="width: 100%" class="flex align-center">
          <el-col :span="3" class="text-initial ellipsis">{{ node.data.title }}</el-col>
          <el-col :span="6">{{ node.data.menuName }}</el-col>
          <el-col :span="2">{{ node.data.type }}</el-col>
          <el-col :span="5" class="ellipsis">{{ node.data.funurl }}</el-col>
          <el-col :span="2">{{ node.data.sort }}</el-col>
          <el-col :span="6" class="menu-action">
            <el-button type="primary" size="mini" @click="addMenu(node.data)"> 添加 </el-button>
            <el-button type="primary" size="mini" @click="editMenu(node.data)"> 修改 </el-button>
            <el-button type="danger" size="mini" @click="delMenuDate(node.data.id)"> 删除 </el-button>
          </el-col>
        </el-row>
      </template>
    </el-tree>
    <EditMenu :visible.sync="visible" :edit-data="editData" @success="getMenuData"></EditMenu>
  </div>
</template>

<script>
import EditMenu from '@/views/superUser/menuManagement/components/EditMenu.vue';
import { deleteMenuService, getMenuService } from '@/api/menu';
export default {
  components: { EditMenu },
  data() {
    return {
      menuData: [], // 菜单数据
      editData: {}, // 修改数据
      visible: false, // 弹框状态
    };
  },
  created() {
    this.getMenuData();
  },
  methods: {
    // 获取数据列表
    async getMenuData() {
      const { data } = await getMenuService();
      this.menuData = data;
    },
    // 新增菜单
    addMenu({ id = 0 }) {
      this.editData = { funpid: id, add: true };
      this.visible = true;
    },
    // 修改
    editMenu(row) {
      this.editData = row;
      this.visible = true;
    },
    // 删除
    delMenuDate(id) {
      this.$confirm('您确认要删除该节点吗?', '提示', { type: 'warning' })
        .then(async () => {
          await deleteMenuService(id);
          this.$message.success('删除节点成功');
          await this.getMenuData();
        })
        .catch(() => {});
    },
  },
};
</script>

<style scoped>
.el-col {
  overflow: hidden;
  text-overflow: ellipsis;
}
.el-col.menu-action {
  min-width: 210px;
}
.menu-management .top {
  padding-left: 24px;
}
</style>
<style>
.menu-management .el-tree-node .el-tree-node__content,
.menu-management .top {
  margin: 5px 0;
  height: 50px !important;
  background-color: #fafafa;
  box-shadow: 0 2px 2px #dddddd;
}
</style>

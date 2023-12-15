<template>
  <div class="menu-management" v-loading="$store.state.isLoading">
    <el-button type="primary" size="small" class="addRoot" @click="addMenuRootDate">添加根节点</el-button>
    <span class="top">
      <el-row style="width: 100%">
        <el-col :span="4">
          <span>显示名称</span>
        </el-col>
        <el-col :span="5">
          <span>菜单名称</span>
        </el-col>
        <el-col :span="2">
          <span>菜单类型</span>
        </el-col>
        <el-col :span="5">
          <span>菜单路径</span>
        </el-col>
        <el-col :span="2">
          <span>菜单排序</span>
        </el-col>
        <el-col :span="6">
          <span>操作</span>
        </el-col>
      </el-row>
    </span>
    <el-container>
      <div class="block" style="width: 100%">
        <el-tree :data="tableData" node-key="id" accordion :expand-on-click-node="false" style="width: 100%">
          <span class="custom-tree-node" slot-scope="{ node }">
            <el-row style="width: 100%">
              <el-col :span="3">
                <span>{{ node.data.title }}</span>
              </el-col>
              <el-col :span="6">
                <span>{{ node.data.menuName }}</span>
              </el-col>
              <el-col :span="2">
                <span>{{ node.data.type }}</span>
              </el-col>
              <el-col :span="5" class="funurl">
                <span>{{ node.data.funurl }}</span>
              </el-col>
              <el-col :span="2">
                <span>{{ node.data.sort }}</span>
              </el-col>
              <el-col :span="6">
                <span>
                  <el-button type="primary" size="mini" @click="addMenuDate(node.data.id)"> 添加 </el-button>
                  <el-button type="primary" size="mini" @click="reviseFun(node.data)"> 修改 </el-button>
                  <el-button type="danger" size="mini" @click="delMenuDate(node.data.id)"> 删除 </el-button>
                </span>
              </el-col>
            </el-row>
          </span>
        </el-tree>
      </div>
    </el-container>
    <!-- 根节点功能 -->
    <el-dialog
      :title="isAddRootNode ? '新增根节点' : '修改根节点'"
      :visible.sync="addVisible"
      width="40%"
      :before-close="addcancel"
      :close-on-click-modal="false"
    >
      <el-form ref="form" :model="revise" :rules="rules" label-width="80px">
        <el-form-item label="显示名称" prop="title">
          <el-input v-model="revise.title" placeholder="请输入显示名称"></el-input>
        </el-form-item>
        <el-form-item label="菜单名称" prop="menuName">
          <el-input v-model="revise.menuName" placeholder="请输入菜单名称"></el-input>
        </el-form-item>
        <el-form-item label="菜单路径" prop="funurl">
          <el-input v-model="revise.funurl" placeholder="请输入菜单路径"></el-input>
        </el-form-item>
        <el-form-item label="菜单类型" class="type" prop="funtype">
          <el-select v-model="revise.funtype" placeholder="请输入菜单类型">
            <el-option v-for="item in menuType" :label="item[1]" :value="item[0]" :key="item[0]"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="菜单排序" class="sort" prop="sort">
          <el-input-number placeholder="请输入菜单排序" v-model="revise.sort" controls-position="right">
          </el-input-number>
        </el-form-item>
        <el-form-item label="菜单图标" prop="icon">
          <el-input placeholder="请输入菜单图标的名称" v-model="revise.icon"></el-input>
        </el-form-item>
        <el-form-item class="form-btn">
          <el-button size="small" type="primary" @click="saveRootNode">确 定</el-button>
          <el-button size="small" @click="addcancel">取 消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 节点功能 -->
    <el-dialog
      :title="isAddSonNode ? '新增结点' : '修改结点'"
      :visible.sync="addsonVisible"
      width="40%"
      :before-close="colseDialog"
      :close-on-click-modal="false"
    >
      <el-form ref="form" :model="revise" label-width="80px" :rules="rules">
        <el-form-item label="显示名称" prop="title">
          <el-input v-model="revise.title" placeholder="请输入显示名称"></el-input>
        </el-form-item>
        <el-form-item label="菜单名称" prop="menuName">
          <el-input v-model="revise.menuName" placeholder="请输入菜单名称"></el-input>
        </el-form-item>
        <el-form-item label="菜单路径" prop="funurl">
          <el-input v-model="revise.funurl" placeholder="请输入菜单路径"></el-input>
        </el-form-item>
        <el-form-item label="菜单类型" class="type" prop="funtype">
          <el-select v-model="revise.funtype" placeholder="请输入菜单类型">
            <el-option v-for="item in menuType" :label="item[1]" :value="item[0]" :key="item[0]"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="菜单排序" class="sort">
          <el-input-number placeholder="请输入菜单排序" v-model="revise.sort" controls-position="right">
          </el-input-number>
        </el-form-item>
        <el-form-item label="菜单图标" prop="icon">
          <el-input placeholder="请输入菜单图标的名称" v-model="revise.icon"></el-input>
        </el-form-item>
        <el-form-item class="form-btn">
          <el-button size="small" type="primary" @click="saveSonNode">确 定</el-button>
          <el-button size="small" @click="colseDialog">取 消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { getdata, adddata, deldata, upmenuData } from '@/utils/api';
import { menuType } from '@/constant/superUser.js';
export default {
  components: {},
  data() {
    return {
      addVisible: false, //根节点弹框显示/隐藏
      isAddRootNode: true, //是添加根节点/修改
      addsonVisible: false, //子节点弹框显示/隐藏
      isAddSonNode: true, //是否添加子节点/修改
      updataId: '', //修改时结点ID
      tableData: [],
      revise: {
        title: '',
        funurl: '',
        funtype: '',
        menuName: '',
        sort: '',
        funpid: '',
      },
      rules: {
        title: [{ required: true, message: '请输入显示名称', trigger: 'blur' }],
        menuName: [{ required: true, message: '请输入菜单名称', trigger: 'blur' }],
        icon: [{ required: false, message: '请输入菜单图标', trigger: 'blur' }],
        funurl: [{ required: true, message: '请输入菜单路径', trigger: 'blur' }],
        funtype: [{ required: true, message: '请选择菜单类型', trigger: 'change' }],
        sort: [{ required: true, message: '请选择菜单排序', trigger: 'blur' }],
      },
      menuType: Object.freeze(menuType),
    };
  },
  created() {
    this.getMenuData();
  },
  methods: {
    // 获取数据列表
    getMenuData() {
      getdata().then((res) => {
        this.tableData = res.data;
      });
    },
    // 新增根节点，节点//
    addMenuRootDate() {
      this.revise = {};
      this.revise.sort = 0;
      this.isAddRootNode = true;
      this.addVisible = true;
    },
    // 新增子节点
    addMenuDate(id) {
      this.revise = {};
      this.revise.sort = 0;
      this.updataId = id;
      this.isAddSonNode = true;
      this.addsonVisible = true;
    },
    // 保存根节点
    saveRootNode() {
      this.$refs['form'].validate(async (valid) => {
        if (valid) {
          const data = {
            title: this.revise.title,
            menuName: this.revise.menuName,
            funurl: this.revise.funurl,
            funtype: this.revise.funtype,
            sort: this.revise.sort,
            icon: this.revise.icon,
          };
          if (this.isAddRootNode) {
            // 新增根节点
            await adddata(data);
            this.$message.success('添加节点成功');
            this.getMenuData();
            this.addVisible = false;
          } else {
            // 修改根节点
            data.id = this.updataId;
            await upmenuData(data);
            console.log(data);
            this.$message.success('修改节点成功');
            this.getMenuData();
            this.addVisible = false;
          }
        } else {
          return this.$message.error('请输入正确的信息');
        }
      });
    },
    // 保存子节点
    saveSonNode() {
      this.$refs['form'].validate(async (valid) => {
        if (valid) {
          console.log(this.revise, 'revise1');
          const data = {
            title: this.revise.title,
            menuName: this.revise.menuName,
            funurl: this.revise.funurl,
            funtype: this.revise.funtype,
            sort: this.revise.sort,
            icon: this.revise.icon,
          };
          if (this.isAddSonNode) {
            // 新增子节点
            data.funpid = this.updataId;
            console.log(data, '添加数据');
            await adddata(data);
            this.$message.success('添加节点成功');
            this.getMenuData();
            this.addsonVisible = false;
          } else {
            data.funpid = this.revise.funpid;
            data.id = this.revise.id;
            console.log(data, '修改数据');
            await upmenuData(data);
            this.$message.success('修改节点成功');
            this.getMenuData();
            this.addsonVisible = false;
          }
        } else {
          return false;
        }
      });
    },
    // 取消按钮
    addcancel() {
      this.revise = {};
      this.$refs['form'].resetFields();
      this.addVisible = false;
    },
    colseDialog() {
      this.revise = {};
      this.$refs['form'].resetFields();
      this.addsonVisible = false;
    },
    // 修改数据
    reviseFun(item) {
      const data = JSON.parse(JSON.stringify(item));
      this.revise = data;
      this.updataId = data.id;
      if (item.funpid === 0) {
        // 根节点
        this.addVisible = true;
        this.isAddRootNode = false;
      } else {
        // 子节点
        this.addsonVisible = true;
        this.isAddSonNode = false;
      }
    },
    // 删除
    delMenuDate(e) {
      this.$confirm('您确认要删除该节点吗?', '提示', { type: 'warning' })
        .then(async () => {
          await deldata(e);
          this.$message.success('删除节点成功');
          this.getMenuData();
        })
        .catch(() => {});
    },
  },
};
</script>

<style scoped>
/* 导航栏 */
.el-menu-vertical-demo {
  width: 200px;
  margin-top: 20px;
}
/* 树形列表 */
.custom-tree-node {
  width: 900px;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  /* padding-right: 8px; */
  font-size: 16px;
}
.el-tree {
  width: 992px;
}
.el-input-group {
  margin: 0 50px 20px 20px !important;
}

/* 菜单类型 */
.type {
  width: 240px !important;
  float: left;
}
/* 菜单排序 */
.sort {
  width: 200px;
  display: inline-block;
}
.top {
  display: block;
  width: 100%;
  height: 50px;
  margin: 5px 0 0;
  text-align: center;
  line-height: 50px;
  background-color: #fafafa;
  box-shadow: 0 2px 2px #dddddd;
  margin-top: 20px;
}
.funurl {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.el-col {
  overflow: hidden;
  text-overflow: ellipsis;
}
.el-input-number {
  width: 100%;
}
.menu-management .form-btn {
  display: flex;
}
</style>
<style>
.form-btn .el-form-item__content {
  flex: 1;
  display: flex;
  margin-left: 0 !important;
  justify-content: space-evenly;
}
/* 添加根菜单 */
.menu-management .addRoot {
  width: 100px;
  height: 30px;
  background-color: #409eff;
  color: white;
  display: block;
  border: none;
}
/* 按钮 */
.menu-management .el-button {
  font-size: 14px;
}
.menu-management .el-tree-node .el-tree-node__content {
  margin: 5px 0;
  height: 50px !important;
  background-color: #fafafa;
  box-shadow: 0 2px 2px #dddddd;
}
/* 新增弹出框的脚部 */
.menu-management .el-dialog__footer {
  text-align: center !important;
}
</style>

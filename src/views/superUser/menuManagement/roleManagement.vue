<template>
  <div class="role-management">
    <div class="addRole zh-mgb-20">
      <el-button type="primary" size="small" @click="addRole"
        >添加角色</el-button
      >
    </div>
    <div class="roleTable">
      <el-table
        ref="tableData"
        :data="tableData"
        border
        style="width: 100%"
        v-loading="loadingGlobal"
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column prop="rolename" label="角色标识" align="center">
        </el-table-column>
        <el-table-column prop="nickname" label="角色名称" align="center">
        </el-table-column>
        <el-table-column prop="description" label="角色描述" align="center">
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope" v-if="scope.row.roleid !== 1">
            <el-button
              size="mini"
              type="primary"
              @click="empower(scope.$index, scope.row)"
              >授权</el-button
            >
            <el-button
              size="mini"
              type="primary"
              @click="edit(scope.$index, scope.row)"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="danger"
              @click="del(scope.$index, scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 添加角色 -->
    <el-dialog
      :title="isAddRole ? '添加角色' : '修改角色'"
      :visible.sync="aeditVisible"
      :before-close="cancal"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="角色标识" prop="rolename">
          <el-input
            v-model="form.rolename"
            :disabled="form.roleid < 5"
          ></el-input>
        </el-form-item>
        <el-form-item label="角色名称" prop="nickname">
          <el-input v-model="form.nickname"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="description">
          <el-input v-model="form.description"></el-input>
        </el-form-item>
        <el-form-item class="form-btn">
          <el-button type="primary" size="small" @click="submit"
            >提交</el-button
          >
          <el-button size="small" @click="cancal">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 授权树 -->
    <div class="empowerTree">
      <el-dialog title="授权" :visible.sync="empowerVisible">
        <el-tree
          :data="treeData"
          ref="tree"
          show-checkbox
          node-key="id"
          :props="defaultProps"
          :default-checked-keys="checked"
          @check="check"
        >
        </el-tree>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" size="small" @click="confirmEmpower"
            >确认授权</el-button
          >
          <el-button type="success" size="small" @click="cancelEmpower"
            >取消授权</el-button
          >
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {
  roleManagement,
  empowerTree,
  ackEmpower,
  delRole,
  updateRole,
  addRole,
} from '@/utils/api.js';
export default {
  data() {
    return {
      // 角色表格
      tableData: [],
      // 编辑表单
      form: {
        rolename: '',
        nickname: '',
        description: '',
      },
      // 表单校验
      rules: {
        rolename: [
          { required: true, message: '角色标识不能为空', trigger: 'blur' },
        ],
        nickname: [
          { required: true, message: '角色名称不能为空', trigger: 'blur' },
        ],
        description: [
          { required: true, message: '角色描述不能为空', trigger: 'blur' },
        ],
      },
      aeditVisible: false, // 是否显示表单
      empowerVisible: false, //是否显示授权树
      // 授权树
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'title',
      },
      checked: [], //授权树默认勾选的节点
      roleId: '',
      isAddRole: true, //是否添加角色
    };
  },
  created() {
    // 请求数据，渲染角色管理表格
    this.getroleManagement();
  },
  methods: {
    check(obj, treeInfo) {
      this.checked = treeInfo.checkedKeys;
      console.log(this.checked);
    },
    // 获取数据
    async getroleManagement() {
      const res = await roleManagement();
      this.tableData = res.data;
      this.loadingGlobal = false;
    },
    // 添加角色
    addRole() {
      this.isAddRole = true;
      this.aeditVisible = true;
    },
    // 编辑
    edit(index, row) {
      // 数据回显到表单
      const data = JSON.parse(JSON.stringify(row));
      // 编辑表单显示
      this.form = data;
      this.isAddRole = false;
      this.aeditVisible = true;
    },
    // 关闭弹框
    cancal() {
      this.aeditVisible = false;
      this.$refs['form'].resetFields();
      this.form = {};
    },
    // 提交
    submit() {
      this.$refs['form'].validate(async (valid) => {
        if (valid) {
          if (this.isAddRole) {
            // 添加角色
            const res = await addRole(this.form);
            if (res.code === 0) {
              this.$message({
                type: 'success',
                message: '添加角色成功',
              });
            } else {
              this.$message.error(res.msg);
            }
            this.getroleManagement();
            this.aeditVisible = false;
          } else {
            // 编辑角色
            const res = await updateRole(this.form);
            if (res.code === 0) {
              this.$message({
                type: 'success',
                message: '修改角色成功',
              });
            } else {
              this.$message.error(res.msg);
            }
            this.getroleManagement();
            this.aeditVisible = false;
          }
        } else {
          return false;
        }
      });
    },
    // 授权
    empower(index, row) {
      this.empowerVisible = true;
      this.roleId = row.roleid;
      empowerTree(this.roleId).then((res) => {
        this.treeData = res.data;
        // 一级
        this.treeData.map((item) => {
          if (item.checked === true) {
            this.checked.push(item.id);
          }
          // 二级
          let secondChildren = item.children;
          if (secondChildren != null) {
            secondChildren.map((items) => {
              if (items.checked === true) {
                this.checked.push(items.id);
              }
              // 三级
              let thirdChildren = items.children;
              if (thirdChildren != null) {
                thirdChildren.map((k) => {
                  if (k.checked === true) {
                    this.checked.push(k.id);
                  }
                });
              }
            });
          }
        });
      });
    },
    // 确认授权
    async confirmEmpower() {
      const data = {
        roleId: this.roleId,
        permissionIds: this.checked.join(','),
      };
      await ackEmpower(data);
      this.$message.success('授权成功');
      this.empowerVisible = false;
    },
    // 取消授权
    cancelEmpower() {
      this.empowerVisible = false;
      this.checked = [];
    },
    // 删除
    del(index, row) {
      this.$confirm('你确定要删除吗', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          const res = await delRole(row.roleid);
          if (res.code === 0) {
            this.$message({
              type: 'success',
              message: '删除角色成功',
            });
            this.getroleManagement();
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch(() => {});
    },
  },
};
</script>

<style scoped>
.addRole {
  text-align: left;
}
.form-btn {
  display: flex;
}
.dialog-footer {
  padding: 0 20px;
  display: flex;
  justify-content: space-evenly;
}
</style>
<style>
.role-management .form-btn .el-form-item__content {
  margin-left: 0 !important;
  width: 100%;
  display: flex;
  justify-content: space-evenly;
}
.el-dialog {
  width: 30% !important;
}
</style>

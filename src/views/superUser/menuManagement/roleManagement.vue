<template>
  <div class="role-management">
    <div class="addRole mb-20">
      <el-button type="primary" size="small" @click="addRole">添加角色</el-button>
    </div>
    <div class="roleTable">
      <el-table ref="tableData" :data="tableData" border style="width: 100%" v-loading="$store.state.isLoading">
        <el-table-column prop="rolename" label="角色标识"> </el-table-column>
        <el-table-column prop="nickname" label="角色名称"> </el-table-column>
        <el-table-column prop="description" label="角色描述"> </el-table-column>
        <el-table-column label="状态">
          <template #default="{ row }">
            <div :class="row.status ? 'text-red' : 'text-blue'">{{ row.status ? '未激活' : '激活' }}</div>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button size="mini" type="primary" @click="empower(scope.$index, scope.row)">授权</el-button>
            <el-button
              size="mini"
              :disabled="isClick(scope.row.rolename)"
              :type="isClick(scope.row.rolename) ? 'info' : 'primary'"
              @click="edit(scope.$index, scope.row)"
              >编辑</el-button
            >
            <el-button
              size="mini"
              :disabled="isClick(scope.row.rolename)"
              :type="isClick(scope.row.rolename) ? 'info' : 'danger'"
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
      :before-close="cancel"
      :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px" v-loading="$store.state.isLoading">
        <el-form-item label="角色标识" prop="rolename">
          <el-input v-model="form.rolename" :disabled="form.roleid < 5"></el-input>
        </el-form-item>
        <el-form-item label="角色名称" prop="nickname">
          <el-input v-model="form.nickname"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="description">
          <el-input v-model="form.description"></el-input>
        </el-form-item>
        <el-form-item label="角色状态">
          <el-radio-group v-model="form.status">
            <el-radio :label="false">激活</el-radio>
            <el-radio :label="true">不激活</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" @click="submit">确定</el-button>
        <el-button @click="cancel">取消</el-button>
      </template>
    </el-dialog>
    <!-- 授权树 -->
    <div class="empowerTree">
      <el-dialog
        title="授权"
        :visible.sync="empowerVisible"
        :before-close="cancelEmpower"
        :close-on-click-modal="false">
        <el-tree
          :data="treeData"
          ref="tree"
          show-checkbox
          node-key="id"
          :props="defaultProps"
          :default-checked-keys="checked"
          @check="check"
          v-loading="$store.state.isLoading">
        </el-tree>
        <template #footer>
          <el-button type="primary" @click="confirmEmpower">确定</el-button>
          <el-button @click="cancelEmpower">取消</el-button>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { ackEmpower, addRole, delRole, roleManagement, updateRole } from '@/utils/api.js';
import { getEmpowerTreeService } from '@/api/role.js';

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
        active: false,
      },
      // 表单校验
      rules: {
        rolename: [{ required: true, message: '角色标识不能为空', trigger: 'blur' }],
        nickname: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }],
        description: [{ required: true, message: '角色描述不能为空', trigger: 'blur' }],
      },
      aeditVisible: false, // 是否显示表单
      empowerVisible: false, //是否显示授权树
      // 授权树
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'menuName',
      },
      checked: [], //授权树默认勾选的节点
      roleId: '',
      isAddRole: true, //是否添加角色
      dialogLoading: true,
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
    },
    // 添加角色
    addRole() {
      this.isAddRole = true;
      this.aeditVisible = true;
    },
    // 编辑
    edit(index, row) {
      // 编辑表单显示
      this.form = JSON.parse(JSON.stringify(row));
      this.isAddRole = false;
      this.aeditVisible = true;
    },
    // 关闭弹框
    cancel() {
      this.aeditVisible = false;
      this.$refs['form'].resetFields();
      this.form = {};
    },
    // 提交
    submit() {
      this.$refs['form'].validate(async (valid) => {
        if (valid) {
          const message = this.isAddRole ? '添加' : '修改' + '角色成功';
          if (this.isAddRole) {
            await addRole(this.form);
          } else {
            await updateRole(this.form);
          }
          await this.getroleManagement();
          this.$message.success(message);
          this.aeditVisible = false;
        }
      });
    },
    // 授权
    async empower(index, row) {
      this.empowerVisible = true;
      this.roleId = row.roleid;
      const res = await getEmpowerTreeService(this.roleId);
      this.treeData = res.data;
      console.log(res.data[0]);
      const getId = (data) => {
        data.forEach((item) => {
          if (item.checked) {
            this.checked.push(item.id);
          }
          if (item.children != null) {
            getId(item.children);
          }
        });
      };
      getId(res.data);
      this.checked = Array.from(new Set([...this.checked]));
      console.log(this.checked);
    },
    // 确认授权
    async confirmEmpower() {
      const data = {
        roleId: this.roleId,
        permissionIds: this.checked.join(','),
      };
      console.log(this.checked);
      await ackEmpower(data);
      this.$message.success('授权成功');
      this.empowerVisible = false;
    },
    // 取消授权
    cancelEmpower() {
      this.empowerVisible = false;
      this.checked = [];
    },
    // 判断该用户是否可以编辑与删除信息,可以返回false，不可以返回true
    isClick(rolename) {
      return ['supper_admin', 'teacher', 'student', 'admin'].includes(rolename);
    },
    // 删除
    del(index, row) {
      this.$confirm('你确定要删除吗', '提示', { type: 'warning' })
        .then(async () => {
          await delRole(row.roleid);
          this.$message.success('删除角色成功');
          this.getroleManagement();
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

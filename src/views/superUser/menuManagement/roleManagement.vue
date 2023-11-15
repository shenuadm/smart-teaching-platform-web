<template>
  <div class="content">
    <div class="addRole zh-mgb-20">
      <el-button type="primary" size="small" @click="addRole"
        >添加角色</el-button
      >
    </div>
    <div class="roleTable">
      <el-table ref="tableData" :data="tableData" border style="width: 100%">
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column
          prop="rolename"
          label="角色标识"
          width="200"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="nickname"
          label="角色名称"
          width="200"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="description"
          label="角色描述"
          width="200"
          align="center"
        >
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
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
    <div class="editForm">
      <el-dialog title="编辑角色" :visible.sync="aeditVisible">
        <el-form ref="form" :model="form" :rules="rules" label-width="80px">
          <el-form-item label="角色标识" prop="rolename">
            <el-input v-model="form.rolename"></el-input>
          </el-form-item>
          <el-form-item label="角色名称" prop="nickname">
            <el-input v-model="form.nickname"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="description">
            <el-input v-model="form.description"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submit">提交</el-button>
          <el-button @click="cancal('form')">取消</el-button>
        </div>
      </el-dialog>
    </div>
    <!-- 编辑表单 -->
    <div class="editForm">
      <el-dialog title="编辑角色" :visible.sync="editVisible">
        <el-form ref="form" :model="form" :rules="rules" label-width="80px">
          <el-form-item label="角色标识" prop="rolename">
            <el-input v-model="form.rolename"></el-input>
          </el-form-item>
          <el-form-item label="角色名称" prop="nickname">
            <el-input v-model="form.nickname"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="description">
            <el-input v-model="form.description"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="confirmModify">确认修改</el-button>
          <el-button @click="cancelModify('form')">取消修改</el-button>
        </div>
      </el-dialog>
    </div>
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
        >
        </el-tree>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="confirmEmpower">确认授权</el-button>
          <el-button type="success" @click="cancelEmpower">取消授权</el-button>
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
} from "@/utils/api.js";
export default {
  data() {
    return {
      // 角色表格
      tableData: [],
      // 编辑表单
      form: {
        rolename: "",
        nickname: "",
        description: "",
        roleid: "",
      },
      // 表单校验
      rules: {
        rolename: [
          { required: true, message: "角色标识不可为空", trigger: "blur" },
        ],
        nickname: [
          { required: true, message: "角色名称不可为空", trigger: "blur" },
        ],
      },
      aeditVisible: false,
      editVisible: false, // 是否显示表单
      empowerVisible: false, //是否显示授权树
      // 授权树
      treeData: [],
      defaultProps: {
        children: "children",
        label: "title",
      },
      checked: [], //授权树默认勾选的节点
      roleId: "",
    };
  },
  mounted() {
    // 请求数据，渲染角色管理表格
    this.roleManagement();
  },
  methods: {
    // 获取数据
    roleManagement() {
      roleManagement().then((res) => {
        this.tableData = res.data;
        // console.log(res.data)
      });
    },
    // 添加角色
    addRole() {
      this.aeditVisible = true;
      if (this.form != "") {
        this.form = {};
      }
    },
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          addRole(this.form).then((res) => {
            console.log(res);
            this.roleManagement();
            if (res.code === 0) {
              this.$message({
                message: "恭喜你，添加成功",
                type: "success",
              });
            } else {
              this.$message({
                message: "用户已存在，请重新添加",
                type: "info",
              });
            }
          });
          this.aeditVisible = false;
        } else {
          return false;
        }
      });
    },
    cancal(from) {
      this.$refs[from].resetFields();
      this.aeditVisible = false;
    },
    // 授权
    empower(index, row) {
      this.empowerVisible = true;
      this.roleId = row.roleid;
      empowerTree(this.roleId).then((res) => {
        console.log(res);
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
    confirmEmpower() {
      let data = {
        roleId: this.roleId,
        permissionIds: this.$refs.tree.getCheckedKeys().join(),
      };
      console.log(data);
      ackEmpower(data).then((res) => {
        console.log(res);
        this.roleManagement();
      });
      this.empowerVisible = false;
    },
    // 取消授权
    cancelEmpower() {
      this.empowerVisible = false;
    },
    // 编辑
    edit(index, row) {
      // 编辑表单显示
      this.editVisible = true;
      // 数据回显到表单
      this.form = row;
    },
    // 确认修改
    confirmModify() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          console.log(this.form)
          updateRole(this.form).then((res) => {
            console.log(res);
            this.roleManagement();
          });
          this.editVisible = false;
        } else {
          return false;
        }
      });
    },
    // 取消修改
    cancelModify(from) {
      this.$refs[from].resetFields();
      this.editVisible = false;
      this.form = this.form;
      this.roleManagement();
    },
    // 删除
    del(index, row) {
      console.log(row);
      this.$confirm("是否删除", "删除", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      })
        .then(() => {
          delRole(row.roleid).then((res) => {
            this.roleManagement();
            console.log(res);
          });
          this.$message({
            type: "success",
            message: "删除成功",
          });
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
.el-form {
  width: 400px;
}
</style>
<style>
.el-button--primary {
  color: #fff;
  background-color: #409eff !important;
  border-color: #409eff !important;
}
.el-button--primary:hover {
  background-color: #7ebbf8;
  border-color: #7ebbf8;
}
.el-dialog__header {
  text-align: left;
}
.el-dialog {
  width: 30% !important;
}
</style>
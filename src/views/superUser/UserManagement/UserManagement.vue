<template>
  <div>
    <div class="header">
      <div class="title">账号:</div>
      <el-input class="inputTop" v-model="serch.account" id="inputh" placeholder="请输入账号"></el-input>
      <div class="title">昵称:</div>
      <el-input class="inputTop" v-model="serch.username" id="inputh" placeholder="请输入昵称"></el-input>
      <el-button type="primary" size="small" @click="search" class="btn-search">搜索</el-button>
      <el-button type="primary" size="small" @click="resetting">重置</el-button>
      <el-button type="primary" size="small" @click="add">添加用户</el-button>
      <el-button type="danger" size="small" @click="batchdel">批量删除</el-button>
    </div>
    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      v-loading="$store.state.isLoading"
      @selection-change="handleSelectionChange"
      class="custom-table"
      v-if="dialogtabledata"
      border
    >
      <el-table-column type="selection" width="50"> </el-table-column>
      <el-table-column prop="account" label="账号" width="120"></el-table-column>
      <el-table-column prop="username" label="昵称" width="160"></el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="160"> </el-table-column>
      <el-table-column prop="lastLoginTime" label="最近登录时间" width="160" show-overflow-tooltip></el-table-column>
      <el-table-column prop="lastLoginIp" label="最近登录IP" width="150" show-overflow-tooltip></el-table-column>
      <el-table-column prop="roleName" label="用户类型" width="210" show-overflow-tooltip></el-table-column>
      <el-table-column prop="active" label="是否激活" width="80">
        <template slot-scope="scope">
          <div v-if="scope.row.active === 0" class="user">激活</div>
          <div v-else-if="scope.row.active === 1" class="forbidden">未激活</div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="300">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="reset(scope.row.userid)">重置密码</el-button>
          <el-button type="primary" size="mini" @click="reviseuser(scope.row)">编辑</el-button>
          <el-button type="danger" size="mini" @click="delUser(scope.row.userid)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="pageSize"
        layout="total, prev, pager, next, jumper"
        :total="this.count"
      >
      </el-pagination>
    </div>
    <!-- 新增用户-->
    <el-dialog title="请输入用户信息" :visible.sync="dialogVisible" width="30%">
      <el-form ref="form" :model="revise" label-width="80px" :rules="rules">
        <el-form-item label="用户账号" prop="account">
          <el-input v-model="revise.account" placeholder="请输入用户账号"></el-input>
        </el-form-item>
        <el-form-item label="用户姓名" prop="username">
          <el-input v-model="revise.username" placeholder="请输入用户姓名"></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="roleId" class="roles">
          <el-select v-model="revise.roleId" placeholder="请选择角色">
            <el-option label="教师" value="2"></el-option>
            <el-option label="学生" value="3"></el-option>
            <el-option label="管理员" value="4"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否激活" prop="active" class="active">
          <el-radio-group v-model="revise.active">
            <el-radio label="0">激活</el-radio>
            <el-radio label="1">不激活</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel('form')">取 消</el-button>
        <el-button type="primary" @click="serve">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改 -->
    <el-dialog title="请输入用户信息" :visible.sync="reviseUser" width="30%">
      <el-form ref="form" :model="reviseOther" label-width="80px" :rules="rules">
        <el-form-item label="用户账号" prop="account">
          <el-input v-model="reviseOther.account" placeholder="请输入用户账号"></el-input>
        </el-form-item>
        <el-form-item label="用户姓名" prop="username">
          <el-input v-model="reviseOther.username" placeholder="请输入用户姓名"></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="roleName" class="roles">
          <el-select v-model="reviseOther.roleName" placeholder="请选择角色" @change="change">
            <el-option label="教师" value="2"></el-option>
            <el-option label="学生" value="3"></el-option>
            <el-option label="管理员" value="4"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否激活" prop="active" class="active">
          <el-radio-group v-model="reviseOther.active">
            <el-radio :label="0">激活</el-radio>
            <el-radio :label="1">不激活</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="reviseNo('form')">取 消</el-button>
        <el-button type="primary" @click="reviseOk">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { delUsers, addUser, getUserData, resetPass, delUser, reviseUser } from '@/utils/api';
export default {
  data() {
    return {
      radio: '0',
      dialogtabledata: true,
      dialogtable: false,
      dialogVisible: false,
      resetPassword: false,
      currentPage: 1,
      pageSize: 10,
      jumpPage: '',
      count: 0,
      serch: {
        account: '',
        username: '',
      },
      revise: {
        account: '',
        username: '',
        roleId: '3',
        active: '0',
      },
      reviseOther: {
        account: '',
        username: '',
        roleId: '',
        roleName: '',
        active: '',
      },
      searchdata: [],
      tableData: [],
      multipleSelection: [],
      ids: [],
      userId: '',
      reviseUser: false,
      rules: {
        account: [{ required: true, message: '请输入用户账号', trigger: 'blur' }],
        username: [{ required: true, message: '请输入用户姓名', trigger: 'blur' }],
        roleId: [{ required: true, message: '请选择角色', trigger: 'change' }],
        active: [{ required: true, message: '请选择激活状态', trigger: 'change' }],
      },
    };
  },
  mounted() {
    this.getUserData();
  },
  methods: {
    //添加用户表
    add() {
      this.dialogVisible = !this.dialogVisible;
    },
    //搜索
    search() {
      getUserData(this.serch).then((res) => {
        console.log(res.data);
        for (let i = 0; i < res.data.length; i++) {
          const item = res.data[i];
          this.searchdata.push(item);
        }
        this.dialogtable = true;
        this.dialogtabledata = false;
      });
    },
    //重置按钮
    resetting() {
      this.serch = {};
      this.searchdata.length = 0;
      this.dialogtable = false;
    },
    //保存
    serve() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          addUser(this.revise).then((res) => {
            this.getUserData();
            console.log(res);
          });
          this.dialogVisible = false;
          this.$message({
            message: '恭喜你，添加成功',
            type: 'success',
          });
        } else {
          return false;
        }
      });
    },
    //取消
    cancel(from) {
      this.empty(this.revise);
      this.dialogVisible = !this.dialogVisible;
      this.$refs[from].resetFields();
      this.addVisible = false;
    },

    //批量删除
    batchdel() {
      this.$confirm('是否删除', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      })
        .then(() => {
          if (this.multipleSelection.length == 0) {
            this.$message({
              type: 'info',
              message: '未选择用户',
            });
          } else {
            for (let i = 0; i < this.multipleSelection.length; i++) {
              this.ids = this.multipleSelection[i].userid;
              console.log(this.ids);
              delUsers(this.ids).then((res) => {
                this.getUserData();
                console.log(res);
              });
            }
          }
        })
        .catch(() => {});
    },
    //重置密码
    reset(e) {
      this.userId = e;
      this.$confirm('是否重置', '重置', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      })
        .then(() => {
          resetPass(this.userId).then((res) => {
            this.getUserData();
            console.log(res);
          });
          this.$message({
            type: 'success',
            message: '重置成功',
          });
        })
        .catch(() => {
          this.$message({
            type: 'info',
          });
        });
    },
    // 删除
    delUser(e) {
      this.userId = e;
      console.log(this.userId);
      this.$confirm('是否删除', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      })
        .then(() => {
          delUser(this.userId).then((res) => {
            this.getUserData();
            console.log(res);
          });
          this.$message({
            type: 'success',
            message: '删除成功',
          });
        })
        .catch(() => {});
    },
    // 修改
    reviseuser(e) {
      this.reviseUser = true;
      this.reviseOther = e;
      this.reviseOther.active = e.active;
    },
    change(roleId) {
      this.reviseOther.roleId = roleId;
      console.log(roleId);
    },
    reviseOk() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          console.log(this.reviseOther);
          reviseUser(this.reviseOther).then((res) => {
            this.getUserData();
            console.log(res);
          });
          this.reviseUser = false;
          // this.$message({
          //   message: '恭喜你，修改成功',
          //   type: 'success',
          // });
          this.$message.success('修改成功');
        }
      });
    },
    reviseNo(from) {
      this.reviseUser = false;
      this.$refs[from].resetFields();
      this.getUserData();
    },
    //清空对象
    empty: function (obj) {
      for (const prop of Object.keys(obj)) {
        obj[prop] = '';
      }
    },
    handleSizeChange(val) {
      console.log(val);
      this.pageSize = val;
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      //跳转页数
      let data = {
        limit: 10,
        page: val,
      };
      getUserData(data).then((res) => {
        this.tableData = res.data;
      });
    },

    handleSelectionChange(val) {
      this.multipleSelection = val;
      console.log(val);
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(() => {
          this.empty(this.revise);
          done();
        })
        .catch(() => {});
    },

    getUserData() {
      getUserData().then((res) => {
        this.count = res.count;
        this.tableData = res.data;
      });
    },
  },
};
</script>

<style scoped>
.user {
  color: #409eff;
}
.forbidden {
  color: red;
}
.custom-file-button {
  position: absolute;
  top: 372px;
  left: 72px;
  width: 95px;
  height: 40px;
  border: 1px solid #dcdfe6;
  color: #909399;
}
.header {
  position: relative;
  width: 100%;
  height: 30px;
  display: flex;
}
.title {
  width: 80px;
  line-height: 30px;
}
.btn-search {
  margin-left: 10px;
}
.block {
  margin-top: 20px;
}
.inputw {
  width: 300px;
}
.inputTop {
  width: 150px;
}
/* 弹出框的角色 */
.roles {
  width: 240px !important;
}
/* 弹出框的激活状态 */
.active {
  width: 230px !important;
}
.el-table {
  margin-top: 20px;
}
</style>
<style>
.el-table th.el-table__cell > .cell,
.el-table__body td.el-table__cell {
  text-align: center;
}
.el-checkbox__inner {
  border: 1px solid #0944cd !important;
}
#inputh {
  height: 33px !important;
  width: 150px !important;
}
.el-input-group__prepend {
  width: 55px !important;
}
</style>

<template>
  <div>
    <div class="header">
      <div class="header-left">
        <div>
          <div class="search-input">
            <div class="title">账号:</div>
            <el-input size="small" v-model="serch.account" placeholder="请输入账号"></el-input>
          </div>
          <div class="search-input">
            <div class="title">昵称:</div>
            <el-input size="small" v-model="serch.username" placeholder="请输入昵称"></el-input>
          </div>
          <div class="search-input">
            <div class="title">专业:</div>
            <el-input size="small" v-model="serch.username" placeholder="请输入专业"></el-input>
          </div>
          <div class="search-input">
            <div class="title">年级:</div>
            <el-input size="small" v-model="serch.username" placeholder="请输入年级"></el-input>
          </div>
        </div>
        <div>
          <el-button type="primary" size="small" @click="search" class="btn-search">搜索</el-button>
          <el-button type="primary" size="small" @click="resetting">重置</el-button>
          <el-button type="primary" size="small" @click="add">添加用户</el-button>
          <el-button type="danger" size="small" @click="batchdel">批量删除</el-button>
        </div>
      </div>
      <div class="header-right ml-10">
        <el-button type="" size="small" style="height: 34px" @click="downloadSample">下载模板</el-button>
        <el-upload
          action=""
          :auto-upload="false"
          :file-list="fileList"
          :limit="2"
          :on-change="uploadChange"
          ref="upload"
        >
          <el-button slot="trigger" size="small" type="primary">导入用户信息</el-button>
          <el-button type="info" size="small" @click="confirmUpload" class="ml-10">确认上传</el-button>
        </el-upload>
      </div>
    </div>
    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      v-loading="$store.state.isLoading"
      @selection-change="handleSelectionChange"
      class="custom-table"
      border
    >
      <el-table-column type="selection" width="50"> </el-table-column>
      <el-table-column prop="account" label="账号" width="120"></el-table-column>
      <el-table-column prop="username" label="姓名" width="160"></el-table-column>
      <el-table-column prop="roleName" label="角色" width="120"></el-table-column>
      <el-table-column prop="active" label="是否激活" width="80">
        <template slot-scope="scope">
          <div v-if="scope.row.active === 0" class="user">激活</div>
          <div v-else-if="scope.row.active === 1" class="forbidden">未激活</div>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="专业"> </el-table-column>
      <el-table-column prop="lastLoginTime" label="年级"></el-table-column>
      <el-table-column prop="lastLoginIp" label="班级" width="150"></el-table-column>
      <el-table-column label="操作" width="300">
        <template slot-scope="{ row }" v-if="row.roleName !== '超级管理员'">
          <el-button type="primary" size="mini" @click="reset(row)">重置密码</el-button>
          <el-button type="primary" size="mini" @click="reviseuser(row)">编辑</el-button>
          <el-button type="danger" size="mini" @click="deleteUser(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="block">
      <el-pagination
        @current-change="getData"
        :current-page.sync="page"
        :page-size="10"
        layout="total, prev, pager, next, jumper"
        :total="count"
      >
      </el-pagination>
    </div>
    <!-- 新增修改用户弹框-->
    <el-dialog
      :close-on-click-modal="false"
      :title="(revise.userid ? '编辑' : '新增') + '用户'"
      :visible.sync="dialogVisible"
      :before-close="cancel"
      width="30%"
    >
      <el-form ref="form" :model="revise" label-width="80px" :rules="rules">
        <el-form-item label="账号" prop="account">
          <el-input v-model="revise.account" placeholder="请输入用户账号"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="username">
          <el-input v-model="revise.username" placeholder="请输入用户姓名"></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="roleId" class="roles">
          <el-select v-model="revise.roleId" placeholder="请选择角色">
            <el-option v-for="item in userRole" :key="item[0]" :label="item[1]" :value="item[0]"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否激活" prop="active" class="active">
          <el-radio-group v-model="revise.active">
            <el-radio :label="0">激活</el-radio>
            <el-radio :label="1">不激活</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="serve">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { userRole } from '@/constant/superUser.js';
import { delUsers, addUser, getUserData, resetPass, delUser, reviseUser } from '@/utils/api';
import { isAllowFile } from '@/utils/upload.js';
import { uploadStudentExcelService, downloadExceleSmpleService } from '@/api/userManagement.js';
export default {
  data() {
    return {
      dialogVisible: false, // 弹框状态
      file: '',
      page: 1,
      count: 0,
      userRole,
      serch: {
        account: '',
        username: '',
      }, // 搜索显示内容
      searchInfo: {}, // 实际搜索信息
      revise: {},
      defaultData: {
        account: '',
        username: '',
        roleId: 3,
        active: 0,
        userid: '',
      },
      fileList: [],
      tableData: [],
      multipleSelection: [],
      rules: {
        account: [{ required: true, message: '请输入用户账号', trigger: 'blur' }],
        username: [{ required: true, message: '请输入用户姓名', trigger: 'blur' }],
        roleId: [{ required: true, message: '请选择角色', trigger: 'change' }],
        active: [{ required: true, message: '请选择激活状态', trigger: 'change' }],
      },
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    //添加用户表
    add() {
      this.dialogVisible = true;
      this.revise = JSON.parse(JSON.stringify(this.defaultData));
    },
    //搜索
    async search() {
      if (Object.values(this.serch).every((item) => item === '')) return this.$message.error('请输入查询信息后再查询');
      this.page = 1;
      this.searchInfo = JSON.parse(JSON.stringify(this.serch));
      this.getData();
    },
    // 重置表格数据
    resetting() {
      this.serch = {};
      this.searchInfo = {};
      this.getData();
    },
    //保存
    serve() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          if (this.revise.userid) {
            await reviseUser(this.revise);
            this.$message.success('修改用户成功');
          } else {
            await addUser(this.revise);
            this.$message.success('添加用户成功');
          }
          this.dialogVisible = false;
          this.getData();
        }
      });
    },
    //取消
    cancel() {
      this.dialogVisible = false;
      this.$refs['form'].resetFields();
      this.revise.userid = '';
    },
    //批量删除
    batchdel() {
      if (this.multipleSelection.length === 0) return this.$message.info('请选择用户再提交');
      this.$confirm('是否删除选中的用户', '删除')
        .then(async () => {
          for (let i = 0, count = this.multipleSelection.length - 1; i < count; i++) {
            await delUser(this.multipleSelection[i].userid);
          }
          this.$message.success('删除用户成功');
        })
        .catch(() => {});
    },
    //重置密码
    reset({ userid }) {
      this.$confirm('是否重置选中的用户密码？', '重置密码')
        .then(async () => {
          await resetPass(userid);
          this.$message.success('重置用户密码成功');
        })
        .catch(() => {});
    },
    // 删除
    deleteUser({ userid }) {
      this.$confirm('是否删除该用户', '删除')
        .then(async () => {
          await delUser(userid);
          this.$message.success('删除用户成功');
          this.getData();
        })
        .catch(() => {});
    },
    // 修改
    reviseuser(row) {
      this.revise = JSON.parse(JSON.stringify(row));
      this.dialogVisible = true;
    },
    handleSelectionChange(val) {
      console.log(val);
      this.multipleSelection = val.map((item) => {
        return item.userid;
      });
      console.log(this.multipleSelection);
    },
    // 获取数据
    async getData() {
      let res;
      if (Object.values(this.searchInfo).every((item) => item === '')) {
        res = await getUserData({ page: this.page });
      } else {
        res = await getUserData({ ...this.searchInfo, page: this.page });
      }
      this.count = res.count;
      this.tableData = res.data;
    },
    uploadChange(file) {
      if (!isAllowFile(file.raw.name, ['.xls', '.xlsx'])) {
        this.$refs.upload.uploadFiles.pop();
        return this.$message.error('请上传excel类型文件');
      }
      if (this.$refs.upload.uploadFiles.length == 2) {
        this.$refs.upload.uploadFiles.shift();
      }
      this.file = file.raw;
    },
    // 确认提交用户信息文件
    async confirmUpload() {
      if (this.file === '') return this.$message.warning('请选择要上传的文件');
      const fd = new FormData();
      fd.append('file', this.file);
      await uploadStudentExcelService(fd);
      this.$message.success('上传用户信息成功');
      this.getData();
      this.$refs.upload.clearFiles();
    },
    async downloadSample() {
      const res = await downloadExceleSmpleService();
      console.log(res);
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

.header {
  position: relative;
  width: 100%;
  display: flex;
}
.header-left {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-bottom: 20px;
}
.header-left > div {
  display: flex;
}
.header-left div:first-child {
  gap: 10px;
}
.header-right {
  width: 350px;
  display: flex;
}
.header-right div:first-of-type {
  flex-grow: 1;
  width: 250px;
}
.search-input {
  display: flex;
  align-items: center;
}
.title {
  width: 50px;
  flex-shrink: 0;
}
.block {
  margin-top: 20px;
}
.inputw {
  width: 300px;
}

/* 弹出框的角色 */
.roles {
  width: 240px !important;
}
/* 弹出框的激活状态 */
.active {
  width: 230px !important;
}
</style>
<style>
#inputh {
  height: 33px !important;
  width: 150px !important;
}
.el-input-group__prepend {
  width: 55px !important;
}
</style>

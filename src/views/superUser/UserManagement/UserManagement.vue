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
            <div class="title">姓名:</div>
            <el-input size="small" v-model="serch.username" placeholder="请输入姓名"></el-input>
          </div>
          <div class="search-input">
            <div class="title">专业:</div>
            <el-input size="small" v-model="serch.major" placeholder="请输入专业"></el-input>
          </div>
          <div class="search-input">
            <div class="title">年级:</div>
            <el-input size="small" v-model="serch.grade" placeholder="请输入年级"></el-input>
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
      <el-table-column prop="username" label="姓名" width="150"></el-table-column>
      <el-table-column prop="roleNickName" label="角色" width="120"></el-table-column>
      <el-table-column prop="active" label="是否激活" width="80">
        <template slot-scope="scope">
          <div v-if="scope.row.active === 0" class="user">激活</div>
          <div v-else-if="scope.row.active === 1" class="forbidden">未激活</div>
        </template>
      </el-table-column>
      <el-table-column prop="major" label="专业"> </el-table-column>
      <el-table-column prop="grade" label="年级"></el-table-column>
      <el-table-column prop="clazz" label="班级" width="150"></el-table-column>
      <el-table-column label="操作" width="250" fixed="right">
        <template slot-scope="{ row }" v-if="row.roleName !== 'supper_admin'">
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
        :hide-on-single-page="count <= 10"
      >
      </el-pagination>
    </div>
    <EditUser :visible.sync="visible" @success="getData" :editData="editData"></EditUser>
  </div>
</template>

<script>
import { delUsers, getUserData, resetPass, delUser } from '@/utils/api';
import { isAllowFile } from '@/utils/upload.js';
import { uploadStudentExcelService, downloadExceleSmpleService } from '@/api/userManagement.js';
import EditUser from './components/EditUser.vue';

export default {
  data() {
    return {
      dialogVisible: false, // 弹框状态
      file: '', // 要上传的文件
      page: 1, // 页数
      count: 0, // 数据总数
      serch: {
        account: '',
        username: '',
        major: '',
        grade: '',
      }, // 搜索显示内容
      searchInfo: {}, // 实际搜索信息
      visible: false, // 弹框状态
      fileList: [], // 上传文件列表
      tableData: [], // 表格数据
      multipleSelection: [], // 多选框当前选中的
      editData: {}, // 编辑数据
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    //添加用户表
    add() {
      this.visible = true;
      this.editData = {};
    },
    //搜索
    async search() {
      if (Object.values(this.serch).every((item) => item === ''))
        return this.$message.warning('请输入查询信息后再查询');
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
    //批量删除
    batchdel() {
      if (this.multipleSelection.length === 0) return this.$message.info('请选择用户再提交');
      this.$confirm('是否删除选中的用户', '删除', { type: 'warning' })
        .then(async () => {
          await delUsers(this.multipleSelection);
          this.$message.success('删除用户成功');
          this.getData();
        })
        .catch(() => {});
    },
    //重置密码
    reset({ userid }) {
      this.$confirm('是否重置选中的用户密码？', '重置密码', { type: 'warning' })
        .then(async () => {
          await resetPass(userid);
          this.$message.success('重置用户密码成功');
        })
        .catch(() => {});
    },
    // 删除
    deleteUser({ userid }) {
      this.$confirm('是否删除该用户', '删除', { type: 'warning' })
        .then(async () => {
          await delUser(userid);
          this.$message.success('删除用户成功');
          this.getData();
        })
        .catch(() => {});
    },
    // 修改
    reviseuser(row) {
      this.editData = row;
      this.visible = true;
    },
    // 选择框选中事件
    handleSelectionChange(val) {
      this.multipleSelection = val.map((item) => item.userid);
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
    // 选择文件后触发
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
      await downloadExceleSmpleService();
    },
  },
  components: {
    EditUser,
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

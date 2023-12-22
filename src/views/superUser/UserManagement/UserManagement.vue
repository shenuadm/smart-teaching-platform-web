<template>
  <div class="user-management">
    <div class="header">
      <div class="header-top">
        <div class="search-input">
          <div class="title">账号:</div>
          <el-input size="small" v-model="search.account" placeholder="请输入账号"></el-input>
        </div>
        <div class="search-input">
          <div class="title">姓名:</div>
          <el-input size="small" v-model="search.username" placeholder="请输入姓名"></el-input>
        </div>
        <div class="search-input">
          <div class="title">角色:</div>
          <el-select v-model="search.role_id" size="small" class="mr-10" placeholder="用户角色">
            <el-option
              v-for="item in roleList"
              :key="item.roleid"
              :label="item.nickname"
              :value="item.roleid"></el-option>
          </el-select>
        </div>
        <div class="search-input flex-grow">
          <div>专业/年级/班级:</div>
          <el-cascader
            v-model="cascaderList"
            :options="majorData"
            @change="changeMajor"
            :props="{ label: 'name', children: 'children', value: 'id' }"></el-cascader>
        </div>
        <el-button type="primary" size="mini" @click="searchClick" class="btn-search">搜索</el-button>
        <el-button type="primary" size="mini" @click="resetting">重置</el-button>
      </div>
      <div class="header-bottom my-5">
        <el-button size="small" style="height: 34px" @click="add" type="primary">添加</el-button>
        <el-button size="small" style="height: 34px" @click="batchdel" type="danger">批量删除</el-button>
        <el-button class="mr-10" size="small" style="height: 34px" @click="downloadSample">下载模板</el-button>
        <el-upload
          action=""
          :auto-upload="false"
          :file-list="fileList"
          :limit="2"
          class="flex user-manage-upload"
          :on-change="uploadChange"
          ref="upload">
          <!--          <el-button slot="trigger" size="small" type="primary">导入用户信息</el-button>-->
          <el-button slot="trigger" size="small" type="primary">导入用户信息</el-button>
          <el-button style="height: 34px" type="primary" size="small" @click="confirmUpload" class="ml-10"
            >确认上传</el-button
          >
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
      border>
      <el-table-column type="selection" width="50"> </el-table-column>
      <el-table-column prop="account" label="账号" width="120"></el-table-column>
      <el-table-column prop="username" label="姓名" width="150"></el-table-column>
      <el-table-column prop="roleNickName" label="角色" width="120" show-overflow-tooltip></el-table-column>
      <el-table-column prop="active" label="是否激活" width="80">
        <template #default="scope">
          <div v-if="scope.row.active === 0" class="user">激活</div>
          <div v-else-if="scope.row.active === 1" class="forbidden">未激活</div>
        </template>
      </el-table-column>
      <el-table-column prop="major" label="专业" show-overflow-tooltip> </el-table-column>
      <el-table-column prop="grade" label="年级"></el-table-column>
      <el-table-column prop="clazz" label="班级" width="150"></el-table-column>
      <el-table-column label="操作" width="250" fixed="right">
        <template #default="scope">
          <template v-if="scope.row.roleName !== 'supper_admin'">
            <el-button type="primary" size="mini" @click="reset(scope.row)">重置密码</el-button>
            <el-button type="primary" size="mini" @click="editUser(scope.row)">编辑</el-button>
            <el-button type="danger" size="mini" @click="deleteUser(scope.row)">删除</el-button>
          </template>
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
        :hide-on-single-page="count <= 10">
      </el-pagination>
    </div>
    <EditUser
      :visible.sync="visible"
      @success="getData"
      :editData="editData"
      :role-list="roleList"
      :major-data="majorData"></EditUser>
  </div>
</template>

<script>
import { delUsers, getUserData, resetPass, delUser } from '@/utils/api';
import { isAllowFile } from '@/utils/upload.js';
import { uploadStudentExcelService, getUserRoleService } from '@/api/userManagement.js';
import EditUser from './components/EditUser.vue';
import { getActiveLearService } from '@/api/systemSetting';
import { getSearchInfo } from '@/utils';

export default {
  data() {
    return {
      dialogVisible: false, // 弹框状态
      file: '', // 要上传的文件
      page: 1, // 页数
      count: 0, // 数据总数
      search: {
        account: '',
        username: '',
        major_id: '',
        grade_id: '',
        clazz_id: '',
        role_id: '',
      }, // 搜索显示内容
      searchInfo: {}, // 实际搜索信息
      visible: false, // 弹框状态
      fileList: [], // 上传文件列表
      tableData: [], // 表格数据
      multipleSelection: [], // 多选框当前选中的
      editData: {}, // 编辑数据
      roleList: [], //  角色列表
      majorData: [], // 年级班级专业级联列表
      cascaderList: [],
    };
  },
  mounted() {
    this.getData();
    this.getRoleList();
    this.getMajorData();
  },
  methods: {
    //添加用户表
    add() {
      this.visible = true;
      this.editData = {};
    },
    //搜索
    async searchClick() {
      console.log(this.search);
      if (Object.values(this.search).every((item) => item === ''))
        return this.$message.warning('请输入查询信息后再查询');
      this.page = 1;
      this.searchInfo = JSON.parse(JSON.stringify(this.search));
      await this.getData();
    },
    // 重置表格数据
    resetting() {
      this.search = {};
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
          await this.getData();
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
          await this.getData();
        })
        .catch(() => {});
    },
    // 修改
    editUser(row) {
      this.editData = row;
      this.visible = true;
    },
    // 选择框选中事件
    handleSelectionChange(val) {
      this.multipleSelection = val.map((item) => (item.roleName !== 'supper_admin' ? item.userid : ''));
    },
    // 获取数据
    async getData() {
      const search = { ...this.searchInfo, page: this.page };
      const params = getSearchInfo(search);
      const { count, data } = await getUserData(params);
      this.count = count;
      this.tableData = data;
    },
    // 获取专业列表
    async getMajorData() {
      const { data } = await getActiveLearService();
      this.majorData = data;
    },
    async getRoleList() {
      const { data } = await getUserRoleService();
      this.roleList = data;
    },
    // 选择文件后触发
    uploadChange(file) {
      if (!isAllowFile(file.raw.name, ['.xls', '.xlsx'])) {
        this.$refs.upload.uploadFiles.pop();
        return this.$message.error('请上传excel类型文件');
      }
      if (this.$refs.upload.uploadFiles.length === 2) {
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
      await this.getData();
      this.$refs.upload.clearFiles();
    },
    async downloadSample() {
      location.href = 'http://localhost:8080/export/UserImportTemplate_170122009491646.xlsx';
    },
    changeMajor(val) {
      const [majorId, gradeId, clazzId] = val;
      this.search.major_id = majorId;
      this.search.grade_id = gradeId;
      this.search.clazz_id = clazzId;
      console.log(clazzId, 'clazz');
    },
  },
  components: {
    EditUser,
  },
};
</script>

<style scoped>
.header-top {
  display: flex;
  gap: 10px;
}
.header-bottom {
  display: flex;
  min-height: 44px;
  align-items: center;
}
.user {
  color: #409eff;
}
.forbidden {
  color: red;
}

.header {
  position: relative;
  width: 100%;
}
.header-left > div {
  display: flex;
}
.header-left div:first-child {
  gap: 10px;
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
</style>

<style>
/* 上传学生的文件上传组件，待上传文件在横排展示*/
.user-manage-upload .el-upload-list {
  display: flex;
  align-items: center;
}
.user-manage-upload .el-upload-list li {
  margin-top: 0;
}
.user-management .el-tooltip {
  display: revert;
}
</style>

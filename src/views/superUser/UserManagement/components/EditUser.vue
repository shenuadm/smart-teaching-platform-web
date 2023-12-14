<template>
  <el-dialog
    :close-on-click-modal="false"
    :title="(formData.userid ? '编辑' : '新增') + '用户'"
    :visible="visible"
    :before-close="cancel"
    width="30%"
  >
    <el-form ref="formRef" :model="formData" label-width="100px" :rules="rules" class="user-edit-form">
      <el-form-item label="用户账号：" prop="account">
        <el-input v-model="formData.account" placeholder="请输入用户账号"></el-input>
      </el-form-item>
      <el-form-item label="用户姓名：" prop="username">
        <el-input v-model="formData.username" placeholder="请输入用户姓名"></el-input>
      </el-form-item>
      <el-form-item label="用户角色：" prop="roleId" class="roles">
        <el-select v-model="formData.roleId" placeholder="请选择角色">
          <el-option
            v-for="item in userRole"
            :key="item.roleid"
            :label="item.nickname"
            :value="item.roleid"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="用户手机：" prop="phone">
        <el-input type="number" v-model.number="formData.phone" placeholder="请输入用户手机号"></el-input>
      </el-form-item>
      <!-- <template v-if="!formData.userid || formData.roleName === 'student'"> -->
      <template v-if="isStudent">
        <el-form-item label="学生专业" prop="major">
          <el-input v-model="formData.major" placeholder="请输入学生专业"></el-input>
        </el-form-item>
        <el-form-item label="学生年级" prop="grade">
          <el-input v-model="formData.grade" placeholder="请输入学生年级"></el-input>
        </el-form-item>
        <el-form-item label="学生班级" prop="clazz">
          <el-input v-model="formData.clazz" placeholder="请输入学生班级"></el-input>
        </el-form-item>
      </template>
      <el-form-item label="是否激活：" prop="active" class="active">
        <el-radio-group v-model="formData.active">
          <el-radio :label="0">激活</el-radio>
          <el-radio :label="1">不激活</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <span slot="footer">
      <el-button @click="cancel">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { addUser, reviseUser } from '@/utils/api';
import { getUserRoleService } from '@/api/userManagement.js';

const defaultData = {
  account: '',
  username: '',
  roleId: '',
  active: 0,
  grade: '',
  major: '',
  clazz: '',
};

export default {
  data() {
    const userRule = (rules, value, callback) => {
      if (this.formData.roleId === '') return callback();
      if (
        this.userRole.find((item) => item.roleid === this.formData.roleId).rolename === 'student' &&
        (value === '' || value === null)
      ) {
        callback(new Error('学生角色请输入专业、年级、班级信息'));
      } else {
        callback();
      }
    };
    const phone = (rule, value, callback) => {
      const regex = /^1[3-9]\d{9}$/;
      if (this.formData.phone === '' || this.formData.phone === null) return callback();
      else if (!regex.test(value)) {
        callback(new Error('请输入正确的手机号'));
      } else {
        callback();
      }
    };
    return {
      formData: { ...defaultData },
      rules: {
        account: [{ required: true, message: '请输入用户账号', trigger: 'blur' }],
        username: [{ required: true, message: '请输入用户姓名', trigger: 'blur' }],
        roleId: [{ required: true, message: '请选择角色', trigger: 'blur' }],
        active: [{ required: true, message: '请选择激活状态', trigger: 'change' }],
        grade: [{ validator: userRule, trigger: 'blur' }],
        major: [{ validator: userRule, trigger: 'blur' }],
        clazz: [{ validator: userRule, trigger: 'blur' }],
        phone: [{ validator: phone, trigger: 'blur' }],
      },
      userRole: [],
    };
  },
  methods: {
    cancel() {
      this.$refs.formRef.clearValidate();
      this.$emit('update:visible', false);
    },
    submit() {
      this.$refs.formRef.validate(async (validate) => {
        if (validate) {
          if (this.userRole.find((item) => item.roleid === this.formData.roleId).rolename !== 'student') {
            // delete this.formData.major;
            // delete this.formData.clazz;
            // delete this.formData.grade;
            this.formData.major = '';
            this.formData.clazz = '';
            this.formData.grade = '';
          }
          if (this.formData.userid) {
            await reviseUser(this.formData);
            this.$message.success('修改用户成功');
          } else {
            await addUser(this.formData);
            this.$message.success('添加用户成功');
          }
          this.cancel();
          this.$emit('success');
        }
      });
    },
    async getUserRole() {
      const res = await getUserRoleService();
      this.userRole = res.data;
    },
  },
  computed: {
    isStudent() {
      if (this.formData.roleId === '' || this.formData.roleId === null) {
        return false;
      } else if (this.userRole.find((item) => item.roleid === this.formData.roleId).rolename === 'student') {
        return true;
      }
      return false;
    },
  },
  props: ['visible', 'editData'],
  watch: {
    editData(newVal) {
      if (this.userRole.length === 0) {
        this.getUserRole();
      }
      this.formData = { ...defaultData, ...newVal };
    },
  },
};
</script>

<style>
/* 选择器靠左 */
.user-edit-form .el-form-item__content {
  text-align: initial;
}
</style>

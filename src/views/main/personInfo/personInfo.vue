<template>
  <div class="person-info" v-loading="$store.state.isLoading">
    <div class="user-info" :class="!$store.getters.isStudent ? 'student' : ''">
      <!-- 学生不可修改信息 -->
      <el-form :model="ruleForm" v-if="$store.state.rolename === 'student'" label-width="100px">
        <el-form-item label="账号">
          <el-input v-model="ruleForm.account" disabled></el-input>
        </el-form-item>
        <el-form-item label="专业">
          <el-input v-model="ruleForm.major" disabled></el-input>
        </el-form-item>
        <el-form-item label="年级">
          <el-input v-model="ruleForm.grade" disabled></el-input>
        </el-form-item>
        <el-form-item label="班级">
          <el-input v-model="ruleForm.clazz" disabled></el-input>
        </el-form-item>
      </el-form>
      <!-- 学生可修改信息 -->
      <el-form :model="ruleForm" v-if="$store.getters.isStudent" label-width="100px" ref="ruleForm" :rules="rules">
        <el-form-item label="姓名" prop="username">
          <el-input v-model="ruleForm.username" autocomplete="off" placeholder="请输入您的账号姓名"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input
            v-model.number="ruleForm.phone"
            autocomplete="off"
            placeholder="请输入手机号"
            type="number"
          ></el-input>
        </el-form-item>
        <el-form-item label="原密码" prop="oldpwd">
          <el-input v-model="ruleForm.oldpwd" autocomplete="off" type="password" placeholder="请输入原密码"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="password">
          <el-input
            v-model="ruleForm.password"
            autocomplete="off"
            type="password"
            placeholder="请输入新密码"
          ></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="renewpwd">
          <el-input
            v-model="ruleForm.renewpwd"
            autocomplete="off"
            type="password"
            placeholder="请输入确认密码"
          ></el-input>
        </el-form-item>
      </el-form>
      <!-- 其它角色信息 -->
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px" v-else>
        <el-form-item label="账号">
          <el-input disabled v-model="ruleForm.account" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="username">
          <el-input v-model="ruleForm.username" autocomplete="off" placeholder="请输入您的账号姓名"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input
            v-model.number="ruleForm.phone"
            autocomplete="off"
            placeholder="请输入手机号"
            type="number"
          ></el-input>
        </el-form-item>
        <el-form-item label="原密码" prop="oldpwd">
          <el-input v-model="ruleForm.oldpwd" autocomplete="off" type="password" placeholder="请输入原密码"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="password">
          <el-input
            v-model="ruleForm.password"
            autocomplete="off"
            type="password"
            placeholder="请输入新密码"
          ></el-input>
        </el-form-item>
        <el-form-item label="确认新密码" prop="renewpwd">
          <el-input
            v-model="ruleForm.renewpwd"
            autocomplete="off"
            type="password"
            placeholder="请输入确认密码"
          ></el-input>
        </el-form-item>
      </el-form>
      <div class="login-log">
        <p>上次登录时间：{{ personMsg.lastLoginTime }}</p>
        <p>上次登录IP：{{ personMsg.lastLoginIp }}</p>
      </div>
    </div>

    <div>
      <el-button type="primary" @click="submitForm">保存</el-button>
      <el-button type="info" @click="resetForm">重置</el-button>
    </div>
  </div>
</template>

<script>
import { saveUserInfoService, getUserInfoService } from '@/api/user.js';
export default {
  data() {
    const newpwd = (rule, value, callback) => {
      const regex = /^[a-zA-Z0-9]\w{5,17}$/;
      if (value === '' && this.ruleForm.oldpwd === '') {
        callback();
      } else if (!regex.test(value)) {
        callback(new Error('请输入6至18位密码，不含有中文字符'));
      } else {
        callback();
      }
    };
    const password = (rule, value, callback) => {
      if (value !== this.ruleForm.renewpwd) {
        callback(new Error('两次输入密码不一致！请重新输入'));
      } else {
        callback();
      }
    };
    const oldPWd = (rule, value, callback) => {
      const regex = /^[a-zA-Z0-9]\w{5,17}$/;
      if (this.ruleForm.oldpwd === '') return callback();
      else if (!regex.test(value)) {
        callback(new Error('请输入6至18位密码，不含有中文字符'));
      } else {
        callback();
      }
    };
    const phone = (rule, value, callback) => {
      const regex = /^1[3-9]\d{9}$/;
      if (this.ruleForm.phone === '' || this.ruleForm.phone === null) return callback();
      else if (!regex.test(value)) {
        callback(new Error('请输入正确的手机号'));
      } else {
        callback();
      }
    };
    return {
      // 表单数据
      ruleForm: {
        // account: '', //账号
        // username: '', //昵称
        // oldpwd: '', //原密码
        // password: '', //新密码
        // renewpwd: '', //确认新密码
      },
      // 表单校验规则
      rules: {
        username: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        oldpwd: [{ validator: oldPWd, trigger: 'blur' }],
        password: [{ validator: password, trigger: 'blur' }],
        renewpwd: [{ validator: newpwd, trigger: 'blur' }],
        phone: [{ validator: phone, trigger: 'blur' }],
      },
      // 接收个人信息
      personMsg: {},
    };
  },
  created() {
    this.getUserInfo();
  },
  mounted() {},
  methods: {
    // 保存表单
    submitForm() {
      this.$refs['ruleForm'].validate(async (valid) => {
        if (valid) {
          // const data = {
          //   oldpwd: this.ruleForm.oldpwd,
          //   password: this.ruleForm.newpwd,
          //   account: this.ruleForm.nickname,
          // };
          // const {  } = this.ruleForm
          await saveUserInfoService(this.ruleForm);
          await this.getUserInfo();
          this.$message.success('修改名称成功');
        }
      });
    },
    // 获取用户信息
    async getUserInfo() {
      const res = await getUserInfoService();
      sessionStorage.setItem('username', res.data.username);
      this.$store.commit('getUsername');
      this.personMsg = { ...res.data, oldpwd: '', renewpwd: '', password: '' };
      this.ruleForm = { ...res.data, oldpwd: '', renewpwd: '', password: '' };
      console.log(this.ruleForm);
    },
    // 重置表单
    resetForm() {
      this.$refs['ruleForm'].resetFields();
      this.ruleForm = this.personMsg;
    },
  },
};
</script>

<style scoped>
.person-info {
  padding: 50px;
  background: #fff;
}
.user-info {
  display: grid;
  gap: 20px;
  grid-template-columns: 1fr 1fr 1fr;
}
/* 学生端的页面 */
.person-info .user-info.student {
  grid-template-columns: 1fr 1fr;
}

.login-log p {
  text-align: left;
  font-size: 14px;
}
</style>

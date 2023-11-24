<template>
  <div class="person-content">
    <el-form
      ref="ruleForm"
      :model="ruleForm"
      :rules="rules"
      status-icon
      label-width="100px"
      class="form-list"
    >
      <el-form-item label="账号" prop="name">
        <el-input
          disabled
          v-model="ruleForm.name"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="昵称" prop="nickname">
        <el-input v-model="ruleForm.nickname" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="原密码" prop="oldpwd">
        <el-input v-model="ruleForm.oldpwd" autocomplete="off" type="password"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="newpwd">
        <el-input v-model="ruleForm.newpwd" autocomplete="off" type="password"></el-input>
      </el-form-item>
      <el-form-item label="确认新密码" prop="renewpwd">
        <el-input v-model="ruleForm.renewpwd" autocomplete="off" type="password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" @click="submitForm('ruleForm')"
          >保存</el-button
        >
        <el-button type="primary" size="small" @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="login-log">
      <p>上次登录时间：{{personMsg.lastLoginTime}}</p>
      <p>上次登录IP：{{personMsg.lastLoginIp}}</p>
    </div>
  </div>
</template>

<script>
import {getPersonInfo,savePersonInfo} from '@/utils/api.js'
export default {
  data() {
    //正则判断新密码
    let newpwd = (rule, value, callback) => {
      const regex = /^[a-zA-Z0-9]\w{5,17}$/;
      if (value === "") {
        callback(new Error("请输入您的新密码"));
      } else if (!regex.test(value)) {
        callback(new Error("请输入6至18位密码，不含有中文字符"));
      } else {
        callback();
      }
    };
    //再次验证密码两次是否一致
    let renewpwd = (rule, value, callback) => {
      if (!value) return callback(new Error("请再次输入您的新密码"));
      if (value !== this.ruleForm.newpwd) {
        callback(new Error("两次输入密码不一致！请重新输入"));
      } else {
        callback();
      }
    };
    return {
      // 表单数据
      ruleForm: {
        name: "", //账号
        nickname: "", //昵称
        oldpwd: "", //原密码
        newpwd: "", //新密码
        renewpwd: "", //确认新密码
      },
      // 表单校验规则
      rules: {
        name: [{ required: true, message: "请输入账号", trigger: "blur" }],
        nickname: [{ required: true, message: "请输入昵称", trigger: "blur" }],
        oldpwd: [{ required: true, message: "请输入密码", trigger: "blur" }],
        newpwd: [{ required: true, validator: newpwd, trigger: "blur" }],
        renewpwd: [{ required: true, validator: renewpwd, trigger: "blur" }],
      },
      // 接收个人信息
      personMsg:{}
    };
  },
  created() {
    getPersonInfo().then(res=>{
      this.personMsg = res.data
      this.ruleForm.name = this.personMsg.account
      this.ruleForm.nickname = this.personMsg.username
    })
  },
  mounted() {
  },
  methods: {
    // 保存表单
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        let oldpwd = localStorage.getItem("oldpwd");
        let data = {
          oldpwd: this.ruleForm.oldpwd,
          password: this.ruleForm.newpwd,
        };
        if (valid && this.ruleForm.oldpwd === oldpwd) {
          savePersonInfo(data).then((res) => {
            console.log(res);
            this.$message({
              message: res.msg,
            });
          });
        } else {
          this.$message({
            message: "信息修改失败",
            type: "warning",
          });
          return false;
        }
      });
    },
    // 重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.ruleForm.name = this.personMsg.account
      this.ruleForm.nickname = this.personMsg.username
    },
  },
};
</script>

<style scoped>
.person-content {
  display: flex;
  padding: 50px;
}
.form-list {
  flex: 1;
}
.login-log {
  margin-left: 50px;
  min-width: 270px;
  height: 80px;
  padding: 10px 20px;
  border-radius: 5px;
  border: 1px solid #efefef;
}
.login-log p {
  text-align: left;
  font-size: 14px;
}
</style>
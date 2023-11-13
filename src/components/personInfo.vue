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
        <el-input v-model="ruleForm.oldpwd" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="newpwd">
        <el-input v-model="ruleForm.newpwd" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="确认新密码" prop="renewpwd">
        <el-input v-model="ruleForm.renewpwd" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')"
          >保存</el-button
        >
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="login-log">
      <p>上次登录时间：2023-10-23 10:41:12</p>
      <p>上次登录IP：192.168.20.254</p>
    </div>
  </div>
</template>

<script>
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
    };
  },
  mounted() {
    this.personInfo();
  },
  methods: {
    personInfo() {
      let account = localStorage.getItem("account");
      let username = localStorage.getItem("username");
      this.ruleForm.name = account;
      this.ruleForm.nickname = username;
    },
    // 保存表单
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log(this.ruleForm);
        } else {
          // console.log("error submit!!");
          this.$message({
            title: "信息修改失败",
            type: "warning",
          });
          return false;
        }
      });
    },
    // 重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.ruleForm.name = localStorage.getItem("account");
      this.ruleForm.nickname = localStorage.getItem("username");
      // this.$refs[formName].resetField();
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
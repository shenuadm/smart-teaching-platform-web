<template>
  <div>
    <!-- 标题 -->
    <div class="person-title">个人信息</div>
    <!-- 信息内容 -->
    <div>
      <div class="person-info">
        <el-form
          :model="ruleForm"
          status-icon
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="账号" prop="account">
            <el-input
              disabled
              v-model="ruleForm.account"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="昵称" prop="nickname">
            <el-input v-model="ruleForm.nickname" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="原密码" prop="OriginPassword">
            <el-input
              v-model="ruleForm.OriginPassword"
              autocomplete="off"
              type="password"
            ></el-input>
          </el-form-item>
          <el-form-item label="新密码" prop="newPassword">
            <el-input
              v-model="ruleForm.newPassword"
              autocomplete="off"
              type="password"
            ></el-input>
          </el-form-item>
          <el-form-item label="确认新密码" prop="confirmPassword">
            <el-input
              v-model="ruleForm.confirmPassword"
              autocomplete="off"
              type="password"
            ></el-input>
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
    </div>
  </div>
</template>

<script>
import adapter from "./adapter";
export default {
  data() {
    //正则判断新密码
    let newPass = (rule, value, callback) => {
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
    let confirmPass = (rule, value, callback) => {
      if (!value) return callback(new Error("请再次输入您的新密码"));
      if (value !== this.ruleForm.newPassword) {
        callback(new Error("两次输入密码不一致！请重新输入"));
      } else {
        callback();
      }
    };
    return {
      ...adapter.data,
      ruleForm: {
        account: "", //账号
        nickname: "", //昵称
        OriginPassword: "", //原密码
        newPassword: "", //新密码
        confirmPassword: "", //确认密码
      },
      // 表单校验规则
      rules: {
        account: [{ required: true, message: "请输您的账号", trigger: "blur" }],
        nickname: [
          { required: true, message: "请输入您的昵称", trigger: "blur" },
        ],
        OriginPassword: [
          {
            required: true,
            message: "请输入您的密码",
            trigger: "blur",
          },
        ],
        newPassword: [
          {
            required: true,
            validator: newPass,
            trigger: "blur",
          },
        ],
        confirmPassword: [
          {
            required: true,
            validator: confirmPass,
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {
    let account = localStorage.getItem("account");
    let username = localStorage.getItem("username");
    this.ruleForm.account = account;
    this.ruleForm.nickname = username;
  },
  mounted() {},
  methods: {
    ...adapter.methods,
    // 保存表单
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log(this.ruleForm);
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.ruleForm.account = localStorage.getItem("account");
      this.ruleForm.nickname = localStorage.getItem("username");
    },
  },
};
</script>

<style scoped>
.person-title {
  height: 60px;
  line-height: 60px;
  padding: 0 50px;
  text-align: left;
  font-size: 20px;
  border-bottom: 2px solid #efefef;
  background-color: #fff;
}
.person-info {
  display: flex;
  padding: 50px;
  background-color: #fff;
}
.demo-ruleForm {
  flex: 1;
}
.login-log {
  margin-left: 50px;
  min-width: 270px;
  height: 80px;
  padding: 10px 20px;
  border-radius: 5px;
  border: 1px solid rgb(234, 230, 230);
}
.login-log p {
  text-align: left;
  font-size: 14px;
}
</style>

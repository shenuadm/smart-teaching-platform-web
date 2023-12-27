<template>
  <div class="bg" id="loginRegister">
    <div class="login center" v-loading="$store.state.isLoading">
      <div class="login-num flex-grow">登录账号</div>
      <!-- 登录 -->
      <div class="content-login">
        <el-form :model="loginForm" :rules="loginRules" ref="loginForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="账号" prop="account">
            <el-input type="text" v-model="loginForm.account" autocomplete="off" placeholder="请输入用户名"> </el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input type="password" v-model="loginForm.password" autocomplete="off" placeholder="请输入密码">
            </el-input>
          </el-form-item>
          <el-form-item class="login-btn text-center">
            <el-button type="primary" @click="login">登录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import { loginService } from '@/api/user';
export default {
  data() {
    // 密码
    let pwd = (rule, value, callback) => {
      const regex = /^[a-zA-Z0-9]{3,18}$/;
      if (value === '') {
        callback(new Error('请输入密码'));
      } else if (!regex.test(value)) {
        callback(new Error('请输入3-18位英文、数字组成的密码'));
      } else {
        callback();
      }
    };
    return {
      loginForm: {
        account: '',
        password: '',
      },
      loginRules: {
        account: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { validator: pwd, trigger: 'blur' },
        ],
      },
    };
  },
  methods: {
    login() {
      this.$refs.loginForm.validate(async (valid) => {
        if (valid) {
          // 登录
          const res = await loginService(this.loginForm);
          localStorage.setItem('satoken', res.tokenValue); // 存token
          localStorage.setItem('navData', JSON.stringify(res.menuVoList)); // 存导航信息
          sessionStorage.setItem('rolename', res.rolename); // 角色名称
          this.$store.commit('getRolename');
          this.$store.commit('updateUsername', res.username);
          sessionStorage.setItem('username', res.username);
          this.$message.success({ message: '登录成功', duration: 1500 });
          this.$router.push('/user/getInfo');
        }
      });
    },
  },
  name: 'loginIndex',
};
</script>

<style scoped>
.bg {
  width: 100%;
  height: 595px;
  background-color: #f8f6f6;
}
.center {
  left: 50%;
  transform: translateX(-50%);
}
.login {
  position: relative;
  width: 460px;
  background-color: white;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  border: 1px solid #dedede;
}

img {
  width: 100px;
  height: 100px;
}
.login-num {
  height: 62px;
  font-size: 16px;
  text-align: center;
  line-height: 62px;
  background-color: white;
}

.content-login {
  height: auto;
  margin-top: 20px;
  padding-right: 20px;
}
.pas-tow > span {
  display: inline-block;
  text-indent: 10px;
}
.number > span,
.pas > span,
.name > span,
.pas-tow > span,
.enr-number > span {
  position: relative;
  color: #0000008f;
  font-weight: 700;
  left: -46%;
}
.enr-number > span,
.pas-tow > span {
  position: relative;
  color: #0000008f;
  font-weight: 700;
  left: -43%;
}
.enr-number > span::before,
.name > span::before,
.pass > span::before,
.pas-tow > span::before {
  content: '*';
  color: red;
  margin-right: 10px;
  position: absolute;
  top: 3px;
  left: -9px;
}
</style>
<style>
#loginRegister .el-form-item__label {
  text-align: center;
}
#loginRegister .login-btn .el-form-item__content,
#loginRegister .register-btn .el-form-item__content {
  margin: 0 !important;
}
</style>

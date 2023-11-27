<template>
  <div class="bg" id="loginRegister">
    <div class="login center">
      <div class="login-tab">
        <div class="login-num" @click="toLogin">
          登录账号
          <div class="bglog" v-if="enrolldis">登录账号</div>
        </div>
        <div class="enroll-num" @click="toEnroll">
          注册账号
          <div class="bgenr" v-if="logindis">注册账号</div>
        </div>
      </div>
      <div class="content center">
        <!-- 登录 -->
        <div class="content-login" v-if="logindis">
          <el-form
            :model="loginForm"
            :rules="loginRules"
            ref="loginForm"
            label-width="100px"
            class="demo-ruleForm"
          >
            <el-form-item label="账号" prop="logNum">
              <el-input
                type="text"
                v-model="loginForm.logNum"
                autocomplete="off"
                placeholder="请输入用户名"
              >
              </el-input>
            </el-form-item>
            <el-form-item label="密码" prop="logPas">
              <el-input
                type="password"
                v-model="loginForm.logPas"
                autocomplete="off"
                placeholder="请输入密码"
              >
              </el-input>
            </el-form-item>
            <el-form-item class="login-btn">
              <el-button type="primary" @click="Login('loginForm')"
                >登录</el-button
              >
            </el-form-item>
          </el-form>
          <div>
            <p>
              还没有账号？<a
                href="javascript:void(0)"
                class="zh-fc-blue"
                @click="toRegister"
                >去注册</a
              >
            </p>
          </div>
        </div>
        <!-- 注册 -->
        <div class="enroll-login" v-if="enrolldis">
          <el-form
            :model="registerForm"
            :rules="registerRules"
            ref="registerForm"
            label-width="100px"
            class="demo-ruleForm"
          >
            <el-form-item label="用户名" prop="username">
              <el-input
                v-model="registerForm.username"
                maxlength="30"
                placeholder="请输入用户名，最长30个字符"
              >
              </el-input>
            </el-form-item>
            <el-form-item label="昵称" prop="nikename">
              <el-input
                v-model="registerForm.nikename"
                maxlength="20"
                placeholder="请输入昵称，最长20个字符"
              >
              </el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input
                v-model="registerForm.password"
                maxlength="18"
                placeholder="请输入3-18位英文、数字组成的密码"
              >
              </el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="enrPast">
              <el-input v-model="registerForm.enrPast" placeholder="请确认密码">
              </el-input>
            </el-form-item>
            <el-form-item class="register-btn">
              <el-button type="primary" @click="Enroll('registerForm')"
                >注册</el-button
              >
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { toLogin, toRegister } from '@/utils/api.js';
export default {
  components: {},
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
    // 确认密码
    let repwd = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.registerForm.password) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      logindis: true,
      enrolldis: false,
      loginForm: {
        logNum: '',
        logPas: '',
      },
      loginRules: {
        logNum: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        logPas: [{ required: true, message: '请输入密码', trigger: 'blur' }],
      },
      registerForm: {
        account: '',
        username: '',
        password: '',
        enrPast: '',
      },
      registerRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
        ],
        nikename: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
        password: [{ required: true, validator: pwd, trigger: 'blur' }],
        enrPast: [{ required: true, validator: repwd, trigger: 'blur' }],
      },
    };
  },
  mounted() {},
  methods: {
    toLogin() {
      this.logindis = true;
      this.enrolldis = false;
    },
    toEnroll() {
      this.logindis = false;
      this.enrolldis = true;
    },
    Login(formName) {
      let data = {
        account: this.loginForm.logNum,
        password: this.loginForm.logPas,
      };
      if (this.loginForm.logNum === '' || this.loginForm.logPas === '') {
        this.$message({
          message: '用户名或者密码不可为空',
          type: 'error',
        });
      } else {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            // 登录
            toLogin(data).then((res) => {
              if (res.msg != 'success') {
                this.$message.error(res.msg);
              } else {
                let tokenValue = res.tokenValue;
                localStorage.setItem('satoken', tokenValue);
                let navData = JSON.stringify(res.menuVoList);
                localStorage.setItem('navData', navData);
                localStorage.setItem('roleId', res.roleId);
                this.$store.commit('updateUsername', res.username);
                // this.$store.commit("updateRoleId",res.roleId)
                sessionStorage.setItem('username', res.username);
                localStorage.setItem('oldpwd', data.password);
                this.$message.success({ message: '登录成功', duration: 1500 });
                if (res.roleId === 1) {
                  this.$router.push({ path: '/personmsg' });
                }
                if (res.roleId === 2) {
                  this.$router.push({ path: '/personalInfo' });
                }
                if (res.roleId === 3) {
                  this.$router.push({ path: '/personInfo' });
                }
              }
            });
          }
        });
      }
    },
    toRegister() {
      this.enrolldis = true;
      this.logindis = false;
    },
    Enroll(formName) {
      let data = {
        account: this.registerForm.username,
        username: this.registerForm.nikename,
        password: this.registerForm.password,
      };
      this.$refs[formName].validate((valid) => {
        if (valid) {
          toRegister(data).then((res) => {
            if (res.msg === 'success') {
              this.$message({
                message: '注册成功',
                type: 'success',
              });
              this.registerForm = {};
            }
          });
        } else {
          this.$message({
            message: '注册失败',
            type: 'info',
          });
          return false;
        }
      });
    },
  },
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
.login-tab {
  position: relative;
  width: 100%;
  display: flex;
}
img {
  width: 100px;
  height: 100px;
}
.login-num,
.enroll-num {
  width: 50%;
  height: 62px;
  font-size: 16px;
  text-align: center;
  line-height: 62px;
  cursor: pointer;
  background-color: white;
}
.bglog,
.bgenr {
  position: relative;
  width: 100%;
  height: 62px;
  background-color: #f8f6f6;
  top: -62px;
}

.content {
  position: relative;
  width: 428px;
  height: auto;
  padding-bottom: 10px;
  box-sizing: border-box;
}
.content-login {
  height: auto;
  margin-top: 20px;
}
.enroll-login {
  position: relative;
  height: auto;
  top: 20px;
}
.number,
.pas,
.name,
.pas-tow,
.enr-number {
  position: relative;
  width: 338px;
  height: 67px;
  margin-top: 20px;
}
.pas-tow > span {
  display: inline-block;
  text-indent: 10px;
}
.input-number,
.input-pas,
.input-name,
.input-pas-tow,
.input-enr-number {
  position: relative;
  width: 338px;
  height: 40px;
  padding-left: 15px;
  border: 1px solid #e1e1e1;
}
.input-number:focus,
.input-pas:focus,
.input-name:focus,
.input-pas-tow:focus,
.input-enr-number:focus {
  outline: none;
  border-color: #43bc60;
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

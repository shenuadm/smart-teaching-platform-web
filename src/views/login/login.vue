<template >
  <div class="bg">
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
          <div class="number center">
            <span>账号</span>
            <input
              type="text"
              class="input-number center"
              placeholder="账号"
              v-model="logNum"
            />
          </div>
          <div class="pas center">
            <span>密码</span>
            <input
              type="password"
              class="input-pas center"
              placeholder="密码"
              v-model="logPas"
            />
          </div>
          <div>
            <button class="login-but" @click="Login">登录</button>
          </div>
          <div>
            <p>还没有账号？<a href="javascript:void(0)" class="zh-fc-blue" @click="toRegister">去注册</a></p>
          </div>
        </div>
        <!-- 注册 -->
        <div class="enroll-login" v-if="enrolldis">
          <div class="enr-number center">
            <span>手机/邮箱</span>
            <input
              type="text"
              class="input-enr-number center"
              placeholder="填写你常用的手机号或邮箱号"
              v-model="enrNum"
            />
          </div>
          <div class="name center">
            <span>用户名</span>
            <input
              type="text"
              class="input-name center"
              placeholder="中英文均可，最长18个英文或9个汉字"
              v-model="username"
            />
          </div>
          <div class="pas center">
            <span>密码</span>
            <input
              type="password"
              class="input-pas center"
              placeholder="5-20位英文、数字、符号、区分大小写"
              v-model="password"
            />
          </div>
          <div class="pas-tow center">
            <span>确认密码</span>
            <input
              type="password"
              class="input-pas-tow center"
              placeholder="请确认密码"
              v-model="enrPast"
            />
          </div>
          <div>
            <button class="enroll-but" @click="Enroll">注册</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { toLogin } from "@/utils/api.js";
export default {
  components: {},
  data() {
    return {
      logindis: true,
      enrolldis: false,
      logNum: "",
      logPas: "",
      enrNum: "",
      username: "",
      password: "",
      enrPast: "",
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
    Login() {
      let data = {
        account: this.logNum,
        password: this.logPas,
      };
      // 登录
      toLogin(data).then((res) => {
        if (res.msg != "success") {
          this.$message.error(res.msg);
        } else {
          let tokenValue = res.tokenValue;
          let username = res.username;
          localStorage.setItem("satoken", tokenValue);
          let navData = JSON.stringify(res.menuVoList);
          localStorage.setItem("navData", navData);
          localStorage.setItem("roleId",res.roleId);
          if (res.roleId === 1) {
            localStorage.setItem("username", username); //用户名
            localStorage.setItem("account", data.account); //账号
            //超级管理员端
            this.$router.push({
              path: "/personmsg",
              name: "personmsg",
            });
          } else if (res.roleId === 2) {
            localStorage.setItem("username", username); //用户名
            localStorage.setItem("account", data.account); //账号
            //教师端
            this.$router.push({
              path: "/personalInfo",
              name: "personalInfo",
            });
          } else if (res.roleId === 3) {
            localStorage.setItem("oldpwd", data.password);
            //学生端
            this.$router.push({
              path: "/personInfo",
              name: "personInfo",
            });
          }
        }
      });
    },
    toRegister(){
      this.enrolldis = true
      this.logindis = false
    },
    Enroll() {
      if (/^.{11,}$/.test(this.enrNum)) {
        if (/^(?:[\u4e00-\u9fa5]{1,9}|[\w]{1,18})$/.test(this.username)) {
          if (/^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{6,12}$/.test(this.password)) {
            if (this.password === this.enrPast) {
              console.log(this.password);
              console.log(this.username);
              this.logindis = true;
              this.enrolldis = false;
              this.$message.success("注册成功");
            } else if (this.enrPast == "") {
              this.$message.error("请再次输入密码");
            } else {
              this.$message.error("两次密码不一致，请重新输入");
            }
          } else if (this.password == "") {
            this.$message.error("请输入密码");
          } else {
            this.$message.error("密码格式错误，必须包含字母和数字");
          }
        } else if (this.username == "") {
          this.$message.error("用户名不能为空");
        } else {
          this.$message.error("用户名格式错误");
        }
      } else if (this.enrNum == "") {
        this.$message.error("账号不能为空");
      } else {
        this.$message.error("请输入正确的手机号");
      }
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
  height: 390px;
}
.content-login {
  height: 250px;
}
.enroll-login {
  position: relative;
  height: 420px;
  top: -10px;
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
.login-but,
.enroll-but {
  position: relative;
  width: 338px;
  height: 44px;
  background-color: #43bc60;
  border: 1px solid #36964d;
  color: white;
  border-radius: 5px;
  margin-top: 20px;
  cursor: pointer;
}
</style>
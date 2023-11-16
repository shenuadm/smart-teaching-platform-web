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
              class="input-number center zh-mgt-10"
              placeholder="账号"
              v-model="logNum"
            />
          </div>
          <div class="pas center">
            <span>密码</span>
            <input
              type="password"
              class="input-pas center zh-mgt-10"
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
            <span>用户名</span>
            <input
              type="text"
              class="input-enr-number center zh-mgt-10"
              placeholder="请填写用户名，最长30个字符"
              maxlength="30"
              v-model="username"
            />
          </div>
          <div class="name center">
            <span>昵称</span>
            <input
              type="text"
              class="input-name center zh-mgt-10"
              placeholder="请填写昵称，最长20个字符"
              maxlength="20"
              v-model="nikename"
            />
          </div>
          <div class="pas center pass">
            <span>密码</span>
            <input
              type="password"
              class="input-pas center zh-mgt-10"
              placeholder="5-20位英文、数字、符号、区分大小写"
              v-model="password"
            />
          </div>
          <div class="pas-tow center">
            <span>确认密码</span>
            <input
              type="password"
              class="input-pas-tow center zh-mgt-10"
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
import store from '@/store/index.js'
export default {
  components: {},
  data() {
    return {
      logindis: true,
      enrolldis: false,
      logNum: "",
      logPas: "",
      username: "",
      nikename: "",
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
      if(this.logNum === '' || this.logPas === ''){
        this.$message({
          message:'用户名或者密码不可为空',
          type:'error'
        })
      }else{
        // 登录
        toLogin(data).then((res) => {
          console.log(res);
          if (res.msg != "success") {
            this.$message.error(res.msg);
          } else {
            let tokenValue = res.tokenValue;
            localStorage.setItem("satoken", tokenValue);
            let navData = JSON.stringify(res.menuVoList);
            localStorage.setItem("navData", navData);
            localStorage.setItem("roleId",res.roleId);
            if(res.roleId){
              this.$store.commit("updateUsername",res.username)
              localStorage.setItem("username",res.username)
              localStorage.setItem("oldpwd", data.password);
              this.$router.push({
                path:"/personInfo",
                name:"personInfo"
              })
            }
          }
        });
      }
    },
    toRegister(){
      this.enrolldis = true
      this.logindis = false
    },
    Enroll() {
      if (/^.{1,30}$/.test(this.username)) {
        if (/^.{1,20}$/.test(this.nikename)) {
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
        } else if (this.nikename == "") {
          this.$message.error("昵称不能为空");
        } else {
          this.$message.error("昵称格式错误");
        }
      } else if (this.username == "") {
        this.$message.error("用户不能为空");
      } else {
        this.$message.error("请输入用户名");
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
  height: auto;
  padding-bottom: 10px;
  box-sizing: border-box;
}
.content-login {
  height: auto;
}
.enroll-login {
  position: relative;
  height: auto;
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
.pas-tow>span{
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
.login-but,
.enroll-but {
  position: relative;
  width: 338px;
  height: 44px;
  background-color: #43bc60;
  border: 1px solid #36964d;
  color: white;
  border-radius: 5px;
  margin-top: 25px;
  cursor: pointer;
}
.enr-number>span::before,
.name>span::before,
.pass>span::before,
.pas-tow>span::before{
  content: "*";
  color: red;
  margin-right: 10px;
  position: absolute;
  top: 3px;
  left: -9px;
}
</style>
<template>
  <!-- 忘记密码页面 -->

  <div class="forget">
    <van-nav-bar right-text="先逛一逛" @click-right="redirecthome">
      <template #left>
        <div class="logo iconfont icon-Coffee"></div>
        <div class="logo-text">Lucky coffee</div>
      </template>
    </van-nav-bar>


    <div class="welcome">
      <div class="welcome-text"><h2>忘记密码!</h2></div>
      <div class="english">forget password!</div>

      <van-form v-show="!isNext">
        <van-field
          v-model="userInfo.email"
          name="邮箱"
          label="邮箱"
          placeholder="邮箱"
          autocomplete="off"
        />
        <van-field
          v-model="userInfo.validCode"
          name="邮箱验证码"
          label="邮箱验证码"
          placeholder="邮箱验证码6位"
          autocomplete="off"
          maxlength="6"
        />
        <div class="btns-box">
          <van-button class="btns" @click="getemail" :disabled="issend">{{
            text
          }}</van-button>
        </div>

        <div class="account-login" @click="redirect2">已有账号,立即登录</div>
        <div class="com-btn">
          <van-button round block color="#FDDB3A" @click="next">
            下一步
          </van-button>
        </div>
      </van-form>

      <van-form v-show="isNext">
        <van-field
          v-model="userInfo.phone"
          name="手机号"
          label="手机号"
          placeholder="手机号"
          autocomplete="off"
          maxlength="11"
          left-icon="phone"

        />
        <van-field
          @click-right-icon="dian"
          v-model="userInfo.password"
          :type="type"
          name="新密码"
          label="新密码"
          placeholder="请输入新密码"
          autocomplete="off"
          :right-icon="isLogin ? 'eye-o' : 'closed-eye'"
          left-icon="lock"

        />

        <div class="account-login" @click="redirect2">已有账号,立即登录</div>
        <div class="com-btn">
          <van-button round block color="#FDDB3A" @click="forgetData">
            提交
          </van-button>
        </div>
        <div class="com-btn">
          <van-button round block color="#FDDB3A" @click="back()">
            返回
          </van-button>
        </div>
      </van-form>
    </div>
  </div>
</template>

<script>
import "../assets/less/forget.less";

import { validForm } from "../assets/js/validForm";

export default {
  name: "Forget",

  data() {
    return {
      //用户信息
      isLogin: false,
      //禁用
      issend: false,

      text: "发送验证码",

      type: "password",

      isNext: false,

      userInfo: {
        phone: "",
        password: "",
        email: "",
        validCode: "",
      },
    };
  },

  methods: {
    back() {
      this.isNext = false;
    },

    dian() {
      this.isLogin = !this.isLogin;
      // this.isLogin2 = !this.isLogin2
      this.type = this.isLogin ? "text" : "password";
    },

    redirect() {
      this.$router.push({ name: "Forget" });
    },
    redirect2() {
      this.$router.push({ name: "Login" });
    },
    redirecthome() {
      this.$router.push({ name: "Home" });
    },
    //找回密码数据
    forgetData() {
      let obj = {
        phone: {
          value: this.userInfo.phone,
          error: "手机号格式不正确",
          reg: /^1[3-9]\d{9}$/,
        },
        password: {
          value: this.userInfo.password,
          error: "密码格式不正确",
          reg: /^[A-Za-z]\w{5,15}$/,
        },
      };

      let isPass = validForm.valid(obj);

      if (isPass) {
        this.$toast.loading({
          message: "加载中...",
          forbidClick: true,
          duration: 0,
        });

        this.axios({
          method: "POST",
          url: "/retrievePassword",
          data: {
            appkey: this.appkey,
            phone: this.userInfo.phone,
            password: this.userInfo.password,
          },
        })
          .then((result) => {
            this.$toast.clear();

            if (result.data.code == 700) {
              //token检验无效,则跳到登录页面
              this.$router.push({ name: "Login" });
            } else if (result.data.code == "L001") {
              this.$router.push({ name: "Login" });
            }
            this.$toast(result.data.msg);
          })
          .catch((err) => {});
      }
    },

    //下一步
    next() {
      if (this.userInfo.email == "" || this.userInfo.validCode == "") {
        return this.$toast("请输入邮箱、验证码");
      }
      //构造表单验证信息
      let o = {
        email: {
          value: this.userInfo.email,
          errorMsg: "邮箱格式不正确",
          reg: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
        },
        validCode: {
          value: this.userInfo.validCode,
          errorMsg: "验证码格式不正确",
          reg: /^[A-Za-z\d]{6}$/,
        },
      };

      let isPass = validForm.valid(o);
      if (isPass) {
        //发起验证验证码请求
        //发起获取验证码请求
        this.$toast.loading({
          message: "加载中...",
          forbidClick: true,
          duration: 0,
        });

        this.axios({
          //请求类型
          method: "POST",
          //请求路径
          url: "/checkValidCode",

          //POST请求参数, object
          data: {
            appkey: this.appkey,
            validCode: this.userInfo.validCode,
          },
        })
          .then((result) => {
            this.$toast.clear();

            this.$toast(result.data.msg);

            if (result.data.code == "K001") {
              //下一步
              this.isNext = true;
            }
          })
          .catch((err) => {
            this.$toast.clear();
          });
      }
    },

    //获取验证码
    getemail() {
      let obj = {
        email: {
          value: this.userInfo.email,
          error: "邮箱格式不正确",
          reg: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
        },
      };
      let isPass = validForm.valid(obj);

      if (!isPass) {
        return;
      }
      let time = 10;
      this.issend = true;

      let timer = setInterval(() => {
        if (time <= 0) {
          clearInterval(timer);
          time = 10;
          timer = null;
          this.issend = false;
          this.text = "发送验证码";
        } else {
          time--;
          this.text = `${time}s后重新发送`;
        }
      }, 1000);

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });

      this.axios({
        method: "POST",
        url: "/emailValidCode",
        data: {
          appkey: this.appkey,
          email: this.userInfo.email,
        },
      })
        .then((result) => {
          this.$toast.clear();

          this.$toast(result.data.msg);
        })
        .catch((err) => {});
    },
  },
};
</script>

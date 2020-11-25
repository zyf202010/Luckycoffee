<template>
  <!-- 登录页面 -->

  <div class="login">
    <!-- 顶部导航 -->
       <div class="nav">
      <span @click="gohome"> 先逛一逛 </span>
      <span> 丨 </span>
      <span @click="getContainer" > 注册 </span>
    </div>

    <!-- <van-nav-bar right-text="先逛一逛" @click-right="gohome">
      <template #left>
        <div class="logo iconfont icon-Coffee"></div>
        <div class="logo-text">Lucky coffee</div>
      </template>
    </van-nav-bar> -->

    <div class="welcome">
        <div class="logo iconfont icon-Coffee">
        <div class="logo-text">Lucky Coffee</div>
      </div>

      <van-form class="login-bottom">
        <van-field
          v-model="userInfo.phone"
          name="手机号"
          label="手机号"
          placeholder="手机号"
          autocomplete="off"
          left-icon="phone"

        />

        <van-field
          @click-right-icon="dian"
          v-model="userInfo.password"
          :type="type"
          name="密码"
          label="密码"
          placeholder="密码"
          autocomplete="off"
          :right-icon="isLogin ? 'eye-o' : 'closed-eye'"
          left-icon="lock"

        />

        <div class="forget-box">
          <div class="pas-forget" @click="redirect">忘记密码?</div>
        </div>

        <div class="com-btn">
          <van-button round block color="#FDDB3A" @click="login">
            登录
          </van-button>
        </div>

     
      </van-form>
    </div>

    <!-- 注册页面 -->
    <van-popup
      class="register-box"
      v-model="show"
      closeable
      position="bottom"
      :style="{ height: '40%' }"
    >
      <div class="register-title"><h2>注册</h2></div>

      <van-form>
        <van-field
          v-model="registerInfo.phone"
          name="手机号"
          label="手机号"
          placeholder="11位手机号"
          autocomplete="off"
          maxlength = 11
          left-icon="phone"

        />

        <van-field
          v-model="registerInfo.password"
          :type="type"
          name="密码"
          label="密码"
          placeholder="字母数字_组合且字母开头(6-16位)"
          autocomplete="off"
          :right-icon="isLogin ? 'eye-o' : 'closed-eye'"
          @click-right-icon="dian"
          maxlength = 16
          left-icon="lock"

        />

        <van-field
          v-model="registerInfo.nickName"
          name="昵称"
          label="昵称"
          placeholder="字母数字_汉字组合(1-5位)"
          autocomplete="off"
          left-icon="manager"
          
        />

        <div class="register-btn">
          <van-button round block color="#FDDB3A" @click="register">
            注册
          </van-button>
        </div>
      </van-form>
    </van-popup>
  </div>
</template>




<script>
import "../assets/less/login.less";

import { validForm } from "../assets/js/validForm";

export default {
  name: "Login",

  data() {
    return {
      //用户信息
      show: false,
      isLogin: false,
      type: "password",

      //登录信息
      userInfo: {
        phone: "",
        password: "",
      },

      //注册信息
      registerInfo: {
        phone: "",
        password: "",
        nickName: "",
      },
    };
  },

  methods: {
    //点击切换 显示隐藏密码
    dian() {
      this.isLogin = !this.isLogin;
      this.type = this.isLogin ? "text" : "password";
    },

    // 切换到忘记密码页面
    redirect() {
      this.$router.push({ name: "Forget" });
    },
    gohome() {
      this.$router.push({ name: "Home" });
    },
    //点击显示 注册页面
    getContainer() {
      this.show = true;
    },

    //注册验证表单
    register() {
      let obj = {
        phone: {
          value: this.registerInfo.phone,
          error: "手机号格式不正确",
          reg: /^1[3-9]\d{9}$/,
        },
        password: {
          value: this.registerInfo.password,
          error: "密码格式不正确",
          reg: /^[A-Za-z]\w{5,15}$/,
        },
        nickName: {
          value: this.registerInfo.nickName,
          error: "昵称格式不正确",
          reg: /^[\w\u4e00-\u9fa5]{1,4}$/,
        },
      };

      let isPass = validForm.valid(obj);

      if (isPass) {
        //复制用户注册信息
        let userInfo = Object.assign({}, this.registerInfo);
        userInfo.appkey = this.appkey;

        //启动加载提示
        this.$toast.loading({
          message: "加载中...",
          //禁止穿透点击
          forbidClick: true,
          //提示时间
          duration: 0,
        });

        //发起注册请求
        this.axios({
          //请求方式
          method: "POST",
          //路径
          url: "/register",
          //POST请求参数 对象
          data: userInfo,
        })
          .then((result) => {
            //关闭加载提示
            this.$toast.clear();

            if (result.data.code == 100) {
              //隐藏注册页面
              this.show = false;
            } else {
              //如果注册失败,手机被注册了
              this.$toast(result.data.msg);
            }
            
          })
          .catch((err) => {
            this.$toast.clear();
          });
      }
    },

    //登录验证表单
    login() {
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
        //赋值用户注册信息
        let userInfo = Object.assign({}, this.userInfo);
        userInfo.appkey = this.appkey;

        this.$toast.loading({
          message: "加载中...",
          forbidClick: true,
          duration: 0,
        });

        //发起登录请求
        this.axios({
          method: "POST",

          url: "/login",

          data: userInfo,
        })
          .then((result) => {
            this.$toast.clear();
            if (userInfo.phone == "" || userInfo.password == "") {
              this.$toast("请输入账号密码");
              return;
            }

            if (result.data.code == 200) {
              // 登录成功
              localStorage.setItem("_tk", result.data.token);

              this.$router.push({ name: "Home" });
            } else {
              this.$toast(result.data.msg);
            }
            
          })
          .catch((err) => {
            this.$toast.clear();
          });
      }
    },
  },
};
</script>


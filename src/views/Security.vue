<template>
  <div class="security">
    <van-nav-bar
      title="个人资料"
      left-text="返回"
      left-arrow
      fixed
      @click-left="back"
    />

    <BgBox>
      <div class="me-list">
        <van-cell title="修改密码" is-link @click="getContainer" />
        <van-cell title="注销账号" is-link @click="changelogout" />
      </div>
    </BgBox>

      <div class="btn-box">
        <button class="btn" @click="changelog">退出登录</button>
      </div>
    <van-popup
      v-model="ispassword"
      position="bottom"
      :style="{ height: '36%' }"
      closeable
    >
      <div class="register-title"><h2>修改密码</h2></div>
      <van-field
        v-model="registers.oldpassword"
        :type="type"
        name="旧密码"
        label="旧密码"
        placeholder="字母开头 数字组合(6-16位)"
        autocomplete="off"
        :right-icon="isLogin ? 'eye-o' : 'closed-eye'"
        @click-right-icon="dian"
      />
      <van-field
        v-model="registers.newpassword"
        :type="type"
        name="新密码"
        label="新密码"
        placeholder="字母开头 数字组合(6-16位)"
        autocomplete="off"
        :right-icon="isLogin ? 'eye-o' : 'closed-eye'"
        @click-right-icon="dian"
      />
      <div class="btn-box2">
        <button class="btn2" @click="changepass">确认修改</button>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { validForm } from "../assets/js/validForm";

import BgBox from "../components/BgBox.vue";

export default {
  name: "Security",
  data() {
    return {
      ispassword: false,

      type: "password",

      isLogin: false,

      registers: {
        newpassword: "",
        oldpassword: "",
      },
    };
  },
  components: {
    BgBox,
  },
  methods: {
    //返回上一级
    back() {
      this.$router.go(-1);
    },
    //点击显示 注册页面
    getContainer() {
      this.ispassword = true;
    },
    //点击切换 显示隐藏密码
    dian() {
      this.isLogin = !this.isLogin;
      this.type = this.isLogin ? "text" : "password";
    },

    //修改密码验证
    changepassword() {
      //获取token
      let tokenString = localStorage.getItem("_tk");
      // 
      if (!tokenString) {
        //跳回登录页面
        this.$toast("请先登录");
        return this.$router.push({ name: "Login" });
      }

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });

      let obj = {
        newpassword: {
          value: this.registers.newpassword,
          error: "密码格式不正确",
          reg: /^[A-Za-z]\w{5,15}$/,
        },
        oldpassword: {
          value: this.registers.oldpassword,
          error: "密码格式不正确",
          reg: /^[A-Za-z]\w{5,15}$/,
        },
      };

      let isPass = validForm.valid(obj);

      if (isPass) {
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
          url: "/updatePassword",
          //POST请求参数 对象
          data: {
            appkey: this.appkey,
            tokenString,
            password: this.registers.newpassword,
            oldPassword: this.registers.oldpassword,
          },
        })
          .then((result) => {
            //关闭加载提示
            this.$toast.clear();

            if (result.data.code == 100) {
              //隐藏注册页面
              this.show = false;
            } else if (result.data.code == "E001") {
              //隐藏注册页面
              this.ispassword = false;
              setTimeout(() => {
                this.$router.push({ name: "Login" });
                this.$toast("请重新登录");
              }, 500);
            }
            this.$toast(result.data.msg);
          })
          .catch((err) => {
            this.$toast.clear();
          });
      }
    },
    //确定提示
    changepass() {
      if (this.registers.newpassword == "" || this.registers.oldpassword =="") {
        return this.$toast("请输入密码");
      }
      this.$dialog
        .confirm({
          title: "修改密码",
          message: "是否确认修改密码？",
        })
        .then(() => {
          //提交订单
          this.changepassword();
        })
        .catch((err) => {
          
        });
    },
    //注销账号
    logout() {
      //获取token
      let tokenString = localStorage.getItem("_tk");
      // 
      if (!tokenString) {
        //跳回登录页面
        this.$toast("请先登录");
        return this.$router.push({ name: "Login" });
      }

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });

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
        url: "/destroyAccount",
        //POST请求参数 对象
        data: {
          appkey: this.appkey,
          tokenString,
        },
      })
        .then((result) => {
          //关闭加载提示
          this.$toast.clear();

          if (result.data.code == 100) {
            //隐藏注册页面
            this.show = false;
          } else if (result.data.code == "G001") {
            this.$router.push({ name: "Login" });
          }
          this.$toast(result.data.msg);
        })
        .catch((err) => {
          this.$toast.clear();
        });
    },
    //确定提示
    changelogout() {
      this.$dialog
        .confirm({
          title: "注销账号",
          message: "是否确认注销账号？",
        })
        .then(() => {
          //提交订单
          this.logout();
        })
        .catch((err) => {
          
        });
    },

    // 退出登录
    log() {
      //获取token
      let tokenString = localStorage.getItem("_tk");
      // 
      if (!tokenString) {
        //跳回登录页面
        this.$toast("请先登录");
        return this.$router.push({ name: "Login" });
      }

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });

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
        url: "/logout",
        //POST请求参数 对象
        data: {
          appkey: this.appkey,
          tokenString,
        },
      })
        .then((result) => {
          //关闭加载提示
          this.$toast.clear();

          if (result.data.code == 100) {
            //隐藏注册页面
            this.show = false;
          } else if (result.data.code == "F001") {
            this.$router.push({ name: "Login" });
          }
          this.$toast(result.data.msg);
          
        })
        .catch((err) => {
          this.$toast.clear();
        });
    },
    //确定提示
    changelog() {
      this.$dialog
        .confirm({
          title: "退出登录",
          message: "是否确认退出登录？",
        })
        .then(() => {
          //提交订单
          this.log();
        })
        .catch((err) => {
          
        });
    },
  },
};
</script>

<style lang="less" scoped>
.security {
  padding: 46px 0;

  /deep/ .van-nav-bar .van-icon {
    color: #FDDB3A;
  }

  /deep/ .van-nav-bar__text {
    color: #FDDB3A;
  }

  .me-list {
    padding: 10px;
    margin-bottom: 100px;
  }
  .btn {
    width: 100%;
    padding: 10px;
    border-radius: 20px;
    border: 0;
    background-color: #FDDB3A;
    color: #fff;
  }
  .btn-box {
    margin: 20px 10px 10px 10px;
  }

  .register-title {
    margin-left: 16px;
    font-size: 14px;
  }
  
  .btn2 {
    width: 100%;
    padding: 10px;
    border-radius: 20px;
    border: 0;
    background-color: #FDDB3A;
    color: #fff;
  }
  .btn-box2 {
    margin: 20px;
  }

  .van-cell {
    padding: 10px 10px;
  }
}
</style>
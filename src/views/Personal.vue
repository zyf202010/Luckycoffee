<template>
  <div class="personal">
    <van-nav-bar
      title="个人资料"
      left-text="返回"
      left-arrow
      fixed
      @click-left="back"
    />
    <BgBox>
      <van-address-list>
        <van-cell title="头像" value="内容" class="per-box">
          <div class="per-img">
            <div
              :style="{ backgroundImage: `url('${personalData.userImg}')` }"
              class="head-box"
            >
              <van-uploader class="upload-box" :after-read="uploadhead" />
            </div>
          </div>
        </van-cell>
        <van-cell title="用户ID" :value="personalData.userId" />
        <van-cell title="手机号" :value="personalData.phone" />
        <van-cell
          title="昵称"
          :value="personalData.nickName"
          @click="procedureshow"
        />
        <van-cell
          title="简介"
          :value="personalData.desc || '主人太懒,没有留下什么!'"
          class="desctext"
          @click="proceduredesc"
        />
      </van-address-list>
    </BgBox>

    <van-popup
      v-model="isshowname"
      position="bottom"
      :style="{ height: '30%' }"
    >
      <div class="box">
        昵称 :
        <input type="text" placeholder="请输入您要修改的名称" v-model="uname" />
      </div>
      <van-button @click="proceduredata">确定修改</van-button>
    </van-popup>

    <van-popup
      v-model="isshowdesc"
      position="bottom"
      :style="{ height: '30%' }"
    >
      <div class="box">
        <span class="desctitle">简介 :</span>
        <textarea
          placeholder="请输入您的简介"
          v-model="desc"
          class="text"
        ></textarea>
      </div>
      <van-button class="desctitle-btn" @click="proceddescdata">确定修改</van-button>
    </van-popup>
  </div>
</template>

<script>
import { validForm } from "../assets/js/validForm";

import BgBox from "../components/BgBox.vue";

import "../assets/less/personal.less";

export default {
  name: "Personal",

  data() {
    return {
      personalData: [],

      isshowname: false,

      isshowdesc: false,

      uname: "",

      desc: "",
    };
  },
  components: {
    BgBox,
  },
  created() {
    this.getpersonalData();
  },

  methods: {
    //返回上一级
    back() {
      this.$router.go(-1);
    },

    //点击显示修改昵称
    procedureshow() {
      this.isshowname = true;
    },

    proceduredesc() {
      this.isshowdesc = true;
    },
    //获取个人资料信息
    getpersonalData() {
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

      this.axios({
        method: "GET",
        url: "/findAccountInfo",
        params: {
          appkey: this.appkey,
          tokenString,
        },
      })
        .then((result) => {
          this.$toast.clear();

          if (result.data.code == 700) {
            //token检验无效,则跳到登录页面
            this.$router.push({ name: "Login" });
          }
          this.personalData = result.data.result[0];
          
        })
        .catch((err) => {});
    },

    //修改昵称
    procedure() {
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
        nickName: {
          value: this.uname,
          error: "昵称格式不正确",
          reg: /^[\w\u4e00-\u9fa5]{1,4}$/,
        },
      };
      
      let isPass = validForm.valid(obj);
      if (isPass) {
        this.axios({
          method: "POST",
          url: "/updateNickName",
          data: {
            appkey: this.appkey,
            tokenString,
            nickName: this.uname,
          },
        })
          .then((result) => {
            this.$toast.clear();

            if (result.data.code == 700) {
              //token检验无效,则跳到登录页面
              this.$router.push({ name: "Login" });
            } else if (result.data.code == "C001") {
              this.personalData.nickName = this.uname;
              this.$toast(result.data.msg);
              this.isshowname = false;
            }
          })
          .catch((err) => {});
      }
    },

    //修改简介
    proceddesc() {
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

      this.axios({
        method: "POST",
        url: "/updateDesc",
        data: {
          appkey: this.appkey,
          tokenString,
          desc: this.desc,
        },
      })
        .then((result) => {
          this.$toast.clear();

          if (result.data.code == 700) {
            //token检验无效,则跳到登录页面
            this.$router.push({ name: "Login" });
          } else if (result.data.code == "D001") {
            this.personalData.desc = this.desc;
            this.$toast(result.data.msg);
            this.isshowdesc = false;
          }
        })
        .catch((err) => {});
    },

    //修改昵称提示
    proceduredata(index) {
      if (this.uname == "") {
        return this.$toast("请输入昵称");
      }

      this.$dialog
        .confirm({
          title: "修改昵称",
          message: "是否修改昵称？",
        })
        .then(() => {
          //提交订单
          this.procedure();
        })
        .catch((err) => {
          
        });
    },
    //修改简介提示
    proceddescdata(index) {
      if (this.desc == "") {
        return this.$toast("请输入简介");
      }

      this.$dialog
        .confirm({
          title: "修改简介",
          message: "是否修改简介？",
        })
        .then(() => {
          //提交订单
          this.proceddesc();
        })
        .catch((err) => {
          
        });
    },

    //上传头像
    uploadhead(file) {
      // 
      //允许文件类型
      let type = ["gif", "png", "jpg", "jpeg"];

      //允许最大文件大小 1MB
      let size = 1;

      //判断文件类型
      let fileType = file.file.type.split("/")[1];
      if (type.indexOf(fileType) === -1) {
        this.$toast(`文件类型只支持${type.join(",")}`);
        return;
      }

      //判断文件大小 B, 1024B = 1KB, 1024KB = 1MB
      let fileSize = file.file.size / 1024 / 1024;
      
      if (fileSize > size) {
        this.$toast(`文件允许最大不能超过${size}MB`);
        return;
      }

      //处理base64的标记data:image/jpeg;base64,
      let base64 = file.content.replace(/^data:image\/[A-Za-z]+;base64,/, "");
      // 

      //发起请求
      let tokenString = localStorage.getItem("_tk");

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

      this.axios({
        method: "POST",
        url: "/updateAvatar",
        data: {
          appkey: this.appkey,
          tokenString,
          imgType: fileType,
          serverBase64Img: base64,
        },
      })
        .then((result) => {
          this.$toast.clear();
          
          if (result.data.code == 700) {
            //token检验无效,则跳到登录页面
            this.$router.push({ name: "Login" });
          } else if (result.data.code == "H001") {
            this.personalData.userImg = result.data.userImg;
          }
          this.$toast(result.data.msg);

          
        })
        .catch((err) => {
          this.$toast.clear();
          
        });
    },
  },
};
</script>
<template>
  <!-- 我的页面 -->
  <div class="me">
    <div
      class="meimg-box"
      :style="{ backgroundImage: `url('${meData.userBg}')` }"
    >
      <van-uploader class="upload-box" :after-read="uploadBg" />
    </div>

    <div class="mecon-box">
      <div class="content">
        <div class="pic-img fl">
          <div
            :style="{ backgroundImage: `url('${meData.userImg}')` }"
            class="head-box"
          >
            <van-uploader class="upload-box" :after-read="uploadhead" />
          </div>
        </div>

        <div class="mename-box fl">
          <div class="mename">{{ meData.nickName }}</div>
          <textarea
            class="text"
            :placeholder="meData.desc || '主人太懒了,什么也没留下'"
            disabled="disabled"
          ></textarea>
        </div>

        <div class="me-list">
          <van-cell
            v-for="(item, index) in listData"
            :key="index"
            :title="item.title"
            is-link
            :to="item.name"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import "../assets/less/me.less";
export default {
  name: "Me",

  data() {
    return {
      listData: [
        {
          title: "个人资料",
          name: "/Personal",
        },
        {
          title: "我的订单",
          name: "/Order",
        },
        {
          title: "我的收藏",
          name: "/Collect",
        },
        {
          title: "收货地址",
          name: "/Address",
        },
        {
          title: "安全中心",
          name: "/Security",
        },
      ],
      meData: [],
    };
  },
  created() {
    this.getmeData();
  },
  methods: {
    //获取个人信息
    getmeData() {
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
        url: "/findMy",
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
          } else if (result.data.code == "A001") {
            this.meData = result.data.result[0];
          }
        })
        .catch((err) => {});
    },

    //上传背景
    uploadBg(file) {
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
        url: "/updateUserBg",
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
          } else if (result.data.code == "I001") {
            this.meData.userBg = result.data.userBg;
          }
          this.$toast(result.data.msg);
        })
        .catch((err) => {
          this.$toast.clear();
          
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
            this.meData.userImg = result.data.userImg;
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

<template>
  <!-- 首页页面 -->

  <div class="home">
    <!-- 导航栏 -->

    <van-nav-bar fixed>
      <template #left>
        <div class="home-nav" @click="gome">
          <div class="t1">{{ timetext }}</div>
          <div class="t2">{{ meData.nickName }}</div>
        </div>
      </template>

      <template #right>
        <div class="home-search">
          <van-search
            placeholder="输入商品名称"
            v-model="value"
            @focus="searchData"
          />
        </div>

        <div class="search-list" v-if="value != ''">
          <div
            class="searchname"
            v-for="(item, index) in searchlist"
            :key="index"
            @click="goDetail(item.pid)"
          >
            {{ item.name }}
          </div>
        </div>
      </template>
    </van-nav-bar>

    <!-- 轮播图 -->
    <div class="banner-box">
      <div class="banner">
        <van-swipe @change="onChange" :autoplay="2000">
          <van-swipe-item v-for="(item, index) in bannerData" :key="index"
            ><img
              class="auto-img"
              :src="item.bannerImg"
              @click="goDetail(item.pid)"
          /></van-swipe-item>
          <template #indicator>
            <div class="custom-indicator">{{ current + 1 }}/4</div>
          </template>
        </van-swipe>
      </div>
    </div>

    <!-- 内容 -->
    <div class="product-box">
      <div>
        <div class="clearfix pro-title-box">
          <span class="pro-title">热卖推荐</span>
        </div>

        <div class="products clearfix">
          <div
            class="pro-item fl"
            v-for="(item, index) in hotProduct"
            :key="index"
            @click="goDetail(item.pid)"
          >
            <div class="imgbox">
              <img class="auto-img" :src="item.smallImg" />
              <div class="hot">hot</div>
            </div>
            <div class="pro-info">
              <div class="pro-name one-text">{{ item.name }}</div>
              <div class="pro-rnname">{{ item.enname }}</div>
              <div class="pro-price">￥{{ item.price }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import "../assets/less/home.less";

export default {
  name: "Home",

  data() {
    return {
      timetext: "",

      current: 0,

      bannerData: [],

      hotProduct: [],

      meData: [],

      value: "",

      searchlist: [],
    };
  },

  created() {
    this.getBannerData();

    this.getHotData();

    this.getmeData();

    this.gettime();
  },
  methods: {
    onChange(index) {
      this.current = index;
    },
    //请求轮播图数据
    getBannerData() {
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });

      //发起注册请求
      this.axios({
        //请求类型
        method: "GET",
        //请求路径
        url: "/banner",

        //GET请求参数, object
        params: {
          appkey: this.appkey,
        },
      })
        .then((result) => {
          this.$toast.clear();

          if (result.data.code == 300) {
            this.bannerData = result.data.result;
          }
        })
        .catch((err) => {
          this.$toast.clear();
        });
    },

    //请求热门商品数据
    getHotData() {
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });

      //发起注册请求
      this.axios({
        //请求类型
        method: "GET",
        //请求路径
        url: "/typeProducts",

        //GET请求参数, object
        params: {
          appkey: this.appkey,
          key: "isHot",
          value: 1,
        },
      })
        .then((result) => {
          this.$toast.clear();
          if (result.data.code == 500) {
            this.hotProduct = result.data.result;
          }
        })
        .catch((err) => {
          this.$toast.clear();
        });
    },

    //获取个人信息
    getmeData() {
      //获取token
      let tokenString = localStorage.getItem("_tk");
      if (!tokenString) {
        //跳回登录页面
        return;
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

          if (result.data.code == "A001") {
            this.meData = result.data.result[0];
          }
        })
        .catch((err) => {});
    },

    //判断时间的函数
    gettime() {
      // 获取当前时间
      let timenow = new Date();
      //获取小时
      let h = timenow.getHours();
      //判断时间
      if (h >= 0 && h <= 10) {
        this.timetext = "早上好";
      } else if (h > 10 && h <= 14) {
        this.timetext = "中午好";
      } else if (h > 14 && h <= 18) {
        this.timetext = "下午好";
      } else if (h > 18 && h <= 24) {
        this.timetext = "晚上好";
      }
    },
    //搜索商品
    searchData() {
      this.$router.push({ name: "Search" });
    },

 
    //查看商品详情页面
    goDetail(pid) {
      this.$router.push({ name: "Details", params: { pid } });
    //缓存数据
      let pro = localStorage.getItem("pro");
      if (pro == null) {
        localStorage.setItem("pro", pid);
        return;
      }
      localStorage.setItem("pro", pro + "-" + pid);
    },
    gome() {
      this.$router.push({ name: "Me" });
    },
  },
};
</script>
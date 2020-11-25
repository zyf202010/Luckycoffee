<template>
  <!-- 菜单页面 -->
  <div class="menu">
    <div class="menu-nav">
      <van-nav-bar
        title="菜单"
        left-text="返回"
        left-arrow
        fixed
        @click-left="back"
      >
        <template #right>
          <van-icon name="search" size="18" @click="gosearch" />
        </template>
      </van-nav-bar>

      <!-- <div class="option">
        <div
          class="menu-box"
          v-for="(item, index) in merchandisetype"
          :key="index"
          @click="toggleMenu(index, item.type)"
        >
          <div class="menu-item">
            <div class="icon-img">
              <img
                class="auto-img"
                :src="
                  activeindex == index ? item.activeicon : item.inactiveicon
                "
              />
            </div>
            <div class="title" :class="{ active: activeindex == index }">
              {{ item.title }}
            </div>
          </div>
        </div>
      </div> -->
    </div>
    <div class="img-box">
      <img class="auto-img" src="../assets/images/menu.jpg" />
    </div>

    <div class="nav-box">
      <div class="nav-left">
        <van-sidebar v-model="activeindex">
          <van-sidebar-item
            :title="item.title"
            v-for="(item, index) in merchandisetype"
            :key="index"
            @click="toggleMenu(index, item.type)"
          />
        </van-sidebar>
      </div>

      <div class="nav-right">
        <div class="nav-rightbox">
          <div
            class="hot-box clearfix"
            v-for="(item, index) in merchandiseData"
            :key="index"
          >
            <div class="hot-content fl" @click="goDetail(item.pid)">
              <div class="imgbox fl">
                <img class="auto-img" :src="item.smallImg" />
              </div>
              <div class="hot-text fl">
                <div class="hot-name">{{ item.name }}</div>
                <div class="hot-enname">{{ item.enname }}</div>
              </div>
              <div class="hot-price">￥{{ item.price }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import "../assets/less/menu.less";
export default {
  name: "Menu",

  data() {
    return {
      activeindex: 0,

      //列表数据
      merchandisetype: [
        {
          title: "推荐",
        },
        {
          title: "拿铁",
        },
        {
          title: "咖啡",
        },
        {
          title: "瑞纳冰",
        },
      ],
      //商品数据
      merchandiseData: [],
    };
  },
  created() {
    //获取商品类型
    this.getmerchandisetype();
  },
  methods: {
    //返回上一级
    back() {
      this.$router.go(-1);
    },
    //切换菜单商品
    toggleMenu(index, type) {
      if (this.activeindex == index) {
        return;
      }

      this.activeindex = index;

      this.getmerchandiseData(type);
    },

    //商品类型
    getmerchandisetype() {
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });

      this.axios({
        method: "GET",
        url: "/type",
        params: {
          appkey: this.appkey,
        },
      })
        .then((result) => {
          this.$toast.clear();
          if (result.data.code == 400) {
            let data = result.data.result;
            data.unshift({
              type: "isHot",
              typeDesc: "推荐",
            });

            this.merchandisetype.map((v) => {
              for (let i = 0; i < data.length; i++) {
                if (v.title == data[i].typeDesc) {
                  v.type = data[i].type;
                  break;
                }
              }
            });

            let type = this.merchandisetype[this.activeindex].type;
            this.getmerchandiseData(type);
          }
        })
        .catch((err) => {
          this.$toast.clear();
        });
    },

    //根据类型获取商品
    getmerchandiseData(type) {
      let params = {
        appkey: this.appkey,
      };
      if (type == "isHot") {
        params.key = "isHot";
        params.value = 1;
      } else {
        params.key = "type";
        params.value = type;
      }

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });

      this.axios({
        method: "GET",
        url: "/typeProducts",
        params,
      })
        .then((result) => {
          this.$toast.clear();
          if (result.data.code == 500) {
            this.merchandiseData = result.data.result;
          }
        })
        .catch((err) => {});
    },

    goDetail(pid) {
      this.$router.push({ name: "Details", params: { pid } });
      let pro = localStorage.getItem("pro");
      if (pro == null) {
        localStorage.setItem("pro", pid);
        return;
      }
      localStorage.setItem("pro", pro + "-" + pid);
    },
    gosearch() {
      this.$router.push({ name: "Search" });
    },
  },
};
</script>
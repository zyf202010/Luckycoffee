<template>
  <!-- 商品详情页面 -->

  <div class="details">
    <div class="det-title">
      <van-nav-bar
        title="商品详情"
        left-text="返回"
        left-arrow
        fixed
        @click-left="goback"
      />
    </div>

    <div class="det-img">
      <img class="auto-img" :src="detailData.large_img" />
    </div>

    <div class="det-probox">
      <div class="clearfix pro-box">
        <div class="fl">
          <div class="pro-name">{{ detailData.name }}</div>
          <div class="pro-enname">{{ detailData.enname }}</div>
        </div>
        <div class="fr pro-price">￥{{ detailData.price }}</div>
      </div>

      <div class="det-box">
        <div
          class="det-spec clearfix"
          v-for="(item, index) in detailData.rules"
          :key="index"
        >
          <div class="det-title fl">{{ item.title }}</div>
          <div class="det-items">
            <div
              class="det-item fl"
              v-for="(item1, index1) in item.rule"
              :key="index1"
              :class="{ active: item.ruleIndex == index1 }"
              @click="toggleRule(item, index1)"
            >
              {{ item1.title }}
            </div>
          </div>
        </div>
      </div>

      <div class="det-numbox">
        <div class="select-count">选择数量</div>
        <div class="fr count-box">
          <van-stepper
            v-model="product.count"
            theme="round"
            button-size="22"
            disable-input
          />
        </div>
      </div>

      <div class="det-partbox">
        <div class="part-title">商品描述</div>
        <div
          class="part-text"
          v-for="(item, index) in detailData.desc"
          :key="index"
        >
          {{ index + 1 }}、{{ item }}
        </div>
      </div>
    </div>

    <div class="det-footer">
      <van-goods-action>
        <van-goods-action-icon
          icon="cart-o"
          text="购物车"
          :badge="shopcarcount == 0 ? '' : shopcarcount"
          :color="shopcarcount > 0 ? '#0C34BA' : '#646566'"
          @click="goshopcar"
        />
        <van-goods-action-icon
          icon="like"
          :text="islike ? '已收藏' : '未收藏'"
          :color="islike ? '#FDDB3A' : '#646566'"
          @click="getcollect"
        />
        <van-goods-action-button
          text="加入购物车"
          color="#faeba1"
          @click="addshop()"
        />
        <van-goods-action-button
          text="立即购买"
          color="#FDDB3A"
          @click="gopay(true)"
        />
      </van-goods-action>
    </div>
  </div>
</template>

<script>
import "../assets/less/details.less";
export default {
  name: "Details",

  data() {
    return {
      //商品pid
      pid: "",

      //商品信息
      product: {
        count: 1,
      },

      //商品详情数据
      detailData: {},
      //是否已经收藏商品
      islike: false,
      //购物车的数量
      shopcarcount: 0,
    };
  },

  // 初始化渲染
  created() {
    this.pid = this.$route.params.pid;
    //获取商品详情数据
    this.getProductDetail();
    //查询用户是否已经收藏该商品
    this.findgetcollect();
    //查询用户的购物袋记录数
    this.findshopcar();
  },

  // 商品数据
  methods: {
    getProductDetail() {
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
        url: "/productDetail",

        //GET请求参数, object
        params: {
          appkey: this.appkey,
          pid: this.pid,
        },
      })
        .then((result) => {
          this.$toast.clear();

          if (result.data.code == 600) {
            //获取商品详情
            let data = result.data.result[0];
            //裁剪详情商品数据  以回车裁剪
            data.desc = data.desc.split(/\n/);
            // 
            // 

            let rules = [];
            //构造一个数组存储数据
            let ruleData = ["tem", "sugar", "milk", "cream"];
            //给每一项赋值  获取每一项的规格
            ruleData.map((v) => {
              let r = {};

              r.title = data[v + "_desc"];

              //激活下标
              r.ruleIndex = 0;
              //每一项规格
              r.rule = [];

              //获取规格字符串
              let rulestring = data[v].split("/");

              //添加每一项规格的数据
              rulestring.map((value) => {
                if (value != "") {
                  r.rule.push({ title: value });
                }
              });
              //如果每一项有数据才会添加
              if (r.rule.length > 0) {
                rules.push(r);
              }
            });
            //给数组赋值
            data.rules = rules;

            this.detailData = data;
          }
        })
        .catch((err) => {
          this.$toast.clear();
        });
    },

    // 查找商品是否收藏
    findgetcollect() {
      //获取token
      let tokenString = localStorage.getItem("_tk");

      if (!tokenString) {
        return;
      }

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });

      // 发起收藏商品请求
      this.axios({
        method: "GET",
        url: "/findlike",

        params: {
          appkey: this.appkey,
          pid: this.pid,
          tokenString,
        },
      })
        .then((result) => {
          this.$toast.clear();

          if (result.data.code == 1000) {
            if (result.data.result.length > 0) {
              this.islike = true;
            }
          }
        })
        .catch((err) => {
          this.$toast.clear();
          
        });
    },

    //收藏商品
    getcollect() {
      // 获取token
      let tokenString = localStorage.getItem("_tk");

      if (!tokenString) {
        return this.$router.push({ name: "Login" });
      }

      let url = this.islike ? "/notlike" : "/like";

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });

      // 发起收藏商品请求
      this.axios({
        method: "POST",
        url,

        data: {
          appkey: this.appkey,
          pid: this.pid,
          tokenString,
        },
      })
        .then((result) => {
          this.$toast.clear();
          // token检验无效 条状登录页面
          if (result.data.code == 700) {
            this.$router.push({ name: "Login" });
          } else if (result.data.code == 800) {
            // 商品收藏成功
            this.islike = true;
          } else if (result.data.code == 900) {
            // 取消收藏
            this.islike = false;
          }

          this.$toast(result.data.msg);
        })
        .catch((err) => {
          this.$toast.clear();
          
        });
    },

    //查询用户的购物袋数量
    findshopcar() {
      //获取token
      let tokenString = localStorage.getItem("_tk");

      if (!tokenString) {
        return;
      }

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });

      // 发起收藏商品请求
      this.axios({
        method: "GET",
        url: "/findAllShopcart",

        params: {
          appkey: this.appkey,
          tokenString,
        },
      })
        .then((result) => {
          this.$toast.clear();

          if (result.data.code == 5000) {
            this.shopcarcount = result.data.result.length;
          }
        })
        .catch((err) => {
          this.$toast.clear();
          
        });
    },

    //添加收藏商品
    addshop(ispay) {
      // 获取token
      let tokenString = localStorage.getItem("_tk");

      if (!tokenString) {
        return this.$router.push({ name: "Login" });
      }

      let data = {
        tokenString,
        appkey: this.appkey,
        count: this.product.count,
        pid: this.pid,
      };
      let rs = [];
      //遍历detailData.rules数组获取选择的商品规格

      this.detailData.rules.map((v) => {
        rs.push(v.rule[v.ruleIndex].title);
      });
      data.rule = rs.join("/");

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });

      // 发起收藏商品请求
      this.axios({
        method: "POST",
        url: "/addShopcart",
        data,
      })
        .then((result) => {
          this.$toast.clear();
          // token检验无效 条状登录页面
          if (result.data.code == 700) {
            this.$router.push({ name: "Login" });
          } else if (result.data.code == 3000) {
            if (!ispay) {
              if (result.data.status == 1) {
                this.shopcarcount++;
              }
            } else {
              this.$router.push({
                name: "Pay",
                query: { sids: result.data.sid },
              });
            }
          }
          this.$toast(result.data.msg);
        })
        .catch((err) => {
          this.$toast.clear();
          
        });
    },
    gopay(ispay) {
      this.addshop(ispay);
    },
    // 返回上一页
    goback() {
      this.$router.go(-1);
    },
    goshopcar() {
      this.$router.push({ name: "Shopcar" });
    },
    // 选择商品规格高亮
    toggleRule(item, i) {
      if (item.ruleIndex == i) {
        return;
      }

      item.ruleIndex = i;
    },
  },
};
</script>

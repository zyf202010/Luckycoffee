<template>
  <!-- 支付页面 -->

  <div class="pay">
    <van-nav-bar
      title="订单结算"
      left-text="返回"
      left-arrow
      fixed
      @click-left="back"
    />
    <div class="pay-box">
      <div class="select-address">
        <div>
          <span @click="showselect">选择地址</span>
          <van-icon class="arrow" name="arrow" />
        </div>
        <div class="user-box">
          <div class="user-info">
            <div class="user-name">{{ currentAddress.name }}</div>
            <div class="user-phone">{{ currentAddress.tel }}</div>
            <div class="default-address" v-if="currentAddress.isDefault">
              默认
            </div>
          </div>
          <div class="detail-address">{{ currentAddress.address }}</div>
        </div>
      </div>
    </div>

    <div class="pro-box">
      <div class="info-title">订单信息</div>
      <div class="cell-box">
        <div class="cell-list" v-for="(item, index) in products" :key="index">
          <div class="cell-item-box">
            <div class="pro-info-box">
              <div class="fl pro-img">
                <img class="auto-img" :src="item.small_img" alt="" />
              </div>
              <div class="fl pro-info">
                <div class="pro-info-text">
                  <div class="clearfix names">
                    <div class="fl pro-name">{{ item.name }}</div>
                    <div class="fl pro-rule">{{ item.rule }}</div>
                  </div>
                  <div class="pro-enname">{{ item.enname }}</div>
                </div>
                <div class="pro-count-box">
                  <div class="fl pro-price">￥{{ item.price }}</div>
                  <div class="fr step-box">x{{ item.count }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="clearfix bottom-into">
        <div class="fl">共计 {{ productInfo.count }} 件</div>
        <div class="fr total">合计 ￥ {{ productInfo.total | decimal }}</div>
      </div>
    </div>

    <div class="btn-box">
      <van-button type="primary" block round color="#FDDB3A" @click="payBox"
        >立即结算</van-button
      >
    </div>

    <van-popup is-link position="bottom" closeable v-model="isOpen">
      <div class="address-title">选择地址</div>
      <van-address-list
        v-model="chosenAddressId"
        default-tag-text="默认"
        :list="list"
        @add="newAddress"
        @select="selectAddress"
      />
    </van-popup>
  </div>
</template>

<script>
import "../assets/less/pay.less";
export default {
  name: "Pay",
  data() {
    return {
      isOpen: false,

      //选择地址的sid
      chosenAddressId: "",

      //地址列表
      list: [],

      //选择当前的地址
      currentAddress: [],

      //购物袋的sid
      sids: [],

      //需要购买的商品数据
      products: [],

      //商品数量和订单总价
      productInfo: {
        count: 0,
        total: 0,
      },
    };
  },

  created() {
    //截取查询参数
    this.sids = this.$route.query.sids.split("-");

    //根据sids获取购物袋数据
    this.getShopbagBySids();

    //获取地址列表数据
    this.getaddressData();
  },

  methods: {
    back() {
      this.$router.go(-1);
    },
    //展示选择地址列表
    showselect() {
      this.isOpen = true;
    },

    //新增地址
    newAddress() {
      this.$router.push({ name: "Newaddress" });
    },

    //选择地址
    selectAddress(item, index) {
      this.isOpen = false;

      this.currentAddress = item;
    },

    //获取地址列表数据
    getaddressData() {
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

        url: "/findAddress",

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
          } else if (result.data.code == 20000) {
            result.data.result.map((v) => {
              v.isDefault = Boolean(v.isDefault);
              v.id = v.aid;
              v.address = `${v.province}${v.city}${v.county}${v.addressDetail}`;

              //选择默认地址
              if (v.isDefault) {
                this.chosenAddressId = v.aid;
                this.currentAddress = v;
              }
            });
            //存储获得到的地址数据
          this.list = result.data.result;
          }
          
        })
        .catch((err) => {
          this.$toast.clear();
          
        });
    },

    //根据sids 获取购物袋数据
    getShopbagBySids() {
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

        url: "/commitShopcart",

        params: {
          appkey: this.appkey,
          tokenString,
          sids: JSON.stringify(this.sids),
        },
      })
        .then((result) => {
          this.$toast.clear();
          if (result.data.code == 700) {
            //token检验无效,则跳到登录页面
            this.$router.push({ name: "Login" });
          } else if (result.data.code == 50000) {
            if (result.data.result.length == 0) {
              //如果没有商品可购买，则跳转到购物袋页面
              return this.$router.push({ name: "Shopcar" });
            }
            // 计算总价 和 数量
            result.data.result.map((v) => {
              this.productInfo.count += v.count;
              this.productInfo.total += v.count * v.price;
            });
            //存储 提交订单后的数据
            this.products = result.data.result;
          } else {
            this.products = result.data.result;
          }
        })
        .catch((err) => {
          this.$toast.clear();
          
        });
    },

    //结算订单
    pay() {
      
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
        url: "/pay",
        data: {
          appkey: this.appkey,
          tokenString,
          sids: JSON.stringify(this.sids),
          phone: this.currentAddress.tel,
          address: this.currentAddress.address,
          receiver: this.currentAddress.name,
        },
      })
        .then((result) => {
          this.$toast.clear();
          if (result.data.code == 700) {
            //token检验无效,则跳到登录页面
            this.$router.push({ name: "Login" });
          } else {
            this.$toast(result.data.msg);
            setTimeout(() => {
              //跳转到订单页面
              this.$router.push({ name: "Order" });
            });
          }
        })
        .catch((err) => {
          this.$toast.clear();
          
        });
    },

    //结算提示
    payBox() {

      if(this.currentAddress.length <=0){
        this.$toast("请选择地址")
        return;
      }
      this.$dialog
        .confirm({
          title: "确定订单",
          message: "是否立即结算？",
        })
        .then(() => {
          //提交订单
          this.pay();
        })
        .catch((err) => {
          
        });
    },
  },
};
</script>

<template>
  <div class="order">
    <van-nav-bar
      title="我的订单"
      left-text="返回"
      left-arrow
      fixed
      @click-left="back"
    />

    <div class="bg-box">
      <div class="bg"></div>
      <div class="bg-content">
        <div v-if="isHas">
          <van-tabs
            v-model="tabIndex"
            color="#0C34BA"
            title-active-color="#000"
            line-height="2"
            @change="changeTab"
          >
            <van-tab
              :title="item.title"
              v-for="(item, index) in tabData"
              :key="index"
            >
              <div v-if="orderData.length > 0">
                <div
                  class="pro-box"
                  v-for="(item, index) in orderData"
                  :key="item.oid"
                  v-show="
                    tabIndex == item.status
                      ? item.status
                      : tabIndex == item.title
                  "
                >
                  <div class="clearfix info-boxs">
                    <div class="info-title fl">{{ item.data[0].oid }}</div>
                    <div class="fr re-info" v-if="isRight">
                      <div
                        class="re-text"
                        v-if="item.status != 2"
                        @click="confirm(item)"
                      >
                        确认收货
                      </div>
                      <div class="clearfix" v-else>
                        <div class="fl">已完成</div>
                        <div class="fl delete" @click="remove(item.oid, index)">
                          <van-icon size="19" name="delete" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    class="cell-box"
                    v-for="(items, indexs) in item.data"
                    :key="indexs"
                  >
                    <div class="cell-list">
                      <div class="cell-item-box">
                        <div class="pro-info-box">
                          <div class="fl pro-img">
                            <img
                              class="auto-img"
                              :src="items.smallImg"
                              alt=""
                            />
                          </div>
                          <div class="fl pro-info">
                            <div class="pro-info-text">
                              <div class="clearfix names">
                                <div class="fl pro-name">{{ items.name }}</div>
                                <div class="fl pro-rule">{{ items.rule }}</div>
                              </div>
                              <div class="pro-enname">{{ items.enname }}</div>
                            </div>
                            <div class="pro-count-box">
                              <div class="fl pro-price">
                                ￥{{ items.price }}
                              </div>
                              <div class="fr step-box">x{{ items.count }}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="date" v-if="item.date != ''">
                    {{ item.date | formatDate("yyyy-MM-dd hh:mm:ss") }}
                  </div>
                  <div class="clearfix bottom-into">
                    <div class="fl">共计 {{ item.count }} 件</div>
                    <div class="fr total">
                      合计 ￥{{ item.price | decimal }}
                    </div>
                  </div>
                </div>
              </div>
              <div v-else>
                <van-empty description="没有订单数据" />
              </div>
            </van-tab>
          </van-tabs>
        </div>
         <div v-else>
        <van-empty description="没有订单数据" />
      </div>
      </div>
    </div>
  </div>
</template>

<script>
import "../assets/less/order.less";

export default {
  name: "Order",
  data() {
    return {
      isRight: true,

      isReceive: false,

      tabIndex: 0,

      tabData: [{ title: "全部" }, { title: "进行中" }, { title: "已完成" }],

      //订单商品数据
      orderData: [],
      //全部没有订单数据
      isHas: true
    };
  },

  created() {
    this.getorderData();
  },
  methods: {
    //返回上一级
    back() {
      this.$router.go(-1);
    },

    //获取订单商品数据
    getorderData() {
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

        url: "/findOrder",

        params: {
          appkey: this.appkey,
          tokenString,
          status: this.tabIndex,
        },
      })
        .then((result) => {
          this.$toast.clear();
          if (result.data.code == 700) {
            //token检验无效,则跳到登录页面
            this.$router.push({ name: "Login" });
          } else if (result.data.code == 70000) {
            //进行订单编号分类

            //如果全部没有订单数据，则移除tab
            if (this.tabIndex == 0 && result.data.result.length == 0) {
              this.isHas = false;
              return;
            }
            
            let oidorder = [];

            result.data.result.map((v) => {
              //判断如果不存在键名时

              for (let i = 0; i < oidorder.length; i++) {
                if (oidorder[i].oid == v.oid) {
                  oidorder[i].count += v.count;
                  oidorder[i].price += v.count * v.price;
                  oidorder[i].title = 0;
                  oidorder[i].data.push(v);
                  return;
                }
              }

              //如果找不到当前订单 则初始化当前订单数据
              let obj = {};
              obj.oid = v.oid;
              obj.count = v.count;
              obj.price = v.count * v.price;
              obj.status = v.status;
              obj.date = v.createdAt;
              obj.title = 0;
              obj.data = [v];

              oidorder.push(obj);
            });
            //存储获得到的地址数据
            this.orderData = oidorder;
          }
        })
        .catch((err) => {
          this.$toast.clear();
        });
    },

    //确认收货
    confirmReceive(item) {
      //获取地址列表数据
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

        url: "/receive",

        data: {
          appkey: this.appkey,
          tokenString,
          oid: item.oid,
        },
      })
        .then((result) => {
          this.$toast.clear();
          if (result.data.code == 700) {
            //token检验无效,则跳到登录页面
            this.$router.push({ name: "Login" });
          } else if (result.data.code == 80000) {
            item.status = 2;
          }
          this.$toast(result.data.msg);
        })
        .catch((err) => {
          this.$toast.clear();
        });
    },

    //删除订单
    removeOrder(oid, index) {
      //获取地址列表数据
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

        url: "/removeOrder",

        data: {
          appkey: this.appkey,
          tokenString,
          oid,
        },
      })
        .then((result) => {
          this.$toast.clear();
          if (result.data.code == 700) {
            //token检验无效,则跳到登录页面
            this.$router.push({ name: "Login" });
          } else if (result.data.code == 90000) {
            this.orderData.splice(index, 1);
          }

          this.$toast(result.data.msg);
        })
        .catch((err) => {
          this.$toast.clear();
        });
    },
    //删除提示
    remove(oid, index) {
      this.$dialog
        .confirm({
          title: "删除订单",
          message: "是否立即删除订单？",
        })
        .then(() => {
          //提交订单
          this.removeOrder(oid, index);
        })
        .catch((err) => {});
    },

    //确定提示
    confirm(item) {
      this.$dialog
        .confirm({
          title: "确认收货",
          message: "是否确认收货？",
        })
        .then(() => {
          //提交订单
          this.confirmReceive(item);
        })
        .catch((err) => {});
    },
    //切换订单状态 0: 全部, 1: 进行中, 2: 已完成
    changeTab(name, title) {
      // this.tabIndex = name;
    },
  },
};
</script>
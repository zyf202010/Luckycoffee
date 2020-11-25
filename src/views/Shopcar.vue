<template>
  <!-- 购物车页面 -->
  <div class="shopcar">
    <van-nav-bar
      title="购物袋"
      left-text="返回"
      :right-text="isEdit ? '完成' : '编辑'"
      left-arrow
      fixed
      @click-left="back"
      @click-right="isEdit = !isEdit"
    />
    <div v-if="this.shopcarData == 0">
      <van-empty description="购物袋空空如也，去逛一逛!">
        <van-button round color="#FDDB3A" class="bottom-button" @click="gomenu">
          逛一逛
        </van-button>
      </van-empty>
    </div>
    <div class="shopcar-box" v-else>
      <div class="shopcar-bg"></div>
      <!-- 懒加载组件 -->
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="哎呀，没有数据可加载了!"
        offset="20"
        @load="loadData"
      >
        <div class="shopcar-product">
          <div
            class="shopcar-item"
            v-for="(item, index) in shopcarData"
            :key="item.sid"
          >
            <div class="cell-item">
              <van-swipe-cell :disabled="!isEdit">
                <div class="clearfix cell-item-box">
                  <div class="fl check-box">
                    <van-checkbox
                      v-model="item.isChecked"
                      checked-color="#FDDB3A"
                      @click="onecheck"
                    />
                  </div>
                  <div class="fl pro-info-box">
                    <div class="fl pro-img">
                      <img class="auto-img" :src="item.small_img" alt="" />
                    </div>
                    <div class="fl pro-info">
                      <div class="pro-info-text">
                        <div class="clearfix">
                          <div class="fl pro-name">{{ item.name }}</div>
                          <div class="fl pro-rule">{{ item.rule }}</div>
                        </div>
                        <div class="pro-enname">{{ item.enname }}</div>
                      </div>

                      <div class="pro-count-box">
                        <div class="fl pro-price">￥{{ item.price }}</div>
                        <div class="fr step-box">
                          <van-stepper
                            v-model="item.count"
                            theme="round"
                            button-size="20"
                            disable-input
                            @change="changeCount(item)"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <template #right>
                  <van-button
                    square
                    type="danger"
                    text="删除"
                    @click="oneremove(index, item.sid)"
                  />
                </template>
              </van-swipe-cell>
            </div>
          </div>
        </div>
      </van-list>
      <van-submit-bar
        v-if="!isEdit"
        :price="total"
        button-text="提交订单"
        button-color="#FDDB3A"
        @submit="commit"
      >
        <van-checkbox v-model="isAllChecked" @click="allcheck"
          >全选</van-checkbox
        >
      </van-submit-bar>

      <van-submit-bar
        v-else
        button-text="删除选择"
        button-color="#FDDB3A"
        @submit="removeselect"
      >
        <van-checkbox v-model="isAllChecked" @click="allcheck"
          >全选</van-checkbox
        >
      </van-submit-bar>
    </div>
  </div>
</template>

<script>
import "../assets/less/shopcar.less";
export default {
  name: "Shopcar",
  data() {
    return {
      isCheck: false,
      count: 2,
      isAllChecked: false,

      //是否处于编辑状态
      isEdit: false,

      //购物袋数据
      shopcarData: [],

      // 触发加载
      loading: true,
      //是否全部加载完成数据
      finished: false,
      //所有购物袋数据
      allShopcarData: [],
      //每次触底懒加载截取8条数据
      dataCount: 8,
      //开始截取购物袋数据位置
      startIndex: 0,

      //订单总金额
      total: 0,
    };
  },

  created() {
    //获取购物袋数据
    this.getShopcarData();
  },

  methods: {
    //返回上一级
    back() {
      this.$router.go(-1);
    },

    //获取购物袋数据
    getShopcarData() {
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

      //发起获取购物袋数据请求
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


          if (result.data.code == 700) {
            //token检验无效,则跳到登录页面
            this.$router.push({ name: "Login" });
          } else if (result.data.code == 5000) {
            result.data.result.map((v) => {
              v.isChecked = false;
            });

            this.allShopcarData = result.data.result;

            //根据开始截取位置和截取数据数量设置购物袋显示的数据
            this.shopcarData = this.allShopcarData.slice(
              this.startIndex,
              this.startIndex + this.dataCount
            );
            // 每次都要加
            this.startIndex += this.dataCount;
            //未加载
            this.loading = false;
          }
        })
        .catch((err) => {
          this.$toast.clear();
          
        });
    },

    //懒加载购物袋数据
    loadData() {


      setTimeout(() => {
        //在allShopbagData截取数据
        let data = this.allShopcarData.slice(
          this.startIndex,
          this.startIndex + this.dataCount
        );

        this.startIndex += this.dataCount;
        // 每一次截取的数据
        this.shopcarData.push(...data);
        //如果当前截取数据不足8条数据，下次不可能截取的数据
        if (data.length < this.dataCount) {
          this.finished = true;
        } else {
          this.loading = false;
        }
      }, 1500);
    },

    //全选
    allcheck() {
      this.shopcarData.map((v) => {
        v.isChecked = this.isAllChecked;
      });
      this.sum();
    },

    // 单选
    onecheck() {
      this.sum();

      for (let i = 0; i < this.shopcarData.length; i++) {
        if (!this.shopcarData[i].isChecked) {
          this.isAllChecked = false;
          return;
        }
      }

      this.isAllChecked = true;
    },

    //单个删除
    oneremove(index, sid) {
      //index: shopbagData数组元素下标
      //sid: 购物袋sid

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
        url: "/deleteShopcart",
        data: {
          appkey: this.appkey,
          tokenString,
          sids: JSON.stringify([sid]),
        },
      })
        .then((result) => {
          this.$toast.clear();

          if (result.data.code == 700) {
            //token检验无效,则跳到登录页面
            this.$router.push({ name: "Login" });
          } else if (result.data.code == 7000) {
            //如果删除成功, 则移除页面的商品，重新计算订单总金额
            this.shopcarData.splice(index, 1);
            this.sum();
          }

          this.$toast(result.data.msg);
        })
        .catch((err) => {
          this.$toast.clear();
          
        });
    },

    //判断是否勾选商品
    isSelectProduct(msg) {
      for (let i = 0; i < this.shopcarData.length; i++) {
        if (this.shopcarData[i].isChecked) {
          //如果存在勾选商品
          return true;
        }
      }

      return false;
    },

    //删除选择
    removeselect() {
      let isHas = this.isSelectProduct();
      if (!isHas) {
        this.$toast("请选择删除的商品");
        return;
      }

      //sids: 勾选商品的购物袋sid集合
      let sids = [];
      this.shopcarData.map((v) => {
        if (v.isChecked) {
          sids.push(v.sid);
        }
      });

      //获取token
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
        url: "/deleteShopcart",
        data: {
          appkey: this.appkey,
          tokenString,
          sids: JSON.stringify(sids),
        },
      })
        .then((result) => {
          this.$toast.clear();
          
          if (result.data.code == 700) {
            //token检验无效,则跳到登录页面
            this.$router.push({ name: "Login" });
          } else if (result.data.code == 7000) {
            //移除页面的数据
            for (let i = 0; i < this.shopcarData.length; i++) {
              if (this.shopcarData[i].isChecked) {
                this.shopcarData.splice(i, 1);
                i--;
              }
            }

            this.sum();
          }

          this.$toast(result.data.msg);
        })
        .catch((err) => {
          this.$toast.clear();
          
        });
    },

    //修改数量
    changeCount(item) {
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

      //发起获取购物袋数据请求
      this.axios({
        method: "POST",
        url: "/modifyShopcartCount",
        data: {
          appkey: this.appkey,
          tokenString,
          sid: item.sid,
          count: item.count,
        },
      })
        .then((result) => {
          this.$toast.clear();

          if (result.data.code == 700) {
            //token检验无效,则跳到登录页面
            this.$router.push({ name: "Login" });
          } else if (result.data.code == 6000) {
            if (item.isChecked) {
              this.sum();
            }
          } else {
            this.$toast(result.data.msg);
          }
          // 
        })
        .catch((err) => {
          this.$toast.clear();
          
        });
    },

    //计算订单总金额
    sum() {
      this.total = 0;
      this.shopcarData.map((v) => {
        if (v.isChecked) {
          this.total += v.price * v.count;
        }
      });

      this.total *= 100;
    },

    //提交订单，跳转到订单页面
    commit() {
      let isHas = this.isSelectProduct();
      if (!isHas) {
        this.$toast("请选择购买的商品");
        return;
      }

      //sids: 勾选商品的购物袋sid集合
      let sids = [];
      this.shopcarData.map((v) => {
        if (v.isChecked) {
          sids.push(v.sid);
        }
      });

      //跳转到结算页面且携带sids查询参数
      this.$router.push({ name: "Pay", query: { sids: sids.join("-") } });
    },

    gohome() {
      this.$router.push({ name: "Home" });
    },
    gomenu(){
      this.$router.push({ name: 'Menu' });

    }
  },
};
</script>
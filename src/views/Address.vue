<template>
  <!-- 地址栏页面 -->
  <div class="address">
    <van-nav-bar
      title="地址列表"
      left-text="返回"
      left-arrow
      fixed
      @click-left="back"
    />
    <BgBox>
      <van-address-list
        :list="list"
        default-tag-text="默认"
        :switchable="false"
        @add="add"
        @edit="edit"
      />
    </BgBox>
  </div>
</template>

<script>
import BgBox from "../components/BgBox.vue";

export default {
  name: "Address",

  data() {
    return {
      chosenAddressId: "",
      list: [],
    };
  },

  created() {
    //获取地址列表数据
    this.getAddressData();
  },

  components: {
    BgBox,
  },

  methods: {
    //返回上一级
    back() {
      this.$router.go(-1);
    },

    //获取地址列表数据
    getAddressData() {
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
            });

            this.list = result.data.result;
          }
        })
        .catch((err) => {
          this.$toast.clear();
          
        });
    },

    //新增地址
    add() {
      this.$router.push({ name: "Newaddress" });
    },

    //编辑地址
    edit(item) {
      //item.aid: 地址aid
      this.$router.push({ name: "Newaddress", query: { aid: item.aid } });
    },
  },
};
</script>

<style lang="less" scoped>
.address {
  padding: 46px 0;

  /deep/ .van-nav-bar .van-icon {
    color: #FDDB3A;
  }

  /deep/ .van-nav-bar__text {
    color: #FDDB3A;
  }

  .van-tag--danger {
    background-color: #FDDB3A;
  }

  .van-address-item .van-radio__icon--checked .van-icon {
    background-color: #FDDB3A;
    border-color: #FDDB3A;
  }

  .van-address-list {
    padding: 0;
  }

  .van-address-item {
    padding: 0 0 10px 0;
    border-bottom: 1px solid #e8e8e8;
    &:last-child {
      border-bottom: none;
    }
  }

  .van-button--danger {
    background-color: #FDDB3A;
    border-color: #FDDB3A;
  }
 
}
</style>
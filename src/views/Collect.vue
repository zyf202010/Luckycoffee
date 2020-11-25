<template>
  <div class="collect">
    <van-nav-bar
      title="我的收藏"
      left-text="返回"
      left-arrow
      fixed
      @click-left="back"
    />

    <div class="bg-box">
      <div class="bg"></div>
      <div class="bg-content">
        <van-address-list v-if="collectData.length > 0">
          <div class="collect-box clearfix">

            
            <div
              class="collect-content fl"
              v-for="(item, index) in collectData"
              :key="index"
            >
              <div class="collect-img" @click="godetails(item.pid)">
                <img class="auto-img" :src="item.smallImg" />
              </div>

              <div class="collect-text">{{ item.name }}</div>
              <div class="collect-bottom clearfix">
                <div class="price">
                  ￥ {{ item.price }}
                  <span class="del fr" @click="delcollectdata(item.pid, index)"
                    ><van-icon name="delete" />
                  </span>
                </div>
              </div>
            </div>


          </div>
        </van-address-list>
        <div v-else>
          <van-empty description="没有收藏商品" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import "../assets/less/collect.less";
export default {
  name: "Collect",
  data() {
    return {
      collectData: [],
    };
  },

  created() {
    this.getcollectData();
  },
  methods: {
    //返回上一级
    back() {
      this.$router.go(-1);
    },
    //查询收藏的商品
    getcollectData() {
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
        url: "/findAllLike",
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
          } else if (result.data.code == 2000) {
            this.collectData = result.data.result;
          }
        })
        .catch((err) => {});
    },

    //删除收藏商品
    delcollect(pid, index) {
    
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
        url: "/notlike",
        data: {
          appkey: this.appkey,
          tokenString,
          pid,
        },
      })
        .then((result) => {
          this.$toast.clear();

          if (result.data.code == 700) {
            //token检验无效,则跳到登录页面
            this.$router.push({ name: "Login" });
          } else if (result.data.code == 900) {
            
            this.collectData.splice(index, 1);

            this.$toast(result.data.msg);
          }
        })
        .catch((err) => {});
    },

    //删除收藏商品提示
    delcollectdata(pid , index) {
      this.$dialog
        .confirm({
          title: "取消收藏",
          message: "是否取消收藏？",
        })
        .then(() => {
          //提交订单
          this.delcollect(pid , index);
        })
        .catch((err) => {
          
        });
    },

    godetails(pid) {
      this.$router.push({ name: "Details", params: { pid } });
     let pro = localStorage.getItem("pro");
      if (pro == "") {
        localStorage.setItem("pro", pid);
        return;
      }
      localStorage.setItem("pro", pro + "-" + pid);
    },
  },
};
</script>

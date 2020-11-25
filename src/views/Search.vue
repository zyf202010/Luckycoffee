<template>
  <div class="search">
    <van-nav-bar left-text="返回" left-arrow fixed @click-left="goback">

    <template #right>
      <van-search placeholder="输入商品名称" v-model="value" @input="searchData"/>
    </template>
    </van-nav-bar>

    <div class="hot-box clearfix" v-for="(item, index) in searchdata" :key="index" @click="goDetail(item.pid)">
      <div class="hot-content fl" >
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
</template>

<script>
export default {
  name: "Search",

  data() {
    return {
      value: "",
      searchdata:[],
    };
  },
  methods: {
    //搜索商品
    searchData() {
        if(this.value.length == ""){
            return
        }
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });

      this.axios({
        method: "GET",
        url: "/search",
        params: {
          appkey: this.appkey,
          name: this.value,
        },
      })
        .then((result) => {
          this.$toast.clear();

          this.searchdata = result.data.result;
          
        })
        .catch((err) => {});
    },
 //查看商品详情页面
    goDetail(pid) {
      this.$router.push({ name: "Details", params: { pid } });
      let pro = localStorage.getItem("pro");
      if (pro == null) {
        localStorage.setItem("pro", pid);
        return;
      }
      localStorage.setItem("pro", pro + "-" + pid);
    },
    // 返回上一页
    goback() {
      this.$router.go(-1);
    },
  },
};
</script>

<style lang="less" scoped>
.search {
    padding: 46px 0;
  /deep/ .van-nav-bar .van-icon {
    color: #FDDB3A;
  }

  /deep/ .van-nav-bar__text {
    color: #FDDB3A;
  }
  .van-search{
      padding: 0;
        // width: 100%;
  }
  
  /deep/ .van-nav-bar__right{
    width: calc(~"100% - 120px");
  }
  .van-search__content{
    border-radius: 15px;
  }

  .hot-box{
      height: 80px;
      background-color: #fff;
      border-radius: 10px;
      margin: 10px;
      position: relative;

    }
    .hot-content{
      margin: 5px 15px;
      transition: all 1s
    }
    .hot-name{
      margin-left: 15px;
      font-size: 15px;
      font-weight: bold;
      margin-top: 12px;
    }
    .hot-enname{
      margin-left: 15px;
      font-size: 12px;
      color: #999;
      margin-top: 6px;
    }
    .hot-price{
      position: absolute;
      right: 15px;
      top: calc(80px / 2 - 10px);
      color: #000;
      font-weight: bold;
    }
    .imgbox{
      width: 70px;
      height: 70px;
    }
    .imgbox img{
      border-radius: 50%;

    }
    /deep/ .van-icon-search::before{
      color: #FDDB3A;

    }
}
</style>
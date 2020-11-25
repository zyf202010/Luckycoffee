<template>
  <div class="footprint">
    <van-nav-bar
      title="历史浏览"
      left-text="返回"
      left-arrow
      @click-left="back"
    />


    <div class="bg-box">
      <div class="bg"></div>
      <div class="bg-content">
        <van-address-list v-if="footPrintData.length > 0">
          <div class="collect-box clearfix">

            
            <div
              class="collect-content fl"
              v-for="(item, index) in footPrintData"
              :key="index"
            >
              <div class="collect-img" @click="godetails(item.pid)">
                <img class="auto-img" :src="item.smallImg" />
              </div>

              <div class="collect-text">{{ item.name }}</div>
              <div class="collect-bottom clearfix">
                <div class="price">
                  ￥ {{ item.price }}
                  <span class="del fr" @click="delcollectdata(index,item.pid)"
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


export default {
  name: "Footprint",
  
  data() {
    return {
      footPrintData: [],
    };
  },
  created() {
    this.getData();
  },
  methods: {
    back() {
      this.$router.go(-1);
    },
    // 获取浏览过的商品数据
    getData() {
      let proData = [];

      //查找避免重复出现相同商品
      let data = localStorage.getItem("pro").split("-");
      data.forEach((e) => {
        if (proData.indexOf(e) == -1) {
          proData.push(e);

          //获取商品详情数据
         
          this.axios({
            //请求类型
            method: "GET",
            //请求路径
            url: "/productDetail",

            //GET请求参数, object
            params: {
              appkey: this.appkey,
              pid: e,
            },
          })
            .then((result) => {
              let proData = {};
              if (result.data.code == 600) {
                proData.name = result.data.result[0].name;
                proData.enname = result.data.result[0].enname;
                proData.price = result.data.result[0].price;
                proData.smallImg = result.data.result[0].small_img;
                proData.pid = result.data.result[0].pid;
              }
              this.footPrintData.push(proData);
            })
            .catch((err) => {
              err;
            });
        }
      });
      let str = proData.join("-");
      localStorage.setItem("pro", str);
      //   
    },
    // 删除浏览记录
    removeProduct(index, pid) {
      this.footPrintData.splice(index, 1);
      let data = localStorage.getItem("pro").split("-");
      for (let i = 0; i < data.length; i++) {
        if (data[i] == pid) {
          data.splice(i, 1);
        }
      }
      let str = data.join("-");
      localStorage.setItem("pro", str);
    },
  //删除收藏商品提示
    delcollectdata(index, pid) {
      this.$dialog
        .confirm({
          title: "取消收藏",
          message: "是否取消收藏？",
        })
        .then(() => {
          //提交订单
          this.removeProduct(index , pid);
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

<style lang="less" scoped>
.footprint {
  // padding: 46px 0;
  
    /deep/ .van-nav-bar .van-icon {
      color: #FDDB3A;
    }
  
    /deep/ .van-nav-bar__text {
      color: #FDDB3A;
    }
    .van-address-list__bottom {
      display: none;
    }
    .auto-img {
      border-radius: 10px;
    }
    .collect-content {
      width: calc(100% / 3 - 25px);
      padding: 12.5px;
      background-color: #fff;
    }
    .van-address-list {
      padding: 0;
      margin: 0;
    }
  .collect-text {
      margin-top: 10px;
      font-size: 14px;
      font-weight: bold;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .price {
      font-size: 14px;
      font-weight: bold;
      color: #FDDB3A;
      margin-top: 8px;
    }
    .del {
      color: #999;
    }
    .van-icon {
      font-size: 18px;
    }
    .van-empty {
      position: fixed;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
    }
    .bg-box {
      .bg {
        height: 100px;
        background-color: #FDDB3A;
      }
  
      .bg-content {
        margin: 0 10px;
        position: relative;
        top: -20px;
        background-color: #fff;
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
        overflow: hidden;
      }
    }
}
</style>
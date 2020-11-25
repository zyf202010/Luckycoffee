<template>
  <!-- 底部插件 -->
  <div class="walk">
    <!-- 二级路由 -->
    <div>
      <router-view></router-view>
    </div>

    <van-tabbar
      v-model="activename"
      inactive-color="#646566"
      active-color="#FDDB3A"
      route
    >
      <van-tabbar-item
        name="Home"
        :icon="item.icon"
        v-for="(item, index) in tabData"
        :key="index"
        replace
        :to="item.path"
        >{{ item.title }}
        <!-- 具有插槽作用域的插槽 -->
        <!-- <template #icon="props">
          <img :src="props.active ? item.activeImg : item.inactiveImg" />
        </template> -->
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {
  name: "Walk",

  data() {
    return {
      activename: "Home",

      tabData: [
        {
          title: "首页",
          path: "/walk/home",
          icon: "home-o",
          // inactiveImg: require("../assets/images/home.png"),
          // activeImg: require("../assets/images/home_active.png"),
        },
        {
          title: "菜单",
          path: "/walk/menu",
          icon: "label-o",
          // inactiveImg: require("../assets/images/menu.png"),
          // activeImg: require("../assets/images/menu_active.png"),
        },
        {
          title: "购物车",
          path: "/walk/shopcar",
          icon: "shopping-cart-o",
          // inactiveImg: require("../assets/images/shopbag.png"),
          // activeImg: require("../assets/images/shopbag_active.png"),
        },
        {
          title: "我的",
          path: "/walk/me",
          icon: "friends-o",
          // inactiveImg: require("../assets/images/my.png"),
          // activeImg: require("../assets/images/my_active.png"),
        },
      ],
    };
  },
};
</script>

<style lang="less" scoped>
</style>
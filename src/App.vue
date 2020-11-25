<template>
  <div id="app">
   
    <router-view/>
    
  </div>
</template>
<style>

  @import '~@/assets/icon/iconfont.css' ;

</style>
<style lang="less">
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    font-size: 16px;
    color: #444;

  }
  body{
    background-color: #f5f5f5;
  }
  .auto-img{
    width: 100%;
    display: block;
  }
  .one-text{
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .fr{
    float: right;
  }
  .fl{
    float: left;
  }
  .clearfix::after{
    content: "";
    display: block;
    clear: both;
  }
</style>

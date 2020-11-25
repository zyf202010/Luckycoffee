import Vue from 'vue'

import App from './App.vue'
import router from './router'

import axios from 'axios'
import VueAxios from 'vue-axios'

import 'lib-flexible/flexible'

import {
  Button,
  NavBar,
  Form,
  Field,
  Icon,
  Popup,
  Toast,
  Tabbar,
  TabbarItem,
  Search,
  Swipe,
  SwipeItem,
  GoodsAction,
  GoodsActionIcon,
  GoodsActionButton,
  Stepper,
  Empty,
  SwipeCell,
  Checkbox,
  SubmitBar,
  List,
  AddressEdit,
  AddressList,
  Dialog,
  Cell,
  CellGroup,
  Tab,
  Tabs,
  Uploader,
  Sidebar,
  SidebarItem,
} from 'vant';

Vue
  .use(Button)
  .use(NavBar)
  .use(Form)
  .use(Field)
  .use(Icon)
  .use(Popup)
  .use(Toast)
  .use(Tabbar)
  .use(TabbarItem)
  .use(Search)
  .use(Swipe)
  .use(SwipeItem)
  .use(GoodsAction)
  .use(GoodsActionIcon)
  .use(GoodsActionButton)
  .use(Stepper)
  .use(Empty)
  .use(SwipeCell)
  .use(Checkbox)
  .use(SubmitBar)
  .use(List)
  .use(AddressEdit)
  .use(AddressList)
  .use(Dialog)
  .use(Cell)
  .use(CellGroup)
  .use(Tab)
  .use(Tabs)
  .use(Uploader)
  .use(Sidebar)
  .use(SidebarItem)
















//设置Vue原型
Vue.prototype.appkey = 'U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=';

//配置请求的基础陆路径
axios.defaults.baseURL = 'http://www.kangliuyong.com:10002';

//axios拦截器 发起请求之前执行
axios.interceptors.request.use(config => {
  //处理post请求参数，进行参数序列化
  if (config.method == 'post') {
    //序列化post请求参数
    let paramsString = '';
    for (let item in config.data) {
      paramsString += `${item}=${config.data[item]}&`
    }

    //重新副职config。data
    config.data = paramsString.slice(0, -1)
  }

  //必须返回config
  return config
})
Vue.use(VueAxios, axios)

Vue.config.productionTip = false



//定义全局过滤器 保留两位小数
Vue.filter('decimal', (v, n = 2) => {
  return v.toFixed(n);
})

//格式化时间
Vue.filter("formatDate", (v, format) => {
  let date = new Date(v);
  //格式化年份
  let year = date.getFullYear().toString();
  if (/(y+)/.test(format)) {
    //获取匹配组内容
    var content = RegExp.$1;

    format = format.replace(content, year.slice(year.length - content.length));
  }
  //格式化月份 , 日份 ,时 ,分 ,秒
  let obj = {
    M: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    m: date.getMinutes(),
    s: date.getSeconds()
  }

  for (let key in obj) {
    //创建动态正则
    let reg = new RegExp(`(${key}+)`);

    if (reg.test(format)) {
      let group = RegExp.$1;

      format = format.replace(group, obj[key] >= 10 ? obj[key] : group.length == 2 ? "0" + obj[key] : obj[key])
    }
  }
  return format;
})


new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
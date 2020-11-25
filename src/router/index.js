import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path:'/',
    name:'Login',
    component: () => import("../views/Login.vue"),
 
  },
  {
    path:'/forget',
    name:'Forget',
    component: () => import("../views/Forget.vue")
  },
  {
    path:'/walk',
    name:'Walk',
    component:() => import("../views/Walk.vue"),

    children:[
      {
        path:'home',
        name:'Home',
        component:() => import("../views/Home.vue")
      },
      {
        path:'menu',
        name:'Menu',
        component:() => import("../views/Menu.vue")
      },
      {
        path:'shopcar',
        name:'Shopcar',
        component:() => import("../views/Shopcar.vue")
      },
      {
        path:'me',
        name:'Me',
        component:() => import("../views/Me.vue")
      },
    ]
  },
  {
    path:'/pay',
    name:'Pay',
    component: () => import("../views/Pay.vue")
  },

  {
    path: '/newaddress',
    name: 'Newaddress',
    component: () => import('../views/Newaddress.vue')
  },

  {
    path: '/address',
    name: 'Address',
    component: () => import('../views/Address.vue')
  },

  {
    path:'/details/:pid',
    name:'Details',
    component: () => import('../views/Details.vue')
  },
 
  {
    path:'/order',
    name:'Order',
    component: () => import('../views/Order.vue')
  },

  {
    path:'/personal',
    name:'Personal',
    component: () => import('../views/Personal.vue')

  },
  {
    path:'/security',
    name:'Security',
    component: () => import('../views/Security.vue')

  },
  {
    path:'/collect',
    name:'Collect',
    component: () => import('../views/Collect.vue')

  },
  {
    path:'/search',
    name:'Search',
    component: () => import('../views/Search.vue')

  },
  {
    path:'/abc',
    name:'Abc',
    component: () => import('../views/Abc.vue')

  },
    {
      path: '/footprint',
      name: 'Footprint',
      component: () => import('../views/Footprint.vue')
    },
//   {
//     path: '*',
//     redirect: {
//     name: 'Home'
//   }
// }
]

const router = new VueRouter({
  routes
})

export default router

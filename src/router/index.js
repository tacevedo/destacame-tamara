import Vue from 'vue'
import Router from 'vue-router'

import Home from '../pages/Home'
import Buses from '../pages/Buses'


Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
    },
    {
      path: '/buses',
      name: 'Buses',
      component: Buses,
    }
  ]
})

export default router

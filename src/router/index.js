import Vue from 'vue'
import Router from 'vue-router'

import Home from '../pages/Home'
import Trayectos from '../pages/Trayectos'
import Buses from '../pages/Buses'
import Choferes from '../pages/Choferes'
import Pasajeros from '../pages/Pasajeros'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/trayectos',
      name: 'Trayectos',
      component: Trayectos
    },
    {
      path: '/buses',
      name: 'Buses',
      component: Buses
    },
    {
      path: '/choferes',
      name: 'Choferes',
      component: Choferes
    },
    {
      path: '/pasajeros',
      name: 'Pasajeros',
      component: Pasajeros
    }
  ]
})

export default router

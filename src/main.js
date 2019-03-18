import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import router from './router'
import Vuetify from 'vuetify'
import VueSweetalert2 from 'vue-sweetalert2'
import Vuex from 'vuex'
import store from './store'
import 'vuetify/dist/vuetify.min.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'

Vue.use(VueRouter)
Vue.use(Vuex)
Vue.use(VueSweetalert2)
Vue.use(Vuetify, {
  theme: {
    primary: '#4285F4',
    secondary: '#D82768',
    accent: '#82B1FF',
    error: '#ff4444',
    info: '#33b5e5',
    success: '#00C851',
    warning: '#ffbb33'
  }
})

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')

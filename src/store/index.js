import Vuex from 'vuex'
import Vue from 'vue'
// import createPersistedState from 'vuex-persistedstate'

// import all storage modules
import HorariosTrayecto from './modules/HorariosTrayecto'
import AsignarPasajero from './modules/AsignarPasajero'

Vue.use(Vuex)
Vue.config.devtools = true

export default new Vuex.Store({
  // plugins: [createPersistedState()],
  modules: {
    HorariosTrayecto: HorariosTrayecto,
    AsignarPasajero: AsignarPasajero
  }
})

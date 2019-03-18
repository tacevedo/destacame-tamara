import API from '../../services/api/app.js'

const getDefaultState = () => {
  return {
    showsidebar: true,
    pasajeros: [],
    trayectos: [],
    choferes: []
  }
}

const state = getDefaultState()

// getters
const getters = {
  showsidebar: state => state.showsidebar,
  pasajeros: state => state.pasajeros,
  trayectos: state => state.trayectos,
  choferes: state => state.choferes
}

// actions
const actions = {
  resetBookingState ({ commit }) {
    commit('resetState')
  },
  set_show_sidebar ({commit}, payload) {
    commit('SET_SHOW_SIDEBAR', {showsidebar: payload.showsidebar})
  },
  async get_pasajeros ({commit}, payload) {
    try {
      let respuesta = await API.selectAll('pasajero')
      if (respuesta.status >= 200 && respuesta.status < 300) {
        
        let filtrados = respuesta.data
        commit('SET_PASAJEROS', {pasajeros: filtrados})
      }
    } catch (e) {
      console.log('catch err', e)
    }
  },
  async get_trayectos ({commit}, payload) {
    try {
      let respuesta = await API.selectAll('trayecto')
      if (respuesta.status >= 200 && respuesta.status < 300) {
        
        let filtrados = respuesta.data
        commit('SET_TRAYECTOS', {pasajeros: filtrados})
      }
    } catch (e) {
      console.log('catch err', e)
    }
  },
  async get_choferes ({commit}, payload) {
    try {
      let respuesta = await API.selectAll('chofer')
      if (respuesta.status >= 200 && respuesta.status < 300) {
        let filtrados = respuesta.data
        commit('SET_CHOFERES', {choferes: filtrados})
      }
    } catch (e) {
      console.log('catch err', e)
    }
  },
}

// mutations
const mutations = {
  resetState (state) {
    Object.assign(state, getDefaultState())
  },
  SET_PASAJEROS: (state, {pasajeros}) => {
    state.pasajeros = pasajeros
  },
  SET_TRAYECTOS: (state, {trayectos}) => {
    state.trayectos = trayectos
  },
  SET_CHOFERES: (state, {choferes}) => {
    state.choferes = choferes
  }
}

export default {
  namespaced: true,
  preserveState: true,
  state,
  getters,
  actions,
  mutations
}

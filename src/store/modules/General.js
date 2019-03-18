import API from '../../services/api/app.js'

const getDefaultState = () => {
  return {
    showsidebar: true
  }
}

const state = getDefaultState()

// getters
const getters = {
  showsidebar: state => state.showsidebar
}

// actions
const actions = {
  resetBookingState ({ commit }) {
    commit('resetState')
  },
  set_show_sidebar ({commit}, payload) {
    // console.log('store action')
    commit('SET_SHOW_SIDEBAR', {showsidebar: payload.showsidebar})
  },
 
}

// mutations
const mutations = {
  resetState (state) {
    Object.assign(state, getDefaultState())
  },
  SET_SHOW_SIDEBAR: (state, {showsidebar}) => {
    console.log('muta showsidebar', showsidebar)
    state.showsidebar = showsidebar
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

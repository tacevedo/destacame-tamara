import API from '../../services/api/app.js'

const getDefaultState = () => {
  return {
    trayectoId: '',
    horariosTrayecto: []
  }
}

const state = getDefaultState()

// getters
const getters = {
  trayectoId: state => state.trayectoId,
  horariosTrayecto: state => state.horariosTrayecto
}

// actions
const actions = {
  resetBookingState ({ commit }) {
    commit('resetState')
  },
  set_horariostrayecto ({commit}, payload) {
    console.log('store action')
    commit('SET_HORARIOSTRAYECTO', {horariosTrayecto: payload.horariosTrayecto})
  },
  async getHorarios ({commit}, payload) {
    try {
      console.log('llega a get horarios store')
      let respuesta = await API.selectAll('horario')
      if (respuesta.status >= 200 && respuesta.status < 300) {
        commit('SET_TRAYECTOID', {trayectoId: payload.trayectoId})
        console.log('response horarios', respuesta, 'trayecto', payload.trayectoId)
        let filtrados = respuesta.data.filter(item => item.id_trayecto === payload.trayectoId)
        commit('SET_HORARIOSTRAYECTO', {horariosTrayecto: filtrados})
        // this.$store.dispatch('HorariosTrayecto/set_horariostrayecto', {horariosTrayecto: this.horariosTrayecto})
      }
    } catch (e) {
      console.log('catch err', e)
    }
  }
}

// mutations
const mutations = {
  resetState (state) {
    Object.assign(state, getDefaultState())
  },
  SET_HORARIOSTRAYECTO: (state, {horariosTrayecto}) => {
    console.log('muta horariostrayecto', horariosTrayecto)
    state.horariosTrayecto = horariosTrayecto
  },
  SET_TRAYECTOID: (state, {trayectoId}) => {
    state.trayectoId = trayectoId
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

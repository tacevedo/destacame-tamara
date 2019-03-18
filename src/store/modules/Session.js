import API from '@pi/login'

const state = {
  auth: {
    email: null,
    isAuth: false,
    login_at: false,
    loading: false
  }
}

// getters
const getters = {
  getAuth: state => state.auth,
  authorization: state => `${state.auth.token_type} ${state.auth.access_token}`
}

// actions
const actions = {
  logout ({commit}) {
    commit('LOGOUT')
    return true
  },
  async login ({commit}, payload) {
    commit('LOGOUT')
    commit('SET_LOADING', {loading: true})
    try {
      let loginResult = await API.login(payload)
      commit('SET_LOADING', {loading: false})
      if (loginResult.data && loginResult.data.access_token) {
        return commit('SET_SESSION', {response: loginResult.data, email: payload.email})
      }
    } catch (e) {
      commit('SET_LOADING', {loading: false})
      return e && e.status === 401 ? {error: 'Usuario y/o contraseña invalido'} : {error: 'Error al iniciar sesion'}
    }
  }
}

// mutations
const mutations = {
  LOGOUT: (state) => {
    state.auth = {
      email: null,
      isAuth: false,
      login_at: false,
      invalid: false,
      loading: false
    }
  },
  SET_LOADING: (state, {loading}) => {
    state.auth.loading = loading
  },
  SET_SESSION: (state, {response, email}) => {
    Object.assign(state.auth, {...response})
    state.auth.email = email
    state.auth.login_at = +new Date()
    state.auth.isAuth = true
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}

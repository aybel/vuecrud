import Vue from 'vue'
import Vuex from 'vuex'
import router from '../router'
import jwt from 'jwt-decode';
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: null,
    usuario: null
  },
  mutations: {
    setToken(state, token) {
      state.token = token;
    },
    setUsuario(state, usuario) {
      state.usuario = usuario
    }
  },
  actions: {
    guardarToken({ commit }, token) {
      //guardar token en local storage
      commit("setToken", token);
      commit('setUsuario', jwt(token))
      localStorage.setItem('token', token);
    },
    validarLogin({ commit }) {
      let token = localStorage.getItem('token');
      if (token) {
        commit('setToken', token);
        commit('setUsuario', jwt(token));
      }
      router.push({ name:'Home' });
    },
    salir({ commit }) {
      commit('setToken', null);
      commit('setUsuario', null);
      localStorage.removeItem("token");
      router.push({ name: 'Login' });
    }
  },
  modules: {

  }
})

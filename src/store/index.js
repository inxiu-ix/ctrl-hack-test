import Vue from 'vue'
import Vuex from 'vuex'
import calculateForm from './modules/calculateForm'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    calculateForm
  }
})

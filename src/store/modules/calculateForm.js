import helpers from '../../helpers/helpers';
import createLog from '../../services/createLog'
import api from '../../api/api.js'

export default {
  state: {
    formData: {
      price: 0,
      qty: 0,
      amount: 0
    },
    nonce: 0,
    inputQueue: ['price', 'qty', 'amount'],
    logs: [],
    storage: 'Пусто'
  },
  actions: {
    calculate({ state, commit }, { value, slug }) {
      const slugIdxInQueue = state.inputQueue.indexOf(slug)
      if (slugIdxInQueue) {
        commit('updateQueue', { idx: slugIdxInQueue, slug })
      }
      commit('updateFormValue', { slug, value})
      switch (
        state.inputQueue[2]
      ) {
        case 'price':
          commit('calculatePrice')
          break
        case 'qty':
          commit('calculateQty')
          break;
        case 'amount':
          commit('calculateAmount')
          break;
      }
    },
    submit({ state, commit }) {
      if (state.formData.amount % 2 === 0) {
        setTimeout(() => {
          commit('incrementNonce')
          const submitData = {...state.formData, nonce: state.nonce}

          api.save('calculateStorageVuex', submitData)
          const storage = api.fetch('calculateStorageVuex')
          commit('updateStorage', storage)
          commit('pushToLog', 'Данные успешно сохранены. Текущее состояние обновлено!')
        }, 1000)
      }else {
        commit('pushToLog', 'Ошибка. amount нечетное число. Даннные не сохранены')
      }
    }
  },
  mutations: {
    updateQueue(state, { idx, slug }) {
      state.inputQueue.splice(idx, 1)
      state.inputQueue.unshift(slug)
    },
    calculatePrice(state) {
      const price = helpers.calculatePrice(state.formData)
      state.formData.price = price
    },
    calculateQty(state) {
      const qty = helpers.calculateQty(state.formData)
      state.formData.qty = qty
    },
    calculateAmount(state) {
      const amount = helpers.calculateAmount(state.formData)
      state.formData.amount = amount
    },
    pushToLog(state, text) {
      const log = createLog(text)
      state.logs.unshift(log)
    },
    incrementNonce(state) {
      state.nonce++
    },
    updateStorage(state, storage) {
      state.storage = storage
    },
    updateNonce(state, nonce) {
      state.nonce = nonce
    },
    updateFormValue(state, { slug, value}) {
      state.formData[slug] = value
    }
  },
  getters: {
    formData: (state) => state.formData,
    logs: (state) => state.logs,
    storage: (state) => state.storage
  }
}
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
    calculate({ state, commit }, { event, slug }) {
      const slugIdxInQueue = state.inputQueue.indexOf(slug)
      if (slugIdxInQueue) {
        commit('updateQueue', { idx: slugIdxInQueue, slug })
      }
      commit('updateFormValue', { slug, value: +event.target.value})
      commit('setLogs', { id: +new Date + Math.random(), text: `Поле ${slug} изменилось на ${event.target.value}` })
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
          localStorage.setItem('calculateStorageVuex', JSON.stringify(submitData))
          commit('updateStorage', localStorage.getItem('calculateStorageVuex'))
          commit('setLogs', {id: +new Date + Math.random(), text: 'Данные успешно сохранены. Текущее состояние обновлено!'})
        }, 1000)
      }else {
        commit('setLogs', {id: +new Date + Math.random(), text: 'Ошибка. amount нечетное число. Даннные не сохранены'})
      }
    }
  },
  mutations: {
    updateQueue(state, { idx, slug }) {
      state.inputQueue.splice(idx, 1)
      state.inputQueue.unshift(slug)
    },
    calculatePrice(state) {
      const price = state.formData.amount / state.formData.qty;
      if (isFinite(price) && price !== state.formData.price) {
        state.formData.price = price
        this.commit('setLogs', { id: +new Date + Math.random(1000), text: `Поле price изменилось на ${state.formData.price}` })
      }
    },
    calculateQty(state) {
      const qty = state.formData.amount / state.formData.price;
      if (isFinite(qty) && qty !== state.formData.qty) {
        state.formData.qty = qty
        this.commit('setLogs', { id: +new Date + Math.random(), text: `Поле qty  изменилось на ${state.formData.qty}` })
      }
    },
    calculateAmount(state) {
      const amount = state.formData.price * state.formData.qty;
      if (isFinite(amount) && amount !== state.formData.amount) {
        state.formData.amount = amount
        this.commit('setLogs', { id: +new Date + Math.random(), text: `Поле amount  изменилось на ${state.formData.amount}` })
      }
    },
    setLogs(state, log) {
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
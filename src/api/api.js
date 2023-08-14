class Api {
  save(storage, data) {
    localStorage.setItem(storage, JSON.stringify(data))
  }
  fetch(storage) {
    const res = localStorage.getItem(storage)
    return res
  }
}

const api = new Api

export default api
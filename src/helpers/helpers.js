export default {
  calculatePrice: data => {
    const price = data.amount / data.qty;

    if (isFinite(price) && price !== data.price) {
      return price
    }
    return data.price
  },
  calculateQty: data => {
    const qty = data.amount / data.price

    if (isFinite(qty) && qty !== data.qty) {
      return qty
    }
    return data.qty
  },
  calculateAmount: data => {
    const amount = data.price * data.qty
    if (isFinite(amount) && amount !== data.amount) {
      return amount
    }
    return data.amount
  },
}
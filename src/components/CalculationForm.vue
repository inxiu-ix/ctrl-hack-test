<template>
<div class="container">
  <div class="form">
    <div v-for="input in formInputs" :key="input.id" class="form-item">
      <input
        @input="calculate($event, input.slug)"
        :value="formData[input.slug]"
        :placeholder="input.slug"
        type="number"
      />
      <span class="form-label">{{input.slug}}:{{formData[input.slug]}}</span>
    </div>
    <div class="button-container">
      <button @click="submit">Submit</button>
      <span class="form-label">Current Storage:</span>
      <span> {{storage}} </span>
    </div>
  </div>
  <div v-if="logs.length" class="logs">
    <div v-for="log in logs" :key="log.id" class="logs-item">{{log.text}}</div>
  </div>
</div>
</template>

<script>
import { debounce } from "lodash";
import helpers from '../helpers/helpers'
import createLog from '../services/createLog'
import api from '../api/api.js'

export default {
  data() {
    return {
      formInputs: [
        {
          id: 1,
          slug: 'price',
        },
        {
          id: 2,
          slug: 'qty',
        },
        {
          id: 3,
          slug: 'amount',
        }
      ],
      formData: {
        price: 0,
        qty: 0,
        amount: 0
      },
      nonce: 0,
      inputQueue: ['price', 'qty', 'amount'],
      logs: [],
      storage: 'Пусто'
    }
  },
  created() {
    this.initStorage()
  },
  watch: {
    'formData.price': function(value) {
      this.pushToLog(`Поле price изменилось на ${value}`)
    },
    'formData.qty': function(value) {
      this.pushToLog(`Поле qty изменилось на ${value}`)
    },
    'formData.amount': function(value) {
      this.pushToLog(`Поле amount изменилось на ${value}`)
    }
  },
  methods: {
    calculate: debounce(function (event, slug) {
      const slugIdxInQueue = this.inputQueue.indexOf(slug)

      if (slugIdxInQueue) {
        this.inputQueue.splice(slugIdxInQueue, 1)
        this.inputQueue.unshift(slug)
      }

      this.formData[slug] = +event.target.value

      switch (
        this.inputQueue[2]
      ) {
        case 'price':
          this.formData.price = helpers.calculatePrice(this.formData)
          break
        case 'qty':
          this.formData.qty = helpers.calculateQty(this.formData)
          break;
        case 'amount':
          this.formData.amount = helpers.calculateAmount(this.formData)
          break;
      }
    }, 300),
    submit() {
      if (this.formData.amount % 2 === 0) {
        setTimeout(() => {
          this.nonce++

          const submitData = {...this.formData, nonce: this.nonce}

          api.save('calculationStorage', submitData)
          this.storage = api.fetch('calculationStorage')
          this.pushToLog('Данные успешно сохранены. Текущее состояние обновлено!')
        }, 1000)
      }else {
        this.pushToLog('Ошибка. amount нечетное число. Даннные не сохранены')
      }
    },
    initStorage() {
      const currentStorage = api.fetch('calculationStorage');

      if (currentStorage) {
        this.storage = currentStorage
        this.nonce = JSON.parse(currentStorage).nonce;
      }
    },
    pushToLog(text) {
      const log = createLog(text)
      this.logs.unshift(log)
    }
  }
}
</script>

<style>

  .container {
    padding: 20px;
    border: 1px solid black;
    width: fit-content;
  }
  .form {
    display: flex;
  }
  .form-item {
    margin-right: 20px;
    display: flex;
    flex-direction: column;
  }

  .form-label {
    text-align: start;
    margin-top: 5px;
  }

  .button-container {
    display: flex;
    flex-direction: column;
  }
  .logs {
    margin-top: 20px;
  }
  .logs-item {
    font-size: 12px;
    text-align: start;
  }

</style>
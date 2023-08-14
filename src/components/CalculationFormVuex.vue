<template>
  <div>
    <h3> Form vuex </h3>
    <div class="container">
      <div class="form">
        <div v-for="input in formInputs" :key="input.id" class="form-item">
          <input
            @input="initCalculate($event, input.slug)"
            :placeholder="input.slug"
            :value="formData[input.slug]"
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
  </div>
</template>

<script>
import { debounce } from "lodash";
import { mapGetters, mapActions, mapMutations} from "vuex"
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
    }
  },
  computed: {
    ...mapGetters(['formData', 'logs', 'storage'])
  },
  created() {
    this.initStorage();
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
    ...mapActions(['calculate', 'submit']),
    ...mapMutations(['updateStorage', 'updateNonce', 'pushToLog']),
    initCalculate: debounce( function (event, slug) {
      const value = +event.target.value

      this.calculate({value, slug})
    }, 300),
    initStorage() {
      const currentStorage = api.fetch('calculateStorageVuex');
      if (currentStorage) {
        this.updateStorage(currentStorage)
        this.updateNonce(JSON.parse(currentStorage).nonce)
      }
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
<template>
  <div id="app">
    <calculation-form />
    <calculation-form-vuex/>
  </div>
</template>

<script>
import CalculationForm from './components/CalculationForm.vue'
import CalculationFormVuex from './components/CalculationFormVuex.vue'

export default {
  name: 'App',
  components: {
    CalculationForm,
    CalculationFormVuex
  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>

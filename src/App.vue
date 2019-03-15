<template>
  <v-app id="app">
    <toolbar />
    <router-view />
  </v-app>
</template>

<script>
  import Toolbar from './components/Toolbar'
  export default {
    name: 'app',
    components: {
      Toolbar
    }
  }
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>

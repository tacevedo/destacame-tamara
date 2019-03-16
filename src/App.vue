<template>
  <v-app id="app">
    <toolbar />
    <sidebar />
    <router-view class="contenido"/>
  </v-app>
</template>

<script>
  import Toolbar from './components/Toolbar'
  import Sidebar from './components/Sidebar'
  
  export default {
    name: 'app',
    components: {
      Toolbar,
      Sidebar
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
  .contenido {
    margin-left: 260px;
  }
</style>

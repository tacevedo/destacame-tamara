<template>
  <v-app id="app">
    <toolbar />
    <sidebar />
    <v-content>
      <v-container fluid class="pa-0">
        <v-layout justify-center align-center>
          <router-view/>
        </v-layout>
      </v-container>
    </v-content>
    <!-- <router-view class="contenido"/> -->
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
    width: 100%;
  }

  .title-modal{
    text-align:center;
    padding-bottom:5px;
    width: 100%;
    background:
      linear-gradient(
        to left, 
        transparent 0%,
        #2F5499 47%,
        transparent 100%
      )
      left 
      bottom
      transparent    
      no-repeat; 
    background-size:100% 2px ;
  }

</style>

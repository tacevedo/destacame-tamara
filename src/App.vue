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
@import url('https://fonts.googleapis.com/css?family=Oxygen');
  #app {
    font-family: 'Oxygen', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    width: 100%;
  }
  html * {
    font-size: 1.05em;
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
  .swal2-popup.modal-info {
    font-family: 'Oxygen', sans-serif;
  }
  .swal2-popup.swal2-modal.modal-info{
    border-radius: 0;
  }
  .swal2-popup.modal-info .swal2-styled.swal2-confirm {
    border: 1px solid #1565c0;
    border-radius: 0;
    background: transparent;
    background-color: transparent;
    color: #1565c0;
    font-size: 1.0625em;
    outline: none;
  }
  .swal2-popup.modal-info .swal2-styled.swal2-cancel:focus,
  .swal2-popup.modal-info .swal2-styled.swal2-confirm:focus {
    box-shadow: none;
  }
  .swal2-popup.modal-info .swal2-styled.swal2-cancel {
    border-radius: 0;
    border: none;
    background-color: #1565c0;
    outline: none;
  }
  .swal2-popup.modal-info .swal2-styled.swal2-confirm:hover {
    border: 1px solid #1565c0;
    border-radius: 0;
    background: transparent;
    background-color: rgba(21, 101, 192, 0.12);
    color: #1565c0;
    font-size: 1.0625em;
  }
</style>

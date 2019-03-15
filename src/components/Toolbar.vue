<template>
  <v-toolbar color="primary" class="white--text">
    <!-- <v-toolbar-side-icon></v-toolbar-side-icon> -->
    <v-toolbar-title :to="asignarPath">Gestiona viajes</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-toolbar-items class="hidden-sm-and-down">
      <v-btn flat :to="asignarPath">Asignar Asiento</v-btn>
      <v-btn flat :to="trayectosPath">Trayectos</v-btn>
      <v-btn flat :to="busesPath">Buses</v-btn>
      <v-btn flat :to="choferesPath">Choferes</v-btn>
      <v-btn flat :to="pasajerosPath">Pasajeros</v-btn>
    </v-toolbar-items>
  </v-toolbar>
</template>

<script>
  export default {
    name: 'Toolbar',
    data: () => ({
      asignarPath: '/',
      busesPath: '/buses',
      trayectosPath: '/trayectos',
      choferesPath: '/choferes',
      pasajerosPath: '/pasajeros'
    })
  }
</script>

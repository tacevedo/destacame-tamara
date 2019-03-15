<template>
  <v-toolbar>
    <!-- <v-toolbar-side-icon></v-toolbar-side-icon> -->
    <v-toolbar-title>Gestiona viajes</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-toolbar-items class="hidden-sm-and-down">
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
      busesPath: '/buses',
      trayectosPath: '/trayectos',
      choferesPath: '/choferes',
      pasajerosPath: '/pasajeros'
    })
  }
</script>

<template>
  <v-toolbar color="primary" class="white--text">
    <v-toolbar-side-icon 
        @click="toggleDrawer"
      ></v-toolbar-side-icon>
    <v-toolbar-title :to="asignarPath">Gestiona viajes</v-toolbar-title>
    <v-spacer></v-spacer>
  </v-toolbar>
</template>

<script>
  import {mapGetters} from 'vuex'
  
  export default {
    name: 'Toolbar',
    data: () => ({
      asignarPath: '/',
      drawer: true
    }),
    computed: {
      ...mapGetters({
        showSide: ['General/showsidebar']
      })
    },
    methods: {
      toggleDrawer () {
        this.drawer = !this.drawer
        this.$store.dispatch('General/set_show_sidebar', {showsidebar: this.drawer})
      }
    }
  }
</script>

<template>
  <v-navigation-drawer
    clipped
    :value="drawer"
    fixed 
    permanent
    app
    :width="260"
    id="sidebar"
  >
    <v-list dense class="pb-5">
      <div v-for="(item, i) in items" v-bind:key="i">
        <v-list-tile :to="item.path">
          <v-list-tile-action>
            <v-icon>{{item.icon}}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>
              {{ item.text }}
            </v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </div>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
  export default {
    props: ['drawer'],
    data: () => ({
      items: [
        {icon: 'how_to_reg', text: 'Asignar pasajeros', path: { path: '/' }},
        {icon: 'directions_bus', text: 'Buses', path: { path: '/buses' }},
        {icon: 'power_input', text: 'Trayectos', path: { path: '/trayectos' }},
        {icon: 'airline_seat_recline_normal', text: 'Choferes', path: { path: '/choferes' }},
        {icon: 'directions_walk', text: 'Pasajeros', path: { path: '/pasajeros' }}
      ]
    })
  }
</script>
<style>
  #sidebar.v-navigation-drawer{
    top: 64px;
  }
</style>
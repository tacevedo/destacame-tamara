<template>
  <div class="elevation-1">
    <v-toolbar flat color="white">
      <!-- <v-text-field
        v-model="search"
        append-icon="search"
        label="Buscar"
        single-line
        hide-details
      ></v-text-field>
      <v-spacer></v-spacer>
      <div class="text-xs-right">
        <v-btn color="primary" @click="dialog = true"> <v-icon light>add</v-icon> Agregar Bus</v-btn>
      </div> -->
    </v-toolbar>

    <v-data-table
        :headers="headers"
        :items="items"
        hide-actions
        no-data-text="No hay buses registrados"
      >
      <template slot="items" slot-scope="props">
        <td class="">{{ props.item.patente }}</td>
        <td class="">{{ props.item.marca }}</td>
        <td class="">{{ props.item.chofer_id }}</td>
        <td class="justify-center">
          <v-tooltip top>
            <v-icon
              small
              slot="activator"
              color="primary"
              @click="editItem(props.item)"
            >
              edit
            </v-icon>
            <span>Editar</span>
          </v-tooltip>
        </td>
        <td class="">
          <v-tooltip top>
            <v-icon
              small
              slot="activator"
              color="primary"
              @click="deleteItem(props.item)"
            >
              delete
            </v-icon>
            <span>Eliminar</span>
          </v-tooltip>
        </td>
      </template>
    </v-data-table>
  </div>
</template>

<script>
  export default {
    props: ['headers', 'items'],
    methods: {
      editItem (item) {
        this.$emit('editItem', item)
      },
      deleteItem (item) {
        this.$emit('deleteItem', item)
      }
    }
  }
</script>

<style scoped>

</style>

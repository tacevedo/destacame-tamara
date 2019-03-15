<template>
  <div>
    <div class="py-3"><h2 class="primary--text">Buses</h2> </div>
    
    <v-dialog v-model="dialog" persistent max-width="900px">
      <v-card>
        <v-card-title primary-title>
            <h3 class="headline">Bus</h3>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12 md6>
                <v-text-field label="Patente"
                              v-model="editedItem.plate"></v-text-field>
              </v-flex>
              <v-flex xs12 md6>
                <v-text-field label="Marca" v-model="editedItem.marca"></v-text-field>
              </v-flex>

            </v-layout>
            
            <v-layout wrap>
              <v-flex xs12 md6>
                <v-text-field label="Chofer" v-model="editedItem.chofer_id"></v-text-field>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary darken-1" flat @click.native="close()">Cancelar</v-btn>
          <v-btn color="primary" class='white--text' @click.native="save">Guardar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- dialogo confirmar eliminar -->
    <v-dialog v-model="confirmaAnular" persistent max-width="450">
      <v-card>
        <v-card-title class="headline primary white--text">¿Esta seguro de eliminar el usuario?</v-card-title>
        <v-card-text>Una vez realizada esta acción no podrá recuperar el usuario.</v-card-text>
        <v-card-actions class="pb-3 px-3">
          
          <v-btn color="primary" outline @click.native="confirmaAnular = false">Volver</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="deleteItem(eliminaid)">Eliminar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <div class="elevation-1">
      <v-toolbar flat color="white">
        <v-text-field
          v-model="search"
          append-icon="search"
          label="Buscar"
          single-line
          hide-details
        ></v-text-field>
        <v-spacer></v-spacer>
        <div class="text-xs-right">
          <v-btn color="primary" @click="dialog = true"> <v-icon light>add</v-icon> Agregar Bus</v-btn>
        </div>
      </v-toolbar>

      <v-data-table
          :headers="headers"
          :items="buses"
          :search="search"
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
  </div>
</template>

<script>
  // import API from '@pi/app'

  export default {
    data () {
      return {
        confirmaAnular: false,
        dialog: false,
        search: '',
        editedItem: {
          patente: '',
          marca: '',
          chofer_id: ''
        },
        headers: [
          {text: 'Patente', value: 'patente'},
          {text: 'Marca', value: 'marca'},
          {text: 'Chofer', value: 'chofer_id'},
          {text: '', value: 'edit', sortable: false},
          {text: '', value: 'delete', sortable: false}
        ],
        buses: [
          {
            patente: '113939483-5',
            marca: 'Bus 2',
            chofer_id: 'EST'
          },
          {
            patente: '113939483-5',
            marca: 'Bus 2',
            chofer_id: 'EST'
          },
          {
            patente: '113939483-5',
            marca: 'Bus 2',
            chofer_id: 'EST'
          }
        ]
      }
    },
    // mounted () {
    //   this.getbuses()
    // },
    methods: {
    //   async getbuses () {
    //     let buses = await API.get('buses')
    //     if (buses.status >= 200 && buses.status < 300) {
    //       console.log(buses)
    //       this.buses = buses
    //     }
    //   },
      editItem (item) {
        this.editedItem = item
        this.dialog = true
      },
      deleteItem () {
        this.confirmaAnular = true
      },
      close () {
        this.dialog = false
        this.editedItem = {}
      }
    }
  }
</script>
<template>
  <div class="pa-3">
    <h2 class="py-3 secondary--text">Trayectos</h2>
    
    <v-dialog v-model="dialog" persistent max-width="900px" style="text-align: right">
      <v-card>
        <v-card-title primary-title class="secondary--text">
            <h3 class="headline">Trayecto</h3>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12 md6>
                <v-text-field label="Ida" outline v-model="editedItem.ida"></v-text-field>
              </v-flex>
              <v-flex xs12 md6>
                <v-text-field label="Vuelta" outline v-model="editedItem.vuelta"></v-text-field>
              </v-flex>
            </v-layout>
            <v-layout wrap>
              <v-flex xs12 sm6>
                <v-text-field label="Terminal" outline v-model="editedItem.terminal"></v-text-field>
              </v-flex>
            </v-layout>
            <v-layout wrap>
              <button @click="addRow">Agregar Horario y Bus</button>
              <v-flex xs12>
                <v-layout wrap v-for="(input, index) in inputs" :key="index">
                  <v-flex xs5>
                      <v-text-field label="Horario" outline v-model="input.horario"></v-text-field>
                  </v-flex>
                  <v-flex xs5>
                      <v-text-field label="Bus" outline v-model="input.bus"></v-text-field>
                  </v-flex>
                  <v-flex xs2>
                      <button @click="deleteRow(index)">Delete</button>
                  </v-flex>
                </v-layout>
              
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary darken-1" outline @click.native="close()">Cancelar</v-btn>
          <v-btn color="primary" class='white--text' @click.native="save(editedItem)">Guardar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- dialogo confirmar eliminar -->
    <v-dialog v-model="confirmaAnular" persistent max-width="450">
      <v-card>
        <v-card-title class="headline primary white--text">¿Esta seguro de eliminar el trayecto?</v-card-title>
        <v-card-text>Una vez realizada esta acción no podrá recuperar los datos.</v-card-text>
        <v-card-actions class="pb-3 px-3">
          <v-spacer></v-spacer>          
          <v-btn color="primary" outline @click.native="confirmaAnular = false">Volver</v-btn>
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
          <v-btn color="primary" @click="dialog = true"> <v-icon light>add</v-icon> Agregar trayecto</v-btn>
        </div>
      </v-toolbar>

      <v-data-table
          :headers="headers"
          :items="trayectos"
          :search="search"
          hide-actions
          no-data-text="No hay trayectos registrados"
        >
        <template slot="items" slot-scope="props">
          <td>{{ props.item.ida }}</td>
          <td>{{ props.item.vuelta }}</td>
          <td>{{ props.item.terminal }}</td>
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
                @click="irEliminar(props.item.id)"
              >
                delete
              </v-icon>
              <span>Eliminar</span>
            </v-tooltip>
          </td>
        </template>
      </v-data-table>
    </div>
        <!-- Modal error-->
    <modal v-if="showModal"
        @close="showModal = false"
        v-bind:btn1="modalInfoBtn1">
        <p slot="title" class="headline mb-0">{{modalInfoTitle}}</p>
        <h3 slot="body">{{modalInfoDetail}}</h3>
    </modal>
  </div>
</template>

<script>
  export default {
    name: 'Trayectos',
    data () {
      return {
        confirmaAnular: false,
        dialog: false,
        search: '',
        loading: true,
        showModal: false,
        modalInfoTitle: '',
        modalInfoDetail: '',
        modalInfoBtn1: '',
        editedItem: {
          ida: '',
          vuelta: '',
          terminal: ''
        },
        headers: [
          {text: 'Ida', value: 'ida'},
          {text: 'Vuelta', value: 'vuelta'},
          {text: 'Terminal', value: 'terminal'},
          {text: '', value: 'edit', sortable: false},
          {text: '', value: 'delete', sortable: false}
        ],
        trayectos: [
          {ida: 'Stgo', vuelta: 'Talca', terminal: 'Borja'},
          {ida: 'Serena', vuelta: 'Vina', terminal: 'terminal1'},
          {ida: 'Valparaiso', vuelta: 'Con con', terminal: 'T1'}
        ],
        inputs: []
      }
    },
    methods: {
      addRow() {
        this.inputs.push({
          one: '',
          two: ''
        })
      },
      deleteRow(index) {
        this.inputs.splice(index,1)
      },
      irEliminar (datoid) {
        this.eliminaid = datoid
        this.confirmaAnular = true
      },
      close () {
        this.dialog = false
        this.editedItem = Object.assign({}, '')
      },
      editItem (item) {
        this.editedItem = item
        this.dialog = true
      }
    }
  }
</script>

<style>
  
</style>

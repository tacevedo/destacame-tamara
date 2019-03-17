<template>
  <div class="pa-3">
    <h2 class="py-3 secondary--text">Trayectos</h2>
    
    <v-dialog v-model="dialog" persistent max-width="90%" style="text-align: right">
      <v-card>
        <v-card-title primary-title class="secondary--text">
            <h3 class="headline">Trayecto</h3>
        </v-card-title>
        <v-card-text>
          <v-form
            ref="form"
            v-model="valid"
            lazy-validation
          >
            <v-container fluid>
              <v-layout wrap>
                <v-flex xs12 md6 lg4>
                  <v-text-field label="Ida" outline v-model="editedItem.ida"></v-text-field>
                </v-flex>
                <v-flex xs12 md6 lg4>
                  <v-text-field label="Vuelta" outline v-model="editedItem.vuelta"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 lg4>
                  <v-text-field label="Terminal" outline v-model="editedItem.terminal"></v-text-field>
                </v-flex>
              </v-layout>
            </v-container>
          </v-form>
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

    <v-dialog v-model="dialogHorario" persistent max-width="90%" style="text-align: right">
      <v-card>
        <v-card-title primary-title class="secondary--text">
            <h3 class="headline">Horarios Trayecto</h3>
        </v-card-title>
        <v-card-text>
          <v-container fluid class="pt-0">
            <v-layout wrap>
              <v-flex xs12 class="pb-3 text-xs-left">
                <h4>Trayecto desde {{horarioItem.ida}} hacia
                  {{horarioItem.vuelta}}, Terminal
                  {{horarioItem.terminal}}
                </h4>
              </v-flex>
            </v-layout>
            <v-layout wrap align-center>
              <v-flex xs12 class="text-xs-right">
                <v-btn @click="agregarHorario(horarioItem.id)" color="secondary"><v-icon>add</v-icon>Agregar Horario y Bus</v-btn>
              </v-flex>
              <v-flex xs12 v-for="(horario, i) in horariosTrayecto" v-bind:key="i">
                <horario :id_trayecto="horario.id_trayecto"
                          :id_bus="horario.id_bus"
                          :fecha="horario.fecha"
                          :hora="horario.hora"
                          :horarioid="horario.id"/>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary darken-1" outline @click.native="closeHorarios()">Cerrar</v-btn>
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
          <td><v-btn flat small
                slot="activator"
                color="primary"
                @click="verHorarios(props.item)"
              >Ver horarios horarios</v-btn>
          </td>
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
                @click="goDelete(props.item.id)"
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
  import API from '../services/api/app.js'
  import Horario from '../components/Horario'
  import moment from 'moment'
  
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
          {text: '', value: 'horario', sortable: false},
          {text: '', value: 'edit', sortable: false},
          {text: '', value: 'delete', sortable: false}
        ],
        trayectos: [],
        inputs: [],
        valid: true,
        elimina: '',
        horarioItem: {},
        dialogHorario: false,
        horariosTrayecto: []
      }
    },
    mounted () {
      this.getTrayectos()
    },
    components: {
      Horario
    },
    methods: {
       async getTrayectos () {
        try {
          let respuesta = await API.selectAll('trayecto')
          if (respuesta.status >= 200 && respuesta.status < 300) {
            // console.log('buses', respuesta)
            setTimeout(() => {
              this.trayectos = respuesta.data
              this.loading = false
            }, 500)
          }
        } catch (e) {
          // console.log('catch err', e)
        }
      },
      async save (guardar) {
        // console.log('a guardar', guardar)
        if (this.$refs.form.validate()) {
          let id = guardar.id
          if (id) {
            try {
              let putTrayecto = await API.update('trayecto', id, guardar)
              if (putTrayecto.status >= 200 && putTrayecto.status < 300) {
                this.getTrayectos()
                this.dialog = false
                this.$swal({
                  type: 'success',
                  customClass: 'modal-info',
                  timer: 2000,
                  title: 'Trayectos',
                  text: 'Trayecto actualizado exitosamente!',
                  animation: true,
                  showConfirmButton: false,
                  showCloseButton: false
                })
                this.editedItem = Object.assign({}, '')
              }
            } catch (e) {
              // console.log('catch err', e.response)
              this.editedItem = Object.assign({}, '')
              this.dialog = false
              this.$swal({
                type: 'error',
                customClass: 'modal-info',
                timer: 2000,
                title: 'Ha ocurrido un error',
                text: 'Ha ocurrido un error editando el trayecto, intente más tarde.',
                animation: true,
                showConfirmButton: false,
                showCloseButton: false
              })
            }
          } else {
            try {
              let postTrayectos = await API.insert('trayecto', guardar)
              if (postTrayectos.status >= 200 && postTrayectos.status < 300) {
                // console.log('result post bus', postTrayectos)
                this.editedItem = Object.assign({}, '')
                this.getTrayectos()
                this.dialog = false
                this.$swal({
                  type: 'success',
                  customClass: 'modal-info',
                  timer: 2000,
                  title: 'Trayectos',
                  text: 'Trayecto creado exitosamente!',
                  animation: true,
                  showConfirmButton: false,
                  showCloseButton: false
                })
              }
            } catch (e) {
              // console.log('catch err', e.response)
              this.editedItem = Object.assign({}, '')
              this.dialog = false
              this.$swal({
                type: 'error',
                customClass: 'modal-info',
                title: 'Ha ocurrido un error',
                text: 'Ha ocurrido un error creando el Trayecto, intente más tarde.',
                animation: true,
                showConfirmButton: false,
                showCloseButton: false
              })
            }
          }
        }
      },
      verHorarios (trayecto) {
        this.horarioItem = trayecto
        this.getHorarios(trayecto.id)
        this.dialogHorario = true
      },
      async getHorarios (idTrayecto) {
        try {
          let respuesta = await API.selectAll('horario')
          if (respuesta.status >= 200 && respuesta.status < 300) {
            console.log('response horarios', respuesta, 'tray', idTrayecto)
            this.horariosTrayecto = respuesta.data.filter(item => item.id_trayecto === idTrayecto)
            console.log('horariosTrayecto', this.horariosTrayecto)
          }
        } catch (e) {
          // console.log('catch err', e)
        }
      },
      editItem (item) {
        console.log('edit', item)
        this.editedItem = item
        this.dialog = true
      },
      goDelete (itemid) {
        this.elimina = itemid
        this.confirmaAnular = true
      },
      async deleteItem () {
        try {
          let eliminando = await API.delete('trayecto', this.elimina)
          if (eliminando.status >= 200 && eliminando.status < 300) {
            // console.log('ya hizo DELETE Trayecto', eliminando)
            this.getTrayectos()
            this.confirmaAnular = false
            this.$swal({
              type: 'success',
              customClass: 'modal-info',
              timer: 2000,
              title: 'Trayectos',
              text: 'Trayecto eliminado exitosamente!',
              animation: true,
              showConfirmButton: false,
              showCloseButton: false
            })
          }
        } catch (e) {
          // console.log('catch err', e.response)
          this.editedItem = Object.assign({}, '')
          this.confirmaAnular = false
          this.$swal({
            type: 'error',
            customClass: 'modal-info',
            timer: 2000,
            title: 'Ha ocurrido un error',
            text: 'Ha ocurrido un error eliminando el Trayecto, intente más tarde.',
            animation: true,
            showConfirmButton: false,
            showCloseButton: false
          })
        }
      },
      close () {
        this.dialog = false
        this.editedItem = {}
      },
      closeHorarios () {
        this.dialogHorario = false
        this.horariosTrayecto = []
        this.horarioItem = {}
      },
      agregarHorario(trayectoid) {
        this.horariosTrayecto.push({fecha: '', hora: '', id_bus: '', id_trayecto: trayectoid})
      },
      deleteRow(index) {
        this.inputs.splice(index,1)
      },
      computedDateFormattedMomentjs (data) {
        return data ? moment(data).lang('es').format('MM/DD/YYYY') : ''
      }
    }
  }
</script>

<style>
  
</style>

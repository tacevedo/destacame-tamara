<template>
  <div class="pa-3">
    <h2 class="py-3 secondary--text">Trayectos</h2>
    
    <v-dialog v-model="dialog" max-width="900px">
      <v-card>
        <v-card-title primary-title class="secondary--text">
            <h3 class="headline title-modal">Trayecto</h3>
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
                  <v-text-field label="Ida" outline v-model="editedItem.ida" :rules="[rules.required]" required></v-text-field>
                </v-flex>
                <v-flex xs12 md6 lg4>
                  <v-text-field label="Vuelta" outline v-model="editedItem.vuelta" :rules="[rules.required]" required></v-text-field>
                </v-flex>
                <v-flex xs12 md6 lg4>
                  <v-text-field label="Terminal" outline v-model="editedItem.terminal" :rules="[rules.required]" required></v-text-field>
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
         <v-card-title primary-title class="secondary--text">
            <h3 class="headline title-modal">¿Esta seguro de eliminar el trayecto?</h3>
        </v-card-title>
        <!-- <v-card-title class="headline primary white--text">¿Esta seguro de eliminar el trayecto?</v-card-title> -->
        <v-card-text>Una vez realizada esta acción no podrá recuperar los datos.</v-card-text>
        <v-card-actions class="pb-3 px-3">
          <v-spacer></v-spacer>          
          <v-btn color="primary" outline @click.native="confirmaAnular = false">Volver</v-btn>
          <v-btn color="primary" @click="deleteItem()">Eliminar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogHorario" max-width="900px">
      <v-card>
        <v-card-title primary-title class="secondary--text">
            <h3 class="headline title-modal">Horarios Trayecto</h3>
        </v-card-title>
        <v-card-text>
          <v-container fluid class="pt-0">
            <v-layout wrap>
              <v-flex xs12 class="pb-3 text-xs-left">
                <h4 class="title">Trayecto desde {{horarioItem.ida}} hacia
                  {{horarioItem.vuelta}}, Terminal
                  {{horarioItem.terminal}}
                </h4>
              </v-flex>
            </v-layout>
            <v-layout wrap align-center>
              <v-flex xs12 class="pb-2">
                <horario :id_trayecto="nuevohorario.id_trayecto"
                          :id_bus="nuevohorario.id_bus"
                          :fecha="nuevohorario.fecha"
                          :hora="nuevohorario.hora"
                          :horarioid="nuevohorario.id"
                          @deleteHorario="deleteHorario"
                          />
              </v-flex>
              <v-flex xs12 v-for="(horario) in horariosTrayecto" v-bind:key="horario.id" class="text-xs-left">
                  <v-chip
                      close
                      color="primary"
                      outline
                      class="subheading hidden-sm-and-down"
                      @input="deleteHorario(horario)"
                    >Fecha: <strong>{{horario.fecha}}</strong> - Hora: <strong>{{horario.hora}}</strong> - Patente bus: <strong>{{ getBusPatente(horario.id_bus) }}</strong></v-chip>
                 <v-chip
                      close
                      color="primary"
                      outline
                      class="hidden-md-and-up"
                      @input="deleteHorario(horario)"
                    ><strong>{{horario.fecha}}</strong> - <strong>{{horario.hora}}</strong> - <strong>{{ getBusPatente(horario.id_bus) }}</strong></v-chip>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary darken-1" @click.native="closeHorarios()">Cerrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <div class="elevation-1">
      <v-toolbar flat color="white">
        <v-spacer></v-spacer>
        <div class="text-xs-right">
          <v-btn color="primary" @click="dialog = true"> <v-icon light>add</v-icon> Agregar trayecto</v-btn>
        </div>
      </v-toolbar>

      <v-data-table
          class="hidden-sm-and-down"
          :headers="headers"
          :items="trayectos"
          :loading="loading"
          :pagination.sync="pagination"
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

      <div v-for="trayecto in trayectos" :key="trayecto.id" class="hidden-md-and-up my-2">
        <v-card>
          <v-card-title primary-title>
            <div class="text-xs-left">
              <p>Ida: <strong>{{trayecto.ida}}</strong></p>
              <p>Vuelta: <strong>{{trayecto.vuelta}}</strong></p>
              <p>Terminal: <strong>{{trayecto.terminal}}</strong></p>
            </div>
          </v-card-title>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn flat small
                slot="activator"
                color="primary"
                @click="verHorarios(trayecto)"
              >Ver horarios horarios</v-btn>
            
            <v-btn outline color="primary" @click="editItem(trayecto)">
              <v-icon small>edit</v-icon>
              Editar
            </v-btn>

            <v-btn outline color="primary" @click="goDelete(trayecto.id)">
              <v-icon small>delete</v-icon>
              Eliminar
            </v-btn>
            
          </v-card-actions>
        </v-card>
      </div>
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
  import {mapGetters} from 'vuex'
  
  export default {
    name: 'Trayectos',
    data () {
      return {
        confirmaAnular: false,
        dialog: false,
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
        rules: {
          required: v => !!v || 'Campo requerido'
        },
        elimina: '',
        horarioItem: {},
        dialogHorario: false,
        horariosTrayecto: [],
        nuevohorario: {},
        buses: [],
        pagination: {
              rowsPerPage: 10, // -1 for All
              sortBy: 'ida'
            }
      }
    },
    mounted () {
      this.getTrayectos()
      this.getBuses()
    },
    components: {
      Horario
    },
    computed: {
      ...mapGetters({
        horariosTrayectoStore: ['HorariosTrayecto/horariosTrayecto'],
        trayectoid: ['HorariosTrayecto/trayectoId']
      })
    },
    watch: {
      horariosTrayectoStore (val) {
        console.log('cambio', val)
        this.horariosTrayecto = val
      }
    },
    methods: {
      getBusPatente: function (data) {
        const bus = this.buses.find(item => item.id === data)
        return bus ? bus.patente : ''
      },
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
      async getBuses () {
        try {
          let respuesta = await API.selectAll('bus')
          if (respuesta.status >= 200 && respuesta.status < 300) {
            // console.log('buses', respuesta)
            this.buses = respuesta.data
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
        // this.getHorarios(trayecto.id)
        this.$store.dispatch('HorariosTrayecto/getHorarios', {trayectoId: trayecto.id})
        this.dialogHorario = true
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
      async deleteHorario (horario) {
        try {
          let eliminando = await API.delete('horario', horario.id)
          if (eliminando.status >= 200 && eliminando.status < 300) {
            console.log('ya hizo DELETE horario', eliminando, this.trayectoid)
            this.$store.dispatch('HorariosTrayecto/getHorarios', {trayectoId: this.trayectoid})
            this.$swal({
              type: 'success',
              customClass: 'modal-info',
              timer: 2000,
              title: 'Horario',
              text: 'Horario eliminado exitosamente!',
              animation: true,
              showConfirmButton: false,
              showCloseButton: false
            })
          }
        } catch (e) {
          console.log('catch err', e.response)
          this.$swal({
            type: 'error',
            customClass: 'modal-info',
            timer: 2000,
            title: 'Ha ocurrido un error',
            text: 'Ha ocurrido un error eliminando el horario, intente más tarde.',
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
        this.nuevohorario.push({fecha: '', hora: '', id_bus: '', id_trayecto: trayectoid})
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

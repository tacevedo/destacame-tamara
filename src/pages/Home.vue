<template>
  <div class="pa-3">
    <h1 class="secondary--text"> Asignar asiento a un usuario </h1>
    <v-stepper v-model="e6" vertical>

      <v-stepper-step :complete="e6 > 1" step="1">Seleccionar Usuario</v-stepper-step>
      <v-stepper-content step="1">
        <v-card class="mb-5 elevation-0">
            <v-autocomplete
              v-model="pasajeroSeleccionado"
              :items="pasajeros"
              outline
              hide-details
              label="Pasajero"
              item-text="nombre"
              item-value="id"
              class="white--text autocomplete"
            >
            </v-autocomplete>
        </v-card>
        <v-btn color="primary" @click="e6 = 2" :disabled="!habilitarPasajero">Continuar</v-btn>
      </v-stepper-content>
  
      <v-stepper-step :complete="e6 > 2" step="2">Seleccionar trayecto</v-stepper-step>
      <v-stepper-content step="2">
        <v-card class="mb-5 elevation-0">
          <v-autocomplete
            v-model="trayectoSeleccionado"
            :items="trayectosCompleto"
            outline
            hide-details
            label="Trayecto"
            item-value="id"
            item-text="completo"
            class="white--text autocomplete"
          >
          </v-autocomplete>
        </v-card>
        <v-btn outline color="primary" @click="e6 = 1">Volver</v-btn>
        <v-btn color="primary" @click="e6 = 3" :disabled="!habilitarTrayecto">Continuar</v-btn>
        
      </v-stepper-content>
  
      <v-stepper-step :complete="e6 > 3" step="3">Buscar horario</v-stepper-step>
      <v-stepper-content step="3">
        <v-card class="mb-5 elevation-0">
          <v-data-table
              :headers="headers"
              :items="horariosTrayecto"
              hide-actions
              class="tabla-horarios"
              no-data-text="No hay buses registrados"
            >
            <template slot="items" slot-scope="props">
              <td>{{ props.item.fecha }}</td>
              <td>{{ props.item.hora }}</td>
              <td class="justify-center">
                <v-btn color="primary"
                      @click="selectHorario(props.item)">
                  <v-icon
                    small
                    color="white"
                  >
                    check
                  </v-icon> Seleccionar
                </v-btn>
              </td>
            </template>
          </v-data-table>
        </v-card>
        <!-- <v-btn color="primary" @click="e6 = 4">Continue</v-btn> -->
        <v-btn outline color="primary" @click="e6 = 2">Volver</v-btn>
      </v-stepper-content>
    </v-stepper>
  </div>
</template>

<script>
  import API from '../services/api/app.js'
  import {mapGetters} from 'vuex'

  export default {
    name: 'Home',
    data () {
      return {
        e6: 1,
        pasajeros: [],
        pasajeroSeleccionado: {},
        trayectos: [],
        trayectoSeleccionado: {},
        trayectosCompleto: [],
        headers: [
          {text: 'Fecha', value: 'fecha'},
          {text: 'Hora', value: 'hora'},
          {text: '', value: 'seleccionar', sortable: false}
        ],
        habilitarPasajero: false,
        habilitarTrayecto: false,
        habilitarHorario: false
      }
    },
    mounted () {
      this.getPasajeros()
      this.getTrayectos()
    },
    computed: {
      ...mapGetters({
        pasajeroStore: ['AsignarPasajero/pasajeroId'],
        trayectoStore: ['AsignarPasajero/trayectoId'],
        horarioStore: ['AsignarPasajero/horarioId'],
        horariosTrayecto: ['AsignarPasajero/horariosTrayecto']
      })
    },
    watch: {
      pasajeroSeleccionado (val) {
        this.$store.dispatch('AsignarPasajero/set_pasajero_seleccionado', {pasajeroId: val})
        this.habilitarPasajero = val ? true : false
      },
      trayectoSeleccionado (val) {
        this.$store.dispatch('AsignarPasajero/set_trayecto_seleccionado', {trayectoId: val})
        this.$store.dispatch('AsignarPasajero/getHorarios', {trayectoId: val})
        this.habilitarTrayecto = val ? true : false
      },
      horarioSeleccionado (val) {
        this.$store.dispatch('AsignarPasajero/set_horario_seleccionado', {horarioId: val})
        this.habilitarHorario =  val ? true : false
      },
      horariosTrayecto (val) {}
    },
    methods: {
      selectHorario (horario) {
        this.$store.dispatch('AsignarPasajero/set_horario_seleccionado', {horarioId: horario.id})
        this.agregarAsiento(horario.id_bus)
        this.e6 = 4
      },
      async agregarAsiento (busid) {
        let guardar = {
            num_asiento: 1,
            id_bus: busid,
            id_pasajero: this.pasajeroStore
          }
          console.log('guardar asiento', guardar)
        try {
          let respuesta = await API.insert('asiento', guardar)
          if (respuesta.status >= 200 && respuesta.status < 300) {
            console.log('respuesta agrear asento')
            this.$store.dispatch('AsignarPasajero/resetBookingState')
            this.$swal({
                  type: 'success',
                  customClass: 'modal-info',
                  timer: 2000,
                  title: 'Asiento',
                  text: 'Asiento asignado exitosamente!',
                  animation: true,
                  showConfirmButton: false,
                  showCloseButton: false
                })
            this.pasajeroSeleccionado= ''
            this.trayectoSeleccionado= ''
            this.horarioSeleccionado= ''
            this.e6 = 1
          }
        } catch (e) {
          console.log('catch err', e)
        }
      },
      async getPasajeros () {
        try {
          let respuesta = await API.selectAll('pasajero')
          if (respuesta.status >= 200 && respuesta.status < 300) {
            this.pasajeros = respuesta.data
          }
        } catch (e) {
          // console.log('catch err', e)
        }
      },
      async getTrayectos () {
        try {
          let respuesta = await API.selectAll('trayecto')
          if (respuesta.status >= 200 && respuesta.status < 300) {
            this.trayectos = respuesta.data
            this.trayectosCompleto = this.trayectos.map(item => {
              return {id: item.id, completo: `${item.ida} - ${item.vuelta} - ${item.terminal}`}
            })
          }
        } catch (e) {
          // console.log('catch err', e)
        }
      }
    }
  }
</script>

<style>
  .autocomplete.v-text-field.v-text-field--enclosed {
    width: 50%;
    margin: 0 auto;
  }
  .tabla-horarios .v-datatable.v-table.theme--light{
    border: 1px solid #ccc;
  }
</style>


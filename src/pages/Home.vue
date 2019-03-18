<template>
  <div class="pa-3 contiene-asigna-pasajero">
    <h1 class="secondary--text mb-2"> Asignar asiento a un usuaro </h1>
    <v-stepper v-model="e6" vertical>

      <v-stepper-step :complete="e6 > 1" step="1">Seleccionar Usuario</v-stepper-step>
      <v-stepper-content step="1">
        <v-card class="mb-5 elevation-0">
            <v-autocomplete
              v-model="pasajeroSeleccionado"
              :items="pasajerosFull"
              outline
              hide-details
              label="Pasajero"
              item-text="fullName"
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
              :pagination.sync="pagination"
              class="tabla-horarios"
              rows-per-page-text="Filas por página"
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
        // pasajeros: [],
        pasajerosFull: [],
        pasajeroSeleccionado: {},
        // trayectos: [],
        asientos: [],
        trayectosFull: [],
        trayectoSeleccionado: {},
        trayectosCompleto: [],
        headers: [
          {text: 'Fecha', value: 'fecha'},
          {text: 'Hora', value: 'hora'},
          {text: '', value: 'seleccionar', sortable: false}
        ],
        habilitarPasajero: false,
        habilitarTrayecto: false,
        habilitarHorario: false,
        pagination: {
              rowsPerPage: 5, // -1 for All
              sortBy: 'fecha'
            }
      }
    },
    mounted () {
      this.$store.dispatch('General/get_pasajeros')
      // this.$store.dispatch('General/get_trayectos')
      // this.getPasajeros()
      this.getTrayectos()
      this.getAsientos()
    },
    computed: {
      ...mapGetters({
        pasajeroStore: ['AsignarPasajero/pasajeroId'],
        trayectoStore: ['AsignarPasajero/trayectoId'],
        horarioStore: ['AsignarPasajero/horarioId'],
        pasajeros: ['General/pasajeros'],
        // trayectos: ['General/trayectos'],
        horariosTrayecto: ['AsignarPasajero/horariosTrayecto']
      })
    },
    watch: {
      pasajeros (val) {
        this.pasajerosFull = val.map(pasajero => {
          const item = {...pasajero}
          item.fullName = `${item.nombre} ${item.apellido}`
          return item
        })
      },
      pasajeroSeleccionado (val) {
        this.$store.dispatch('AsignarPasajero/set_pasajero_seleccionado', {pasajeroId: val})
        // this.$store.dispatch('AsignarPasajero/set_asignacion', {pasajero: val})
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
        let asientosBus = this.asientos.filter(item => item.id_bus === horario.id_bus)
        let asientoslength = asientosBus.length
        if(asientoslength < 10) {
          this.agregarAsiento(horario.id_bus, asientosBus.length)
          this.e6 = 4  
        } else {
            this.$swal({
              type: 'warning',
              customClass: 'modal-info',
              timer: 2000,
              title: 'Asiento',
              text: 'No hay asientos disponible, escoja otro horario',
              animation: true,
              showConfirmButton: false,
              showCloseButton: false
            })
        }

      },
      async agregarAsiento (busid, asientosLen) {
        let guardar = {
            num_asiento: asientosLen + 1,
            id_bus: busid,
            id_pasajero: this.pasajeroStore
          }
          // console.log('guardar asiento', guardar)
        try {
          let respuesta = await API.insert('asiento', guardar)
          if (respuesta.status >= 200 && respuesta.status < 300) {
            // console.log('respuesta agrear asento')
            
            const pasajero = this.pasajeros.find(item => item.id === this.pasajeroStore)
            const trayecto = this.trayectos.find(item => item.id === this.trayectoStore)
            this.$swal({
              type: 'success',
              customClass: 'modal-info',
              // timer: 2000,
              title: 'Asiento',
              html: `
                <p>Asiento fue asignado exitosamente </p>
                <p> Asiento: <strong>${asientosLen +1}</strong></p>
                <p> Pasajero: <strong>${pasajero.nombre} ${pasajero.apellido}</strong></p>
                <p> Trayecto: <strong>${trayecto.ida} - ${trayecto.vuelta}</strong></p>
              `,
              animation: true,
              showCancelButton: true,
              showConfirmButton: false,
              cancelButtonText: 'Cerrar'
            })
            this.pasajeroSeleccionado= ''
            this.trayectoSeleccionado= ''
            this.horarioSeleccionado= ''
            this.$store.dispatch('AsignarPasajero/resetBookingState')
            this.e6 = 1
          }
        } catch (e) {
          console.log('catch err', e)
        }
      },
      async getAsientos () {
        try {
          let respuesta = await API.selectAll('asiento')
          if (respuesta.status >= 200 && respuesta.status < 300) {
            this.asientos = respuesta.data
          }
        } catch (e) {
          console.log('catch err', e)
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
          console.log('catch err', e)
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
  .asigna-pasajero {
    min-width: 80%;
  }
  @media (max-width: 960px) {
    .autocomplete.v-text-field.v-text-field--enclosed {
      width: 80%;
    }
  }
</style>


<template>
  <v-form
    ref="form"
    v-model="valid"
    lazy-validation
  >
      <v-layout wrap row align-center class="py-2">
        <v-flex xs12 md3 class="pr-1">
          <v-menu
            v-model="datepicker"
            :close-on-content-click="false"
            :nudge-right="40"
            lazy
            transition="scale-transition"
            offset-y
            full-width
            max-width="290px"
            min-width="290px"
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                v-model="computedDateFormatted"
                label="Fecha"
                readonly
                outline
                v-on="on"
                class="pickersHorario"
                :rules="[rules.required]" required
              ></v-text-field>
            </template>
            <v-date-picker 
                v-model="horario.fecha"
                no-title
                @input="datepicker = false"></v-date-picker>
          </v-menu>
        </v-flex>
        <v-flex xs12 md3 class="pr-1">
          <v-menu
            ref="time1"
            :close-on-content-click="false"
            v-model="timepicker"
            :nudge-right="40"
            :return-value.sync="horario.hora"
            lazy
            transition="scale-transition"
            offset-y
            full-width
            max-width="290px"
            min-width="290px"
            class="pickersHorario"
          >
            <v-text-field
              slot="activator"
              v-model="horario.hora"
              label="Hora"
              outline
              readonly
              :rules="[rules.required]" required
            ></v-text-field>
            <v-time-picker
              v-if="timepicker"
              v-model="horario.hora"
              format="24hr"
              full-width
              @change="$refs.time1.save(horario.hora)"
            ></v-time-picker>
          </v-menu>
        </v-flex>
        <v-flex xs12 md3 class="pr-1">
          <v-autocomplete
            v-model="horario.id_bus"
            :items="buses"
            outline
            hide-details
            label="Bus"
            item-text="patente"
            item-value="id"
            class="white--text"
            :rules="[rules.required]" required
          >
          </v-autocomplete>
        </v-flex>
        <v-flex xs12 md3>
          <v-btn small color="secondary" @click="save(horario)">
            <v-icon>add</v-icon>
            Agregar
          </v-btn>
          <!-- <v-btn flat small color="primary" @click="$emit('deleteHorario', horario)">
            <span>Eliminar</span>
          </v-btn> -->
        </v-flex>
      </v-layout>
  </v-form>
</template>

<script>
  import API from '../services/api/app.js'
  import moment from 'moment'
  import {mapGetters} from 'vuex'
  
  export default {
    props: ['id_trayecto', 'id_bus', 'fecha', 'hora', 'horarioid'],
    data () {
      return {
        datepicker: false,
        timepicker: false,
        buses: [],
        valid: true,
        rules: {
          required: v => !!v || 'Campo requerido'
        },
        horario:{
          id_trayecto: '',
          id_bus: '',
          hora: '',
          fecha: '',
          id: ''
        },
        elimina: ''
      }
    },
    mounted () {
      this.horario.id_trayecto = this.id_trayecto
      this.horario.id_bus = this.id_bus
      this.horario.hora = this.hora
      this.horario.fecha = this.fecha? moment(this.fecha, 'MM/DD/YYYY').toISOString().substr(0, 10) : moment().toISOString().substr(0, 10)
      this.horario.id = this.horarioid
      console.log('trayectoid', this.horario.id_trayecto)
      this.getbuses()
    },
    computed: {
      ...mapGetters({
        trayectoid: ['HorariosTrayecto/trayectoId']
      }),
      isDisabled: function () {
        return this.horario.id ? true : false
      },
      computedDateFormatted () {
        return this.formatDate(this.horario.fecha)
      }
    },
    methods: {
      formatDate (date) {
        if (!date) return null

        const [year, month, day] = date.split('-')
        return `${month}/${day}/${year}`
      },
      async getbuses () {
        try {
          let cars = await API.selectAll('bus')
          if (cars.status >= 200 && cars.status < 300) {
            console.log('buses', cars)
            setTimeout(() => {
              this.buses = cars.data
              this.loading = false
            }, 500)
          }
        } catch (e) {
          console.log('catch err', e)
        }
      },
       async getHorarios () {
        try {
          let horarios = await API.selectAll('horario')
          if (horarios.status >= 200 && horarios.status < 300) {
            setTimeout(() => {
              this.horarios = horarios.data
              console.log('horarios', this.horarios)
              this.loading = false
            }, 500)
          }
        } catch (e) {
          console.log('catch err', e)
        }
      },
      async save (guardar) {
        guardar.id_trayecto =  this.trayectoid
        console.log('a guardar', guardar)
        if (this.$refs.form.validate()) {
          let id = guardar.id
          
          if (id) {
            try {
              let puthorario = await API.update('horario', id, guardar)
              if (puthorario.status >= 200 && puthorario.status < 300) {
                // this.getHorarios()

                this.$store.dispatch('HorariosTrayecto/getHorarios', {trayectoId: this.trayectoid})
                this.horario= {
                            id_trayecto: '',
                            id_bus: '',
                            hora: '',
                            fecha: '',
                            id: ''
                          }
                this.dialog = false
                this.$swal({
                  type: 'success',
                  customClass: 'modal-info',
                  timer: 2000,
                  title: 'Horario',
                  text: 'Horario actualizado exitosamente!',
                  animation: true,
                  showConfirmButton: false,
                  showCloseButton: false
                })
              }
            } catch (e) {
              console.log('catch err', e.response)
              this.dialog = false
              this.$swal({
                type: 'error',
                customClass: 'modal-info',
                timer: 2000,
                title: 'Ha ocurrido un error',
                text: 'Ha ocurrido un error editando el horario, intente más tarde.',
                animation: true,
                showConfirmButton: false,
                showCloseButton: false
              })
            }
          } else {
            try {
              let posthorario = await API.insert('horario', guardar)
              if (posthorario.status >= 200 && posthorario.status < 300) {
                console.log('result post horario', posthorario)
                this.getHorarios()
                this.$store.dispatch('HorariosTrayecto/getHorarios', {trayectoId: this.horario.id_trayecto})
                this.horario= {
                              id_trayecto: '',
                              id_bus: '',
                              hora: '',
                              fecha: '',
                              id: ''
                            }
                this.dialog = false
                this.$swal({
                  type: 'success',
                  customClass: 'modal-info',
                  timer: 2000,
                  title: 'Horario',
                  text: 'Horario creado exitosamente!',
                  animation: true,
                  showConfirmButton: false,
                  showCloseButton: false
                })
              }
            } catch (e) {
              console.log('catch err', e.response)
              this.dialog = false
              this.$swal({
                type: 'error',
                customClass: 'modal-info',
                title: 'Ha ocurrido un error',
                text: 'Ha ocurrido un error creando el horario, intente más tarde.',
                animation: true,
                showConfirmButton: false,
                showCloseButton: false
              })
            }
          }
        }
      },
      close () {
        this.dialog = false
      }
    }
  }
</script>

<style>
  .pickersHorario .v-text-field__details {
    display: none;
  }
  .pickersHorario .v-input__slot {
    margin-bottom: 0;
  }
</style>

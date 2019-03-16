<template>
  <div class="pa-3">
    <div class="py-3"><h2 class="secondary--text">Horarios</h2> </div>
    
    <v-dialog v-model="dialog" persistent max-width="900px">
      <v-card>
        <v-card-title primary-title>
            <h3 class="headline secondary--text">Horario</h3>
        </v-card-title>
        <v-card-text>
          <v-form
            ref="form"
            v-model="valid"
            lazy-validation
          >
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12 md6>
                  <v-menu
                    v-model="datepicker"
                    :close-on-content-click="false"
                    full-width
                    max-width="290"
                  >
                    <v-text-field
                      slot="activator"
                      :value="computedDateFormattedMomentjs(editedItem.fecha)"
                      clearable
                      label="Fecha"
                      outline
                      readonly
                    ></v-text-field>
                    <v-date-picker
                      v-model="editedItem.fecha"
                      @change="datepicker = false"
                      locale="es-419"
                    ></v-date-picker>
                  </v-menu>
                </v-flex>
                <v-flex xs12 md6>
                  <v-menu
                    ref="time1"
                    :close-on-content-click="false"
                    v-model="timepicker"
                    :nudge-right="40"
                    :return-value.sync="editedItem.hora"
                    lazy
                    transition="scale-transition"
                    offset-y
                    full-width
                    max-width="290px"
                    min-width="290px"
                  >
                    <v-text-field
                      slot="activator"
                      v-model="editedItem.hora"
                      label="Hora Salida"
                      outline
                      readonly
                    ></v-text-field>
                    <v-time-picker
                      v-if="timepicker"
                      v-model="editedItem.hora"
                      format="24hr"
                      full-width
                      @change="$refs.time1.save(editedItem.hora)"
                    ></v-time-picker>
                  </v-menu>
                </v-flex>

              </v-layout>
              
              <v-layout wrap>
                <v-flex xs12 md6>
                  Mostrar lista de trayectos y bus qe lo tienen
                </v-flex>
              </v-layout>
            </v-container>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary darken-1" outline @click.native="close()">Cancelar</v-btn>
          <v-btn color="primary" class='white--text' @click.native="save">Guardar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- dialogo confirmar eliminar -->
    <v-dialog v-model="confirmaAnular" persistent max-width="450">
      <v-card>
        <v-card-title class="headline primary white--text">¿Esta seguro de eliminar el Horario?</v-card-title>
        <v-card-text>Una vez realizada esta acción no podrá recuperar el horario.</v-card-text>
        <v-card-actions class="pb-3 px-3">
          <v-spacer></v-spacer>          
          <v-btn color="primary" outline @click.native="confirmaAnular = false">Volver</v-btn>
          <v-btn color="primary" @click="deleteItem">Eliminar</v-btn>
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
          <v-btn color="primary" @click="dialog = true"> <v-icon light>add</v-icon> Agregar Horario</v-btn>
        </div>
      </v-toolbar>

      <v-data-table
          :headers="headers"
          :items="horarios"
          :search="search"
          hide-actions
          no-data-text="No hay horarios registrados"
        >
        <template slot="items" slot-scope="props">
          <td>{{ props.item.fecha }}</td>
          <td>{{ props.item.hora }}</td>
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
  </div>
</template>

<script>
  import API from '../services/api/app.js'
  // import Tabla from '../components/Tabla'
  import moment from 'moment'
  export default {
    data () {
      return {
        confirmaAnular: false,
        dialog: false,
        search: '',
        datepicker: false,
        timepicker: false,
        editedItem: {
          fecha: '',
          hora: ''
        },
        elimina: '',
        headers: [
          {text: 'Fecha', value: 'fecha'},
          {text: 'Hora', value: 'hora'},
          {text: '', value: 'edit', sortable: false},
          {text: '', value: 'delete', sortable: false}
        ],
        horarios: [],
        valid: true
      }
    },
mounted () {
      this.getHorarios()
    },
    methods: {
       async getHorarios () {
        try {
          let horarios = await API.selectAll('horario')
          if (horarios.status >= 200 && horarios.status < 300) {
            console.log('horarios', horarios)
            setTimeout(() => {
              this.horarios = horarios.data
              this.loading = false
            }, 500)
          }
        } catch (e) {
          console.log('catch err', e)
        }
      },
      async save (guardar) {
        console.log('a guardar', guardar)
        if (this.$refs.form.validate()) {
          let id = guardar.id
          if (id) {
            try {
              let puthorario = await API.update('horario', id, guardar)
              if (puthorario.status >= 200 && puthorario.status < 300) {
                this.getHorarios()
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
                this.editedItem = Object.assign({}, '')
              }
            } catch (e) {
              console.log('catch err', e.response)
              this.editedItem = Object.assign({}, '')
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
                this.editedItem = Object.assign({}, '')
                this.getHorarios()
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
              this.editedItem = Object.assign({}, '')
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
      editItem (item) {
        this.editedItem = item
        this.dialog = true
      },
      goDelete (itemid) {
        this.elimina = itemid
        this.confirmaAnular = true
      },
      async deleteItem () {
        try {
          let eliminando = await API.delete('horario', this.elimina)
          if (eliminando.status >= 200 && eliminando.status < 300) {
            console.log('ya hizo DELETE horario', eliminando)
            this.getHorarios()
            this.confirmaAnular = false
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
          this.editedItem = Object.assign({}, '')
          this.confirmaAnular = false
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
      computedDateFormattedMomentjs (data) {
        return data ? moment(data).lang('es').format('MM/DD/YYYY') : ''
      }
    }
  }
</script>
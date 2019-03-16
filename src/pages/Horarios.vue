<template>
  <div class="pa-3">
    <div class="py-3"><h2 class="secondary--text">Horarios</h2> </div>
    
    <v-dialog v-model="dialog" persistent max-width="900px">
      <v-card>
        <v-card-title primary-title>
            <h3 class="headline secondary--text">Horario</h3>
        </v-card-title>
        <v-card-text>
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
  // import API from '@pi/app'
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
        horarios: [
          {
            fecha: '22/2/1987',
            hora: '22:00:00'
          },
          {
            fecha: '2/2/2178',
            hora: '17:00:00'
          }
        ]
      }
    },
    // mounted () {
    //   this.getbuses()
    // },
    methods: {
      computedDateFormattedMomentjs (data) {
        return data ? moment(data).lang('es').format('dddd DD/MM/YYYY') : ''
      },
      editItem (item) {
        this.editedItem = item
        this.dialog = true
      },
      goDelete (item) {
        this.elimina = item
        this.confirmaAnular = true
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
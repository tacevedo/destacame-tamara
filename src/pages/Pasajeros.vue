<template>
  <div class="pa-3">
    <h2 class="py-3 secondary--text">Pasajeros</h2>
    
    <v-dialog v-model="dialog" persistent max-width="900px" style="text-align: right">
      <v-card>
        <v-card-title primary-title class="secondary--text">
            <h3 class="headline title-modal title-modal">Pasajero</h3>
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
                  <v-text-field label="Nombre" outline v-model="editedItem.nombre" :rules="[rules.required]" required></v-text-field>
                </v-flex>
                <v-flex xs12 md6>
                  <v-text-field label="Apellido" outline v-model="editedItem.apellido" :rules="[rules.required]" required></v-text-field>
                </v-flex>
                <v-flex xs12 sm6>
                  <v-text-field label="Rut" outline v-model="editedItem.rut" :rules="[rules.required]" required></v-text-field>
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
            <h3 class="headline title-modal title-modal">¿Esta seguro de eliminar el pasajero?</h3>
        </v-card-title>
        <!-- <v-card-title class="headline primary white--text">¿Esta seguro de eliminar el pasajero?</v-card-title> -->
        <v-card-text>Una vez realizada esta acción no podrá recuperar los datos.</v-card-text>
        <v-card-actions class="pb-3 px-3">
          <v-spacer></v-spacer>          
          <v-btn color="primary" outline @click.native="confirmaAnular = false">Volver</v-btn>
          <v-btn color="primary" @click="deleteItem()">Eliminar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <div class="elevation-1">
      <v-toolbar flat color="white">
        <export :fields="excelFields" :data="pasajeros" :nameExport="'Pasajeros'" :pdf="true"/>
        <v-spacer></v-spacer>
        <div class="text-xs-right">
          <v-btn color="primary" @click="dialog = true"> <v-icon light>add</v-icon> Agregar pasajero</v-btn>
        </div>
      </v-toolbar>

      <v-data-table
          class="hidden-sm-and-down"
          :headers="headers"
          :items="pasajeros"
          :loading="loading"
          :pagination.sync="pagination"
          rows-per-page-text="Filas por página"
          no-data-text="No hay pasajeros registrados"
        >
        <template slot="items" slot-scope="props">
          <td>{{ props.item.nombre }}</td>
          <td>{{ props.item.apellido }}</td>
          <td>{{ props.item.rut }}</td>
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

      <div v-for="pasajero in pasajeros" :key="pasajero.id" class="hidden-md-and-up my-2">
        <v-card>
          <v-card-title primary-title>
            <div class="text-xs-left">
              <p>Nombre: <strong>{{pasajero.nombre}}</strong></p>
              <p>Apellido: <strong>{{pasajero.apellido}}</strong></p>
              <p>Rut: <strong>{{pasajero.rut}}</strong></p>
            </div>
          </v-card-title>

          <v-card-actions>
            <v-spacer></v-spacer>
            
            
            <v-btn outline color="primary" @click="editItem(pasajero)">
              <v-icon small>edit</v-icon>
              Editar
            </v-btn>

            <v-btn outline color="primary" @click="goDelete(pasajero.id)">
              <v-icon small>delete</v-icon>
              Eliminar
            </v-btn>
            
          </v-card-actions>
        </v-card>
      </div>
    </div>
     
  </div>
</template>

<script>
  import API from '../services/api/app.js'
  import Export from '../components/Exporta'
  import {mapGetters} from 'vuex'

  export default {
    name: 'Pasajeros',
    data () {
      return {
        confirmaAnular: false,
        dialog: false,
        loading: false,
        editedItem: {
          nombre: '',
          apellido: '',
          rut: ''
        },
        headers: [
          {text: 'Nombre', value: 'nombre'},
          {text: 'Apellido', value: 'apellido'},
          {text: 'Rut', value: 'rut'},
          {text: '', value: 'edit', sortable: false},
          {text: '', value: 'delete', sortable: false}
        ],
        // pasajeros: [],
        valid: true,
        rules: {
          required: v => !!v || 'Campo requerido'
        },
        elimina: '',
        excelFields: {
          Nombre: 'nombre',
          Apellido: 'apellido',
          Rut: 'rut'
        },
        pagination: {
          rowsPerPage: 10, // -1 for All
          sortBy: 'nombre'
        }
      }
    },
   mounted () {
      // this.getPasajeros()
      this.$store.dispatch('General/get_pasajeros')
    },
    components: {
      Export
    },
    computed: {
      ...mapGetters({
        pasajeros: ['General/pasajeros'],
      })
    },
    methods: {
      //  async getPasajeros () {
      //   try {
      //     let respuesta = await API.selectAll('pasajero')
      //     if (respuesta.status >= 200 && respuesta.status < 300) {
      //       console.log('buses', respuesta)
      //       setTimeout(() => {
      //         this.pasajeros = respuesta.data
      //         this.loading = false
      //       }, 500)
      //     }
      //   } catch (e) {
      //     console.log('catch err', e)
      //   }
      // },
      async save (guardar) {
        if (this.$refs.form.validate()) {
          let id = guardar.id
          if (id) {
            try {
              let putPasajero = await API.update('pasajero', id, guardar)
              if (putPasajero.status >= 200 && putPasajero.status < 300) {
                // this.getPasajeros()
                this.$store.dispatch('General/get_pasajeros')
                this.dialog = false
                this.$swal({
                  type: 'success',
                  customClass: 'modal-info',
                  timer: 2000,
                  title: 'Pasajero',
                  text: 'Pasajero actualizado exitosamente!',
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
                text: 'Ha ocurrido un error editando el pasajero, intente más tarde.',
                animation: true,
                showConfirmButton: false,
                showCloseButton: false
              })
            }
          } else {
            try {
              let postPasajero = await API.insert('pasajero', guardar)
              if (postPasajero.status >= 200 && postPasajero.status < 300) {
                this.editedItem = Object.assign({}, '')
                // this.getPasajeros()
                this.$store.dispatch('General/get_pasajeros')
                this.dialog = false
                this.$swal({
                  type: 'success',
                  customClass: 'modal-info',
                  timer: 2000,
                  title: 'Pasajero',
                  text: 'Pasajero creado exitosamente!',
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
                text: 'Ha ocurrido un error creando el Pasajero, intente más tarde.',
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
          let eliminando = await API.delete('pasajero', this.elimina)
          if (eliminando.status >= 200 && eliminando.status < 300) {
            // console.log('ya hizo DELETE pasajero', eliminando)
            // this.getPasajeros()
            this.$store.dispatch('General/get_pasajeros')
            this.confirmaAnular = false
            this.$swal({
              type: 'success',
              customClass: 'modal-info',
              timer: 2000,
              title: 'Pasajero',
              text: 'Pasajero eliminado exitosamente!',
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
            text: 'Ha ocurrido un error eliminando el pasajero, intente más tarde.',
            animation: true,
            showConfirmButton: false,
            showCloseButton: false
          })
        }
      },
      close () {
        this.dialog = false
        this.editedItem = {}
      }
    }
  }
</script>

<style>

</style>

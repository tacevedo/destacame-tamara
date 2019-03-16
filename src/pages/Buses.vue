<template>
  <div class="pa-3">
    <h2 class="py-3 secondary--text">Buses</h2>
    <v-dialog v-model="dialog" persistent max-width="900px">
      <v-card>
        <v-card-title primary-title>
            <h3 class="headline secondary--text">Bus</h3>
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
                  <v-text-field label="Patente" outline v-model="editedItem.patente"></v-text-field>
                </v-flex>
                <v-flex xs12 md6>
                  <v-text-field label="Marca" outline v-model="editedItem.marca"></v-text-field>
                </v-flex>
              </v-layout>
              
              <v-layout wrap>
                <v-flex xs12 md6>
                  <!-- <v-text-field label="Chofer" type="number" outline v-model="editedItem.id_chofer"></v-text-field> -->
                  <v-autocomplete
                    v-model="editedItem.id_chofer"
                    :items="choferes"
                    outline
                    hide-details
                    label="Chofer"
                    item-text="nombre"
                    item-value="id"
                    class="white--text"
                  >
                  </v-autocomplete>
                </v-flex>
              </v-layout>
            </v-container>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary darken-1" outline @click="close()">Cancelar</v-btn>
          <v-btn color="primary" class='white--text' @click="save(editedItem)">Guardar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- dialogo confirmar eliminar -->
    <v-dialog v-model="confirmaAnular" persistent max-width="450">
      <v-card>
        <v-card-title class="headline primary white--text">¿Esta seguro de eliminar el Bus?</v-card-title>
        <v-card-text>Una vez realizada esta acción no podrá recuperar el bus.</v-card-text>
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
          <td>{{ props.item.patente }}</td>
          <td>{{ props.item.marca }}</td>
          <td>{{ props.item.chofer_id }}</td>
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

  export default {
    data () {
      return {
        confirmaAnular: false,
        dialog: false,
        search: '',
        editedItem: {
          patente: '',
          marca: ''
        },
        elimina: '',
        headers: [
          {text: 'Patente', value: 'patente'},
          {text: 'Marca', value: 'marca'},
          {text: 'Chofer', value: 'id_chofer'},
          {text: '', value: 'edit', sortable: false},
          {text: '', value: 'delete', sortable: false}
        ],
        buses: [],
        choferes: [],
        valid: true
      }
    },
    mounted () {
      this.getbuses()
      this.getChoferes()
    },
    methods: {
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
      async getChoferes () {
        try {
          let drivers = await API.selectAll('chofer')
          if (drivers.status >= 200 && drivers.status < 300) {
            console.log('choferes en buses', drivers)
            this.choferes = drivers.data
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
              let putbus = await API.update('bus', id, guardar)
              if (putbus.status >= 200 && putbus.status < 300) {
                this.getbuses()
                this.dialog = false
                this.$swal({
                  type: 'success',
                  customClass: 'modal-info',
                  timer: 2000,
                  title: 'Bus',
                  text: 'Bus actualizado exitosamente!',
                  animation: true,
                  showConfirmButton: false,
                  showCloseButton: false
                })
                this.editedItem = Object.assign({}, '')
              }
            } catch (e) {
              console.log('catch err', e)
              this.editedItem = Object.assign({}, '')
              this.dialog = false
              this.$swal({
                type: 'error',
                customClass: 'modal-info',
                timer: 2000,
                title: 'Ha ocurrido un error',
                text: 'Ha ocurrido un error editando el bus, intente más tarde.',
                animation: true,
                showConfirmButton: false,
                showCloseButton: false
              })
            }
          } else {
            try {
              let postbus = await API.insert('bus', guardar)
              if (postbus.status >= 200 && postbus.status < 300) {
                console.log('result post bus', postbus)
                this.editedItem = Object.assign({}, '')
                this.getbuses()
                this.dialog = false
                this.$swal({
                  type: 'success',
                  customClass: 'modal-info',
                  timer: 2000,
                  title: 'Bus',
                  text: 'Bus creado exitosamente!',
                  animation: true,
                  showConfirmButton: false,
                  showCloseButton: false
                })
              }
            } catch (e) {
              console.log('catch err', e)
              this.editedItem = Object.assign({}, '')
              this.dialog = false
              this.$swal({
                type: 'error',
                customClass: 'modal-info',
                title: 'Ha ocurrido un error',
                text: 'Ha ocurrido un error creando el bus, intente más tarde.',
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
          let eliminando = await API.delete('bus', this.elimina)
          if (eliminando.status >= 200 && eliminando.status < 300) {
            console.log('ya hizo DELETE car', eliminando)
            this.getbuses()
            this.confirmaAnular = false
            this.$swal({
              type: 'success',
              customClass: 'modal-info',
              timer: 2000,
              title: 'Bus',
              text: 'Bus eliminado exitosamente!',
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
            text: 'Ha ocurrido un error eliminando el bus, intente más tarde.',
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
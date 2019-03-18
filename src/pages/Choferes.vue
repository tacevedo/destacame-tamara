<template>
  <div class="pa-3">
    <h2 class="py-3 secondary--text">Choferes</h2>
    
    <v-dialog v-model="dialog" max-width="900px">
      <v-card>
        <v-card-title primary-title>
            <h3 class="headline secondary--text title-modal">Chofer</h3>
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
              </v-layout>
              <v-layout wrap>
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
        <v-card-title primary-title>
            <h3 class="headline secondary--text title-modal">¿Esta seguro de eliminar el Chofer?</h3>
        </v-card-title>
        <!-- <v-card-title class="headline primary white--text">¿Esta seguro de eliminar el Chofer?</v-card-title> -->
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
        <export :fields="excelFields" :data="choferes" :nameExport="'Choferes'" :pdf="true"/>
        <v-spacer></v-spacer>
        <div class="text-xs-right">
          <v-btn color="primary" @click="dialog = true"> <v-icon light>add</v-icon> Agregar Chofer</v-btn>
        </div>
      </v-toolbar>

      <v-data-table
          :headers="headers"
          :items="choferes"
          :loading="loading"
          :pagination.sync="pagination"
          no-data-text="No hay choferes registrados"
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
  import Export from '../components/Exporta'

  export default {
    name: 'Choferes',
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
        choferes: [],
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
      this.getChoferes()
    },
    components: {
      Export
    },
    methods: {
       async getChoferes () {
        try {
          let respuesta = await API.selectAll('chofer')
          if (respuesta.status >= 200 && respuesta.status < 300) {
            console.log('buses', respuesta)
            setTimeout(() => {
              this.choferes = respuesta.data
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
              let putChofer = await API.update('chofer', id, guardar)
              if (putChofer.status >= 200 && putChofer.status < 300) {
                this.getChoferes()
                this.dialog = false
                this.$swal({
                  type: 'success',
                  customClass: 'modal-info',
                  timer: 2000,
                  title: 'chofer',
                  text: 'Chofer actualizado exitosamente!',
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
                text: 'Ha ocurrido un error editando el chofer, intente más tarde.',
                animation: true,
                showConfirmButton: false,
                showCloseButton: false
              })
            }
          } else {
            try {
              let postChofer = await API.insert('chofer', guardar)
              if (postChofer.status >= 200 && postChofer.status < 300) {
                console.log('result post bus', postChofer)
                this.editedItem = Object.assign({}, '')
                this.getChoferes()
                this.dialog = false
                this.$swal({
                  type: 'success',
                  customClass: 'modal-info',
                  timer: 2000,
                  title: 'chofer',
                  text: 'Chofer creado exitosamente!',
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
                text: 'Ha ocurrido un error creando el Chofer, intente más tarde.',
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
          let eliminando = await API.delete('chofer', this.elimina)
          if (eliminando.status >= 200 && eliminando.status < 300) {
            console.log('ya hizo DELETE chofer', eliminando)
            this.getChoferes()
            this.confirmaAnular = false
            this.$swal({
              type: 'success',
              customClass: 'modal-info',
              timer: 2000,
              title: 'chofer',
              text: 'Chofer eliminado exitosamente!',
              animation: true,
              showConfirmButton: false,
              showCloseButton: false
            })
          }
        } catch (e) {
          console.log('catch err', e)
          this.editedItem = Object.assign({}, '')
          this.confirmaAnular = false
          this.$swal({
            type: 'error',
            customClass: 'modal-info',
            timer: 2000,
            title: 'Ha ocurrido un error',
            text: 'Ha ocurrido un error eliminando el chofer, intente más tarde.',
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

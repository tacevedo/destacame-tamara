<template>
  <v-menu offset-y>

    <v-btn slot="activator" color="primary darken-1" dark>
      <v-icon left dark>arrow_drop_down</v-icon>
      <span>Exportar</span>
    </v-btn>

    <v-list>
      <v-list-tile v-for="option in options" :key="option.name" @click="">
        <v-list-tile-title>
          <download-excel :data="data" :fields="fields"
                          :name="name +' ('+ moment().format('LLLL') +')'+ option.extension"
                          :type="option.type">
            {{option.name}}
          </download-excel>
        </v-list-tile-title>
      </v-list-tile>
      <v-list-tile v-if="pdf" @click="preparePdf1">
        <v-list-tile-title>
          PDF
        </v-list-tile-title>
      </v-list-tile>
    </v-list>
  </v-menu>
</template>

<script>
  import JsonExcel from 'vue-json-excel'
  import moment from 'moment'
  import JsPDF from 'jspdf'

  export default {

    props: ['fields', 'data', 'nameExport', 'pdf'],

    data: () => ({
      moment: moment,
      name: 'Name',
      options: [
        {name: 'Microsoft Excel', extension: '.xls'},
        {name: 'Numbers (OSX)', type: 'csv', extension: '.xls'},
        {name: 'CSV', type: 'csv', extension: '.csv'}
      ]
    }),

    mounted () {
      // moment.locale(this.language)
      console.log('data', this.data)
      console.log('fields', this.fields)
    },

    components: {
      'downloadExcel': JsonExcel
    },

    methods: {
      preparePdf1 () { // slow
        let doc = new JsPDF('landscape')
        doc.setFont('helvetica')
        doc.setFontSize(8)
        let currentColumnData = []
        let columnWide = 0
        let x = 5
        let y = 3
        let page = 1
        let counter = 0
        let pages = []
        if (this.data.length > 65) {
          pages = [...Array(parseInt(this.data.length / 65)).keys()]
          pages.forEach((row) => doc.addPage())
        }
        doc.setPage(1)
        Object.entries(this.fields).map(([key, value]) => {
          doc.setPage(1)
          y = 3
          currentColumnData = []
          y = 8
          // console.log(this.data)
          this.data.forEach((row) => {
            currentColumnData.push(row[value])
          })
          for (let field of currentColumnData) {
            if (counter > 65) {
              counter = 0
              page++
              doc.setPage(page)
            }
            if (counter === 0) {
              y = 3
              doc.setFontType('bold')
              doc.text(x, y, key)
              doc.setLineWidth(0.1)
              doc.line(x - 1, 0, x - 1, 206)
              doc.line(0, 206, 280, 206)
              doc.setFontType('normal')
              doc.text(5, 209, `Pagina ${page} de ${pages.length + 1}`)
              doc.text(50, 209, `Generado el: ${moment().format('LLLL')}`)
              y = 8
            }
            doc.text(x, y, field)
            y += 3
            counter++
          }
          page = 1
          counter = 0
          columnWide = currentColumnData.reduce((a, b) => a.length > b.length ? a : b, '').length
          columnWide = (columnWide >= key.length ? columnWide : key.length) * 2
          x += columnWide
        })
        doc.save(this.name + ' (' + moment().format('LLLL') + ').pdf')
      },
      preparePdf0 () { // fast
        let doc = new JsPDF('landscape')
        let spacing = 5
        let rowJump = 5
        let counter = 0
        let page = 1
        doc.setFontSize(8)
        doc.text(5, 205, `Pagina ${page}`)
        doc.text(25, 205, `Generado el: ${moment().format('LLLL')}`)

        Object.keys(this.fields).forEach((headerKey) => {
          doc.text(spacing, rowJump, headerKey)
          spacing += headerKey.length * 4
        })

        this.data.forEach((row) => {
          rowJump += 3
          spacing = 5
          counter++
          if (counter > 65) {
            doc.addPage()
            page++
            doc.text(5, 208, `Pagina ${page}`)
            doc.text(25, 208, `Generado el: ${moment().format('LLLL')}`)
            doc.setFontSize(8)
            counter = 0
            rowJump = 5
            Object.keys(this.fields).forEach((headerKey) => {
              doc.text(spacing, rowJump, headerKey)
              spacing += headerKey.length * 4
            })
            spacing = 5
            rowJump += 3
          }
          Object.keys(this.fields).forEach((headerKey) => {
            Object.keys(row).forEach((key) => {
              if (this.fields[headerKey] === key) {
                doc.text(spacing, rowJump, row[key])
                spacing += row[key].length * 2
              }
            })
          })
        })
        doc.save(this.name + ' (' + moment().format('LLLL') + ').pdf')
      }
    }

  }
</script>

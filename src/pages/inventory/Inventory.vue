<template>
   <q-layout view="hHh lpR fFf">
    <q-page-container>
        <q-page class="flex flex-center text-center">
          <div class="q-gutter-sm flex text-center">
            <div style="width: 100%; height: 50%;">
              <h2> Inventory </h2>
              <q-input borderless dense debounce="300" v-model="filter" placeholder="Search">
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>
            </div>
            <div style="width: 100%;">
            <q-table
              class="my-sticky-column-table"
              :data="data"
              :columns="columns"
              row-key="name"
              :filter="filter"
            >
              <template v-slot:body="props">
                <q-tr :props="props">
                  <q-td key="name" :props="props">
                    {{ props.row.name }}
                    <q-popup-edit v-model="props.row.name">
                      <q-input v-model="props.row.name" dense autofocus counter />
                    </q-popup-edit>
                  </q-td>
                  <q-td key="stocks" :props="props">
                    {{ props.row.stocks }}
                    <q-popup-edit v-model="props.row.stocks" title="Update stocks" buttons persistent>
                      <q-input type="number" v-model="props.row.stocks" dense autofocus hint="Use buttons to close" />
                    </q-popup-edit>
                  </q-td>
                </q-tr>
              </template>
            </q-table>
            </div>
          <q-btn no-caps rounded dense class="q-mr-sm" color="secondary" label="Add row" @click="addRow"/>
          <q-btn no-caps rounded push @click="$router.push('/InventoryHomepage')" class="q-mr-sm" label="Generate File" color="secondary"/>
          </div>
          </q-page>
        <router-view/>
    </q-page-container>
  </q-layout>
</template>

<style lang="sass">

  td:first-child
    background-color: #e8a87c

  th:first-child,
  td:first-child
    position: sticky
    left: 0
    z-index: 1
</style>

<script>
export default {
  data () {
    return {
      columns: [
        {
          name: 'name',
          required: true,
          label: 'Name',
          align: 'left',
          field: row => row.name,
          format: val => `${val}`,
          sortable: true
        },
        { name: 'stocks', label: 'Stocks', field: 'stocks', sortable: true }
      ],
      data: [
        {
          name: 'Small Nails',
          stocks: 1
        },
        {
          name: 'Big Nails',
          stocks: 10
        },
        {
          name: 'Medium Nails',
          stocks: 15
        },
        {
          name: '1 Litter can of paint White',
          stocks: 20
        },
        {
          name: '1 Litter can of paint Black',
          stocks: 22
        },
        {
          name: '1 Litter can of paint Gray',
          stocks: 30
        },
        {
          name: 'Bulb',
          stocks: 30
        }
      ],
      original: [
        {
          name: 'new stock',
          stocks: 0
        }
      ]
    }
  },
  methods: {
    // emulate fetching data from server
    addRow () {
      this.loading = true
      setTimeout(() => {
        const
          index = Math.floor(Math.random() * (this.data.length + 1)),
          row = this.original[Math.floor(Math.random() * this.original.length)]
        if (this.data.length === 0) {
          this.rowCount = 0
        }
        row.id = ++this.rowCount
        const addRow = { ...row } // extend({}, row, { name: `${row.name} (${row.__count})` })
        this.data = [...this.data.slice(0, index), addRow, ...this.data.slice(index)]
        this.loading = false
      }, 500)
    }
  }
}
</script>

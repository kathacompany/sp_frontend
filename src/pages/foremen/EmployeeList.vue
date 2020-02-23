<template>
   <q-layout view="hHh lpR fFf">
    <q-page-container>
        <q-page class="flex flex-center text-center">
          <div class="q-gutter-sm flex text-center">
            <div style="width: 100%; height: 50%;">
              <h2> Employee List </h2>
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
                  <q-td key="department" :props="props">
                    {{ props.row.department }}
                  </q-td>
                  <q-td key="position" :props="props">
                    {{ props.row.position }}
                  </q-td>
                </q-tr>
              </template>
            </q-table>
            </div>
          <q-btn no-caps rounded dense class="q-mr-sm" color="secondary" label="Add employee" @click="addRow"/>
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
        { name: 'department', label: 'Department', field: 'department', sortable: true },
        { name: 'position', label: 'Position', field: 'position', sortable: true }
      ],
      data: [
        {
          name: 'Juan Dela Cruz',
          position: 'Administrative Staff',
          department: 'CDMO'
        },
        {
          name: 'Johny Doe',
          position: 'Foremen',
          department: 'CDMO'
        },
        {
          name: 'John Doe',
          position: 'Workier',
          department: 'Plumbing'
        },
        {
          name: 'Juany Dela',
          position: 'Worker',
          department: 'Electrical'
        },
        {
          name: 'Juana Cruz',
          position: 'Worker',
          department: 'Electricity'
        },
        {
          name: 'Juanita Dela Cruz',
          position: 'Worker',
          department: 'Electricity'
        }
      ],
      original: [
        {
          name: 'new employee',
          department: 0
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

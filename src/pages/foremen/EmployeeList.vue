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
            />
            </div>
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
      filter: '',
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
        {
          name: 'Position',
          label: 'Position',
          field: 'position',
          sortable: true
        },
        {
          name: 'department',
          label: 'Department',
          field: 'department',
          sortable: true
        }
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
      ]
    }
  }
}
</script>

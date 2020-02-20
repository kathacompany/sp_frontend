<template>
  <q-layout view="hHh lpR fFf">
    <q-page-container>
        <q-page class="flex flex-center text-center">
          <div class="q-gutter-sm flex text-center">
            <div style="width: 100%; height: 50%;">
              <h2> Job Order Requests </h2>
              <q-input borderless dense debounce="300" v-model="filter" placeholder="Search">
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>
            </div>
            <div style="width: 100%;" class="q-ma-md">
            <q-table
                title="Received Job Order Requests"
                class="my-sticky-column-table"
                :data="data"
                :columns="columns"
                hide-bottom
                row-key="id"
                :filter="filter"
            >
            <template v-slot:body="props">
              <q-tr :props="props">
                  <q-td key="id" :props="props">
                    {{ props.row.id }}
                  </q-td>
                  <q-td key="name" :props="props">
                    {{ props.row.name }}
                  </q-td>
                  <q-td key="unit" :props="props">
                    {{ props.row.id }}
                  </q-td>
                  <q-td key="location" :props="props">
                    {{ props.row.location }}
                  </q-td>
                  <q-td key="date" :props="props">
                    {{ props.row.date }}
                  </q-td>
                  <q-td key="status" :props="props">
                    {{ props.row.status }}
                     <q-popup-edit v-model="props.row.status" title="Update status" buttons persistent>
                      <q-btn-dropdown push no-caps v-model="probType" color="primary" label="Forward to">
                      <q-list>
                      <q-item clickable v-model="props.row.status" v-close-popup>
                          <q-item-section>
                          <q-item-label v-model="props.row.status"> Plumbing</q-item-label>
                          </q-item-section>
                      </q-item>
                      <q-item clickable v-model="props.row.status" v-close-popup>
                          <q-item-section>
                          <q-item-label v-model="props.row.status"> Electricity</q-item-label>
                          </q-item-section>
                      </q-item>
                      <q-item clickable v-model="props.row.status" v-close-popup>
                          <q-item-section>
                          <q-item-label v-model="props.row.status"> Electricity</q-item-label>
                          </q-item-section>
                      </q-item>
                      <q-item clickable v-model="props.row.status" v-close-popup>
                          <q-item-section>
                          <q-item-label v-model="props.row.status"> Electricity</q-item-label>
                          </q-item-section>
                      </q-item>
                      </q-list>
                      </q-btn-dropdown>
                      <q-btn-dropdown push no-caps v-model="probType" color="primary" label="Update Status to">
                      <q-list>
                      <q-item clickable v-model="props.row.status" v-close-popup>
                          <q-item-section>
                          <q-item-label v-model="props.row.status">Ongoing</q-item-label>
                          </q-item-section>
                      </q-item>
                      </q-list>
                      </q-btn-dropdown>
                    </q-popup-edit>
                  </q-td>
                </q-tr>
              </template>
            </q-table>
            <q-table
                title="Completed Job Orders"
                class="my-sticky-column-table"
                :data="completedData"
                :columns="completedColumns"
                hide-bottom
                row-key="id"
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
          id: 'id',
          name: 'id',
          required: true,
          label: 'Job Order Number',
          align: 'left',
          field: row => row.id,
          format: val => `${val}`,
          sortable: true
        },
        {
          name: 'name',
          align: 'center',
          label: 'Name',
          field: 'name',
          sortable: true
        },
        {
          name: 'unit',
          align: 'center',
          label: 'Unit',
          field: 'unit',
          sortable: true
        },
        {
          name: 'location',
          align: 'center',
          label: 'Location',
          field: 'location',
          sortable: true
        },
        {
          name: 'date',
          align: 'center',
          label: 'Date Filed',
          field: 'date',
          sortable: true
        },
        {
          name: 'status',
          align: 'center',
          label: 'Status',
          field: 'status',
          sortable: true
        }
      ],
      data: [
        {
          id: 1,
          name: 'Construction',
          unit: 'CAS',
          location: 'Miagao',
          date: '2018/12/01',
          status: 'Pending'
        },
        {
          id: 2,
          name: 'Construction',
          unit: 'Humanities',
          location: 'Miagao',
          date: '2018/12/01',
          status: 'Pending'
        },
        {
          id: 3,
          name: 'Electricity',
          unit: 'CAS',
          location: 'Miagao',
          date: '2018/12/01',
          status: 'Ongoing'
        },
        {
          id: 4,
          name: 'Plumbing',
          unit: 'DPSM',
          location: 'Miagao',
          date: '2018/12/01',
          status: 'Ongoing'
        },
        {
          id: 5,
          name: 'Construction',
          unit: 'Balay Ilonggo',
          location: 'Iloilo City',
          date: '2018/12/01',
          status: 'Pending'
        },
        {
          id: 6,
          name: 'Construction',
          unit: 'CFOS',
          location: 'Miagao',
          date: '2018/12/01',
          status: 'Pending'
        }
      ],
      completedColumns: [
        {
          id: 'Job Order Number',
          required: true,
          label: 'Job Order Number',
          align: 'left',
          field: row => row.id,
          format: val => `${val}`,
          sortable: true
        },
        {
          name: 'name',
          align: 'center',
          label: 'Name',
          field: 'name',
          sortable: true
        },
        {
          name: 'unit',
          align: 'center',
          label: 'Unit',
          field: 'unit',
          sortable: true
        },
        {
          name: 'location',
          align: 'center',
          label: 'Location',
          field: 'location',
          sortable: true
        },
        {
          name: 'date',
          align: 'center',
          label: 'Date Filed',
          field: 'date',
          sortable: true
        },
        {
          name: 'status',
          align: 'center',
          label: 'Status',
          field: 'status',
          sortable: true
        }
      ],
      completedData: [
        {
          id: 1,
          name: 'Construction',
          unit: 'CAS',
          location: 'Miagao',
          date: '2018/12/01',
          status: 'Completed'
        },
        {
          id: 2,
          name: 'Construction',
          unit: 'Humanities',
          location: 'Miagao',
          date: '2018/12/01',
          status: 'Completed'
        },
        {
          id: 3,
          name: 'Electricity',
          unit: 'CAS',
          location: 'Miagao',
          date: '2018/12/01',
          status: 'Completed'
        },
        {
          id: 4,
          name: 'Plumbing',
          unit: 'DPSM',
          location: 'Miagao',
          date: '2018/12/01',
          status: 'Completed'
        },
        {
          id: 5,
          name: 'Construction',
          unit: 'Balay Ilonggo',
          location: 'Iloilo City',
          date: '2018/12/01',
          status: 'Completed'
        },
        {
          id: 6,
          name: 'Construction',
          unit: 'CFOS',
          location: 'Miagao',
          date: '2018/12/01',
          status: 'Completed'
        }
      ]
    }
  }
}
</script>

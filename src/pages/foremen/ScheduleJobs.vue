<template>
  <q-layout view="hHh lpR fFf">
    <q-page-container>
        <q-page class="flex flex-center text-center">
          <div class="q-gutter-sm flex text-center">
            <div style="width: 100%; height: 50%;">
              <h2> Schedule Job Implementation </h2>
              <q-input borderless dense debounce="300" v-model="filter" placeholder="Search">
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>
              <q-table
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
                      <q-popup-edit v-model="props.row.status" title="Schedule Job" buttons persistent>
                        <q-input filled v-model="date" mask="date" :rules="['date']">
                          <template v-slot:append>
                            <q-icon name="event" class="cursor-pointer">
                              <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                                <q-date v-model="date" @input="() => $refs.qDateProxy.hide()" />
                              </q-popup-proxy>
                            </q-icon>
                          </template>
                        </q-input>
                      <q-btn-dropdown push no-caps v-model="probType" color="primary" label="Add Employee">
                      <q-list>
                      <q-item clickable v-model="props.row.id" v-close-popup>
                          <q-item-section>
                          <q-item-label v-model="props.row.id">Juan Dela Cruz</q-item-label>
                          </q-item-section>
                      </q-item>
                      <q-item clickable v-model="props.row.id" v-close-popup>
                          <q-item-section>
                          <q-item-label v-model="props.row.id">Juanita Dela Cruz</q-item-label>
                          </q-item-section>
                      </q-item>
                      <q-item clickable v-model="props.row.id" v-close-popup>
                          <q-item-section>
                          <q-item-label v-model="props.row.id">Juana Dela Cruz</q-item-label>
                          </q-item-section>
                      </q-item>
                      <q-item clickable v-model="props.row.id" v-close-popup>
                          <q-item-section>
                          <q-item-label v-model="props.row.id">Juan Cruz</q-item-label>
                          </q-item-section>
                      </q-item>
                      </q-list>
                    </q-btn-dropdown>
                    <q-btn push no-caps v-model="probType" color="primary" label="Add Materials" @click="opened=true"/>

                    <q-dialog v-model="opened" class="bg-white" >
                    <q-table
                      class="my-sticky-column-table"
                      :data="fakeData"
                      :columns="fakeColumns"
                      hide-bottom
                    >
                    <template v-slot:body="props">
                      <q-tr :props="props">
                          <q-td key="name" :props="props">
                            {{ props.row.name }}
                          </q-td>
                          <q-td key="quantity" :props="props">
                            {{ props.row.quantity }}
                            <q-popup-edit v-model="props.row.quantity" title="Needed Quantity" buttons persistent>
                              <q-input filled v-model="props.row.quantity"/>
                            </q-popup-edit>
                          </q-td>
                        </q-tr>
                      </template>
                    </q-table>
                    </q-dialog>
                    <p>Job Workers: Juana Dela Cruz, Juan Dela Cruz
                    </p>
                    <p>Materials Added: Nails, Paint
                    </p>
                    </q-popup-edit>
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
                  </q-td>
                </q-tr>
              </template>
            </q-table>
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
      opened: false,
      filter: '',
      columns: [
        {
          name: 'id',
          id: 'id',
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
        }
      ],
      data: [
        {
          id: 1,
          name: 'Construction',
          unit: 'CAS',
          location: 'Miagao',
          date: '2018/12/01'
        },
        {
          id: 2,
          name: 'Construction',
          unit: 'Humanities',
          location: 'Miagao',
          date: '2018/12/01'
        },
        {
          id: 3,
          name: 'Electricity',
          unit: 'CAS',
          location: 'Miagao',
          date: '2018/12/01'
        },
        {
          id: 4,
          name: 'Plumbing',
          unit: 'DPSM',
          location: 'Miagao',
          date: '2018/12/01'
        },
        {
          id: 5,
          name: 'Construction',
          unit: 'Balay Ilonggo',
          location: 'Iloilo City',
          date: '2018/12/01'
        },
        {
          id: 6,
          name: 'Construction',
          unit: 'CFOS',
          location: 'Miagao',
          date: '2018/12/01'
        }
      ],
      fakeColumns: [
        {
          name: 'name',
          align: 'center',
          label: 'Name',
          field: 'name',
          sortable: true
        },
        {
          name: 'quantity',
          align: 'center',
          label: 'Quantity',
          field: 'quantity',
          sortable: true
        }
      ],
      fakeData: [
        {
          id: 1,
          name: 'Small Nails',
          quantity: '3'
        },
        {
          id: 2,
          name: 'Big Nails',
          quantity: '2'
        }
      ]
    }
  }
}
</script>

<template>
  <q-layout view="hHh lpR fFf">
    <q-page-container>
        <q-page class="flex flex-center text-center">
<<<<<<< HEAD
          <div class="q-gutter-sm flex text-center">
            <div style="width: 100%; height: 50%;">
              <h2> Job Orders </h2>
              <q-input borderless dense debounce="300" v-model="filter" placeholder="Search">
=======
          <div class="q-ma-md q-pa-md">
            <h4 style="margin-top: 20px"> Job Order Requests </h4>
              <q-input clearable color="secondary" v-if="jobs.length || pending.length || ongoing.length" dense debounce="300" v-model="filter" placeholder="Search">
>>>>>>> 463a21677031f679fb323bf2410525d549cd140d
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>
<<<<<<< HEAD
              <div style="width: 100%; text-align:left;">
                <h6>Pending Job Requests</h6>
                <q-table
                  class="my-sticky-header-table"
                  :data="job_orders"
                  :columns="columnA"
                  row-key="name"
                  :filter="filter"
                  hide-bottom
                >
                <template v-slot:body="props">
                  <q-tr :props="props">
                  <q-td key="id" :props="props">
                    {{ props.row.id }}
                  </q-td>
                  <q-td key="category" :props="props">
                    {{ props.row.category }}
                  </q-td>
                  <q-td key="status" :props="props">
                    {{ props.row.status }}
                  </q-td>
                  <q-tr :props="props">
                    <q-td key="details" :props="props">
                      <q-btn class="bg-primary" push label="More Details" @click="details=true">
                        <q-dialog v-model="details">
                          <q-card class="q-pa-md">
                            <q-card-section>
                              <div class="text-h6">Job Order Details: </div>
                            </q-card-section>

                            <q-card-section>
                              Unit: {{ props.row.unit }} <q-separator/>
                              Location: {{ props.row.location }} <q-separator/>
                              Description: {{ props.row.description }} <q-separator />
                              Date: {{ props.row.date }} <q-separator/>
                              Telephone: {{ props.row.telephone }} <q-separator/>
                              Requestor: {{ props.row.requestor }} <q-separator/>
                            </q-card-section>
                            <q-card-actions align="right">
                              <q-btn flat label="OK" class= "bg-primary" v-close-popup />
                            </q-card-actions>
                          </q-card>
                        </q-dialog>
                      </q-btn>
                    </q-td>
                    </q-tr>
                  </q-tr>
                </template>
                </q-table>
              </div>
              <div style="width: 100%; text-align:left;">
                <h6>Ongoing Job Requests</h6>
                <q-table
                  class="my-sticky-header-table"
                  :data="job_orders"
                  :columns="columnA"
                  row-key="name"
                  :filter="filter"
                  hide-bottom
                >
                <template v-slot:body="props">
                  <q-tr :props="props">
                  <q-td key="id" :props="props">
                    {{ props.row.id }}
                  </q-td>
                  <q-td key="category" :props="props">
                    {{ props.row.category }}
                  </q-td>
                  <q-td key="status" :props="props">
                    {{ props.row.status }}
                  </q-td>
                  <q-tr :props="props">
                    <q-td key="details" :props="props">
                      <q-btn class="bg-primary" push label="More Details" @click="details=true">
                        <template v-if=" status === 'Processing'" >
                          <q-dialog v-model="details">
                            <q-card class="q-pa-md">
                              <q-card-section>
                                <div class="text-h6">Job Order Details: </div>
                              </q-card-section>

                              <q-card-section>
                                Unit: {{ props.row.unit }} <q-separator/>
                                Location: {{ props.row.location }} <q-separator/>
                                Description: {{ props.row.description }} <q-separator />
                                Date: {{ props.row.date }} <q-separator/>
                                Telephone: {{ props.row.telephone }} <q-separator/>
                                Requestor: {{ props.row.requestor }} <q-separator/>
                              </q-card-section>
                              <q-card-actions align="right">
                                <q-btn flat label="OK" class= "bg-primary" v-close-popup />
                              </q-card-actions>
                            </q-card>
                          </q-dialog>
                        </template>
                      </q-btn>
                    </q-td>
                    </q-tr>
                  </q-tr>
                </template>
                </q-table>
              </div>
              <div style="width: 100%; text-align:left;">
                <h6>Completed Job Requests</h6>
                <q-table
                  class="my-sticky-header-table"
                  :data="job_orders"
                  :columns="columnA"
                  row-key="name"
                  :filter="filter"
                  hide-bottom
                >
                  <template v-slot:body="props">
                  <q-tr :props="props">
                  <q-td key="id" :props="props">
                    {{ props.row.id }}
                  </q-td>
                  <q-td key="category" :props="props">
                    {{ props.row.category }}
                  </q-td>
                  <q-td key="status" :props="props">
                    {{ props.row.status }}
                  </q-td>
                  <q-tr :props="props">
                    <q-td key="details" :props="props">
                      <q-btn class="bg-primary" push label="More Details" @click="details=true">
                        <q-dialog v-model="details">
                          <q-card class="q-pa-md">
                            <q-card-section>
                              <div class="text-h6">Job Order Details: </div>
                            </q-card-section>

                            <q-card-section>
                              Unit: {{ props.row.unit }} <q-separator/>
                              Location: {{ props.row.location }} <q-separator/>
                              Description: {{ props.row.description }} <q-separator />
                              Date: {{ props.row.date }} <q-separator/>
                              Telephone: {{ props.row.telephone }} <q-separator/>
                              Requestor: {{ props.row.requestor }} <q-separator/>
                            </q-card-section>
                            <q-card-actions align="right">
                              <q-btn flat label="OK" class= "bg-primary" v-close-popup />
                            </q-card-actions>
                          </q-card>
                        </q-dialog>
                      </q-btn>
                    </q-td>
                    </q-tr>
                  </q-tr>
                </template>
                </q-table>
              </div>
=======
            <div style="width: 100%; max-height: 50%; margin-bottom: 30px">
              <q-banner v-if="!jobs.length" class="bg-red-1 q-pa-md">
                <template v-slot:avatar>
                  <q-icon name="event_busy" color="accent" />
                </template>
                No filed request!
                <template v-slot:action>
                  <q-btn flat color="secondary" label="FILE A REQUEST" @click="$router.push('/UserFileJobOrder')"/>
                </template>
              </q-banner>
              <q-table
                title="JOB ORDERS"
                class="my-sticky-column-table"
                v-else
                :data="jobs"
                :columns="column"
                row-key="id"
                :filter="filter"
                :selected-rows-label="getSelectedString"
                selection="multiple"
                :selected.sync="selected"
              />
            </div>
             <div style="width: 100%; max-height: 50%; margin-bottom: 30px">
              <q-banner v-if="!pending.length" class="bg-red-1 q-pa-md">
                <template v-slot:avatar>
                  <q-icon name="event_busy" color="accent" />
                </template>
                No pending request!
              </q-banner>
              <q-table
                title="PENDING"
                class="my-sticky-column-table"
                v-else
                :data="pending"
                :columns="column"
                row-key="id"
                :filter="filter"
              />
            </div>
            <div style="width: 100%; max-height: 50%; margin-bottom: 30px">
              <q-banner v-if="!ongoing.length" class="bg-red-1 q-pa-md">
                <template v-slot:avatar>
                  <q-icon name="event_busy" color="accent" />
                </template>
                No ongoing request!
              </q-banner>
              <q-table
                title="ONGOING"
                class="my-sticky-column-table"
                v-else
                :data="ongoing"
                :columns="column"
                row-key="id"
                :filter="filter"
              />
            </div>
            <div style="width: 100%; max-height: 50%; margin-bottom: 30px">
              <q-banner v-if="!complete.length" class="bg-red-1 q-pa-md">
                <template v-slot:avatar>
                  <q-icon name="event_busy" color="accent" />
                </template>
                No completed request!
              </q-banner>
              <q-table
                title="COMPLETED"
                class="my-sticky-column-table"
                v-else
                :data="complete"
                :columns="column"
                row-key="id"
                :filter="filter"
              />
>>>>>>> 463a21677031f679fb323bf2410525d549cd140d
            </div>
          </div>
        </q-page>
    </q-page-container>
  </q-layout>
</template>

<style lang="sass">
.my-sticky-header-table
  .q-table__top,
  thead tr:first-child th
    background-color: #e8a87c

<<<<<<< HEAD
  thead tr th
=======
  td:first-child
    background-color: #9C3B3B

  th:first-child,
  td:first-child
>>>>>>> 463a21677031f679fb323bf2410525d549cd140d
    position: sticky
    z-index: 1
  thead tr:first-child th
    top: 0
</style>

<script>
// import * as firebase from 'firebase/app'
import 'firebase/firestore'
import { db } from 'boot/firebase'

export default {
  data () {
    return {
      details: false,
      filter: '',
<<<<<<< HEAD
      job_orders: [],
      status: '',
      columnA: [
        { name: 'id', align: 'left', label: 'JOB ID', field: 'id' },
        { name: 'category', align: 'left', label: 'CATEGORY', field: 'category', sortable: true },
        { name: 'status', align: 'left', field: 'status', label: 'STATUS' },
        { name: 'details', field: 'details', align: 'left' }
=======
      selected: [],
      jobs: [],
      pending: [],
      ongoing: [],
      complete: [],
      // status: null,
      // category: null,
      // unit: null,
      // location: null,
      // description: null,
      // telephone: null,
      column: [
        {
          name: 'id',
          align: 'left',
          label: 'JOB ID',
          field: 'id',
          sortable: true
        },
        {
          name: 'date',
          align: 'left',
          label: 'DATE FILED',
          field: 'date'
        },
        {
          name: 'category',
          align: 'left',
          label: 'CATEGORY',
          field: 'category',
          sortable: true
        },
        {
          name: 'description',
          align: 'left',
          label: 'DESCRIPTION',
          field: 'description'
        },
        {
          name: 'unit',
          align: 'left',
          label: 'REQUESTING UNIT',
          field: 'unit'
        },
        {
          name: 'location',
          align: 'left',
          label: 'LOCATION',
          field: 'location'
        },
        {
          name: 'telephone',
          align: 'left',
          label: 'TELEPHONE',
          field: 'telephone'
        },
        {
          name: 'foreman',
          align: 'left',
          label: "FOREMAN'S NAME",
          field: 'foreman'
        },
        {
          name: 'status',
          align: 'left',
          label: 'STATUS',
          field: 'status'
        }
>>>>>>> 463a21677031f679fb323bf2410525d549cd140d
      ]
    }
  },
  created () {
<<<<<<< HEAD
    this.getMaterial()
  },
  methods: {
    async getMaterial () {
      try {
        await db.collection('job_orders').get().then(querySnapshot => {
          querySnapshot.forEach(doc => {
            const matData = {
              id: doc.id,
              category: doc.data().category,
              unit: doc.data().unit,
              location: doc.data().location,
              description: doc.data().description,
              date: doc.data().date,
              telephone: doc.data().telephone,
              requestor: doc.data().requestor,
              status: doc.data().status
            }
            // console.log(matData)
            this.job_orders.push(matData)
          })
        })
      } catch (error) {
        console.log(error)
      }
=======
    let jobRef = firebase.firestore().collection('job_orders').orderBy('date')
    let penRef = firebase.firestore().collection('pending_jobs').orderBy('date')
    let onRef = firebase.firestore().collection('ongoing_jobs').orderBy('date')

    jobRef.get().then(querySnapshot => {
      querySnapshot.forEach(doc => {
        const data = {
          id: doc.id,
          category: doc.data().category,
          unit: doc.data().unit,
          location: doc.data().location,
          description: doc.data().description,
          date: doc.data().date,
          telephone: doc.data().telephone,
          foreman: doc.data().foreman,
          status: doc.data().status
        }
        this.jobs.push(data)
      })
    })
    penRef.get().then(querySnapshot => {
      querySnapshot.forEach(doc => {
        const data = {
          id: doc.data().id,
          category: doc.data().category,
          unit: doc.data().unit,
          location: doc.data().location,
          description: doc.data().description,
          date: doc.data().date,
          telephone: doc.data().telephone,
          foreman: doc.data().foreman,
          status: doc.data().status
        }
        this.pending.push(data)
      })
    })
    onRef.get().then(querySnapshot => {
      querySnapshot.forEach(doc => {
        const data = {
          id: doc.data().id,
          category: doc.data().category,
          unit: doc.data().unit,
          location: doc.data().location,
          description: doc.data().description,
          date: doc.data().date,
          telephone: doc.data().telephone,
          foreman: doc.data().foreman,
          status: doc.data().status
        }
        this.ongoing.push(data)
      })
    })
  },
  methods: {
    getSelectedString () {
      return this.selected.length === 0 ? '' : `${this.selected.length} request${this.selected.length > 1 ? 's' : ''} selected of ${this.jobs.length}`
>>>>>>> 463a21677031f679fb323bf2410525d549cd140d
    }
  }
}
</script>

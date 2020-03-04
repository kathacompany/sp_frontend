<template>
  <q-layout view="hHh lpR fFf">
    <q-page-container>
        <q-page class="flex flex-center text-center">
          <div class="q-gutter-sm flex text-center">
            <div style="width: 100%; height: 50%;">
              <h2> Job Orders </h2>
              <q-input borderless dense debounce="300" v-model="filter" placeholder="Search">
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>
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

  thead tr th
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
      job_orders: [],
      columnA: [
        { name: 'id', align: 'left', label: 'JOB ID', field: 'id' },
        { name: 'category', align: 'left', label: 'CATEGORY', field: 'category', sortable: true },
        { name: 'status', align: 'left', field: 'status', label: 'STATUS' },
        { name: 'details', field: 'details', align: 'left' }
      ]
    }
  },
  created () {
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
    }
  }
}
</script>

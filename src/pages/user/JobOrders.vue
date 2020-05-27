<template>
  <q-layout view="hHh lpR fFf">
    <q-page-container>
        <q-page class="flex flex-center text-center">
          <div class="q-ma-md q-pa-md">
            <h4 style="margin-top: 20px"> Job Order Requests </h4>
              <q-input clearable color="secondary" v-if="jobs.length || pending.length || ongoing.length" dense debounce="300" v-model="filter" placeholder="Search">
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>
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

  td:first-child
    background-color: #9C3B3B

  th:first-child,
  td:first-child
    position: sticky
    z-index: 1
  thead tr:first-child th
    top: 0
</style>

<script>
import * as firebase from 'firebase/app'
import 'firebase/firestore'
// import { db } from 'boot/firebase'

export default {
  data () {
    return {
      details: false,
      filter: '',
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
      ]
    }
  },
  created () {
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
    }
  }
}
</script>

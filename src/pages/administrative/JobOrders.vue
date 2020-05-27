<template>
  <q-layout view="hHh lpR fFf">
    <q-page-container>
        <q-page class="flex flex-center text-center">
          <div class="q-ma-md q-pa-md">
            <h4 style="margin-top: 20px"> Job Order Requests </h4>
              <q-input clearable color="secondary" v-if="pending.length || ongoing.length" dense debounce="300" v-model="filter" placeholder="Search">
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>
            <div style="width: 100%; max-height: 50%; margin-bottom: 30px">
              <q-banner v-if="!pending.length" class="bg-red-1 q-pa-md">
                <template v-slot:avatar>
                  <q-icon name="done_all" color="accent" />
                </template>
                All caught up. Nothing to approve!
              </q-banner>
              <q-table
                title="JOB ORDERS"
                class="my-sticky-column-table"
                v-else
                :data="pending"
                :columns="column"
                row-key="id"
                :filter="filter"
                :selected-rows-label="getSelectedString"
                selection="multiple"
                :selected.sync="selected"
              />
              <q-btn no caps label="ACCEPT" class="q-ma-sm bg-secondary text-white"  v-if="selected.length" @click="confirm=true"/>
              <q-dialog v-model="confirm" persistent>
                <q-card>
                  <q-card-section class="row items-center">
                    <q-avatar icon="done" color="secondary" text-color="primary" />
                    <span class="q-ma-sm">Accept {{selected.length}} selected <span v-if="selected.length>1">requests</span><span v-else>request</span> to be sent to a foreman?</span>
                  </q-card-section>

                  <q-card-actions align="right">
                    <q-btn flat label="Yes" color="secondary" @click="onSubmit" v-close-popup/>
                    <q-btn flat label="No" color="accent" v-close-popup />
                  </q-card-actions>
                </q-card>
              </q-dialog>
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
                No complete request!
              </q-banner>
              <q-table
                title="COMPLETE"
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
import { db } from 'boot/firebase'

export default {
  data () {
    return {
      confirm: false,
      medium: false,
      filter: '',
      pending: [],
      ongoing: [],
      complete: [],
      selected: [],
      // category: null,
      // unit: null,
      // status: null,
      // date: null,
      // location: null,
      // description: null,
      // telephone: null,
      requestor: null,
      head: null,
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
          name: 'requestor',
          align: 'left',
          label: "REQUESTOR'S NAME",
          field: 'requestor'
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
    let penRef = db.collection('pending_jobs').orderBy('date')
    let onRef = db.collection('ongoing_jobs').orderBy('date')
    let comRef = db.collection('complete_jobs').orderBy('date')

    penRef.get().then(querySnapshot => {
      querySnapshot.forEach(doc => {
        const data = {
          id: doc.id,
          category: doc.data().category,
          unit: doc.data().unit,
          location: doc.data().location,
          description: doc.data().description,
          date: doc.data().date,
          telephone: doc.data().telephone,
          requestor: doc.data().requestor,
          foreman: doc.data().foreman,
          status: 'for your approval'
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
          requestor: doc.data().requestor,
          foreman: doc.data().foreman,
          status: doc.data().status
        }
        this.ongoing.push(data)
      })
    })
    comRef.get().then(querySnapshot => {
      querySnapshot.forEach(doc => {
        const data = {
          id: doc.data().id,
          category: doc.data().category,
          unit: doc.data().unit,
          location: doc.data().location,
          description: doc.data().description,
          date: doc.data().date,
          telephone: doc.data().telephone,
          requestor: doc.data().requestor,
          foreman: doc.data().foreman,
          status: doc.data().status
        }
        this.complete.push(data)
      })
    })
  },
  methods: {
    getSelectedString () {
      return this.selected.length === 0 ? '' : `${this.selected.length} request${this.selected.length > 1 ? 's' : ''} selected of ${this.pending.length}`
    },
    onSubmit () {
      let penRef = db.collection('pending_jobs')
      let onRef = db.collection('ongoing_jobs')
      // let comRef = db.collection('complete_jobs')

      Object.keys(this.selected).forEach(doc => {
        onRef.add({
          id: this.selected[doc].id,
          category: this.selected[doc].category,
          unit: this.selected[doc].unit,
          location: this.selected[doc].location,
          description: this.selected[doc].description,
          date: this.selected[doc].date,
          telephone: this.selected[doc].telephone,
          requestor: this.requestor,
          head: this.head,
          foreman: this.selected[doc].foreman,
          status: 'sent to foreman'
        })
          .then(
            penRef.doc(this.selected[doc].id).delete(),
            this.$q.notify({
              color: 'secondary',
              message: 'Forwarded Successfully'
            }),
            location.reload()
          )
      })
    }
  }
}
</script>

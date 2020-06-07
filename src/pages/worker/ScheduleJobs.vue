<template>
  <q-layout view="hHh lpR fFf">
    <q-page-container>
        <q-page class="window-height window-width row justify-center">
          <div class="q-gutter-sm flex text-center">
            <div style="width: 100%; height: 50%;">
              <h5>JOB ORDER REQUESTS</h5> {{ date }}<br><br>
              <q-input v-if="jobs.length || pending.length || ongoing.length || complete.length" outlined clearable color="secondary" dense debounce="300" v-model="filter" placeholder="Search by Category">
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>
              <br>

              <div style="width: 100%;">
                <q-banner v-if="!ongoing.length" class="bg-red-1 q-pa-md">
                  <template v-slot:avatar>
                    <q-icon name="event_busy" color="accent" />
                  </template>
                  No ongoing request!
                </q-banner>
                <q-table
                  title="Ongoing"
                  class="my-sticky-column-table"
                  v-else
                  dense
                  :separator="separator"
                  :data="ongoing"
                  :columns="column"
                  row-key="id"
                  :filter="filter"
                  hide-bottom
                >
                  <template v-slot:header="props">
                    <q-tr :props="props">
                      <q-th auto-width/>
                      <q-th
                        v-for="col in props.cols"
                        :key="col.name"
                        :props="props"
                        class="text-italic text-accent"
                      >
                        {{ col.label }}
                      </q-th>
                    </q-tr>
                  </template>
                  <template v-slot:body="props">
                    <q-tr :props="props">
                      <q-td auto-width>
                        <q-btn round dense color="accent" @click="props.expand = !props.expand" :icon="props.expand ? 'description' : 'description'" />
                      </q-td>
                      <q-td
                        v-for="col in props.cols"
                        :key="col.name"
                        :props="props"
                      >
                        {{ col.value }}
                      </q-td>
                    </q-tr>
                    <q-tr v-show="props.expand" :props="props">
                      <q-td colspan="100%">
                        <div class="text-left"><span class="text-italic text-accent">Description</span><br>{{ props.row.description}}</div>
                      </q-td>
                    </q-tr>
                  </template>
                </q-table>
              </div>
              <br/>
              <br/>

            </div>
          </div>
        </q-page>
      <router-view/>
    </q-page-container>
  </q-layout>
</template>

<style lang="sass">

  th:first-child,
  td:first-child
    position: sticky
    left: 0
    z-index: 1
</style>

<script>
import { date } from 'quasar'
import { db } from 'boot/firebase'

export default {
  data () {
    return {
      separator: 'cell',
      dense: false,
      edit_dialog: false,
      filter: '',
      selected: [],
      jobs: [],
      pending: [],
      ongoing: [],
      complete: [],
      editedItem: {
        date: '',
        category: '',
        unit: '',
        location: '',
        description: '',
        telephone: ''
      },
      options: [
        'Plumbing', 'Electricity', 'Grounds', 'Transportation'
      ],
      column: [
        {
          name: 'id',
          align: 'left',
          label: 'Job Id',
          field: 'id',
          sortable: true
        },
        {
          name: 'date',
          align: 'left',
          label: 'Date Filed',
          field: 'date',
          sortable: true
        },
        {
          name: 'category',
          align: 'left',
          label: 'Category',
          field: 'category',
          sortable: true
        },
        // {
        //   name: 'description',
        //   align: 'left',
        //   label: 'Description',
        //   field: 'description',
        //   sortable: true
        // },
        {
          name: 'unit',
          align: 'left',
          label: 'Requesting Unit',
          field: 'unit',
          sortable: true
        },
        {
          name: 'location',
          align: 'left',
          label: 'Location',
          field: 'location',
          sortable: true
        },
        {
          name: 'telephone',
          align: 'left',
          label: 'Telephone',
          field: 'telephone',
          sortable: true
        },
        {
          name: 'foreman',
          align: 'left',
          label: "Foreman's Name",
          field: 'foreman',
          sortable: true
        },
        {
          name: 'status',
          align: 'left',
          label: 'Status',
          field: 'status',
          sortable: true
        }
      ]
      // jobsCol: [
      //   // { name: 'description', field: 'description', align: 'left', label: 'Description' },
      //   { name: 'id', field: 'id', align: 'left', label: 'Job Id' },
      //   { name: 'date', field: 'date', align: 'left', label: 'Date Filed' },
      //   { name: 'category', field: 'category', align: 'left', label: 'Category', sortable: true },
      //   { name: 'unit', field: 'unit', align: 'left', label: 'Requesting Unit' },
      //   { name: 'location', field: 'location', align: 'left', label: 'Location' },
      //   { name: 'telephone', field: 'telephone', align: 'left', label: 'Telephone' },
      //   { name: 'foreman', field: 'foreman', align: 'left', label: "Foreman's Name" },
      //   { name: 'status', field: 'status', align: 'left', label: 'Status' }
      // ]
    }
  },
  created () {
    let jobRef = db.collection('job_orders').orderBy('date')
    let penRef = db.collection('pending_jobs').orderBy('date')
    let onRef = db.collection('ongoing_jobs').orderBy('date')

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
  computed: {
    date () {
      let timeStamp = Date.now()
      return date.formatDate(timeStamp, 'dddd D MMMM YYYY')
    }
  },
  methods: {
    getSelectedString () {
      return this.selected.length === 0 ? '' : `${this.selected.length} request${this.selected.length > 1 ? 's' : ''} selected of ${this.jobs.length}`
    },
    updateJob () {
      let docref = db.collection('job_orders').doc(this.activeJob)
      docref.update(this.editedItem)
        .then(
          location.reload(),
          this.$q.notify({
            color: 'secondary',
            message: 'Updated successfully'
          })
        )
        .catch(error => {
          console.error('Error updating job: ', error)
        })
    },
    toEdit (item, id) {
      this.edit_dialog = true
      this.editedItem = Object.assign({}, item)
      this.activeJob = this.editedItem.id
    },
    toDelete (id) {
      this.$q.dialog({
        title: 'Cancel Confirm',
        message: 'The job filed will be cancelled. Are you sure you want to continue?',
        cancel: {
          label: 'No',
          flat: true,
          color: 'accent'
        },
        ok: {
          label: 'Yes',
          flat: true,
          color: 'secondary'
        },
        persistentL: true
      }).onOk(async () => {
        try {
          await db.collection('job_orders').doc(id).delete()
          this.$q.notify({
            color: 'accent',
            message: 'Job cancelled successfully'
          })
          window.location.reload()
        } catch (error) {
          console.log('Error cancelling job', error)
        }
      })
    }
  }
}
</script>

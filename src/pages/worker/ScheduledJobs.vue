<template>
  <q-layout view="hHh lpR fFf">
    <q-page-container>
        <q-page class="window-height window-width row justify-center">
          <div class="q-gutter-sm flex text-center">
            <div style="width: 100%; height: 50%;">
              <h5 class="text-weight-light">JOB ORDER REQUESTS</h5> {{ date }}<br><br>
              <q-input v-if="schedule.length" outlined clearable color="secondary" dense debounce="300" v-model="filter" placeholder="Search by Location">
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>
              <br>

              <div style="width: 100%;">
                <q-banner v-if="!schedule.length" class="bg-grey-2 q-pa-md" style="min-width: 800px; height: 150px">
                  <template v-slot:avatar>
                    <q-icon name="event_busy" color="accent" />
                  </template>
                <span class="text-h6 text-grey text-weight-thin">No Scheduled Request!</span>
                </q-banner>
                <q-table
                  title="Scheduled Work"
                  class="my-sticky-column-table"
                  v-else
                  dense
                  :separator="separator"
                  :data="schedule"
                  :columns="column"
                  row-key="jobId"
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
      schedule: [],
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
        { name: 'date', field: 'date', align: 'left', label: 'Scheduled on' },
        { name: 'id', field: 'jobId', align: 'left', label: 'Job Id' },
        { name: 'location', field: 'location', align: 'left', label: 'Location' },
        { name: 'unit', field: 'unit', align: 'left', label: 'Requesting Unit' },
        { name: 'requestor', field: 'requestor', align: 'left', label: 'Unit Requestor' },
        { name: 'foreman', field: 'foreman', align: 'left', label: 'Foreman' }
      ]
    }
  },
  created () {
    const schedRef = db.collection('scheduled_jobs').orderBy('date')

    schedRef.get().then(querySnapshot => {
      querySnapshot.forEach(doc => {
        this.schedule.push(doc.data())
      })
    })
  },
  computed: {
    date () {
      let timeStamp = Date.now()
      return date.formatDate(timeStamp, 'dddd D MMMM YYYY')
    }
  }
  // methods: {
  //   updateJob () {
  //     let docref = db.collection('job_orders').doc(this.activeJob)
  //     docref.update(this.editedItem)
  //       .then(
  //         location.reload(),
  //         this.$q.notify({
  //           color: 'secondary',
  //           message: 'Updated successfully'
  //         })
  //       )
  //       .catch(error => {
  //         console.error('Error updating job: ', error)
  //       })
  //   },
  //   toEdit (item, id) {
  //     this.edit_dialog = true
  //     this.editedItem = Object.assign({}, item)
  //     this.activeJob = this.editedItem.id
  //   },
  //   toDelete (id) {
  //     this.$q.dialog({
  //       title: 'Cancel Confirm',
  //       message: 'The job filed will be cancelled. Are you sure you want to continue?',
  //       cancel: {
  //         label: 'No',
  //         flat: true,
  //         color: 'accent'
  //       },
  //       ok: {
  //         label: 'Yes',
  //         flat: true,
  //         color: 'secondary'
  //       },
  //       persistentL: true
  //     }).onOk(async () => {
  //       try {
  //         await db.collection('job_orders').doc(id).delete()
  //         this.$q.notify({
  //           color: 'accent',
  //           message: 'Job cancelled successfully'
  //         })
  //         window.location.reload()
  //       } catch (error) {
  //         console.log('Error cancelling job', error)
  //       }
  //     })
  //   }
  // }
}
</script>

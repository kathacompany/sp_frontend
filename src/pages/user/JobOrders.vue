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
                <q-banner v-if="!jobs.length" class="bg-red-1 q-pa-md" style="min-width: 800px;">
                  <template v-slot:avatar>
                    <q-icon name="event_busy" color="accent" />
                  </template>
                  No filed request!
                  <template v-slot:action>
                    <q-btn flat icon="post_add" color="secondary" label="FILE A REQUEST" @click="$router.push('/UserFileJobOrder')"/>
                  </template>
                </q-banner>
                <q-table
                  title="Job Orders"
                  class="my-sticky-header-table"
                  :data="jobs"
                  v-else
                  :separator="separator"
                  :columns="column"
                  row-key="jobId"
                  :filter="filter"
                  hide-bottom
                  dense
                  :expanded.sync="expanded"
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
                      <q-th>
                        <span class="text-italic text-accent">Actions</span>
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
                      <q-td>
                        <q-btn flat dense icon="edit" color="secondary" @click="toEdit(props.row)"/>

                           <q-dialog v-model="edit_dialog">
                            <q-card style="width: 350px">
                              <q-card-section class="row items-center q-pb-none">
                                <div class="text-h6">Edit Job Request</div>
                                <q-space />
                                <q-btn color="accent" icon="close" flat round dense v-close-popup />
                              </q-card-section>

                              <q-card-section>
                                <q-input outlined dense color="secondary" v-model="editedItem.date" mask="date" placeholder="Date Filed">
                                <template v-slot:append>
                                  <q-icon name="today" class="cursor-pointer"/>
                                  <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                                    <q-date v-model="editedItem.date" @input="() => $refs.qDateProxy.hide()" />
                                  </q-popup-proxy>
                                </template>
                                </q-input>
                                <q-select outlined dense class="q-pa-xs" color="accent" v-model="editedItem.category" :options="options" label="Category" />
                                <q-input class="q-pa-xs" outlined dense clearable color="accent" type="textarea" autogrow v-model="editedItem.description" label="Description"/>
                                <q-input class="q-pa-xs" outlined dense clearable color="accent" v-model="editedItem.unit" label="Requesting Unit" />
                                <q-input class="q-pa-xs" outlined dense clearable color="accent" v-model="editedItem.location" label="Location" />
                                <q-input class="q-pa-xs" outlined dense clearable color="accent" mask="(###) ### - ####" fill-mask v-model="editedItem.telephone" label="Telephone" />

                              </q-card-section>
                              <q-card-actions class="justify-center q-pa-xs">
                                <q-btn no-caps @click="updateJob" color="secondary" label="Save Changes" v-close-popup/>
                              </q-card-actions>
                            </q-card>
                          </q-dialog>
                        <q-btn flat dense icon="delete" color="accent" @click="toDelete(props.row.jobId)">
                          <q-space/>
                        </q-btn>
                      </q-td>
                    </q-tr>
                    <q-tr v-show="props.expand" :props="props" >
                      <q-td colspan="100%">
                        <div class="text-left"><span class="text-italic text-accent">Description</span><br>{{ props.row.description}}</div>
                      </q-td>
                    </q-tr>
                  </template>
                </q-table>
              </div>
              <br/>
              <br/>

               <div style="width: 100%;">
                <q-banner v-if="!pending.length" class="bg-red-1 q-pa-md">
                  <template v-slot:avatar>
                    <q-icon name="event_busy" color="accent" />
                  </template>
                  No pending request!
                </q-banner>
                <q-table
                  title="Pending"
                  class="my-sticky-column-table"
                  v-else
                  dense
                  :separator="separator"
                  :data="pending"
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

              <div style="width: 100%;">
                <q-banner v-if="!complete.length" class="bg-red-1 q-pa-md">
                  <template v-slot:avatar>
                    <q-icon name="event_busy" color="accent" />
                  </template>
                  No completed request!
                </q-banner>
                <q-table
                  title="Completed"
                  class="my-sticky-column-table"
                  v-else
                  dense
                  :separator="separator"
                  :data="complete"
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
            </div>
          </div>
        </q-page>
      <router-view/>
    </q-page-container>
  </q-layout>
</template>

<style lang="sass">
.my-sticky-header-table
  .q-table__top,
  thead tr:first-child th
    background-color: #e8a87c

  th:first-child,
  td:first-child
    position: sticky
    z-index: 1
  thead tr:first-child th
    top: 0
</style>

<script>
import { date } from 'quasar'
import { db } from 'boot/firebase'

export default {
  data () {
    return {
      expanded: [],
      separator: 'cell',
      dense: false,
      edit_dialog: false,
      filter: '',
      selected: [],
      jobs: [],
      pending: [],
      ongoing: [],
      complete: [],
      name: {},
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
        { name: 'id', field: 'jobId', align: 'left', label: 'Job Id' },
        { name: 'date', field: 'date', align: 'left', label: 'Date Filed' },
        { name: 'category', field: 'category', align: 'left', label: 'Category', sortable: true },
        { name: 'unit', field: 'unit', align: 'left', label: 'Requesting Unit' },
        { name: 'location', field: 'location', align: 'left', label: 'Location' },
        { name: 'telephone', field: 'telephone', align: 'left', label: 'Telephone' },
        { name: 'foreman', field: 'foreman', align: 'left', label: "Foreman's Name" },
        { name: 'status', field: 'status', align: 'left', label: 'Status' }
      ]
    }
  },
  created () {
    let jobRef = db.collection('job_orders').orderBy('date')
    let penRef = db.collection('pending_jobs').orderBy('date')
    let onRef = db.collection('ongoing_jobs').orderBy('date')
    // let useRef = db.collection('account').where('usertype', '==', 'foreman')

    // useRef.get().then(querySnapshot => {
    //   querySnapshot.forEach(doc => {
    //     const data = {
    //       firstname: doc.data().firstname,
    //       lastname: doc.data().lastname
    //     }
    //     this.name = data
    //   })
    // })
    jobRef.get().then(querySnapshot => {
      querySnapshot.forEach(doc => {
        const data = {
          jobId: doc.id,
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
          jobId: doc.data().jobId,
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
          jobId: doc.data().jobId,
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
      this.activeJob = this.editedItem.jobId
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

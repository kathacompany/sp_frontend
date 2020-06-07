<template>
  <q-layout view="hHh lpR fFf">
    <q-page-container>
        <q-page class="window-height window-width row justify-center">
          <div class="q-gutter-sm flex text-center">
            <div style="width: 100%; height: 50%;">
              <h5>JOB ORDER REQUESTS</h5> {{ date }}<br><br>
              <q-input v-if="ongoing.length || complete.length" outlined clearable color="secondary" dense debounce="300" v-model="filter" placeholder="Search by Category">
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>
              <br>
              <div style="width: 100%;">
                 <q-banner v-if="!ongoing.length" class="bg-red-1 q-pa-md" style="min-width: 800px">
                  <template v-slot:avatar>
                    <q-icon name="event_busy" color="accent" />
                  </template>
                  No ongoing request!
                </q-banner>
                <q-table
                  title="Job Orders"
                  class="my-sticky-column-table"
                  v-else
                  dense
                  :data="ongoing"
                  :columns="column"
                  row-key="jobId"
                  :filter="filter"
                  :separator="separator"
                  :selected-rows-label="getSelectedString"
                  selection="multiple"
                  :selected.sync="selected"
                  hide-bottom
                >
                  <template v-slot:header="props">
                    <q-tr :props="props">
                      <q-th key="selected">
                        <q-checkbox dense color="secondary" v-model="props.selected"/>
                      </q-th>
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
                      <q-td>
                        <q-checkbox dense color="secondary" v-model="props.selected"/>
                      </q-td>
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
                        <q-btn flat dense icon="hourglass_full" color="secondary" @click="toEdit(props.row)"/>

                           <q-dialog v-model="edit_dialog">
                            <q-card style="width: 350px">
                              <q-card-section class="row items-center q-pb-none">
                                <div class="text-h6">Update Status</div>
                                <q-space />
                                <q-btn color="accent" icon="close" flat round dense v-close-popup />
                              </q-card-section>

                              <q-card-section>
                                <q-input outlined dense color="secondary" v-model="editedItem.date" mask="date" placeholder="Date Filed" :disable="disable">
                                <template v-slot:append>
                                  <q-icon name="today" class="cursor-pointer"/>
                                  <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                                    <q-date v-model="editedItem.date" @input="() => $refs.qDateProxy.hide()" />
                                  </q-popup-proxy>
                                </template>
                                </q-input>
                                <q-select outlined dense class="q-pa-xs" color="accent" v-model="editedItem.category" :options="options" label="Category"  :disable="disable"/>
                                <q-input class="q-pa-xs" outlined dense clearable color="accent" type="textarea" autogrow v-model="editedItem.description" label="Description" :disable="disable"/>
                                <q-input class="q-pa-xs" outlined dense clearable color="accent" v-model="editedItem.unit" label="Requesting Unit"  :disable="disable"/>
                                <q-input class="q-pa-xs" outlined dense clearable color="accent" v-model="editedItem.location" label="Location"  :disable="disable"/>
                                <q-input class="q-pa-xs" outlined dense clearable color="accent" mask="(###) ### - ####" fill-mask v-model="editedItem.telephone" label="Telephone" :disable="disable"/>
                                <q-input class="q-pa-xs" outlined dense clearable color="accent" v-model="editedItem.status" label="Status" />

                              </q-card-section>
                              <q-card-actions class="justify-center q-pa-xs">
                                <q-btn no-caps @click="updateJob" color="secondary" label="Save Changes" v-close-popup/>
                              </q-card-actions>
                            </q-card>
                          </q-dialog>
                        <q-btn flat dense icon="update" color="secondary" @click="$router.push('/ForemanScheduleJobs')">
                          <q-space/>
                        </q-btn>
                        <q-btn flat dense icon="build" color="secondary" @click="$router.push('/ForemanMaterialList')"/>
                      </q-td>
                    </q-tr>
                    <q-tr v-show="props.expand" :props="props">
                      <q-td colspan="100%">
                        <div class="text-left"><span class="text-italic text-accent">Description</span><br>{{ props.row.description}}</div>
                        <div class="text-left"><span class="text-italic text-accent">Requestor's Name</span><br>{{ props.row.requestor}}</div>
                        <div class="text-left"><span class="text-italic text-accent">Unit Head's Name</span><br>{{ props.row.head}}</div>
                      </q-td>
                    </q-tr>
                  </template>
                </q-table>
                <q-btn no-caps icon="assignment_turned_in" class="q-ma-sm bg-secondary text-white"  v-if="selected.length" label="Submit for Completion" @click="onSubmit"/>
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
                        <div class="text-left"><span class="text-italic text-accent">Requestor's Name</span><br>{{ props.row.requestor}}</div>
                        <div class="text-left"><span class="text-italic text-accent">Unit Head's Name</span><br>{{ props.row.head}}</div>
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

  th:first-child,
  td:first-child
    position: sticky
    left: 0
    z-index: 1
</style>

<script>
import { date } from 'quasar'
import { firebaseAuth, db } from 'boot/firebase'

export default {
  data () {
    return {
      separator: 'cell',
      disable: true,
      dense: false,
      edit_dialog: false,
      filter: '',
      selected: [],
      ongoing: [],
      complete: [],
      editedItem: {
        date: '',
        category: '',
        unit: '',
        location: '',
        description: '',
        telephone: '',
        status: '',
        foreman: ''
      },
      options: [
        'Plumbing', 'Electricity', 'Grounds', 'Transportation'
      ],
      requestor: null,
      head: null,
      column: [
        { name: 'id', field: 'jobId', align: 'left', label: 'Job Id' },
        { name: 'date', field: 'date', align: 'left', label: 'Date Filed' },
        { name: 'category', field: 'category', align: 'left', label: 'Category', sortable: true },
        { name: 'unit', field: 'unit', align: 'left', label: 'Requesting Unit' },
        { name: 'location', field: 'location', align: 'left', label: 'Location' },
        { name: 'telephone', field: 'telephone', align: 'left', label: 'Telephone' },
        { name: 'status', field: 'status', align: 'left', label: 'Status' }
      ]
    }
  },
  created () {
    // let jobRef = db.collection('job_orders').orderBy('date')
    // let penRef = db.collection('pending_jobs').orderBy('date')
    let onRef = db.collection('ongoing_jobs').orderBy('date')
    let comRef = db.collection('complete_jobs').orderBy('date')
    onRef.get().then(querySnapshot => {
      querySnapshot.forEach(doc => {
        const data = {
          id: doc.id,
          jobId: doc.data().jobId,
          userId: doc.data().userId,
          category: doc.data().category,
          unit: doc.data().unit,
          location: doc.data().location,
          description: doc.data().description,
          date: doc.data().date,
          telephone: doc.data().telephone,
          requestor: doc.data().requestor,
          head: doc.data().head,
          status: doc.data().status
        }
        this.ongoing.push(data)
        this.userId = data.userId
      })
    })
    comRef.get().then(querySnapshot => {
      querySnapshot.forEach(doc => {
        const data = {
          jobId: doc.data().jobId,
          userId: doc.data().userId,
          category: doc.data().category,
          unit: doc.data().unit,
          location: doc.data().location,
          description: doc.data().description,
          date: doc.data().date,
          telephone: doc.data().telephone,
          requestor: doc.data().requestor,
          head: doc.data().head,
          status: doc.data().status
        }
        this.complete.push(data)
        this.userId = data.userId
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
    getName () {
      let useRef = db.collection('account').where('userId', '==', firebaseAuth.currentUser.uid)
      useRef.get().then(querySnapshot => {
        querySnapshot.forEach(doc => {
          const data = {
            firstname: doc.data().firstname,
            lastname: doc.data().lastname
          }
          this.editedItem.foreman = data
        })
      })
    },
    getSelectedString () {
      return this.selected.length === 0 ? '' : `${this.selected.length} request${this.selected.length > 1 ? 's' : ''} selected of ${this.jobs.length}`
    },
    onSubmit () {
      let onRef = db.collection('ongoing_jobs')
      let comRef = db.collection('complete_jobs')
      let foreId = firebaseAuth.currentUser.uid

      Object.keys(this.selected).forEach(doc => {
        comRef.add({
          jobId: this.selected[doc].id,
          userId: this.userId,
          foreId: foreId,
          category: this.selected[doc].category,
          unit: this.selected[doc].unit,
          location: this.selected[doc].location,
          description: this.selected[doc].description,
          date: this.selected[doc].date,
          telephone: this.selected[doc].telephone,
          requestor: this.requestor,
          foreman: this.foreman,
          head: this.head,
          status: this.selected[doc].status
        })
          .then(
            onRef.doc(this.selected[doc].id).delete(),
            this.$q.notify({
              color: 'secondary',
              message: 'Request Completed'
            }),
            location.reload()
          )
      })
    },
    updateJob () {
      let foreId = firebaseAuth.currentUser.uid
      let docref = db.collection('ongoing_jobs').doc(this.activeJob)
      this.getName()
      docref.update({
        status: this.editedItem.status,
        foreId: foreId
      })
        .then(
          location.reload(),
          this.$q.notify({
            color: 'secondary',
            message: 'Status updated'
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
    }
  }
}
</script>

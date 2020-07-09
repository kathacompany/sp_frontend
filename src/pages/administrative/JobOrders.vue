<template>
  <q-layout view="hHh lpR fFf">
    <q-page-container>
        <q-page class="window-height window-width row justify-center">
          <div class="q-gutter-sm flex text-center">
            <div style="width: 100%; height: 50%;">
              <h5 class="text-weight-light">JOB ORDER REQUESTS</h5> {{ date }}<br><br>
              <q-input v-if="pending.length || ongoing.length || complete.length" outlined clearable color="secondary" dense debounce="300" v-model="filter" placeholder="Search by Category">
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>
              <br>
              <q-card>
                <q-tabs
                  v-model="tab"
                  dense
                  class="text-grey"
                  active-color="secondary"
                  indicator-color="accent"
                  align="justify"
                  narrow-indicator
                >
                  <q-tab name="tab 1" label="Tab 1" />
                  <q-tab name="tab 2" label="Tab 2" />
                </q-tabs>

                <q-separator />

                <q-tab-panels v-model="tab" animated>
                  <q-tab-panel name="tab 1">
                    <div style="width: 100%;">
                      <q-banner v-if="!pending.length" class="bg-grey-2 q-pa-md" style="min-width: 800px; height: 150px">
                        <template v-slot:avatar>
                          <q-icon name="done_all" color="accent" />
                        </template>
                       <span class="text-h6 text-grey text-weight-thin">All caught up. Nothing to approve!</span>
                      </q-banner>
                      <q-table
                        title="Job Orders"
                        class="my-sticky-column-table"
                        v-else
                        dense
                        :data="pending"
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
                          </q-tr>
                          <q-tr v-show="props.expand" :props="props">
                            <q-td colspan="100%">
                              <div class="text-left"><span class="text-italic text-accent">Description</span><br>{{ props.row.description}}</div><br/>
                              <div class="text-left"><span class="text-italic text-accent">Unit Requestor</span><br>{{ props.row.requestor}}</div><br/>
                              <div class="text-left"><span class="text-italic text-accent">Unit Head</span><br>{{ props.row.head}}</div>
                            </q-td>
                          </q-tr>
                        </template>
                      </q-table>
                      <q-btn no-caps icon="thumb_up_alt" label="Accept" class="q-ma-sm bg-secondary text-weight-light text-white"  v-if="selected.length" @click="confirm=true"/>
                      <q-dialog v-model="confirm" persistent>
                        <q-card>
                          <q-card-section class="row items-center">
                            <div class="text-h6">Accept Confirm</div>
                          </q-card-section>
                          <q-card-section>
                            <span class="q-ma-sm">Forward {{selected.length}} selected <span v-if="selected.length>1">requests</span><span v-else>request</span> to a Foreman?</span>
                          </q-card-section>

                          <q-card-actions align="right">
                            <q-btn flat label="No" color="accent" v-close-popup />
                            <q-btn flat label="Yes" color="secondary" @click="onSubmit()" v-close-popup/>
                          </q-card-actions>
                        </q-card>
                      </q-dialog>
                    </div>
                    <br/>
                    <br/>

                    <div style="width: 100%;">
                    <q-banner v-if="!ongoing.length" class="bg-grey-2 q-pa-md" style="min-width: 800px; height: 150px">
                      <template v-slot:avatar>
                        <q-icon name="event_busy" color="accent" />
                      </template>
                     <span class="text-h6 text-grey text-weight-thin">No Ongoing Request!</span>
                    </q-banner>
                    <q-table
                      title="Ongoing"
                      class="my-sticky-column-table"
                      v-else
                      dense
                      :data="ongoing"
                      :columns="column"
                      row-key="jobId"
                      :separator="separator"
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
                            <div class="text-left"><span class="text-italic text-accent">Description</span><br>{{ props.row.description}}</div><br/>
                            <div class="text-left"><span class="text-italic text-accent">Unit Requestor</span><br>{{ props.row.requestor}}</div><br/>
                            <div class="text-left"><span class="text-italic text-accent">Unit Head</span><br>{{ props.row.head}}</div>
                          </q-td>
                        </q-tr>
                      </template>
                    </q-table>
                  </div>
                  </q-tab-panel>

                  <q-tab-panel name="tab 2">
                    <div style="width: 100%;">
                      <q-banner v-if="!complete.length" class="bg-grey-2 q-pa-md" style="min-width: 800px; height: 150px">
                        <template v-slot:avatar>
                          <q-icon name="event_busy" color="accent" />
                        </template>
                        <span class="text-h6 text-grey text-weight-thin">No Completed Request!</span>
                      </q-banner>
                      <q-table
                        title="Completed"
                        class="my-sticky-column-table"
                        v-else
                        dense
                        :data="complete"
                        :columns="column"
                        row-key="jobId"
                        :separator="separator"
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
                              <div class="text-left"><span class="text-italic text-accent">Description</span><br>{{ props.row.description}}</div><br/>
                              <div class="text-left"><span class="text-italic text-accent">Unit Requestor</span><br>{{ props.row.requestor}}</div><br/>
                              <div class="text-left"><span class="text-italic text-accent">Unit Head</span><br>{{ props.row.head}}</div>
                            </q-td>
                          </q-tr>
                        </template>
                      </q-table>
                    </div>
                    </q-tab-panel>

                  </q-tab-panels>
                </q-card>
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
    z-index: 1
  thead tr:first-child th
    top: 0
</style>

<script>
import { db } from 'boot/firebase'
import { date } from 'quasar'

export default {
  data () {
    return {
      separator: 'cell',
      tab: 'tab 1',
      confirm: false,
      dense: false,
      filter: '',
      pending: [],
      ongoing: [],
      complete: [],
      selected: [],
      status: 'sent to foreman',
      requestor: null,
      head: null,
      column: [
        { name: 'id', field: 'jobId', align: 'left', label: 'Job Id' },
        { name: 'date', field: 'date', align: 'left', label: 'Date Filed' },
        { name: 'category', field: 'category', align: 'left', label: 'Category', sortable: true },
        { name: 'unit', field: 'unit', align: 'left', label: 'Requesting Unit' },
        { name: 'location', field: 'location', align: 'left', label: 'Location' },
        { name: 'telephone', field: 'telephone', align: 'left', label: 'Telephone' },
        { name: 'foreman', field: 'foreman', align: 'left', label: 'Foreman' },
        { name: 'status', field: 'status', align: 'left', label: 'Status' }
      ]
    }
  },
  created () {
    let penRef = db.collection('pending_jobs').orderBy('date')
    let onRef = db.collection('ongoing_jobs').orderBy('date')
    let comRef = db.collection('complete_jobs').orderBy('date')
    let useRef = db.collection('account').where('usertype', '==', 'Foreman')

    useRef.get().then(querySnapshot => {
      querySnapshot.forEach(doc => {
        this.foreId = doc.data().userId
        this.foreman = doc.data().fullname
      })
    })

    penRef.get().then(querySnapshot => {
      querySnapshot.forEach(doc => {
        const data = {
          id: doc.id,
          jobId: doc.data().jobId,
          userId: doc.data().userId,
          headId: doc.data().headId,
          category: doc.data().category,
          unit: doc.data().unit,
          location: doc.data().location,
          description: doc.data().description,
          date: doc.data().date,
          telephone: doc.data().telephone,
          requestor: doc.data().requestor,
          head: doc.data().head,
          foreman: doc.data().foreman,
          status: doc.data().status
        }
        this.pending.push(data)
        this.userId = data.userId
        this.headId = data.headId
      })
    })
    onRef.get().then(querySnapshot => {
      querySnapshot.forEach(doc => {
        const data = {
          jobId: doc.data().jobId,
          userId: doc.data().userId,
          headId: doc.data().headId,
          category: doc.data().category,
          unit: doc.data().unit,
          location: doc.data().location,
          description: doc.data().description,
          date: doc.data().date,
          telephone: doc.data().telephone,
          requestor: doc.data().requestor,
          head: doc.data().head,
          foreman: doc.data().foreman,
          status: doc.data().status
        }
        this.ongoing.push(data)
        this.userId = data.userId
        this.headId = data.headId
      })
    })
    comRef.get().then(querySnapshot => {
      querySnapshot.forEach(doc => {
        const data = {
          jobId: doc.data().jobId,
          userId: doc.data().userId,
          headId: doc.data().headId,
          category: doc.data().category,
          unit: doc.data().unit,
          location: doc.data().location,
          description: doc.data().description,
          date: doc.data().date,
          telephone: doc.data().telephone,
          requestor: doc.data().requestor,
          head: doc.data().head,
          foreman: doc.data().foreman,
          status: doc.data().status
        }
        this.complete.push(data)
        this.userId = data.userId
        this.headId = data.headId
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
      return this.selected.length === 0 ? '' : `${this.selected.length} request${this.selected.length > 1 ? 's' : ''} selected of ${this.pending.length}`
    },
    onSubmit () {
      let penRef = db.collection('pending_jobs')
      let onRef = db.collection('ongoing_jobs')
      // let comRef = db.collection('complete_jobs')

      Object.keys(this.selected).forEach(doc => {
        onRef.add({
          jobId: this.selected[doc].jobId,
          headId: this.selected[doc].headId,
          userId: this.selected[doc].userId,
          foreId: this.foreId,
          category: this.selected[doc].category,
          unit: this.selected[doc].unit,
          location: this.selected[doc].location,
          description: this.selected[doc].description,
          date: this.selected[doc].date,
          telephone: this.selected[doc].telephone,
          requestor: this.selected[doc].requestor,
          head: this.selected[doc].head,
          foreman: this.foreman,
          status: this.status
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

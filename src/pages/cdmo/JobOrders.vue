<template>
  <q-layout view="hHh lpR fFf">
    <q-page-container>
        <q-page class="window-height window-width row justify-center">
          <div class="q-gutter-sm flex text-center">
            <div style="width: 100%; height: 50%;">
              <h5 class="text-weight-light">JOB ORDER REQUESTS</h5><span class="text-weight-medium">{{ date }}</span><br><br>
              <q-input v-if="pending.length || ongoing.length || complete.length" outlined clearable color="secondary" dense debounce="300" v-model="filter" placeholder="Search">
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
                  <q-tab name="tab 1" label="Active" icon="assignment">
                  </q-tab>
                  <q-tab name="tab 2" label="Completed" icon="assignment_turned_in">
                  </q-tab>
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
                        title="Job Order Requests"
                        :table-style="'counter-reset: cssRowCounter '"
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
                      >
                        <template v-slot:top-right v-if="selected.length">
                          <q-btn no-caps icon="thumb_up_alt" label="Accept" color="secondary" class="q-ma-sm text-weight-light" @click="confirm=true"/>
                        </template>
                        <template v-slot:header="props">
                          <q-tr :props="props">
                            <q-th key="selected">
                              <q-checkbox dense color="secondary" v-model="props.selected"/>
                            </q-th>
                            <q-th class="text-italic text-accent" auto-width>#</q-th>
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
                            <q-td><span class="text-secondary text-weight-bold rowNumber"/></q-td>
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

                      <q-dialog v-model="confirm" persistent transition-show="rotate" transition-hide="rotate">
                        <q-card>
                          <q-bar class="bg-secondary text-white" style="height: 50px">
                            <div class="text-weight-light">Accept Confirm</div>
                          </q-bar>
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
                     <span class="text-h6 text-grey text-weight-thin">No Ongoing Requests!</span>
                    </q-banner>
                    <q-table
                      title="Ongoing Requests"
                      :table-style="'counter-reset: cssRowCounter'"
                      class="my-sticky-column-table"
                      v-else
                      dense
                      :data="ongoing"
                      :columns="column"
                      row-key="jobId"
                      :separator="separator"
                      :filter="filter"
                    >
                      <template v-slot:header="props">
                        <q-tr :props="props">
                          <q-th class="text-italic text-accent" auto-width>#</q-th>
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
                          <q-td><span class="text-secondary text-weight-bold rowNumber"/></q-td>
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
                        <span class="text-h6 text-grey text-weight-thin">No Completed Requests!</span>
                      </q-banner>
                      <q-table
                        title="Completed Requests"
                        :table-style="'counter-reset: cssRowCounter'"
                        class="my-sticky-column-table"
                        v-else
                        dense
                        :data="complete"
                        :columns="column"
                        row-key="jobId"
                        :separator="separator"
                        :filter="filter"
                      >
                      <template v-slot:header="props">
                          <q-tr :props="props">
                            <q-th class="text-italic text-accent" auto-width>#</q-th>
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
                            <q-td><span class="text-secondary text-weight-bold rowNumber"/></q-td>
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
                              <div class="text-left"><span class="text-italic text-accent">Findings</span><br>{{ props.row.findings}}</div><br>
                              <div class="text-left"><span class="text-italic text-accent">Recommendations</span><br>{{ props.row.rec}}</div><br>
                              <div class="text-left"><span class="text-italic text-accent">Action</span><br>{{ props.row.action}}</div><br>
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
        { name: 'category', field: 'category', align: 'left', label: 'Category', sortable: true },
        { name: 'date', field: 'date', align: 'left', label: 'Date Filed', sortable: true },
        { name: 'unit', field: 'unit', align: 'left', label: 'Requesting Unit', sortable: true },
        { name: 'location', field: 'location', align: 'left', label: 'Location', sortable: true },
        { name: 'telephone', field: 'telephone', align: 'left', label: 'Telephone' },
        { name: 'foreman', field: 'foreman', align: 'left', label: 'Foreman', sortable: true },
        { name: 'status', field: 'status', align: 'left', label: 'Status', sortable: true }
      ]
    }
  },
  created () {
    const penRef = db.collection('pending_jobs').orderBy('date')
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
      })
    })
    const onRef = db.collection('ongoing_jobs').orderBy('date')
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
      })
    })
    const comRef = db.collection('complete_jobs').orderBy('date')
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
          status: doc.data().status,
          findings: doc.data().findings,
          rec: doc.data().rec,
          action: doc.data().action
        }
        this.complete.push(data)
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
      const penRef = db.collection('pending_jobs')
      const onRef = db.collection('ongoing_jobs')

      Object.keys(this.selected).forEach(doc => {
        const category = this.selected[doc].category
        const useRef = db.collection('account').where('area', '==', category).where('usertype', '==', 'foreman')

        useRef.get().then(querySnapshot => {
          querySnapshot.forEach(doc => {
            this.foreId = doc.id
            this.foreman = doc.data().fullname
          })
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
      })
    }
  }
}
</script>

<template>
  <q-layout view="hHh lpR fFf">
    <q-page-container>
        <q-page class="window-height window-width row justify-center">
          <div class="q-gutter-sm flex text-center">
            <div style="width: 100%; height: 50%;">
              <h5 class="text-weight-light">JOB ORDER REQUESTS</h5><span class="text-weight-medium">{{ date }}</span><br><br>
              <q-input v-if="jobs.length || pending.length || ongoing.length || complete.length" outlined clearable color="secondary" dense debounce="300" v-model="filter" placeholder="Search">
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
                  <q-tab name="tab 1" label="Filed" icon="group_work"/>
                  <q-tab name="tab 2" label="Pending" icon="pending"/>
                  <q-tab name="tab 3" label="Ongoing" icon="next_plan"/>
                  <q-tab name="tab 4" label="Completed" icon="offline_pin"/>
                </q-tabs>

                <q-separator />

                <q-tab-panels v-model="tab" animated>
                  <q-tab-panel name="tab 1">
                    <div style="width: 100%;">
                      <q-banner v-if="!jobs.length" class="bg-grey-2 q-pa-md" style="min-width: 800px; height: 150px">
                        <template v-slot:avatar>
                          <q-icon name="event_busy" color="accent" />
                        </template>
                       <span class="text-h6 text-grey text-weight-thin">No Job Requests!</span>
                      </q-banner>
                      <q-table
                        title="Filed Requests"
                        :table-style="'counter-reset: cssRowCounter '"
                        class="my-sticky-column-table"
                        v-else
                        dense
                        :data="jobs"
                        :columns="jobCol"
                        row-key="jobId"
                        :filter="filter"
                        :separator="separator"
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
                              <div class="text-left"><span class="text-italic text-accent">Description</span><br/>{{ props.row.description}}</div><br/>
                              <div class="text-left"><span class="text-italic text-accent">Status</span><br>{{ props.row.status}}</div>
                            </q-td>
                          </q-tr>
                        </template>
                      </q-table>
                    </div>
                  </q-tab-panel>

                  <q-tab-panel name="tab 2">
                    <div style="width: 100%;">
                      <q-banner v-if="!pending.length" class="bg-grey-2 q-pa-md" style="min-width: 800px; height: 150px">
                        <template v-slot:avatar>
                          <q-icon name="event_busy" color="accent" />
                        </template>
                       <span class="text-h6 text-grey text-weight-thin">No Pending Requests!</span>
                      </q-banner>
                      <q-table
                        title="Pending Requests"
                        :table-style="'counter-reset: cssRowCounter '"
                        class="my-sticky-column-table"
                        v-else
                        dense
                        :separator="separator"
                        :data="pending"
                        :columns="penCol"
                        row-key="jobId"
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
                              <div class="text-left"><span class="text-italic text-accent">Description</span><br/>{{ props.row.description}}</div><br/>
                              <div class="text-left"><span class="text-italic text-accent">Status</span><br>{{ props.row.status}}</div>
                            </q-td>
                          </q-tr>
                        </template>
                      </q-table>
                    </div>
                  </q-tab-panel>

                  <q-tab-panel name="tab 3">
                    <div style="width: 100%;">
                      <q-banner v-if="!ongoing.length" class="bg-grey-2 q-pa-md" style="min-width: 800px; height: 150px">
                        <template v-slot:avatar>
                          <q-icon name="event_busy" color="accent" />
                        </template>
                       <span class="text-h6 text-grey text-weight-thin">No Ongoing Requests!</span>
                      </q-banner>
                      <q-table
                        title="Ongoing Requests"
                        :table-style="'counter-reset: cssRowCounter '"
                        class="my-sticky-column-table"
                        v-else
                        dense
                        :separator="separator"
                        :data="ongoing"
                        :columns="onCol"
                        row-key="jobId"
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
                              <div class="text-left"><span class="text-italic text-accent">Description</span><br/>{{ props.row.description}}</div><br/>
                              <div class="text-left"><span class="text-italic text-accent">Status</span><br>{{ props.row.status}}</div>
                            </q-td>
                          </q-tr>
                        </template>
                      </q-table>
                    </div>
                  </q-tab-panel>

                  <q-tab-panel name="tab 4">
                    <div style="width: 100%;">
                      <q-banner v-if="!complete.length" class="bg-grey-2 q-pa-md" style="min-width: 800px; height: 150px">
                        <template v-slot:avatar>
                          <q-icon name="event_busy" color="accent" />
                        </template>
                       <span class="text-h6 text-grey text-weight-thin">No Completed Requests!</span>
                      </q-banner>
                      <q-table
                        title="Completed Requests"
                        :table-style="'counter-reset: cssRowCounter '"
                        class="my-sticky-column-table"
                        v-else
                        dense
                        :separator="separator"
                        :data="complete"
                        :columns="onCol"
                        row-key="jobId"
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
                              <div class="text-left"><span class="text-italic text-accent">Description</span><br/>{{ props.row.description}}</div><br/>
                              <div class="text-left"><span class="text-italic text-accent">Findings</span><br/>{{ props.row.findings}}</div><br/>
                              <div class="text-left"><span class="text-italic text-accent">Recommendations</span><br/>{{ props.row.rec}}</div><br/>
                              <div class="text-left"><span class="text-italic text-accent">Action Taken</span><br/>{{ props.row.action}}</div><br/>
                              <div class="text-left"><span class="text-italic text-accent">Status and Completion Date</span><br>{{ props.row.status}}</div>
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
import { date } from 'quasar'
import { db } from 'boot/firebase'

export default {
  data () {
    return {
      separator: 'cell',
      confirm: false,
      reject: false,
      dense: false,
      filter: '',
      tab: 'tab 1',
      jobs: [],
      pending: [],
      ongoing: [],
      complete: [],
      jobCol: [
        { name: 'id', field: 'jobId', align: 'left', label: 'Job Id', sortable: true },
        { name: 'category', field: 'category', align: 'left', label: 'Category', sortable: true },
        { name: 'unit', field: 'unit', align: 'left', label: 'Requesting Unit', sortable: true },
        { name: 'location', field: 'location', align: 'left', label: 'Location', sortable: true },
        { name: 'telephone', field: 'telephone', align: 'left', label: 'Telephone', sortable: true },
        { name: 'requestor', field: 'requestor', align: 'left', label: 'Filed By', sortable: true },
        { name: 'date', field: 'date', align: 'left', label: 'Date Created', sortable: true }
      ],
      penCol: [
        { name: 'id', field: 'jobId', align: 'left', label: 'Job Id', sortable: true },
        { name: 'category', field: 'category', align: 'left', label: 'Category', sortable: true },
        { name: 'unit', field: 'unit', align: 'left', label: 'Requesting Unit', sortable: true },
        { name: 'location', field: 'location', align: 'left', label: 'Location', sortable: true },
        { name: 'telephone', field: 'telephone', align: 'left', label: 'Telephone', sortable: true },
        { name: 'requestor', field: 'requestor', align: 'left', label: 'Filed By', sortable: true },
        { name: 'head', field: 'head', align: 'left', label: 'Approved By', sortable: true },
        { name: 'date', field: 'date', align: 'left', label: 'Date Filed', sortable: true }
      ],
      onCol: [
        { name: 'id', field: 'jobId', align: 'left', label: 'Job Id', sortable: true },
        { name: 'category', field: 'category', align: 'left', label: 'Category', sortable: true },
        { name: 'unit', field: 'unit', align: 'left', label: 'Requesting Unit', sortable: true },
        { name: 'location', field: 'location', align: 'left', label: 'Location', sortable: true },
        { name: 'telephone', field: 'telephone', align: 'left', label: 'Telephone', sortable: true },
        { name: 'requestor', field: 'requestor', align: 'left', label: 'Filed By', sortable: true },
        { name: 'head', field: 'head', align: 'left', label: 'Approved By', sortable: true },
        { name: 'foreman', field: 'foreman', align: 'left', label: 'Foreman', sortable: true },
        { name: 'date', field: 'date', align: 'left', label: 'Date Filed', sortable: true }
      ]
    }
  },
  created () {
    const jobRef = db.collection('job_orders').orderBy('date')
    jobRef.get().then(querySnapshot => {
      querySnapshot.forEach(doc => {
        const data = {
          id: doc.data().jobId,
          jobId: doc.id,
          userId: doc.data().userId,
          category: doc.data().category,
          unit: doc.data().unit,
          location: doc.data().location,
          description: doc.data().description,
          date: doc.data().date,
          telephone: doc.data().telephone,
          requestor: doc.data().requestor,
          status: doc.data().status
        }
        this.jobs.push(data)
      })
    })
    const penRef = db.collection('pending_jobs').orderBy('date')
    penRef.get().then(querySnapshot => {
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
        this.pending.push(data)
      })
    })
    const onRef = db.collection('ongoing_jobs').orderBy('date')
    onRef.get().then(querySnapshot => {
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
          category: doc.data().category,
          unit: doc.data().unit,
          location: doc.data().location,
          description: doc.data().description,
          date: doc.data().date,
          telephone: doc.data().telephone,
          findings: doc.data().findings,
          rec: doc.data().rec,
          action: doc.data().action,
          requestor: doc.data().requestor,
          head: doc.data().head,
          foreman: doc.data().foreman,
          status: doc.data().status
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
  }
}
</script>

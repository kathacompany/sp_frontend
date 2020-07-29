<template>
  <q-layout view="hHh lpR fFf">
    <q-page-container>
        <q-page class="window-height window-width row justify-center">
          <div class="q-gutter-sm flex text-center">
            <div style="width: 100%; height: 50%;">
              <h5 class="text-weight-light">JOB ORDER REQUESTS</h5><span class="text-weight-medium">{{ date }}</span><br><br>
              <q-input v-if="ongoing.length || complete.length" outlined clearable color="secondary" dense debounce="300" v-model="filter" placeholder="Search">
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
                     <q-banner v-if="!ongoing.length" class="bg-grey-2 q-pa-md" style="min-width: 800px; height: 150px">
                      <template v-slot:avatar>
                        <q-icon name="event_busy" color="accent" />
                      </template>
                     <span class="text-h6 text-grey text-weight-thin">No Job Requests!</span>
                    </q-banner>

                    <q-table
                      title="Job Order Requests"
                      :table-style="'counter-reset: cssRowCounter '"
                      class="my-sticky-column-table"
                      v-else
                      dense
                      :data="ongoing"
                      :columns="column"
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
                          <q-th>
                            <span class="text-italic text-accent">Actions</span>
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
                            :class="badgeClasses(props.row, 'editedItem.bgcolor')"
                            v-for="col in props.cols"
                            :key="col.name"
                            :props="props"
                          >
                            {{ col.value }}
                          </q-td>
                          <q-td>
                            <q-btn flat dense no-caps color="secondary" icon="today" @click="toEditSW(props.row)"/>
                              <q-dialog persistent transition-show="rotate" transition-hide="rotate" v-model="sched_dialog">
                                <q-card style="width: 400px">
                                  <q-bar class="bg-secondary text-white" style="height: 60px">
                                    <div class="text-weight-light">Schedule Job -- {{ editedItem.jobId }}</div>
                                      <q-space />
                                    <q-btn flat icon="close" round dense v-close-popup />
                                  </q-bar>
                                  <q-card-section>
                                    <span class="text-sub1 text-weight-light">{{ editedItem.description }}</span>
                                  </q-card-section>
                                  <q-card-section v-show="showSimulatedReturnData">
                                    <div class="q-pa-xs">
                                      <span class="text-caption text-grey">Selection is REQUIRED</span>
                                      <q-btn-toggle
                                        v-model="schedWork.title"
                                        dense
                                        spread
                                        no-caps
                                        unelevated
                                        toggle-color="secondary"
                                        text-color="accent"
                                        style="border: 1px solid #3B9C9C"
                                        :options="[{label: 'for Inspection', value: 'Inspection', icon: 'fact_check'},
                                          {label: 'for Implementation', value: 'Implementation', icon: 'gavel'}]"
                                      />
                                    </div>
                                  </q-card-section>
                                  <q-card-section v-show="showSimulatedReturnData">
                                    <q-input
                                      clearable
                                      outlined
                                      dense
                                      class="q-pa-xs"
                                      ref="sel"
                                      color="accent"
                                      placeholder="Select Date"
                                      v-model="schedWork.date"
                                      hint="ALL UNDERLINED DAY is ALREADY been SCHEDULED"
                                      lazy-rules
                                      :rules="[val => val !== null && val !== '' && val !== undefined || 'Date is required']">
                                      <template v-slot:append>
                                        <q-icon name="today" class="cursor-pointer">
                                          <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                                            <q-date ref="sel" mask="YYYY-MM-DD" :events="events" today-btn color="accent" v-model="schedWork.date"/>
                                          </q-popup-proxy>
                                        </q-icon>
                                      </template>
                                    </q-input>
                                    <br>
                                    <q-select
                                      v-if="schedWork.title==='Implementation'"
                                      dense
                                      class="q-pa-xs"
                                      clearable
                                      outlined
                                      color="accent"
                                      ref="selWork"
                                      v-model="schedWork.details"
                                      use-input
                                      multiple
                                      option-value="id"
                                      option-label="worker"
                                      options-dense
                                      use-chips
                                      stack-label
                                      input-debounce="0"
                                      label="Search Worker's Name"
                                      :options="workers"
                                      @filter="filterWork"
                                      lazy-rules
                                      :rules="[val => val !== null && val !== '' && val !== undefined || 'Selection is required']"
                                    >
                                      <template v-slot:prepend>
                                        <q-icon name="people"/>
                                      </template>
                                      <template v-slot:no-option>
                                        <q-item>
                                          <q-item-section class="text-grey">
                                            No results
                                          </q-item-section>
                                        </q-item>
                                      </template>
                                    </q-select>
                                  </q-card-section>
                                  <q-inner-loading :showing="visible">
                                    <q-spinner-gears size="50px" color="grey-5" />
                                  </q-inner-loading>
                                  <q-card-actions align="center">
                                    <q-btn no-caps unelevated class="full-width text-weight-light" label="Save Changes" color="secondary" @click="onSave"/>
                                  </q-card-actions>
                                </q-card>
                              </q-dialog>

                            <q-btn flat dense icon="shopping_cart" color="secondary"  @click="toEditM(props.row)"/>
                            <q-dialog persistent transition-show="rotate" transition-hide="rotate" v-model="mat_dialog">
                                <q-card style="width: 400px">
                                  <q-bar class="bg-secondary text-white" style="height: 60px">
                                    <div class="text-subtitle2 text-weight-light">Request Material -- {{ editedItem.jobId }}</div>
                                      <q-space />
                                    <q-btn flat icon="close" round dense v-close-popup />
                                  </q-bar>
                                  <q-card-section>
                                     <q-select
                                      v-show="showSimulatedReturnData"
                                      dense
                                      clearable
                                      outlined
                                      color="accent"
                                      ref="selMat"
                                      v-model="selection"
                                      use-input
                                      multiple
                                      option-value="matId"
                                      option-label="material"
                                      options-dense
                                      use-chips
                                      stack-label
                                      input-debounce="0"
                                      label="Search Material Name"
                                      :options="materials"
                                      @filter="filterMat"
                                      lazy-rules
                                      :rules="[val => val !== null && val !== '' && val !== undefined || 'Selection is required']"
                                    >
                                      <template v-slot:prepend>
                                        <q-icon name="shopping_cart"/>
                                      </template>
                                      <template v-slot:no-option>
                                        <q-item>
                                          <q-item-section class="text-grey">
                                            No results
                                          </q-item-section>
                                        </q-item>
                                      </template>
                                    </q-select>
                                    <div v-if="selection" v-show="showSimulatedReturnData">
                                      <div v-for="material in selection " :key="material.matId">
                                        <span class="text-subtitle1 text-weight-light">Description: {{ material.description }}</span><br>
                                        <span class="text-subtitle1 text-weight-light">Quantity: {{ material.quantity }}</span>
                                        <q-input outlined dense color="accent" v-model="material.request" clearable label="Enter Quantity Needed" type="number"/><br>
                                      </div>
                                    </div>
                                  </q-card-section>
                                  <q-inner-loading :showing="visible">
                                    <q-spinner-gears size="50px" color="grey-5" />
                                  </q-inner-loading>
                                  <q-card-actions align="center">
                                    <q-btn no-caps unelevated class="full-width text-weight-light" label="Send Request" color="secondary" @click="onRequest"/>
                                  </q-card-actions>
                                </q-card>
                              </q-dialog>

                            <q-btn flat dense icon="verified" color="secondary" @click="toEditC(props.row)"/>

                             <q-dialog persistent transition-show="rotate" transition-hide="rotate" v-model="comp_dialog">
                                <q-card style="width: 450px;">
                                  <q-bar class="bg-secondary text-white" style="height: 60px">
                                    <div class="text-weight-light">Job Report for Job --- {{ editedItem.jobId }}</div>
                                      <q-space />
                                    <q-btn flat icon="close" round dense v-close-popup />
                                  </q-bar>
                                 <q-card-section>
                                  <div class="text-caption text-accent text-weight-medium">Note: JOB REPORT is for WORKED JOBS ONLY or else it will not be submitted</div><br>
                                  <div class="text-center text-weight-light">{{ date }}</div><br>
                                  <div class="text-weight-light">Requested By:  {{ editedItem.requestor }}</div>
                                  <div class="text-weight-light">Approved By:  {{ editedItem.head }}</div>
                                  <div class="text-weight-light">Unit:  {{ editedItem.unit }}</div>
                                  <div class="text-weight-light">Date Filed:  {{ editedItem.date }}</div><br>
                                    <q-input
                                      outlined
                                      dense
                                      class="q-pa-xs"
                                      ref="description"
                                      clearable
                                      color="accent"
                                      v-model="findings"
                                      type="textarea"
                                      label="Findings/Observations"
                                      lazy-rules
                                      :rules="[ val => val !== null && val !== '' || 'Input is required']"/>
                                    <q-input
                                      outlined
                                      dense
                                      class="q-pa-xs"
                                      ref="description"
                                      clearable
                                      color="accent"
                                      v-model="rec"
                                      label="Recommendations"
                                      autogrow
                                      lazy-rules
                                      :rules="[ val => val !== null && val !== '' || 'Input is required']"/>
                                    <q-input
                                      outlined
                                      ref="description"
                                      dense
                                      class="q-pa-xs"
                                      clearable
                                      color="accent"
                                      v-model="action"
                                      label="Action Taken"
                                      autogrow
                                      lazy-rules
                                      :rules="[ val => val !== null && val !== '' || 'Input is required']"/>
                                  </q-card-section>
                                  <q-card-actions align="center">
                                    <q-btn no-caps unelevated class="full-width text-weight-light" label="Submit to the Requestor" color="secondary" @click="onAttest"/>
                                  </q-card-actions>
                                </q-card>
                              </q-dialog>

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
                  <br/>
                  <br/>

                    <div style="width: 100%;">
                      <q-banner v-if="!attested.length" class="bg-grey-2 q-pa-md" style="min-width: 800px; height: 150px">
                        <template v-slot:avatar>
                          <q-icon name="event_busy" color="accent" />
                        </template>
                       <span class="text-h6 text-grey text-weight-thin">No Certified Requests!</span>
                      </q-banner>
                      <q-table
                        title="Confirmed Requests"
                        :table-style="'counter-reset: cssRowCounter '"
                        class="my-sticky-column-table"
                        v-else
                        dense
                        :separator="separator"
                        :data="attested"
                        :columns="atCol"
                        row-key="job"
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
                            <q-th>
                              <span class="text-italic text-accent">Action</span>
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
                            <q-td>
                              <q-btn flat dense icon="assignment_turned_in" color="secondary" @click="toEdit(props.row)"/>

                              <q-dialog v-model="submit" persistent>
                                <q-card style="width: 350px">
                                  <q-bar class="bg-secondary text-white" style="height: 60px">
                                    <div class="text-h6 text-weight-light">Submit Job for Completion</div>
                                  </q-bar>
                                  <q-card-section>
                                  <div>
                                    <span class="text-h6  text-weight-medium q-ma-sm">This job is ready for Completion</span><br>
                                    <div class="text-grey q-ma-sm">By clicking the "Submit button" you acknowledge that this job is done and certified by the Requestor</div><br>
                                    <span class="q-ma-sm">Completion Date: <span class="text-weight-medium">{{ date }}</span></span>
                                  </div>
                                  </q-card-section>
                                  <q-card-actions align="right">
                                    <q-btn flat class="q-ma-sm" label="Submit" color="secondary" @click="onComplete" v-close-popup/>
                                    <q-btn flat class="q-ma-sm" label="Cancel" color="accent" v-close-popup/>
                                  </q-card-actions>
                                </q-card>
                              </q-dialog>
                            </q-td>
                          </q-tr>
                          <q-tr v-show="props.expand" :props="props">
                            <q-td colspan="100%">
                              <div class="text-left"><span class="text-italic text-accent">Description</span><br>{{ props.row.description}}</div>
                              <div class="text-left"><span class="text-italic text-accent">Findings</span><br>{{ props.row.findings}}</div><br>
                              <div class="text-left"><span class="text-italic text-accent">Recommendations</span><br>{{ props.row.rec}}</div><br>
                              <div class="text-left"><span class="text-italic text-accent">Action</span><br>{{ props.row.action}}</div>
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
                        :table-style="'counter-reset: cssRowCounter '"
                        class="my-sticky-column-table"
                        v-else
                        dense
                        :separator="separator"
                        :data="complete"
                        :columns="column"
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
                              <div class="text-left"><span class="text-italic text-accent">Description</span><br>{{ props.row.description }}</div><br>
                              <div class="text-left"><span class="text-italic text-accent">Findings</span><br>{{ props.row.findings}}</div><br>
                              <div class="text-left"><span class="text-italic text-accent">Recommendations</span><br>{{ props.row.rec}}</div><br>
                              <div class="text-left"><span class="text-italic text-accent">Action</span><br>{{ props.row.action}}</div><br>
                              <div class="text-left"><span class="text-italic text-accent">Unit Requestor</span><br>{{ props.row.requestor}}</div><br>
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
import { LocalStorage, date } from 'quasar'
import { db } from 'boot/firebase'

const stringOptions = []
const stringMat = []

export default {
  data () {
    return {
      separator: 'cell',
      filter: '',
      tab: 'tab 1',
      submit: false,
      dense: false,
      visible: false,
      showSimulatedReturnData: false,
      comp_dialog: false,
      sched_dialog: false,
      mat_dialog: false,
      editQ_dialog: false,
      ongoing: [],
      complete: [],
      attested: [],
      editedItem: {
        date: '',
        category: '',
        unit: '',
        location: '',
        description: '',
        telephone: '',
        status: '',
        foreman: '',
        bgcolor: ''
      },
      events: [],
      workers: stringOptions,
      schedWork: {
        date: '',
        details: '',
        title: ''
      },
      materials: stringMat,
      selection: null,
      request: 0,
      findings: '',
      rec: '',
      action: '',
      column: [
        { name: 'category', field: 'category', align: 'left', label: 'Category', sortable: true },
        { name: 'date', field: 'date', align: 'left', label: 'Date Filed', sortable: true },
        { name: 'unit', field: 'unit', align: 'left', label: 'Requesting Unit', sortable: true },
        { name: 'location', field: 'location', align: 'left', label: 'Location', sortable: true },
        { name: 'telephone', field: 'telephone', align: 'left', label: 'Telephone' },
        { name: 'status', field: 'status', align: 'left', label: 'Status', sortable: true }
      ],
      atCol: [
        { name: 'date', field: 'confirmed', align: 'left', label: 'Date Confirmed', sortable: true },
        { name: 'status', field: 'certified', align: 'left', label: 'Status', sortable: true }
      ]
    }
  },
  computed: {
    date () {
      let timeStamp = Date.now()
      return date.formatDate(timeStamp, 'dddd D MMMM YYYY')
    }
  },
  created () {
    const user = JSON.parse(LocalStorage.getItem('user'))

    const useRef = db.collection('account').where('userId', '==', user.uid)
    useRef.get().then(querySnapshot => {
      querySnapshot.forEach(doc => {
        this.foreman = doc.data().fullname
        this.area = doc.data().area
      })
      const onRef = db.collection('ongoing_jobs').where('category', '==', this.area)
      onRef.get().then(querySnapshot => {
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
            status: doc.data().status,
            bgcolor: doc.data().bgcolor
          }
          this.ongoing.push(data)
        })
      })
      const atRef = db.collection('complete_jobs').where('info.category', '==', this.area)
      atRef.get().then(querySnapshot => {
        querySnapshot.forEach(doc => {
          const data = {
            id: doc.id,
            job: doc.data().job,
            info: doc.data().info,
            rec: doc.data().rec,
            action: doc.data().action,
            findings: doc.data().findings,
            confirmed: doc.data().confirmed,
            conducted: doc.data().conducted,
            certified: doc.data().certified
          }
          this.attested.push(data)
        })
      })
      const comRef = db.collection('complete_jobs').where('category', '==', this.area)
      comRef.get().then(querySnapshot => {
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
            status: doc.data().status,
            findings: doc.data().findings,
            rec: doc.data().rec,
            action: doc.data().action
          }
          this.complete.push(data)
        })
      })
    })
  },
  methods: {
    showSchedWorkDataLoading () {
      this.visible = true
      this.showSimulatedReturnData = false
      setTimeout(() => {
        this.visible = false
        this.showSimulatedReturnData = true
      }, 700)
    },
    filterWork (val, update, abort) {
      update(() => {
        const needle = val.toLowerCase()
        this.workers = stringOptions.filter(v => v.worker.toLowerCase().indexOf(needle) > -1)
        this.$refs.selWork.setOptionIndex(0)
      })
    },
    filterMat (val, update, abort) {
      update(() => {
        const needle = val.toLowerCase()
        this.materials = stringMat.filter(v => v.material.toLowerCase().indexOf(needle) > -1)
        this.$refs.selMat.setOptionIndex(0)
      })
    },
    toEdit (item, job) {
      this.submit = true
      this.editedItem = Object.assign({}, item)
      this.activeJob = this.editedItem.job
    },
    onComplete () {
      const user = JSON.parse(LocalStorage.getItem('user'))
      const comRef = db.collection('complete_jobs')
      const comSet = db.collection('complete_jobs').where('jobId', '==', this.activeJob)
      const atRef = db.collection('complete_jobs').where('job', '==', this.activeJob)

      comRef.get().then(querySnapshot => {
        querySnapshot.forEach(doc => {
          LocalStorage.set('info', JSON.stringify(doc.data().info))
        })
      })
      this.status = 'Job Completed ' + this.date
      const infoData = JSON.parse(LocalStorage.getItem('info'))
      comRef.add(infoData)
        .then(
          comSet.get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              doc.ref.update({
                findings: this.editedItem.findings,
                rec: this.editedItem.rec,
                action: this.editedItem.action,
                foreId: user.uid,
                foreman: this.editedItem.conducted,
                status: this.status
              })
            })
          }),
          atRef.get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              doc.ref.delete()
            })
          }),
          this.$q.notify({
            color: 'secondary',
            message: 'Job Completed'
          }),
          location.reload()
        )
        .catch(error => {
          console.error('Error submitting: ', error)
        })
    },
    toEditC (item, jobId) {
      this.comp_dialog = true
      this.editedItem = Object.assign({}, item)
      this.activeJob = this.editedItem.jobId
      this.requestor = this.editedItem.requestor
      this.headId = this.editedItem.headId
      this.userId = this.editedItem.userId
    },
    onAttest () {
      const onRef = db.collection('ongoing_jobs').where('jobId', '==', this.activeJob)
      const schedRef = db.collection('scheduled_jobs').where('jobId', '==', this.activeJob)
      const matRef = db.collection('material_requests').where('jobId', '==', this.activeJob)
      const atRef = db.collection('attested_jobs')
      const user = JSON.parse(LocalStorage.getItem('user'))

      atRef.add({
        info: this.editedItem,
        jobId: this.activeJob,
        foreman: this.foreman,
        foreId: user.uid,
        findings: this.findings,
        rec: this.rec,
        action: this.action,
        requestor: this.requestor,
        userId: this.userId,
        headId: this.headId,
        date: this.date,
        status: 'confirm for Completion'
      })
        .then(
          onRef.get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              doc.ref.delete()
            })
          }),
          schedRef.get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              doc.ref.delete()
            })
          }),
          matRef.get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              doc.ref.update({
                status: 'Done'
              })
            })
          }),
          this.$q.notify({
            color: 'secondary',
            message: 'Job Report Sent'
          }),
          location.reload()
        )
        .catch(error => {
          console.error('Error sending job report: ', error)
        })
    },
    toEditM (item, jobId) {
      this.showSchedWorkDataLoading()
      this.mat_dialog = true
      this.editedItem = Object.assign({}, item)
      this.activeJob = this.editedItem.jobId
      this.activeCat = this.editedItem.category

      const materials = db.collection('materials').where('category', '==', this.activeCat)
      materials.get().then(querySnapshot => {
        querySnapshot.forEach(doc => {
          const data = {
            matId: doc.id,
            material: doc.data().name,
            description: doc.data().description,
            quantity: doc.data().quantity
          }
          this.materials.push(data)
        })
      })
      const matReq = db.collection('material_requests').where('category', '==', this.activeCat)
      matReq.get().then(querySnapshot => {
        querySnapshot.forEach(doc => {
          const jobId = doc.data().jobId
          this.material = doc.data().material
          if (this.activeJob === jobId) {
            this.selection = this.material
          }
        })
      })
    },
    onRequest () {
      const user = JSON.parse(LocalStorage.getItem('user'))
      const matReq = db.collection('material_requests').doc(this.activeJob)
      const schedRef = db.collection('scheduled_jobs').where('jobId', '==', this.activeJob)

      matReq.set({
        material: this.selection,
        foreId: user.uid,
        foreman: this.foreman,
        category: this.editedItem.category,
        jobId: this.editedItem.jobId,
        status: 'for Approval'
      },
      { merge: true })
        .then(
          schedRef.get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              doc.ref.update({
                materials: this.selection
              })
            })
          }),
          location.reload(),
          this.$q.notify({
            color: 'secondary',
            message: 'Request Sent'
          })
        )
        .catch(error => {
          console.error('Error sending request: ', error)
        })
    },
    toEditSW (item, jobId) {
      this.showSchedWorkDataLoading()
      this.sched_dialog = true
      this.editedItem = Object.assign({}, item)
      this.activeJob = this.editedItem.jobId
      this.activeCat = this.editedItem.category

      const workers = db.collection('worker_list').where('area', '==', this.activeCat)
      workers.get().then(querySnapshot => {
        querySnapshot.forEach(doc => {
          const data = {
            workerId: doc.data().workerId,
            worker: doc.data().name,
            position: doc.data().position
          }
          this.workers.push(data)
        })
      })
      const user = JSON.parse(LocalStorage.getItem('user'))
      const schedRef = db.collection('scheduled_jobs').where('foreId', '==', user.uid)

      schedRef.get().then(querySnapshot => {
        querySnapshot.forEach(doc => {
          const jobId = doc.data().jobId
          if (this.activeJob === jobId) {
            this.schedWork = Object.assign({}, doc.data())
          }
          this.events.push(date.formatDate(doc.data().date, 'YYYY/MM/DD'))
        })
      })
      this.schedWork = []
    },
    onSave () {
      const onRef = db.collection('ongoing_jobs').where('jobId', '==', this.activeJob)
      const schedRef = db.collection('scheduled_jobs').doc(this.activeJob)
      const user = JSON.parse(LocalStorage.getItem('user'))

      if (this.schedWork.date !== undefined) {
        if (this.schedWork.date !== '' && this.schedWork.title === 'Inspection') {
          this.status = 'for inspection on ' + this.schedWork.date
          this.schedWork.details = []
          onRef.get().then(querySnapshot => {
            querySnapshot.forEach(doc => {
              doc.ref.update({
                status: this.status,
                bgcolor: 'purple-14'
              })
            })
          })
            .then(
              schedRef.set({
                jobId: this.editedItem.jobId,
                foreId: user.uid,
                foreman: this.editedItem.foreman,
                date: this.schedWork.date,
                title: this.schedWork.title,
                details: this.schedWork.details,
                bgcolor: 'purple-14',
                icon: 'fact_check',
                location: this.editedItem.location,
                unit: this.editedItem.unit,
                requestor: this.editedItem.requestor,
                description: this.editedItem.description
              },
              { merge: true }),
              location.reload(),
              this.$q.notify({
                color: 'secondary',
                message: 'Status updated'
              })
            )
            .catch(error => {
              console.error('Error updating job: ', error)
            })
        } else if (this.schedWork.date !== '' && this.schedWork.title === 'Implementation') {
          this.status = 'for implementation on ' + this.schedWork.date
          onRef.get().then(querySnapshot => {
            querySnapshot.forEach(doc => {
              doc.ref.update({
                status: this.status,
                bgcolor: 'green-14'
              })
            })
          })
            .then(
              schedRef.set({
                jobId: this.editedItem.jobId,
                foreId: user.uid,
                foreman: this.editedItem.foreman,
                date: this.schedWork.date,
                title: this.schedWork.title,
                details: this.schedWork.details,
                bgcolor: 'green-14',
                icon: 'gavel',
                location: this.editedItem.location,
                unit: this.editedItem.unit,
                requestor: this.editedItem.requestor,
                description: this.editedItem.description
              },
              { merge: true }),
              location.reload(),
              this.$q.notify({
                color: 'secondary',
                message: 'Status updated'
              })
            )
            .catch(error => {
              console.error('Error updating job: ', error)
            })
        }
      } else {
        this.$refs.sel.validate()
      }
    },
    badgeClasses (event, type) {
      const cssColor = this.isCssColor(event.bgcolor)
      const isHeader = type === 'header'
      return {
        [`bg-${event.bgcolor}`]: !cssColor,
        'full-width': !isHeader && (!event.side || event.side === 'full'),
        'left-side': !isHeader && event.side === 'left',
        'right-side': !isHeader && event.side === 'right'
      }
    },
    isCssColor (color) {
      return !!color && !!color.match(/^(#|(rgb|hsl)a?\()/)
    }
  }
}
</script>

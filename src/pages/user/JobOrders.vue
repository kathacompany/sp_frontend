<template>
  <q-layout view="hHh lpR fFf">
    <q-page-container>
        <q-page class="window-height window-width row justify-center">
          <div class="q-gutter-sm flex text-center">
            <div style="width: 100%; height: 50%;">
              <h5 class="text-weight-light">JOB ORDER REQUESTS</h5> {{ date }}<br><br>
              <q-input v-if="jobs.length || pending.length || ongoing.length || complete.length" outlined clearable color="secondary" dense debounce="300" v-model="filter" placeholder="Search by Category">
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
                  <q-tab name="tab 3" label="Tab 3" />
                </q-tabs>

                <q-separator />

                <q-tab-panels v-model="tab" animated>
                  <q-tab-panel name="tab 1">
                    <div style="width: 100%;">
                      <q-banner v-if="!jobs.length" class="bg-grey-2 q-pa-md" style="min-width: 800px; height: 150px">
                        <template v-slot:avatar>
                          <q-icon name="event_busy" color="accent" />
                        </template>
                       <span class="text-h6 text-grey text-weight-thin">No Filed Request!</span>
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

                              <q-dialog v-model="edit_dialog" persistent transition-show="rotate" transition-hide="rotate">
                                <q-card style="width: 350px">
                                  <q-bar class="bg-secondary text-white" style="height: 60px">
                                    <div class="text-h6 text-weight-light">Edit Job Request</div>
                                    <q-space />
                                    <q-btn icon="close" flat round dense v-close-popup />
                                  </q-bar>
                                  <q-card-section>
                                  <q-input outlined dense ref="date" color="accent" v-model="editedItem.date" mask="date" placeholder="Date Filed" lazy-rules :rules="[val => val !== null && val !== '' && val !== undefined || 'Input is required']">
                                    <template v-slot:append>
                                      <q-icon name="today" class="cursor-pointer"/>
                                      <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                                        <q-date v-model="editedItem.date" @input="() => $refs.qDateProxy.hide()"/>
                                      </q-popup-proxy>
                                    </template>
                                    </q-input>
                                    <q-select outlined dense class="q-pa-xs"  ref="category" color="accent" v-model="editedItem.category" :options="options" label="Category" lazy-rules :rules="[val => val !== null && val !== '' && val !== undefined || 'Input is required']"/>
                                    <q-input class="q-pa-xs" outlined dense clearable ref="description" color="accent" type="textarea" autogrow v-model="editedItem.description" label="Description" lazy-rules :rules="[val => val !== null && val !== '' && val !== undefined || 'Input is required']"/>
                                    <q-input class="q-pa-xs" outlined dense clearable ref="unit" color="accent" v-model="editedItem.unit" label="Requesting Unit" lazy-rules :rules="[val => val !== null && val !== '' && val !== undefined || 'Input is required']"/>
                                    <q-input class="q-pa-xs" outlined dense clearable ref="location" color="accent" v-model="editedItem.location" label="Location" lazy-rules :rules="[val => val !== null && val !== '' && val !== undefined || 'Input is required']"/>
                                    <q-input class="q-pa-xs" outlined dense clearable ref="telephone" color="accent" mask="(###) ### - ####" fill-mask v-model="editedItem.telephone" label="Telephone" lazy-rules :rules="[val => val !== null && val !== '' && val !== undefined || 'Input is required']"/>

                                  </q-card-section>
                                  <q-card-actions class="justify-center">
                                    <q-btn no-caps @click="updateJob" color="secondary"  class="text-weight-light"  label="Save Changes"/>
                                  </q-card-actions>
                                </q-card>
                              </q-dialog>

                              <q-btn flat dense icon="delete" color="accent" @click="toDelete(props.row.id)">
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
                      <q-banner v-if="!pending.length" class="bg-grey-2 q-pa-md" style="min-width: 800px; height: 150px">
                        <template v-slot:avatar>
                          <q-icon name="event_busy" color="accent" />
                        </template>
                       <span class="text-h6 text-grey text-weight-thin">No Pending Request!</span>
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

                  </q-tab-panel>

                  <q-tab-panel name="tab 2">
                    <div style="width: 100%;">
                      <q-banner v-if="!rejected.length" class="bg-grey-2 q-pa-md" style="min-width: 800px; height: 150px">
                        <template v-slot:avatar>
                          <q-icon name="event_busy" color="accent" />
                        </template>
                      <span class="text-h6 text-grey text-weight-thin">No Rejected Request!</span>
                      </q-banner>
                      <q-table
                        title="Rejected"
                        class="my-sticky-column-table"
                        v-else
                        dense
                        :separator="separator"
                        :data="rejected"
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
                              <q-btn flat dense icon="edit" color="secondary" @click="toEditRej(props.row)"/>

                              <q-dialog v-model="edit_dialog" persistent transition-show="rotate" transition-hide="rotate">
                                <q-card style="width: 350px">
                                  <q-bar class="bg-secondary text-white" style="height: 60px">
                                    <div class="text-h6 text-weight-light">Edit Job Request</div>
                                    <q-space />
                                    <q-btn icon="close" flat round dense v-close-popup />
                                  </q-bar>
                                  <q-card-section>
                                    <q-input outlined dense ref="date" color="accent" v-model="editedItem.date" mask="date" placeholder="Date Filed" lazy-rules :rules="[val => val !== null && val !== '' && val !== undefined || 'Input is required']">
                                    <template v-slot:append>
                                      <q-icon name="today" class="cursor-pointer"/>
                                      <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                                        <q-date v-model="editedItem.date" @input="() => $refs.qDateProxy.hide()"/>
                                      </q-popup-proxy>
                                    </template>
                                    </q-input>
                                    <q-select outlined dense class="q-pa-xs"  ref="category" color="accent" v-model="editedItem.category" :options="options" label="Category" lazy-rules :rules="[val => val !== null && val !== '' && val !== undefined || 'Input is required']"/>
                                    <q-input class="q-pa-xs" outlined dense clearable ref="description" color="accent" type="textarea" autogrow v-model="editedItem.description" label="Description" lazy-rules :rules="[val => val !== null && val !== '' && val !== undefined || 'Input is required']"/>
                                    <q-input class="q-pa-xs" outlined dense clearable ref="unit" color="accent" v-model="editedItem.unit" label="Requesting Unit" lazy-rules :rules="[val => val !== null && val !== '' && val !== undefined || 'Input is required']"/>
                                    <q-input class="q-pa-xs" outlined dense clearable ref="location" color="accent" v-model="editedItem.location" label="Location" lazy-rules :rules="[val => val !== null && val !== '' && val !== undefined || 'Input is required']"/>
                                    <q-input class="q-pa-xs" outlined dense clearable ref="telephone" color="accent" mask="(###) ### - ####" fill-mask v-model="editedItem.telephone" label="Telephone" lazy-rules :rules="[val => val !== null && val !== '' && val !== undefined || 'Input is required']"/>

                                  </q-card-section>
                                  <q-card-actions class="justify-center">
                                    <q-btn no-caps @click="atSend" color="secondary"  class="text-weight-light"  label="Send Changes"/>
                                  </q-card-actions>
                                </q-card>
                              </q-dialog>

                              <q-btn flat dense icon="delete" color="accent" @click="toDelRej(props.row.id)">
                                <q-space/>
                              </q-btn>
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
                    <br>
                    <br>

                    <div style="width: 100%;">
                      <q-banner v-if="!attested.length" class="bg-grey-2 q-pa-md" style="min-width: 800px; height: 150px">
                        <template v-slot:avatar>
                          <q-icon name="event_busy" color="accent" />
                        </template>
                      <span class="text-h6 text-grey text-weight-thin">No Request!</span>
                      </q-banner>
                      <q-table
                        title="Confirmations"
                        class="my-sticky-column-table"
                        v-else
                        dense
                        :data="attested"
                        :columns="atCol"
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
                              <div class="text-left"><span class="text-italic text-accent">Findings</span><br/>{{ props.row.findings}}</div><br/>
                              <div class="text-left"><span class="text-italic text-accent">Recommendations</span><br>{{ props.row.rec}}</div><br>
                              <div class="text-left"><span class="text-italic text-accent">Action</span><br/>{{ props.row.action}}</div>
                            </q-td>
                          </q-tr>
                        </template>
                      </q-table>
                      <q-btn no-caps icon="thumb_up_alt" label="Confirm" class="q-ma-sm text-weight-light bg-secondary text-white"  v-if="selected.length" @click="confirm=true"/>

                      <q-dialog v-model="confirm" persistent>
                        <q-card>
                          <q-card-section class="row items-center">
                            <div class="text-h6">Confirm Completion</div>
                          </q-card-section>
                          <q-card-section>
                            <span class="q-ma-sm">Approve {{selected.length}} selected <span v-if="selected.length>1">requests</span><span v-else>request</span>?</span>
                          </q-card-section>

                          <q-card-actions align="right">
                            <q-btn flat label="No" color="accent" v-close-popup />
                            <q-btn flat label="Yes" color="secondary" @click="onConfirm" v-close-popup/>
                          </q-card-actions>
                        </q-card>
                      </q-dialog>
                    </div>
                    </q-tab-panel>

                    <q-tab-panel name="tab 3">
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
    left: 0
    z-index: 1
</style>

<script>
import { LocalStorage, date } from 'quasar'
import { db } from 'boot/firebase'

export default {
  data () {
    return {
      expanded: [],
      separator: 'cell',
      tab: 'tab 1',
      dense: false,
      confirm: false,
      edit_dialog: false,
      filter: '',
      selected: [],
      jobs: [],
      pending: [],
      ongoing: [],
      rejected: [],
      attested: [],
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
        { name: 'foreman', field: 'foreman', align: 'left', label: 'Foreman' },
        { name: 'status', field: 'status', align: 'left', label: 'Status' }
      ],
      atCol: [
        { name: 'id', field: 'jobId', align: 'left', label: 'Job Id' },
        { name: 'date', field: 'date', align: 'left', label: 'Date Sent' },
        { name: 'foreman', field: 'foreman', align: 'left', label: 'Foreman' },
        { name: 'status', field: 'status', align: 'left', label: 'Status' }
      ]
    }
  },
  created () {
    const jobRef = db.collection('job_orders').orderBy('date')
    const penRef = db.collection('pending_jobs').orderBy('date')
    const onRef = db.collection('ongoing_jobs').orderBy('date')
    const atRef = db.collection('attested_jobs').orderBy('date')
    const rejRef = db.collection('rejected_jobs').orderBy('date')
    const comRef = db.collection('complete_jobs').orderBy('date')
    const user = JSON.parse(LocalStorage.getItem('user'))
    const useRef = db.collection('account').where('userId', '==', user.uid)
    useRef.get().then(querySnapshot => {
      querySnapshot.forEach(doc => {
        this.requestor = doc.data().fullname
      })
    })
    atRef.get().then(querySnapshot => {
      querySnapshot.forEach(doc => {
        const data = {
          id: doc.id,
          jobId: doc.data().jobId,
          info: doc.data().info,
          rec: doc.data().rec,
          action: doc.data().action,
          findings: doc.data().findings,
          date: doc.data().date,
          foreman: doc.data().foreman,
          status: doc.data().status
        }
        this.attested.push(data)
      })
    })
    rejRef.get().then(querySnapshot => {
      querySnapshot.forEach(doc => {
        const data = {
          id: doc.id,
          jobId: doc.data().jobId,
          category: doc.data().category,
          unit: doc.data().unit,
          location: doc.data().location,
          description: doc.data().description,
          date: doc.data().date,
          telephone: doc.data().telephone,
          foreman: doc.data().foreman,
          requestor: doc.data().requestor,
          status: doc.data().status
        }
        this.rejected.push(data)
      })
    })
    comRef.get().then(querySnapshot => {
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
        this.complete.push(data)
      })
    })
    jobRef.get().then(querySnapshot => {
      querySnapshot.forEach(doc => {
        const data = {
          id: doc.data().jobId,
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
      if (this.editedItem.date === '' || this.editedItem.category === '' || this.editedItem.telephone === '' || this.editedItem.location === '' || this.editedItem.description === '' || this.editedItem.unit === '' || this.editedItem.date === undefined || this.editedItem.category === undefined || this.editedItem.telephone === undefined || this.editedItem.location === undefined || this.editedItem.description === undefined || this.editedItem.unit === undefined || this.editedItem.date === null || this.editedItem.category === null || this.editedItem.telephone === null || this.editedItem.location === null || this.editedItem.description === null || this.editedItem.unit === null) {
        this.$refs.date.validate()
        this.$refs.category.validate()
        this.$refs.description.validate()
        this.$refs.unit.validate()
        this.$refs.location.validate()
        this.$refs.telephone.validate()
      } else {
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
      }
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
    },
    toDelRej (id) {
      this.$q.dialog({
        title: 'Delete Confirm',
        message: 'The rejected job will be deleted forever. Are you sure you want to continue?',
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
          await db.collection('rejected_jobs').doc(id).delete()
          this.$q.notify({
            color: 'accent',
            message: 'Job deleted'
          })
          location.reload()
        } catch (error) {
          console.log('Error cancelling job', error)
        }
      })
    },
    async onConfirm () {
      const comRef = db.collection('complete_jobs')
      const atRef = db.collection('attested_jobs')
      this.status = 'Certified by ' + this.requestor

      Object.keys(this.selected).forEach(doc => {
        comRef.add({
          job: this.selected[doc].jobId,
          info: this.selected[doc].info,
          rec: this.selected[doc].rec,
          action: this.selected[doc].action,
          findings: this.selected[doc].findings,
          confirmed: this.selected[doc].date,
          conducted: this.selected[doc].foreman,
          certified: this.status
        })
          .then(
            atRef.doc(this.selected[doc].id).delete(),
            this.$q.notify({
              color: 'secondary',
              message: 'Forwarded Successfully'
            }),
            location.reload()
          )
      })
    },
    toEditRej (item, id) {
      this.edit_dialog = true
      this.editedItem = Object.assign({}, item)
      this.activeJob = this.editedItem.jobId
    },
    async atSend () {
      const jobRef = db.collection('job_orders')
      const rejRef = db.collection('rejected_jobs').where('jobId', '==', this.activeJob)
      const user = JSON.parse(LocalStorage.getItem('user'))

      if (this.editedItem.date === '' || this.editedItem.category === '' || this.editedItem.telephone === '' || this.editedItem.location === '' || this.editedItem.description === '' || this.editedItem.unit === '' || this.editedItem.date === undefined || this.editedItem.category === undefined || this.editedItem.telephone === undefined || this.editedItem.location === undefined || this.editedItem.description === undefined || this.editedItem.unit === undefined || this.editedItem.date === null || this.editedItem.category === null || this.editedItem.telephone === null || this.editedItem.location === null || this.editedItem.description === null || this.editedItem.unit === null) {
        this.$refs.date.validate()
        this.$refs.category.validate()
        this.$refs.description.validate()
        this.$refs.unit.validate()
        this.$refs.location.validate()
        this.$refs.telephone.validate()
      } else {
        jobRef.add({
          userId: user.uid,
          status: 'changed! for Unit Head approval',
          jobId: this.editedItem.jobId,
          category: this.editedItem.category,
          date: this.editedItem.date,
          telephone: this.editedItem.telephone,
          unit: this.editedItem.unit,
          location: this.editedItem.location,
          description: this.editedItem.description,
          requestor: this.editedItem.requestor,
          foreman: this.editedItem.foreman
        })
          .then(doc => {
            rejRef.get().then((querySnapshot) => {
              querySnapshot.forEach((doc) => {
                doc.ref.delete()
              })
            })
            location.reload()
            this.$q.notify({
              color: 'secondary',
              message: 'Forwarded Successfully'
            })
          })
          .catch(error => {
            console.error('Error fowarding job order: ', error)
          })
      }
    }
  }
}
</script>

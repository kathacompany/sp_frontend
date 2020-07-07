<template>
  <q-layout view="hHh lpR fFf">
    <q-page-container>
        <q-page class="window-height window-width row justify-center">
          <div class="q-gutter-sm flex text-center">
            <div style="width: 100%; height: 50%;">
              <h5 class="text-weight-light">JOB ORDER REQUESTS</h5> {{ date }}<br><br>
              <q-input v-if="ongoing.length || complete.length" outlined clearable color="secondary" dense debounce="300" v-model="filter" placeholder="Search by Requesting Unit">
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>
              <br>
              <div style="width: 100%;">
                 <q-banner v-if="!ongoing.length" class="bg-grey-2 q-pa-md" style="min-width: 800px; height: 150px">
                  <template v-slot:avatar>
                    <q-icon name="event_busy" color="accent" />
                  </template>
                 <span class="text-h6 text-grey text-weight-thin">No Job Request!</span>
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
                                <div>
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
                                  outlined
                                  dense
                                  v-if="schedWork.title==='Implementation'"
                                  clearable
                                  color="accent"
                                  v-model="schedWork.details"
                                  use-input
                                  use-chips
                                  multiple
                                  options-dense
                                  ref="selWork"
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
                                <q-btn no-caps class="text-weight-light" label="Save Changes" color="secondary" @click="onSave"/>
                              </q-card-actions>
                            </q-card>
                          </q-dialog>

                        <q-btn flat dense icon="shopping_cart" color="secondary"  @click="toEditM(props.row)"/>
                        <q-dialog persistent transition-show="rotate" transition-hide="rotate" v-model="mat_dialog">
                            <q-card style="width: 400px">
                              <q-bar class="bg-secondary text-white" style="height: 60px">
                                <div class="text-weight-light">Request Materials -- {{ editedItem.jobId }}</div>
                                  <q-space />
                                <q-btn flat icon="close" round dense v-close-popup />
                              </q-bar>
                              <q-card-section>
<<<<<<< HEAD
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
                                <q-input class="q-pa-xs" outlined dense clearable color="accent" v-model="editedItem.status"  label="Status" />
                                <!-- <q-select class="q-pa-xs" outlined dense clearable color="accent" v-model="editedItem.status" :options="statusOptions" label="Status" /> -->
                                {{ status }}
=======
                                 <q-select
                                  outlined
                                  dense
                                  clearable
                                  color="accent"
                                  v-model="material.name"
                                  use-input
                                  use-chips
                                  options-dense
                                  ref="selMat"
                                  multiple
                                  option-label="name"
                                  option-value="materials"
                                  label="Search Material"
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
                                <div v-if="material.name">
                                  <q-input outlined dense color="accent" v-model="material.request" clearable label="Enter Quantity Needed" type="number"/>
                                </div>
                              </q-card-section>
                              <q-card-actions align="center">
                                <q-btn no-caps class="text-weight-light" label="Send Request" color="secondary" @click="onRequest(props.row)"/>
                              </q-card-actions>
                            </q-card>
                          </q-dialog>

                        <q-btn flat dense icon="assignment_turned_in" color="secondary" @click="toEditC(props.row)"/>

                         <q-dialog persistent transition-show="rotate" transition-hide="rotate" v-model="comp_dialog">
                            <q-card style="width: 700px;">
                              <q-bar class="bg-secondary text-white" style="height: 60px">
                                <div class="text-weight-light">Job Report for Job --- {{ editedItem.jobId }}</div>
                                  <q-space />
                                <q-btn flat icon="close" round dense v-close-popup />
                              </q-bar>
                             <q-card-section>
                              <div class="text-center text-weight-light">{{ date }}</div><br>
                              <div class="text-weight-light">Requested By:  {{ editedItem.requestor }}</div>
                              <div class="text-weight-light">Unit:  {{ editedItem.unit }}</div>
                              <div class="text-weight-light">Unit:  {{ editedItem.category }}</div><br>
                                <q-input
                                  outlined
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
                                  ref="description"
                                  clearable
                                  color="accent"
                                  v-model="rec"
                                  label="Recommendations"
                                  lazy-rules
                                  :rules="[ val => val !== null && val !== '' || 'Input is required']"/>
                                <q-input
                                  outlined
                                  ref="description"
                                  clearable
                                  color="accent"
                                  v-model="action"
                                  label="Action Taken"
                                  lazy-rules
                                  :rules="[ val => val !== null && val !== '' || 'Input is required']"/>
>>>>>>> 8627e025ebd2ffb424cbfcd2e63cb983ad363a8f
                              </q-card-section>
                              <q-card-actions align="center">
                                <q-btn no-caps class="text-weight-light" label="Send Job for Completion" color="secondary" @click="onSubmit"/>
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
<<<<<<< HEAD
                 <q-banner v-if="!forImplementation.length" class="bg-red-1 q-pa-md" style="min-width: 800px">
                  <template v-slot:avatar>
                    <q-icon name="event_busy" color="accent" />
                  </template>
                  No For Implementation request!
                </q-banner>

                <q-table
                  class="my-sticky-column-table"
                  v-else
                  dense
                  :data="forImplementation"
                  :columns="column"
                  row-key="jobId"
                  :filter="filter"
                  :separator="separator"
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
                        <q-btn flat dense icon="hourglass_full" color="secondary" @click="toEdit(props.row)"/>

                           <q-dialog v-model="edit_dialog">
                            <q-card style="width: 100%;">
                              <q-card-section class="row items-center q-pb-none">
                                <div class="text-h6">Schedule Job</div>
                                <q-space />
                                <q-btn color="accent" icon="close" flat round dense v-close-popup />
                              </q-card-section>

                              <!-- <q-input class="q-pa-xs" outlined dense clearable color="accent" mask="(###) ### - ####" fill-mask v-model="editedItem.telephone" label="Telephone" :disable="disable"/> -->
                              <q-card-section>
                                <text-h6 class="text-italic text-accent"> Implementation Date: </text-h6> {{ editedItem.date }} <br/>
                                <text-h6 class="text-italic text-accent"> Category: </text-h6> {{ editedItem.category }} <br/>
                                <text-h6 class="text-italic text-accent"> Description: </text-h6> {{ editedItem.description }} <br/>
                                <text-h6 class="text-italic text-accent"> Requesting Unit: </text-h6> {{ editedItem.unit }} <br/>
                                <text-h6 class="text-italic text-accent"> Location: </text-h6> {{ editedItem.location }} <br/>
                                <text-h6 class="text-italic text-accent"> Telephone Number: </text-h6> {{ editedItem.telephone }} <br/>
                              </q-card-section>

                              <q-card-section>
                                <q-select class="q-pa-xs" outlined dense clearable color="accent" v-model="editedItem.status" :options="statusOptions" label="Status" :disable="disable"/>
                                <br/>
                                <q-table
                                  title="Available Electricity Workers"
                                  :data="workers"
                                  :columns="workersColumn"
                                  class="my-sticky-column-table"
                                  row-key="name"
                                  :selected-rows-label="getSelectedWorkers"
                                  selection="multiple"
                                  :selected.sync="selectedWorkers"
                                  :separator="separator"
                                  hide-bottom
                                  dense
                                >
                                <template v-slot:header="props">
                                <q-tr :props="props">
                                  <!-- <q-th key="selected">
                                    <q-checkbox dense color="secondary" v-model="props.selected"/>
                                  </q-th> -->
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
                                <q-tr class="cursor-pointer" :props="props" @click.native="props.selected = !props.selected">
                                <!-- <q-tr :props="props">
                                <q-td>
                                  <q-checkbox dense color="secondary" v-model="props.selected"/>
                                </q-td> -->
                                  <q-td
                                    v-for="col in props.cols"
                                    :key="col.name"
                                    :props="props"
                                  >
                                    {{ col.value }}
                                  </q-td>
                                </q-tr>
                              </template>
                              </q-table>
                                <div class="q-mt-md">
                                  Selected: {{ JSON.stringify(selectedWorkers) }}
                                </div>
                              </q-card-section>

                              <q-card-section>
                              <q-table
                                  title="Available Electricity Materials"
                                  :data="materials"
                                  :columns="materialsColumn"
                                  class="my-sticky-column-table"
                                  row-key="name"
                                  :selected-rows-label="getSelectedMaterials"
                                  selection="multiple"
                                  :selected.sync="selectedMaterials"
                                  :separator="separator"
                                  hide-bottom
                                  dense
                                >

                                <template v-slot:header="props">
                                <q-tr :props="props">
                                  <!-- <q-th key="selected">
                                    <q-checkbox dense color="secondary" v-model="props.selected"/>
                                  </q-th> -->
                                  <q-th
                                    v-for="col in props.cols"
                                    :key="col.name"
                                    :props="props"
                                    class="text-italic text-accent"
                                  >
                                    {{ col.label }}
                                  </q-th>
                                <q-th>
                                  <span class="text-italic text-accent">Input quantity to request</span>
                                </q-th>
                                </q-tr>
                              </template>

                              <template v-slot:body="props">
                                <q-tr class="cursor-pointer" :props="props" @click.native="props.selected = !props.selected">
                                <!-- <q-tr :props="props">
                                <q-td>
                                  <q-checkbox dense color="secondary" v-model="props.selected"/>
                                </q-td> -->
                                  <q-td
                                    v-for="col in props.cols"
                                    :key="col.name"
                                    :props="props"
                                  >
                                    {{ col.value }}
                                  </q-td>
                                  <q-td>
                                    {{ props.row.reqQuantity }}
                                    <q-popup-edit v-model.number="props.row.reqQuantity">
                                      <q-input type="number" v-model.number="props.row.reqQuantity" dense autofocus />
                                  </q-popup-edit>
                                  </q-td>
                                </q-tr>
                              </template>

                              </q-table>
                                <div class="q-mt-md">
                                  Selected: {{ JSON.stringify(selectedMaterials) }}
                                </div>
                              </q-card-section>

                              <q-card-actions class="justify-center q-pa-xs">
                                <q-btn no-caps @click="requestMaterial(selected, selectedMaterials)" color="secondary" label="Request Materials" v-close-popup/>
                                <!-- <q-btn no-caps @click="updateJob" color="secondary" label="Update Status" v-close-popup/> -->
                              </q-card-actions>
                            </q-card>
                          </q-dialog>
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
              <br/>
              <br/>

              <div style="width: 100%;">
                <q-banner v-if="!complete.length" class="bg-red-1 q-pa-md">
=======
                <q-banner v-if="!complete.length" class="bg-grey-2 q-pa-md" style="min-width: 800px; height: 150px">
>>>>>>> 8627e025ebd2ffb424cbfcd2e63cb983ad363a8f
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
                        <div class="text-left"><span class="text-italic text-accent">Unit Requestor</span><br>{{ props.row.requestor}}</div>
                        <div class="text-left"><span class="text-italic text-accent">Unit Head</span><br>{{ props.row.head}}</div>
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
import { LocalStorage, date } from 'quasar'
import { firebaseAuth, db } from 'boot/firebase'
<<<<<<< HEAD
export default {
  data () {
    return {
      matReqStatus: 'Pending',
      reqQuantity: '',
      selectedMaterials: [],
      selectedWorkers: [],
      data: [],
      quantity: '',
      forImplementation: [],
=======

const stringOptions = []
const stringMat = []

export default {
  data () {
    return {
      action: '',
      findings: '',
      rec: '',
>>>>>>> 8627e025ebd2ffb424cbfcd2e63cb983ad363a8f
      separator: 'cell',
      filter: '',
      dense: false,
      visible: false,
      showSimulatedReturnData: false,
      comp_dialog: false,
      sched_dialog: false,
      mat_dialog: false,
      editQ_dialog: false,
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
<<<<<<< HEAD
      workers: [],
      workersColumn: [
        { name: 'name', field: 'name', align: 'left', label: 'Name' }
      ],
      materials: [],
      materialsColumn: [
        { name: 'name', field: 'name', align: 'left', label: 'Name' },
        { name: 'quantity', field: 'quantity', align: 'left', label: 'Quantity' }
      ],
      options: [
        'Plumbing', 'Electricity', 'Grounds', 'Transportation'
      ],
      requestor: null,
      head: null,
      statusOptions: ['For Inspection', 'For Implementation'],
=======
      events: [],
      workers: stringOptions,
      schedWork: {
        date: '',
        details: '',
        title: ''
      },
      quantity: '',
      materials: stringMat,
      material: {
        name: '',
        request: ''
      },
      matCol: [
        { name: 'material', field: 'material', align: 'left', label: 'Material Name' },
        { name: 'stockNo', field: 'matId', align: 'left', label: 'Material Id' },
        { name: 'description', field: 'description', align: 'left', label: 'Description' },
        { name: 'quantity', field: 'quantity', align: 'left', label: 'Remaining Quantity' }
      ],
>>>>>>> 8627e025ebd2ffb424cbfcd2e63cb983ad363a8f
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
<<<<<<< HEAD
    // let jobRef = db.collection('job_orders').orderBy('date')
    // let penRef = db.collection('pending_jobs').orderBy('date')
    let onRef = db.collection('ongoing_jobs').orderBy('date')
    let comRef = db.collection('complete_jobs').orderBy('date')
    let workerRef = db.collection('worker_list')
    let matRef = db.collection('materials')

    workerRef.get().then(querySnapshot => {
      querySnapshot.forEach(doc => {
        const data = {
          id: doc.id,
          name: doc.data().name,
          area: doc.data().area
        }
        if (data.area === 'Electricity') {
          this.workers.push(data)
        }
      })
    })
    matRef.get().then(querySnapshot => {
      querySnapshot.forEach(doc => {
        const data = {
          id: doc.id,
          name: doc.data().name,
          category: doc.data().category,
          quantity: doc.data().quantity
        }
        if (data.category === 'Electricity') {
          this.materials.push(data)
        }
      })
    })
=======
    const user = JSON.parse(LocalStorage.getItem('user'))
    const useRef = db.collection('account').where('userId', '==', user.uid)
    useRef.get().then(querySnapshot => {
      querySnapshot.forEach(doc => {
        this.foreman = doc.data().fullname
        this.area = doc.data().category
      })
    })
    const materials = db.collection('materials')
    materials.get().then(querySnapshot => {
      querySnapshot.forEach(doc => {
        const data = {
          matId: doc.id,
          material: doc.data().name,
          description: doc.data().description,
          quantity: doc.data().quantity
        }
        this.materials.push(data.material)
        this.matId = data.matId
        this.name = data.material
      })
    })
    const workers = db.collection('worker_list')
    workers.get().then(querySnapshot => {
      querySnapshot.forEach(doc => {
        const data = {
          id: doc.id,
          worker: doc.data().name,
          position: doc.data().position
        }
        this.workers.push(data.worker + ' --- ' + data.position)
      })
    })
    const onRef = db.collection('ongoing_jobs')
>>>>>>> 8627e025ebd2ffb424cbfcd2e63cb983ad363a8f
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
        if (data.status !== 'For Implementation') {
          this.ongoing.push(data)
        } else {
          this.forImplementation.push(data)
        }
        this.userId = data.userId
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
    getVal (obj, key) {
      const inputValue = Object.values(obj)
      if (inputValue.length > 0) {
        this.material = Object.assign(key, inputValue)
      } else {
        this.material.delete()
      }
    },
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
        this.workers = stringOptions.filter(v => v.toLowerCase().indexOf(needle) > -1)
        this.$refs.selWork.setOptionIndex(0)
      })
    },
<<<<<<< HEAD
    getSelectedString () {
      return this.selected.length === 0 ? '' : `${this.selected.length} record${this.selected.length > 1 ? 's' : ''} selected of ${this.data.length}`
    },
    getSelectedMaterials () {
      return this.selected.length === 0 ? '' : `${this.selected.length} record${this.selected.length > 1 ? 's' : ''} selected of ${this.data.length}`
    },
    getSelectedWorkers () {
      return this.selected.length === 0 ? '' : `${this.selected.length} record${this.selected.length > 1 ? 's' : ''} selected of ${this.data.length}`
    },
    requestMaterial (selected, selectedMaterials) {
      var i
      let docref = db.collection('ongoing_jobs').doc(this.activeJob)
      let foreId = firebaseAuth.currentUser.uid
      let matReqRef = db.collection('material_request')
      this.getName()

      // docref.update({
      //   status: this.editedItem.status,
      //   foreId: foreId
      // })
      for (i = 0; i < selectedMaterials.length; i++) {
        matReqRef.add({
          matId: selectedMaterials[i].id,
          reqQuantity: selectedMaterials[i].reqQuantity,
          jobId: docref.id,
          foreId: foreId,
          status: this.matReqStatus
        })
          .then(
            this.$q.notify({
              color: 'secondary',
              message: 'Request Completed'
            })
          )
          .catch(error => {
            console.error('Error updating job: ', error)
          })
      }
      // for (i = 0; i < selected.length; i++) {
      //   docref.update({
      //     workerId: selected[i].id,
      //     workerName: selected[i].name
      //   })
      // }
      console.log('sucees')
      location.reload()
=======
    filterMat (val, update, abort) {
      update(() => {
        const needle = val.toLowerCase()
        this.materials = stringMat.filter(v => v.toLowerCase().indexOf(needle) > -1)
        this.$refs.selMat.setOptionIndex(0)
      })
>>>>>>> 8627e025ebd2ffb424cbfcd2e63cb983ad363a8f
    },
    onSubmit () {
      const onRef = db.collection('ongoing_jobs')
      const comRef = db.collection('complete_jobs')
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
          requestor: this.selected[doc].requestor,
          head: this.selected[doc].head,
          foreman: this.foreman,
          status: 'Job Completed',
          completion: this.date
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
<<<<<<< HEAD
    updateJob () {
      let foreId = firebaseAuth.currentUser.uid
      let docref = db.collection('ongoing_jobs').doc(this.activeJob)
      this.getName()
      console.log(this.editedItem.status)
      docref.update({
        status: this.editedItem.status,
        foreId: foreId
=======
    onRequest (item, id) {
      const user = JSON.parse(LocalStorage.getItem('user'))
      const matReq = db.collection('material_requests')
      this.editedItem = Object.assign({}, item)
      this.category = this.editedItem.category
      this.activeJob = this.editedItem.jobId

      matReq.add({
        foreId: user.uid,
        foreman: this.foreman,
        material: this.material.name,
        quantity: this.material.request,
        matId: this.matId,
        category: this.category,
        jobId: this.activeJob,
        status: 'Pending'
>>>>>>> 8627e025ebd2ffb424cbfcd2e63cb983ad363a8f
      })
        .then(
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
    onSave () {
      const onRef = db.collection('ongoing_jobs').doc(this.activeJob)
      const schedRef = db.collection('scheduled_jobs').doc(this.activeJob)
      const user = JSON.parse(LocalStorage.getItem('user'))

      if (this.schedWork.date !== undefined) {
        if (this.schedWork.date !== '' && this.schedWork.title === 'Inspection') {
          this.status = 'for inspection on ' + this.schedWork.date
          onRef.update({
            status: this.status
          })
            .then(
              schedRef.set({
                jobId: this.editedItem.jobId,
                foreId: user.uid,
                foreman: this.foreman,
                date: this.schedWork.date,
                title: this.schedWork.title,
                bgcolor: 'purple',
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
          onRef.update({
            status: this.status
          })
            .then(
              schedRef.set({
                jobId: this.editedItem.jobId,
                foreId: user.uid,
                foreman: this.foreman,
                date: this.schedWork.date,
                title: this.schedWork.title,
                details: this.schedWork.details,
                bgcolor: 'orange',
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
    toEditC (item, id) {
      this.comp_dialog = true
      this.editedItem = Object.assign({}, item)
    },
    toEditM (item, id) {
      this.mat_dialog = true
      this.editedItem = Object.assign({}, item)
      this.category = this.editedItem.category
      this.material = {}
    },
    toEditSW (item, id) {
      this.showSchedWorkDataLoading()
      this.sched_dialog = true
      this.editedItem = Object.assign({}, item)
      this.activeJob = this.editedItem.id

      const schedRef = db.collection('scheduled_jobs').orderBy('date')
      schedRef.get().then(querySnapshot => {
        querySnapshot.forEach(doc => {
          const activeSched = this.editedItem.jobId
          const jobId = doc.data().jobId
          if (activeSched === jobId) {
            this.schedWork = Object.assign({}, doc.data())
          }
          this.events.push(date.formatDate(doc.data().date, 'YYYY/MM/DD'))
        })
      })
      this.schedWork = []
    }
  }
}
</script>

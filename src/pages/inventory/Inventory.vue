<template>
  <q-layout view="hHh lpR fFf">
    <q-page-container>
        <q-page class="window-height window-width row justify-center">
          <div class="q-gutter-sm flex text-center">
            <div style="width: 100%; height: 50%;">
              <h5 class="text-weight-light">INVENTORY OF MATERIALS</h5><span class="text-weight-medium">{{ date }}</span><br><br>
              <q-input v-if="plumbingData.length || transportationData.length || groundsData.length || electricityData.length" outlined clearable color="secondary" dense debounce="300" v-model="filter" placeholder="Search">
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
                  <q-tab name="tab 1" label="Plumbing" icon="plumbing"/>
                  <q-tab name="tab 2" label="Electricity" icon="electrical_services"/>
                  <q-tab name="tab 3" label="Grounds" icon="construction"/>
                  <q-tab name="tab 4" label="Transportation" icon="commute"/>
                </q-tabs>

                <q-separator />

                <q-tab-panels v-model="tab" animated>
                  <q-tab-panel name="tab 1">

                  <div style="width: 100%;">
                  <q-banner v-if="!plumbingData.length" class="bg-grey-2 q-pa-md" style="min-width: 800px; height: 150px">
                    <template v-slot:avatar>
                      <q-icon name="sentiment_dissatisfied" color="accent" />
                    </template>
                  <span class="text-h6 text-grey text-weight-thin">No Records Found!</span>
                    <template v-slot:action>
                      <q-btn class="text-weight-light q-ma-sm" flat icon="add_box" color="secondary" label="Material" @click="add_dialog=true"/>
                    </template>
                  </q-banner>
                  <q-table
                    title="Plumbing Materials"
                    :table-style="'counter-reset: cssRowCounter '"
                    :data="plumbingData"
                    :columns="columns"
                    row-key="name"
                    :filter="filter"
                    :separator="separator"
                    v-else
                    dense
                  >
                    <template v-slot:top-right>
                      <q-btn
                        no-caps
                        unelevated
                        class="text-weight-light q-ma-sm"
                        icon="add_box"
                        color="secondary"
                        label="Material"
                        @click="add_dialog=true"
                      />
                      <q-btn
                        color="secondary"
                        icon="archive"
                        label="csv"
                        no-caps
                        flat
                        dense
                        @click="exportP"
                      />
                    </template>
                    <template v-slot:header="props">
                      <q-tr :props="props">
                        <q-th class="text-italic text-accent" auto-width>Stock ID</q-th>
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
                        <q-td><span class="text-secondary text-weight-bold rowNumber">-P</span></q-td>
                        <q-td
                          v-for="col in props.cols"
                          :key="col.name"
                          :props="props"
                        >
                          {{ col.value }}
                        </q-td>
                         <q-td>
                          <q-btn flat dense icon="edit" color="secondary" @click="toEdit(props.row)"/>
                        </q-td>
                      </q-tr>
                    </template>
                  </q-table>
                </div>

                <q-dialog v-model="add_dialog" persistent transition-show="rotate" transition-hide="rotate">
                  <q-card style="width: 350px">
                    <q-bar class="bg-secondary text-white" style="height: 60px">
                      <div class="text-h6 text-weight-light">Add Material</div>
                      <q-space />
                      <q-btn icon="close" flat round dense v-close-popup />
                    </q-bar>
                    <q-card-section>
                      <q-select outlined class="q-pa-xs" dense clearable color="accent" v-model="defaultItem.category" :options="options" label="Category" />
                      <q-input class="q-pa-xs" outlined dense clearable color="accent" v-model="defaultItem.name" label="Item" @input="val => { defaultItem.name = val.toLowerCase() }"/>
                      <q-input class="q-pa-xs" outlined dense clearable color="accent" v-model="defaultItem.description" label="Description" @input="val => { defaultItem.description = val.toLowerCase() }"/>
                      <q-input class="q-pa-xs" outlined dense clearable color="accent" v-model="defaultItem.unit" label="Unit of Measure" @input="val => { defaultItem.unit = val.toLowerCase() }"/>
                       <q-input class="q-pa-xs" outlined dense clearable color="accent" v-model="defaultItem.value" label="Unit Cost (PhP)" mask="#.##" fill-mask="0" reverse-fill-mask input-class="text-right"/>
                      <q-input class="q-pa-xs" outlined dense clearable color="accent" type="number" v-model="defaultItem.quantity" label="Quantity" />
                    </q-card-section>
                    <q-card-actions>
                      <q-btn no-caps unelevated class="full-width text-weight-light" @click="addMaterial" color="secondary" label="Add Material" v-close-popup/>
                    </q-card-actions>
                  </q-card>
                </q-dialog>

                <q-dialog v-model="edit_dialog" persistent transition-show="rotate" transition-hide="rotate">
                  <q-card style="width: 350px">
                    <q-bar class="bg-secondary text-white" style="height: 60px">
                      <div class="text-h6 text-weight-light">Edit Material</div>
                      <q-space />
                      <q-btn icon="close" flat round dense v-close-popup />
                    </q-bar>

                    <q-card-section>
                      <q-select outlined class="q-pa-xs" dense clearable color="accent" v-model="editedItem.category" :options="options" label="Category" />
                      <q-input class="q-pa-xs" outlined dense clearable color="accent" v-model="editedItem.name" label="Item" @input="val => { editedItem.name = val.toLowerCase() }"/>
                      <q-input class="q-pa-xs" outlined dense clearable color="accent" v-model="editedItem.description" label="Description" @input="val => { editedItem.description = val.toLowerCase() }"/>
                      <q-input class="q-pa-xs" outlined dense clearable color="accent" v-model="editedItem.unit" label="Unit of Measure" @input="val => { editedItem.unit = val.toLowerCase() }"/>
                      <q-input class="q-pa-xs" outlined dense clearable color="accent" v-model="editedItem.value" label="Unit Cost (PhP)" mask="#.##" fill-mask="0" reverse-fill-mask input-class="text-right"/>
                      <q-input class="q-pa-xs" outlined dense clearable color="accent" type="number" v-model="editedItem.quantity" label="Quantity" />
                    </q-card-section>
                    <q-card-actions>
                      <q-btn no-caps unelevated class="full-width text-weight-light" @click="updateMaterial" color="secondary" label="Save Changes" v-close-popup/>
                    </q-card-actions>
                  </q-card>
                </q-dialog>

              </q-tab-panel>

              <q-tab-panel name="tab 2">

                <div style="width: 100%;">
                  <q-banner v-if="!electricityData.length" class="bg-grey-2 q-pa-md" style="min-width: 800px; height: 150px">
                    <template v-slot:avatar>
                      <q-icon name="sentiment_dissatisfied" color="accent" />
                    </template>
                  <span class="text-h6 text-grey text-weight-thin">No Records Found!</span>
                    <template v-slot:action>
                      <q-btn class="text-weight-light q-ma-sm" flat icon="add_box" color="secondary" label="Material" @click="add_dialog=true"/>
                    </template>
                  </q-banner>
                  <q-table
                    title="Electricity Materials"
                    :table-style="'counter-reset: cssRowCounter '"
                    :data="electricityData"
                    :columns="columns"
                    row-key="name"
                    :filter="filter"
                    :separator="separator"
                    v-else
                    dense
                  >
                    <template v-slot:top-right>
                      <q-btn
                        no-caps
                        unelevated
                        class="text-weight-light q-ma-sm"
                        icon="add_box"
                        color="secondary"
                        label="Material"
                        @click="add_dialog=true"
                      />
                      <q-btn
                        color="secondary"
                        icon="archive"
                        label="csv"
                        no-caps
                        flat
                        dense
                        @click="exportE"
                      />
                    </template>
                    <template v-slot:header="props">
                      <q-tr :props="props">
                        <q-th class="text-italic text-accent" auto-width>Stock ID</q-th>
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
                        <q-td><span class="text-secondary text-weight-bold rowNumber">-E</span></q-td>
                        <q-td
                          v-for="col in props.cols"
                          :key="col.name"
                          :props="props"
                        >
                          {{ col.value }}
                        </q-td>
                         <q-td>
                          <q-btn flat dense icon="edit" color="secondary" @click="toEdit(props.row)"/>
                        </q-td>
                      </q-tr>
                    </template>
                  </q-table>
                </div>

                <q-dialog v-model="add_dialog" persistent transition-show="rotate" transition-hide="rotate">
                  <q-card style="width: 350px">
                    <q-bar class="bg-secondary text-white" style="height: 60px">
                      <div class="text-h6 text-weight-light">Add Material</div>
                      <q-space />
                      <q-btn icon="close" flat round dense v-close-popup />
                    </q-bar>
                    <q-card-section>
                      <q-select outlined class="q-pa-xs" dense clearable color="accent" v-model="defaultItem.category" :options="options" label="Category" />
                      <q-input class="q-pa-xs" outlined dense clearable color="accent" v-model="defaultItem.name" label="Item" @input="val => { defaultItem.name = val.toLowerCase() }"/>
                      <q-input class="q-pa-xs" outlined dense clearable color="accent" v-model="defaultItem.description" label="Description" @input="val => { defaultItem.description = val.toLowerCase() }"/>
                      <q-input class="q-pa-xs" outlined dense clearable color="accent" v-model="defaultItem.unit" label="Unit of Measure" @input="val => { defaultItem.unit = val.toLowerCase() }"/>
                       <q-input class="q-pa-xs" outlined dense clearable color="accent" v-model="defaultItem.value" label="Unit Cost (PhP)" mask="#.##" fill-mask="0" reverse-fill-mask input-class="text-right"/>
                      <q-input class="q-pa-xs" outlined dense clearable color="accent" type="number" v-model="defaultItem.quantity" label="Quantity" />
                    </q-card-section>
                    <q-card-actions>
                      <q-btn no-caps unelevated class="full-width text-weight-light" @click="addMaterial" color="secondary" label="Add Material" v-close-popup/>
                    </q-card-actions>
                  </q-card>
                </q-dialog>

                <q-dialog v-model="edit_dialog" persistent transition-show="rotate" transition-hide="rotate">
                  <q-card style="width: 350px">
                    <q-bar class="bg-secondary text-white" style="height: 60px">
                      <div class="text-h6 text-weight-light">Edit Material</div>
                      <q-space />
                      <q-btn icon="close" flat round dense v-close-popup />
                    </q-bar>

                    <q-card-section>
                      <q-select outlined class="q-pa-xs" dense clearable color="accent" v-model="editedItem.category" :options="options" label="Category"/>
                      <q-input class="q-pa-xs" outlined dense clearable color="accent" v-model="editedItem.name" label="Item" @input="val => { editedItem.name = val.toLowerCase() }"/>
                      <q-input class="q-pa-xs" outlined dense clearable color="accent" v-model="editedItem.description" label="Description" @input="val => { editedItem.description = val.toLowerCase() }"/>
                      <q-input class="q-pa-xs" outlined dense clearable color="accent" v-model="editedItem.unit" label="Unit of Measure" @input="val => { editedItem.unit = val.toLowerCase() }"/>
                      <q-input class="q-pa-xs" outlined dense clearable color="accent" v-model="editedItem.value" label="Unit Cost (PhP)" mask="#.##" fill-mask="0" reverse-fill-mask input-class="text-right"/>
                      <q-input class="q-pa-xs" outlined dense clearable color="accent" type="number" v-model="editedItem.quantity" label="Quantity" />
                    </q-card-section>
                    <q-card-actions>
                      <q-btn no-caps unelevated class="full-width text-weight-light" @click="updateMaterial" color="secondary" label="Save Changes" v-close-popup/>
                    </q-card-actions>
                  </q-card>
                </q-dialog>

              </q-tab-panel>

              <q-tab-panel name="tab 3">

                <div style="width: 100%;">
                  <q-banner v-if="!groundsData.length" class="bg-grey-2 q-pa-md" style="min-width: 800px; height: 150px">
                    <template v-slot:avatar>
                      <q-icon name="sentiment_dissatisfied" color="accent" />
                    </template>
                  <span class="text-h6 text-grey text-weight-thin">No Records Found!</span>
                    <template v-slot:action>
                      <q-btn class="text-weight-light q-ma-sm" flat icon="add_box" color="secondary" label="Material" @click="add_dialog=true"/>
                    </template>
                  </q-banner>
                  <q-table
                    title="Grounds Materials"
                    :table-style="'counter-reset: cssRowCounter '"
                    :data="groundsData"
                    :columns="columns"
                    row-key="name"
                    :filter="filter"
                    :separator="separator"
                    v-else
                    dense
                  >
                    <template v-slot:top-right>
                      <q-btn
                        no-caps
                        unelevated
                        class="text-weight-light q-ma-sm"
                        icon="add_box"
                        color="secondary"
                        label="Material"
                        @click="add_dialog=true"
                      />
                      <q-btn
                        color="secondary"
                        icon="archive"
                        label="csv"
                        no-caps
                        flat
                        dense
                        @click="exportG"
                      />
                    </template>
                    <template v-slot:header="props">
                      <q-tr :props="props">
                        <q-th class="text-italic text-accent" auto-width>Stock ID</q-th>
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
                        <q-td><span class="text-secondary text-weight-bold rowNumber">-G</span></q-td>
                        <q-td
                          v-for="col in props.cols"
                          :key="col.name"
                          :props="props"
                        >
                          {{ col.value }}
                        </q-td>
                         <q-td>
                          <q-btn flat dense icon="edit" color="secondary" @click="toEdit(props.row)"/>
                        </q-td>
                      </q-tr>
                    </template>
                  </q-table>
                </div>

                <q-dialog v-model="add_dialog" persistent transition-show="rotate" transition-hide="rotate">
                  <q-card style="width: 350px">
                    <q-bar class="bg-secondary text-white" style="height: 60px">
                      <div class="text-h6 text-weight-light">Add Material</div>
                      <q-space />
                      <q-btn icon="close" flat round dense v-close-popup />
                    </q-bar>
                    <q-card-section>
                      <q-select outlined class="q-pa-xs" dense clearable color="accent" v-model="defaultItem.category" :options="options" label="Category" />
                      <q-input class="q-pa-xs" outlined dense clearable color="accent" v-model="defaultItem.name" label="Item" @input="val => { defaultItem.name = val.toLowerCase() }"/>
                      <q-input class="q-pa-xs" outlined dense clearable color="accent" v-model="defaultItem.description" label="Description" @input="val => { defaultItem.description = val.toLowerCase() }"/>
                      <q-input class="q-pa-xs" outlined dense clearable color="accent" v-model="defaultItem.unit" label="Unit of Measure" @input="val => { defaultItem.unit = val.toLowerCase() }"/>
                       <q-input class="q-pa-xs" outlined dense clearable color="accent" v-model="defaultItem.value" label="Unit Cost (PhP)" mask="#.##" fill-mask="0" reverse-fill-mask input-class="text-right"/>
                      <q-input class="q-pa-xs" outlined dense clearable color="accent" type="number" v-model="defaultItem.quantity" label="Quantity" />
                    </q-card-section>
                    <q-card-actions>
                      <q-btn no-caps unelevated class="full-width text-weight-light" @click="addMaterial" color="secondary" label="Add Material" v-close-popup/>
                    </q-card-actions>
                  </q-card>
                </q-dialog>

                <q-dialog v-model="edit_dialog" persistent transition-show="rotate" transition-hide="rotate">
                  <q-card style="width: 350px">
                    <q-bar class="bg-secondary text-white" style="height: 60px">
                      <div class="text-h6 text-weight-light">Edit Material</div>
                      <q-space />
                      <q-btn icon="close" flat round dense v-close-popup />
                    </q-bar>

                    <q-card-section>
                      <q-select outlined class="q-pa-xs" dense clearable color="accent" v-model="editedItem.category" :options="options" label="Category" />
                      <q-input class="q-pa-xs" outlined dense clearable color="accent" v-model="editedItem.name" label="Item" @input="val => { editedItem.name = val.toLowerCase() }"/>
                      <q-input class="q-pa-xs" outlined dense clearable color="accent" v-model="editedItem.description" label="Description" @input="val => { editedItem.description = val.toLowerCase() }"/>
                      <q-input class="q-pa-xs" outlined dense clearable color="accent" v-model="editedItem.unit" label="Unit of Measure" @input="val => { editedItem.unit = val.toLowerCase() }"/>
                      <q-input class="q-pa-xs" outlined dense clearable color="accent" v-model="editedItem.value" label="Unit Cost (PhP)" mask="#.##" fill-mask="0" reverse-fill-mask input-class="text-right"/>
                      <q-input class="q-pa-xs" outlined dense clearable color="accent" type="number" v-model="editedItem.quantity" label="Quantity" />
                    </q-card-section>
                    <q-card-actions>
                      <q-btn no-caps unelevated class="full-width text-weight-light" @click="updateMaterial" color="secondary" label="Save Changes" v-close-popup/>
                    </q-card-actions>
                  </q-card>
                </q-dialog>

              </q-tab-panel>

              <q-tab-panel name="tab 4">

                <div style="width: 100%;">
                  <q-banner v-if="!transportationData.length" class="bg-grey-2 q-pa-md" style="min-width: 800px; height: 150px">
                    <template v-slot:avatar>
                      <q-icon name="sentiment_dissatisfied" color="accent" />
                    </template>
                  <span class="text-h6 text-grey text-weight-thin">No Records Found!</span>
                    <template v-slot:action>
                      <q-btn class="text-weight-light q-ma-sm" flat icon="add_box" color="secondary" label="Material" @click="add_dialog=true"/>
                    </template>
                  </q-banner>
                  <q-table
                    title="Transportation Materials"
                    :table-style="'counter-reset: cssRowCounter '"
                    :data="transportationData"
                    :columns="columns"
                    row-key="name"
                    :filter="filter"
                    :separator="separator"
                    v-else
                    dense
                  >
                    <template v-slot:top-right>
                      <q-btn
                        no-caps
                        unelevated
                        class="text-weight-light q-ma-sm"
                        icon="add_box"
                        color="secondary"
                        label="Material"
                        @click="add_dialog=true"
                      />
                      <q-btn
                        color="secondary"
                        icon="archive"
                        label="csv"
                        no-caps
                        flat
                        dense
                        @click="exportT"
                      />
                    </template>
                    <template v-slot:header="props">
                        <q-tr :props="props">
                          <q-th class="text-italic text-accent" auto-width>Stock ID</q-th>
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
                          <q-td><span class="text-secondary text-weight-bold rowNumber">-T</span></q-td>
                          <q-td
                            v-for="col in props.cols"
                            :key="col.name"
                            :props="props"
                          >
                            {{ col.value }}
                          </q-td>
                          <q-td>
                            <q-btn flat dense icon="edit" color="secondary" @click="toEdit(props.row)"/>
                        </q-td>
                      </q-tr>
                    </template>
                  </q-table>
                </div>

                <q-dialog v-model="add_dialog" persistent transition-show="rotate" transition-hide="rotate">
                  <q-card style="width: 350px">
                    <q-bar class="bg-secondary text-white" style="height: 60px">
                      <div class="text-h6 text-weight-light">Add Material</div>
                      <q-space />
                      <q-btn icon="close" flat round dense v-close-popup />
                    </q-bar>
                    <q-card-section>
                      <q-select outlined class="q-pa-xs" dense clearable color="accent" v-model="defaultItem.category" :options="options" label="Category" />
                      <q-input class="q-pa-xs" outlined dense clearable color="accent" v-model="defaultItem.name" label="Item" @input="val => { defaultItem.name = val.toLowerCase() }"/>
                      <q-input class="q-pa-xs" outlined dense clearable color="accent" v-model="defaultItem.description" label="Description" @input="val => { defaultItem.description = val.toLowerCase() }"/>
                      <q-input class="q-pa-xs" outlined dense clearable color="accent" v-model="defaultItem.unit" label="Unit of Measure" @input="val => { defaultItem.unit = val.toLowerCase() }"/>
                       <q-input class="q-pa-xs" outlined dense clearable color="accent" v-model="defaultItem.value" label="Unit Cost (PhP)" mask="#.##" fill-mask="0" reverse-fill-mask input-class="text-right"/>
                      <q-input class="q-pa-xs" outlined dense clearable color="accent" type="number" v-model="defaultItem.quantity" label="Quantity" />
                    </q-card-section>
                    <q-card-actions>
                      <q-btn no-caps unelevated class="full-width text-weight-light" @click="addMaterial" color="secondary" label="Add Material" v-close-popup/>
                    </q-card-actions>
                  </q-card>
                </q-dialog>

                <q-dialog v-model="edit_dialog" persistent transition-show="rotate" transition-hide="rotate">
                  <q-card style="width: 350px">
                    <q-bar class="bg-secondary text-white" style="height: 60px">
                      <div class="text-h6 text-weight-light">Edit Material</div>
                      <q-space />
                      <q-btn icon="close" flat round dense v-close-popup />
                    </q-bar>

                    <q-card-section>
                      <q-select outlined class="q-pa-xs" dense clearable color="accent" v-model="editedItem.category" :options="options" label="Category" />
                      <q-input class="q-pa-xs" outlined dense clearable color="accent" v-model="editedItem.name" label="Item" @input="val => { editedItem.name = val.toLowerCase() }"/>
                      <q-input class="q-pa-xs" outlined dense clearable color="accent" v-model="editedItem.description" label="Description" @input="val => { editedItem.description = val.toLowerCase() }"/>
                      <q-input class="q-pa-xs" outlined dense clearable color="accent" v-model="editedItem.unit" label="Unit of Measure" @input="val => { editedItem.unit = val.toLowerCase() }"/>
                      <q-input class="q-pa-xs" outlined dense clearable color="accent" v-model="editedItem.value" label="Unit Cost (PhP)" mask="#.##" fill-mask="0" reverse-fill-mask input-class="text-right"/>
                      <q-input class="q-pa-xs" outlined dense clearable color="accent" type="number" v-model="editedItem.quantity" label="Quantity" />
                    </q-card-section>
                    <q-card-actions>
                      <q-btn no-caps unelevated class="full-width text-weight-light" @click="addMaterial" color="secondary" label="Add Material" v-close-popup/>
                    </q-card-actions>
                  </q-card>
                </q-dialog>

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
import { date, exportFile } from 'quasar'

function wrapCsvValue (val, formatFn) {
  let formatted = formatFn !== void 0
    ? formatFn(val)
    : val

  formatted = formatted === void 0 || formatted === null
    ? ''
    : String(formatted)

  formatted = formatted.split('"').join('""')
  /**
   * Excel accepts \n and \r in strings, but some other CSV parsers do not
   * Uncomment the next two lines to escape new lines
   */
  // .split('\n').join('\\n')
  // .split('\r').join('\\r')

  return `"${formatted}"`
}
export default {

  data () {
    return {
      separator: 'cell',
      tab: 'tab 1',
      dense: false,
      editedIndex: -1,
      edit_dialog: false,
      add_dialog: false,
      filter: '',
      activeMaterial: null,
      editedItem: {
        name: '',
        description: '',
        unit: '',
        value: 0,
        updated: '',
        quantity: 0,
        category: ''
      },
      defaultItem: {
        issued: '',
        name: '',
        description: '',
        unit: '',
        value: 0,
        quantity: 0,
        category: ''
      },
      plumbingData: [],
      electricityData: [],
      groundsData: [],
      transportationData: [],
      options: [
        'Plumbing', 'Electricity', 'Grounds', 'Transportation'
      ],
      columns: [
        { name: 'name', label: 'Item', field: 'name', align: 'left', sortable: true },
        { name: 'description', label: 'Item Description', field: 'description', align: 'left', sortable: true },
        { name: 'unit', label: 'Unit of Measure', field: 'unit', align: 'left', sortable: true },
        { name: 'value', label: 'Unit Cost (PhP)', field: 'value', align: 'left', sortable: true },
        { name: 'quantity', label: 'Quantity', field: 'quantity', align: 'left', sortable: true },
        { name: 'issued', label: 'Issued to', field: 'issued', align: 'left', sortable: true },
        { name: 'created', label: 'Created On', field: 'created', align: 'left', sortable: true },
        { name: 'updated', label: 'Updated On', field: 'updated', align: 'left', sortable: true }
      ]
    }
  },
  async created () {
    try {
      await db.collection('materials').get().then(querySnapshot => {
        querySnapshot.forEach(doc => {
          const matData = {
            id: doc.id,
            name: doc.data().name,
            description: doc.data().description,
            unit: doc.data().unit,
            value: doc.data().value,
            quantity: doc.data().quantity,
            category: doc.data().category,
            created: doc.data().created,
            updated: doc.data().updated,
            issued: doc.data().issued
          }
          if (matData.category === 'Plumbing') {
            this.plumbingData.push(matData)
          }
          if (matData.category === 'Electricity') {
            this.electricityData.push(matData)
          }
          if (matData.category === 'Grounds') {
            this.groundsData.push(matData)
          }
          if (matData.category === 'Transportation') {
            this.transportationData.push(matData)
          }
        })
      })
    } catch (error) {
      console.log('error message', error)
    }
  },
  computed: {
    date () {
      let timeStamp = Date.now()
      return date.formatDate(timeStamp, 'dddd D MMMM YYYY')
    }
  },
  methods: {
    exportP () {
      this.data = this.plumbingData
      const content = [ this.columns.map(col => wrapCsvValue(col.label)) ].concat(
        this.data.map(row => this.columns.map(col => wrapCsvValue(
          typeof col.field === 'function'
            ? col.field(row)
            : row[col.field === void 0 ? col.name : col.field],
          col.format
        )).join(','))
      ).join('\r\n')

      const status = exportFile(
        'plumbing-table-export.csv',
        content,
        'text/csv'
      )

      if (status !== true) {
        this.$q.notify({
          message: 'Browser denied file download...',
          color: 'negative',
          icon: 'warning'
        })
      }
    },
    exportT () {
      this.data = this.transportationData
      const content = [ this.columns.map(col => wrapCsvValue(col.label)) ].concat(
        this.data.map(row => this.columns.map(col => wrapCsvValue(
          typeof col.field === 'function'
            ? col.field(row)
            : row[col.field === void 0 ? col.name : col.field],
          col.format
        )).join(','))
      ).join('\r\n')

      const status = exportFile(
        'transportation-table-export.csv',
        content,
        'text/csv'
      )

      if (status !== true) {
        this.$q.notify({
          message: 'Browser denied file download...',
          color: 'negative',
          icon: 'warning'
        })
      }
    },
    exportG () {
      this.data = this.groundsData
      const content = [ this.columns.map(col => wrapCsvValue(col.label)) ].concat(
        this.data.map(row => this.columns.map(col => wrapCsvValue(
          typeof col.field === 'function'
            ? col.field(row)
            : row[col.field === void 0 ? col.name : col.field],
          col.format
        )).join(','))
      ).join('\r\n')

      const status = exportFile(
        'grounds-table-export.csv',
        content,
        'text/csv'
      )

      if (status !== true) {
        this.$q.notify({
          message: 'Browser denied file download...',
          color: 'negative',
          icon: 'warning'
        })
      }
    },
    exportE () {
      this.data = this.electricityData
      const content = [ this.columns.map(col => wrapCsvValue(col.label)) ].concat(
        this.data.map(row => this.columns.map(col => wrapCsvValue(
          typeof col.field === 'function'
            ? col.field(row)
            : row[col.field === void 0 ? col.name : col.field],
          col.format
        )).join(','))
      ).join('\r\n')

      const status = exportFile(
        'electricity-table-export.csv',
        content,
        'text/csv'
      )

      if (status !== true) {
        this.$q.notify({
          message: 'Browser denied file download...',
          color: 'negative',
          icon: 'warning'
        })
      }
    },
    addMaterial () {
      const matRef = db.collection('materials')
      var pluralize = require('pluralize')
      this.unit = pluralize.plural(this.defaultItem.unit)
      if (pluralize.isPlural(this.defaultItem.name) === true) {
        this.name = pluralize.singular(this.defaultItem.name)
        matRef.add({
          name: this.name,
          description: this.defaultItem.description,
          unit: this.unit,
          value: this.defaultItem.value,
          quantity: this.defaultItem.quantity,
          category: this.defaultItem.category,
          created: this.date,
          updated: this.date,
          issued: 'None'
        })
          .then(
            location.reload(),
            this.$q.notify({
              color: 'secondary',
              message: 'Material added successfully'
            })
          )
          .catch(error => {
            console.error('Error adding material: ', error)
          })
      } else if (pluralize.isPlural(this.defaultItem.name) === false) {
        matRef.add({
          name: this.defaultItem.name,
          description: this.defaultItem.description,
          unit: this.unit,
          value: this.defaultItem.value,
          quantity: this.defaultItem.quantity,
          category: this.defaultItem.category,
          created: this.date,
          updated: this.date,
          issued: 'None'
        })
          .then(
            location.reload(),
            this.$q.notify({
              color: 'secondary',
              message: 'Material added successfully'
            })
          )
          .catch(error => {
            console.error('Error adding material: ', error)
          })
      }
    },
    updateMaterial () {
      const matRef = db.collection('materials').doc(this.activeMaterial)
      var pluralize = require('pluralize')
      this.unit = pluralize.plural(this.editedItem.unit)
      if (pluralize.isPlural(this.editedItem.name) === true) {
        this.name = pluralize.singular(this.editedItem.name)
        matRef.update({
          name: this.name,
          description: this.editedItem.description,
          unit: this.unit,
          value: this.editedItem.value,
          quantity: this.editedItem.quantity,
          category: this.editedItem.category,
          updated: this.date
        })
          .then(
            location.reload(),
            this.$q.notify({
              color: 'secondary',
              message: 'Material updated successfully'
            })
          )
          .catch(error => {
            console.error('Error updating material: ', error)
          })
      } else if (pluralize.isPlural(this.editedItem.name) === false) {
        matRef.update({
          name: this.editedItem.name,
          description: this.editedItem.description,
          unit: this.unit,
          value: this.editedItem.value,
          quantity: this.editedItem.quantity,
          category: this.editedItem.category,
          updated: this.date
        })
          .then(
            location.reload(),
            this.$q.notify({
              color: 'secondary',
              message: 'Material updated successfully'
            })
          )
          .catch(error => {
            console.error('Error updating material: ', error)
          })
      }
    },
    toEdit (item, id) {
      this.edit_dialog = true
      this.editedItem = Object.assign({}, item)
      this.activeMaterial = this.editedItem.id
    }
    // toDelete (id) {
    //   this.$q.dialog({
    //     title: 'Delete Confirm',
    //     message: 'The material will be deleted. Are you sure you want to continue?',
    //     cancel: {
    //       label: 'No',
    //       flat: true,
    //       color: 'accent'
    //     },
    //     ok: {
    //       label: 'Yes',
    //       flat: true,
    //       color: 'secondary'
    //     },
    //     persistentL: true
    //   }).onOk(async () => {
    //     try {
    //       await db.collection('materials').doc(id).delete()
    //       location.reload()
    //       this.$q.notify({
    //         avatar: 'delete',
    //         color: 'accent',
    //         message: 'Material deleted successfully'
    //       })
    //     } catch (error) {
    //       console.log('Error deleting material', error)
    //     }
    //   }
    //   )
    // }
  }
}
</script>

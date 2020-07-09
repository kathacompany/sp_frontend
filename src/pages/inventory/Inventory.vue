<template>
  <q-layout view="hHh lpR fFf">
    <q-page-container>
        <q-page class="window-height window-width row justify-center">
          <div class="q-gutter-sm flex text-center">
            <div style="width: 100%; height: 50%;">
              <h5 class="text-weight-light">INVENTORY OF MATERIALS</h5>{{ date }}<br><br>
              <q-input v-if="!plumbingData.length || !transportationData.length || !groundsData.length || !electricityData.length" outlined clearable color="secondary" dense debounce="300" v-model="filter" placeholder="Search by Material Name">
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
                  <q-tab name="tab 4" label="Tab 4" />
                </q-tabs>

                <q-separator />

                <q-tab-panels v-model="tab" animated>
                  <q-tab-panel name="tab 1">
                    <div class="q-pa-md">
                      <q-btn no-caps float="right" class="text-weight-light q-mr-sm" icon="queue" color="secondary" label="Add Material" @click="add_dialog=true"/>
                    </div>

                      <q-dialog v-model="add_dialog" persistent transition-show="rotate" transition-hide="rotate">
                        <q-card style="width: 350px">
                          <q-bar class="bg-secondary text-white" style="height: 60px">
                            <div class="text-h6 text-weight-light">Add Material</div>
                            <q-space />
                            <q-btn icon="close" flat round dense v-close-popup />
                          </q-bar>
                          <q-card-section>
                            <q-input class="q-pa-xs" outlined dense clearable color="accent" v-model="defaultItem.name" label="Material Name"/>
                            <q-input class="q-pa-xs" outlined dense clearable color="accent" v-model="defaultItem.description" label="Description"/>
                            <q-input class="q-pa-xs" outlined dense clearable color="accent" v-model="defaultItem.unit" label="Unit of Measurement"/>
                             <q-input class="q-pa-xs" outlined dense clearable color="accent" v-model="defaultItem.value" label="Unit Cost (PhP)" mask="#.##" fill-mask="0" reverse-fill-mask input-class="text-right"/>
                            <q-input class="q-pa-xs" outlined dense clearable color="accent" type="number" v-model="defaultItem.quantity" label="Quantity" />
                            <q-select outlined class="q-pa-xs" dense clearable color="accent" v-model="defaultItem.category" :options="options" label="Category" />
                          </q-card-section>
                          <q-card-actions class="justify-center q-pa-xs">
                            <q-btn no-caps class="text-weight-light" @click="addMaterial" color="secondary" label="Add Material" v-close-popup/>
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
                            <q-input class="q-pa-xs" outlined dense clearable color="accent" v-model="editedItem.name" label="Material Name"/>
                            <q-input class="q-pa-xs" readonly outlined dense color="accent" v-model="editedItem.stockNo" label="Stock No."/>
                            <q-input class="q-pa-xs" outlined dense clearable color="accent" v-model="editedItem.description" label="Description"/>
                            <q-input class="q-pa-xs" outlined dense clearable color="accent" v-model="editedItem.unit" label="Unit of Measurement"/>
                            <q-input class="q-pa-xs" outlined dense clearable color="accent" v-model="editedItem.value" label="Unit Cost (PhP)" mask="#.##" fill-mask="0" reverse-fill-mask input-class="text-right"/>
                            <q-input class="q-pa-xs" outlined dense clearable color="accent" type="number" v-model="editedItem.quantity" label="Quantity" />
                            <q-select outlined class="q-pa-xs" dense clearable color="accent" v-model="editedItem.category" :options="options" label="Category" />
                          </q-card-section>
                          <q-card-actions class="justify-center q-pa-xs">
                            <q-btn no-caps class="text-weight-light" @click="updateMaterial" color="secondary" label="Save Changes" v-close-popup/>
                          </q-card-actions>
                        </q-card>
                      </q-dialog>

                  <div style="width: 100%;">
                  <q-banner v-if="!plumbingData.length" class="bg-grey-2 q-pa-md" style="min-width: 800px; height: 150px">
                    <template v-slot:avatar>
                      <q-icon name="sentiment_dissatisfied" color="accent" />
                    </template>
                  <span class="text-h6 text-grey text-weight-thin">No Records Found!</span>
                  </q-banner>
                  <q-table
                    class="my-sticky-header-table"
                    :data="plumbingData"
                    :columns="columns"
                    row-key="name"
                    :filter="filter"
                    :separator="separator"
                    v-else
                    hide-bottom
                    dense
                    ref="plumbing"
                    title="Plumbing Materials"
                  >
                    <template v-slot:top-right>
                      <q-btn
                        color="secondary"
                        icon-right="archive"
                        label="csv"
                        no-caps
                        flat
                        dense
                        @click="exportP"
                      />
                    </template>
                    <template v-slot:header="props">
                      <q-tr :props="props">
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
                        <q-td
                          v-for="col in props.cols"
                          :key="col.name"
                          :props="props"
                        >
                          {{ col.value }}
                        </q-td>
                         <q-td>
                          <q-btn flat dense icon="edit" color="secondary" @click="toEdit(props.row)"/>
                          <q-btn flat dense icon="delete" color="accent" @click="toDelete(props.row.id)">
                            <q-space/>
                          </q-btn>
                        </q-td>
                      </q-tr>
                    </template>
                  </q-table>
                </div>
              </q-tab-panel>

              <q-tab-panel name="tab 2">
                <div class="q-pa-md">
                  <q-btn no-caps float="right" class="text-weight-light q-mr-sm" icon="queue" color="secondary" label="Add Material" @click="add_dialog=true"/>
                </div>

                <q-dialog v-model="add_dialog" persistent transition-show="rotate" transition-hide="rotate">
                  <q-card style="width: 350px">
                    <q-bar class="bg-secondary text-white" style="height: 60px">
                      <div class="text-h6 text-weight-light">Add Material</div>
                      <q-space />
                      <q-btn icon="close" flat round dense v-close-popup />
                    </q-bar>
                    <q-card-section>
                      <q-input class="q-pa-xs" outlined dense clearable color="accent" v-model="defaultItem.name" label="Material Name"/>
                      <q-input class="q-pa-xs" outlined dense clearable color="accent" v-model="defaultItem.description" label="Description"/>
                      <q-input class="q-pa-xs" outlined dense clearable color="accent" v-model="defaultItem.unit" label="Unit of Measurement"/>
                       <q-input class="q-pa-xs" outlined dense clearable color="accent" v-model="defaultItem.value" label="Unit Cost (PhP)" mask="#.##" fill-mask="0" reverse-fill-mask input-class="text-right"/>
                      <q-input class="q-pa-xs" outlined dense clearable color="accent" type="number" v-model="defaultItem.quantity" label="Quantity" />
                      <q-select outlined class="q-pa-xs" dense clearable color="accent" v-model="defaultItem.category" :options="options" label="Category" />
                    </q-card-section>
                    <q-card-actions class="justify-center q-pa-xs">
                      <q-btn no-caps class="text-weight-light" @click="addMaterial" color="secondary" label="Add Material" v-close-popup/>
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
                      <q-input class="q-pa-xs" outlined dense clearable color="accent" v-model="editedItem.name" label="Material Name"/>
                      <q-input class="q-pa-xs" readonly outlined dense color="accent" v-model="editedItem.stockNo" label="Stock No."/>
                      <q-input class="q-pa-xs" outlined dense clearable color="accent" v-model="editedItem.description" label="Description"/>
                      <q-input class="q-pa-xs" outlined dense clearable color="accent" v-model="editedItem.unit" label="Unit of Measurement"/>
                      <q-input class="q-pa-xs" outlined dense clearable color="accent" v-model="editedItem.value" label="Unit Cost (PhP)" mask="#.##" fill-mask="0" reverse-fill-mask input-class="text-right"/>
                      <q-input class="q-pa-xs" outlined dense clearable color="accent" type="number" v-model="editedItem.quantity" label="Quantity" />
                      <q-select outlined class="q-pa-xs" dense clearable color="accent" v-model="editedItem.category" :options="options" label="Category" />
                    </q-card-section>
                    <q-card-actions class="justify-center q-pa-xs">
                      <q-btn no-caps class="text-weight-light" @click="updateMaterial" color="secondary" label="Save Changes" v-close-popup/>
                    </q-card-actions>
                  </q-card>
                </q-dialog>

                <div style="width: 100%;">
                  <q-banner v-if="!electricityData.length" class="bg-grey-2 q-pa-md" style="min-width: 800px; height: 150px">
                    <template v-slot:avatar>
                      <q-icon name="sentiment_dissatisfied" color="accent" />
                    </template>
                  <span class="text-h6 text-grey text-weight-thin">No Records Found!</span>
                  </q-banner>
                  <q-table
                    class="my-sticky-header-table"
                    :data="electricityData"
                    :columns="columns"
                    row-key="name"
                    :filter="filter"
                    :separator="separator"
                    v-else
                    hide-bottom
                    dense
                    ref="electric"
                    title="Electricity Materials"
                  >
                    <template v-slot:top-right>
                      <q-btn
                        color="secondary"
                        icon-right="archive"
                        label="csv"
                        no-caps
                        flat
                        dense
                        @click="exportE"
                      />
                    </template>
                    <template v-slot:header="props">
                      <q-tr :props="props">
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
                        <q-td
                          v-for="col in props.cols"
                          :key="col.name"
                          :props="props"
                        >
                          {{ col.value }}
                        </q-td>
                         <q-td>
                          <q-btn flat dense icon="edit" color="secondary" @click="toEdit(props.row)"/>
                          <q-btn flat dense icon="delete" color="accent" @click="toDelete(props.row.id)">
                            <q-space/>
                          </q-btn>
                        </q-td>
                      </q-tr>
                    </template>
                  </q-table>
                </div>
              </q-tab-panel>

              <q-tab-panel name="tab 3">
                <div class="q-pa-md">
                  <q-btn no-caps float="right" class="text-weight-light q-mr-sm" icon="queue" color="secondary" label="Add Material" @click="add_dialog=true"/>
                </div>

                <q-dialog v-model="add_dialog" persistent transition-show="rotate" transition-hide="rotate">
                  <q-card style="width: 350px">
                    <q-bar class="bg-secondary text-white" style="height: 60px">
                      <div class="text-h6 text-weight-light">Add Material</div>
                      <q-space />
                      <q-btn icon="close" flat round dense v-close-popup />
                    </q-bar>
                    <q-card-section>
                      <q-input class="q-pa-xs" outlined dense clearable color="accent" v-model="defaultItem.name" label="Material Name"/>
                      <q-input class="q-pa-xs" outlined dense clearable color="accent" v-model="defaultItem.description" label="Description"/>
                      <q-input class="q-pa-xs" outlined dense clearable color="accent" v-model="defaultItem.unit" label="Unit of Measurement"/>
                       <q-input class="q-pa-xs" outlined dense clearable color="accent" v-model="defaultItem.value" label="Unit Cost (PhP)" mask="#.##" fill-mask="0" reverse-fill-mask input-class="text-right"/>
                      <q-input class="q-pa-xs" outlined dense clearable color="accent" type="number" v-model="defaultItem.quantity" label="Quantity" />
                      <q-select outlined class="q-pa-xs" dense clearable color="accent" v-model="defaultItem.category" :options="options" label="Category" />
                    </q-card-section>
                    <q-card-actions class="justify-center q-pa-xs">
                      <q-btn no-caps class="text-weight-light" @click="addMaterial" color="secondary" label="Add Material" v-close-popup/>
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
                      <q-input class="q-pa-xs" outlined dense clearable color="accent" v-model="editedItem.name" label="Material Name"/>
                      <q-input class="q-pa-xs" readonly outlined dense color="accent" v-model="editedItem.stockNo" label="Stock No."/>
                      <q-input class="q-pa-xs" outlined dense clearable color="accent" v-model="editedItem.description" label="Description"/>
                      <q-input class="q-pa-xs" outlined dense clearable color="accent" v-model="editedItem.unit" label="Unit of Measurement"/>
                      <q-input class="q-pa-xs" outlined dense clearable color="accent" v-model="editedItem.value" label="Unit Cost (PhP)" mask="#.##" fill-mask="0" reverse-fill-mask input-class="text-right"/>
                      <q-input class="q-pa-xs" outlined dense clearable color="accent" type="number" v-model="editedItem.quantity" label="Quantity" />
                      <q-select outlined class="q-pa-xs" dense clearable color="accent" v-model="editedItem.category" :options="options" label="Category" />
                    </q-card-section>
                    <q-card-actions class="justify-center q-pa-xs">
                      <q-btn no-caps class="text-weight-light" @click="updateMaterial" color="secondary" label="Save Changes" v-close-popup/>
                    </q-card-actions>
                  </q-card>
                </q-dialog>

                <div style="width: 100%;">
                  <q-banner v-if="!groundsData.length" class="bg-grey-2 q-pa-md" style="min-width: 800px; height: 150px">
                    <template v-slot:avatar>
                      <q-icon name="sentiment_dissatisfied" color="accent" />
                    </template>
                  <span class="text-h6 text-grey text-weight-thin">No Records Found!</span>
                  </q-banner>
                  <q-table
                    class="my-sticky-header-table"
                    :data="groundsData"
                    :columns="columns"
                    row-key="name"
                    :filter="filter"
                    :separator="separator"
                    v-else
                    hide-bottom
                    dense
                    ref="grounds"
                    title="Grounds Materials"
                  >
                    <template v-slot:top-right>
                      <q-btn
                        color="secondary"
                        icon-right="archive"
                        label="csv"
                        no-caps
                        flat
                        dense
                        @click="exportG"
                      />
                    </template>
                    <template v-slot:header="props">
                      <q-tr :props="props">
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
                        <q-td
                          v-for="col in props.cols"
                          :key="col.name"
                          :props="props"
                        >
                          {{ col.value }}
                        </q-td>
                         <q-td>
                          <q-btn flat dense icon="edit" color="secondary" @click="toEdit(props.row)"/>
                          <q-btn flat dense icon="delete" color="accent" @click="toDelete(props.row.id)">
                            <q-space/>
                          </q-btn>
                        </q-td>
                      </q-tr>
                    </template>
                  </q-table>
                </div>
              </q-tab-panel>

              <q-tab-panel name="tab 4">
                <div class="q-pa-md">
                  <q-btn no-caps float="right" class="text-weight-light q-mr-sm" icon="queue" color="secondary" label="Add Material" @click="add_dialog=true"/>
                </div>

                <q-dialog v-model="add_dialog" persistent transition-show="rotate" transition-hide="rotate">
                  <q-card style="width: 350px">
                    <q-bar class="bg-secondary text-white" style="height: 60px">
                      <div class="text-h6 text-weight-light">Add Material</div>
                      <q-space />
                      <q-btn icon="close" flat round dense v-close-popup />
                    </q-bar>
                    <q-card-section>
                      <q-input class="q-pa-xs" outlined dense clearable color="accent" v-model="defaultItem.name" label="Material Name"/>
                      <q-input class="q-pa-xs" outlined dense clearable color="accent" v-model="defaultItem.description" label="Description"/>
                      <q-input class="q-pa-xs" outlined dense clearable color="accent" v-model="defaultItem.unit" label="Unit of Measurement"/>
                       <q-input class="q-pa-xs" outlined dense clearable color="accent" v-model="defaultItem.value" label="Unit Cost (PhP)" mask="#.##" fill-mask="0" reverse-fill-mask input-class="text-right"/>
                      <q-input class="q-pa-xs" outlined dense clearable color="accent" type="number" v-model="defaultItem.quantity" label="Quantity" />
                      <q-select outlined class="q-pa-xs" dense clearable color="accent" v-model="defaultItem.category" :options="options" label="Category" />
                    </q-card-section>
                    <q-card-actions class="justify-center q-pa-xs">
                      <q-btn no-caps class="text-weight-light" @click="addMaterial" color="secondary" label="Add Material" v-close-popup/>
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
                      <q-input class="q-pa-xs" outlined dense clearable color="accent" v-model="editedItem.name" label="Material Name"/>
                      <q-input class="q-pa-xs" readonly outlined dense color="accent" v-model="editedItem.stockNo" label="Stock No."/>
                      <q-input class="q-pa-xs" outlined dense clearable color="accent" v-model="editedItem.description" label="Description"/>
                      <q-input class="q-pa-xs" outlined dense clearable color="accent" v-model="editedItem.unit" label="Unit of Measurement"/>
                      <q-input class="q-pa-xs" outlined dense clearable color="accent" v-model="editedItem.value" label="Unit Cost (PhP)" mask="#.##" fill-mask="0" reverse-fill-mask input-class="text-right"/>
                      <q-input class="q-pa-xs" outlined dense clearable color="accent" type="number" v-model="editedItem.quantity" label="Quantity" />
                      <q-select outlined class="q-pa-xs" dense clearable color="accent" v-model="editedItem.category" :options="options" label="Category" />
                    </q-card-section>
                    <q-card-actions class="justify-center q-pa-xs">
                      <q-btn no-caps class="text-weight-light" @click="updateMaterial" color="secondary" label="Save Changes" v-close-popup/>
                    </q-card-actions>
                  </q-card>
                </q-dialog>

                <div style="width: 100%;">
                  <q-banner v-if="!transportationData.length" class="bg-grey-2 q-pa-md" style="min-width: 800px; height: 150px">
                    <template v-slot:avatar>
                      <q-icon name="sentiment_dissatisfied" color="accent" />
                    </template>
                  <span class="text-h6 text-grey text-weight-thin">No Records Found!</span>
                  </q-banner>
                  <q-table
                    class="my-sticky-header-table"
                    :data="transportationData"
                    :columns="columns"
                    row-key="name"
                    :filter="filter"
                    :separator="separator"
                    v-else
                    hide-bottom
                    dense
                    ref="transpo"
                    title="Transportation Materials"
                  >
                    <template v-slot:top-right>
                      <q-btn
                        color="secondary"
                        icon-right="archive"
                        label="csv"
                        no-caps
                        flat
                        dense
                        @click="exportT"
                      />
                    </template>
                    <template v-slot:header="props">
                        <q-tr :props="props">
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
                          <q-td
                            v-for="col in props.cols"
                            :key="col.name"
                            :props="props"
                          >
                            {{ col.value }}
                          </q-td>
                          <q-td>
                            <q-btn flat dense icon="edit" color="secondary" @click="toEdit(props.row)"/>
                            <q-btn flat dense icon="delete" color="accent" @click="toDelete(props.row.id)">
                              <q-space/>
                            </q-btn>
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
        stockNo: 0,
        unit: '',
        value: 0,
        quantity: 0,
        category: ''
      },
      defaultItem: {
        name: '',
        description: '',
        stockNo: 0,
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
        { name: 'name', label: 'Name', field: 'name', align: 'left', sortable: true },
        { name: 'description', label: 'Description', field: 'description', align: 'left' },
        // { name: 'stockNo', label: 'Stock No.', field: 'stockNo', align: 'left' },
        { name: 'unit', label: 'Unit of Measurement', field: 'unit', align: 'left' },
        { name: 'value', label: 'Unit Cost (PhP)', field: 'value', align: 'left' },
        { name: 'quantity', label: 'Quantity', field: 'quantity', align: 'left' },
        { name: 'category', label: 'Category', field: 'category', align: 'left' }
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
            stockNo: doc.data().stockNo,
            unit: doc.data().unit,
            value: doc.data().value,
            quantity: doc.data().quantity,
            category: doc.data().category
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
        'table-export.csv',
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
        'table-export.csv',
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
        'table-export.csv',
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
        'table-export.csv',
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
      db.collection('materials').add({
        name: this.defaultItem.name,
        description: this.defaultItem.description,
        stockNo: this.defaultItem.stockNo.inc,
        unit: this.defaultItem.unit,
        value: this.defaultItem.value,
        quantity: this.defaultItem.quantity,
        category: this.defaultItem.category
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
    },
    updateMaterial () {
      let docref = db.collection('materials').doc(this.activeMaterial)
      docref.update(this.editedItem)
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
    },
    toEdit (item, id) {
      this.edit_dialog = true
      this.editedItem = Object.assign({}, item)
      this.activeMaterial = this.editedItem.id
    },
    toDelete (id) {
      this.$q.dialog({
        title: 'Delete Confirm',
        message: 'The material will be deleted. Are you sure you want to continue?',
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
          await db.collection('materials').doc(id).delete()
          location.reload()
          this.$q.notify({
            avatar: 'delete',
            color: 'accent',
            message: 'Material deleted successfully'
          })
        } catch (error) {
          console.log('Error deleting material', error)
        }
      }
      )
    }
  }
}
</script>

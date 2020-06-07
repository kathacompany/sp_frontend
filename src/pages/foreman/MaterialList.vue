<template>
  <q-layout view="hHh lpR fFf">
    <q-page-container>
        <q-page class="window-height window-width row justify-center">
          <div class="q-gutter-sm flex text-center">
            <div style="width: 100%; height: 50%;">
              <h5>INVENTORY OF MATERIALS</h5>{{ date }}<br><br>
              <q-input v-if="plumbingData.length || transportationData.length || groundsData.length || !electricityData.length" outlined clearable color="secondary" dense debounce="300" v-model="filter" placeholder="Search by Material Name">
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>
              <br>
              <!-- <div class="q-pa-md">
                <q-btn no-caps float="right" icon="queue" class="q-mr-sm" color="secondary" label="Add Material" @click="add_dialog=true"/>
                <q-btn no-caps align="right" icon="description" @click="$router.push('/InventoryHomepage')" class="q-mr-sm" label="Generate File" color="secondary"/>
              </div> -->

                <!-- <q-dialog v-model="add_dialog">
                  <q-card style="width: 350px">
                    <q-card-section class="row items-center q-pb-none">
                      <div class="text-h6">New Material</div>
                      <q-space />
                      <q-btn color="accent" icon="close" flat round dense v-close-popup />
                    </q-card-section>

                    <q-card-section>
                      <q-input class="q-pa-xs" outlined dense clearable color="accent" v-model="defaultItem.name" label="Material Name"/>
                      <q-input class="q-pa-xs" outlined dense clearable color="accent" v-model="defaultItem.description" label="Description"/>
                      <q-input class="q-pa-xs" outlined dense clearable color="accent" mask="###" fill-mask v-model="defaultItem.stockNo" label="Stock No."/>
                      <q-input class="q-pa-xs" outlined dense clearable color="accent" v-model="defaultItem.unit" label="Unit of Measurement"/>
                      <q-input class="q-pa-xs" outlined dense clearable color="accent" type="number" v-model="defaultItem.value" label="Unit Cost (PhP)"/>
                      <q-input class="q-pa-xs" outlined dense clearable color="accent" type="number" v-model="defaultItem.quantity" label="Quantity" />
                      <q-select outlined class="q-pa-xs" dense clearable color="accent" v-model="defaultItem.category" :options="options" label="Category" />
                    </q-card-section>
                    <q-card-actions class="justify-center q-pa-xs">
                      <q-btn no-caps @click="addMaterial" color="secondary" label="Add Material" v-close-popup/>
                    </q-card-actions>
                  </q-card>
                </q-dialog>

                <q-dialog v-model="edit_dialog">
                  <q-card style="width: 350px">
                    <q-card-section class="row items-center q-pb-none">
                      <div class="text-h6">Edit Material</div>
                      <q-space />
                      <q-btn color="accent" icon="close" flat round dense v-close-popup />
                    </q-card-section>

                    <q-card-section>
                      <q-input class="q-pa-xs" outlined dense clearable color="accent" v-model="editedItem.name" label="Material Name"/>
                      <q-input class="q-pa-xs" outlined dense clearable color="accent" v-model="editedItem.description" label="Description"/>
                      <q-input class="q-pa-xs" outlined dense clearable color="accent" mask="###" fill-mask v-model="editedItem.stockNo" label="Stock No."/>
                      <q-input class="q-pa-xs" outlined dense clearable color="accent" v-model="editedItem.unit" label="Unit of Measurement"/>
                      <q-input class="q-pa-xs" outlined dense clearable color="accent" type="number" v-model="editedItem.value" label="Unit Cost (PhP)"/>
                      <q-input class="q-pa-xs" outlined dense clearable color="accent" type="number" v-model="editedItem.quantity" label="Quantity" />
                      <q-select outlined class="q-pa-xs" dense clearable color="accent" v-model="editedItem.category" :options="options" label="Category" />
                    </q-card-section>
                    <q-card-actions class="justify-center q-pa-xs">
                      <q-btn no-caps @click="updateMaterial" color="secondary" label="Save Changes" v-close-popup/>
                    </q-card-actions>
                  </q-card>
                </q-dialog> -->

            <div style="width: 100%;">
            <q-banner v-if="!plumbingData.length" class="bg-red-1 q-pa-md" style="min-width: 800px">
              <template v-slot:avatar>
                <q-icon name="sentiment_dissatisfied" color="accent" />
              </template>
              No records found!
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
              :selected-rows-label="getSelectedString"
              selection="multiple"
              :selected.sync="selected"
              title="Plumbing Materials"
            >
              <template v-slot:header="props">
                <q-tr :props="props">
                  <q-th key="selected">
                    <q-checkbox dense color="secondary" v-model="props.selected"/>
                  </q-th>
                  <q-th
                    v-for="col in props.cols"
                    :key="col.name"
                    :props="props"
                    class="text-italic text-accent"
                  >
                    {{ col.label }}
                  </q-th>
                 <!--  <q-th>
                    <span class="text-italic text-accent">Actions</span>
                  </q-th> -->
                </q-tr>
              </template>
              <template v-slot:body="props">
                <q-tr :props="props">
                  <q-td>
                    <q-checkbox dense color="secondary" v-model="props.selected"/>
                  </q-td>
                  <q-td
                    v-for="col in props.cols"
                    :key="col.name"
                    :props="props"
                  >
                    {{ col.value }}
                  </q-td>
                   <!-- <q-td>
                    <q-btn flat dense icon="edit" color="secondary" @click="toEdit(props.row)"/>
                    <q-btn flat dense icon="delete" color="accent" @click="toDelete(props.row.id)">
                      <q-space/>
                    </q-btn>
                  </q-td> -->
                </q-tr>
              </template>
            </q-table>
          </div>
          <br/>
          <br/>

          <div style="width: 100%;">
            <q-banner v-if="!groundsData.length" class="bg-red-1 q-pa-md" style="min-width: 800px">
              <template v-slot:avatar>
                <q-icon name="sentiment_dissatisfied" color="accent" />
              </template>
              No records found!
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
              :selected-rows-label="getSelectedString"
              selection="multiple"
              :selected.sync="selected"
              title="Plumbing Materials"
            >
              <template v-slot:header="props">
                <q-tr :props="props">
                  <q-th key="selected">
                    <q-checkbox dense color="secondary" v-model="props.selected"/>
                  </q-th>
                  <q-th
                    v-for="col in props.cols"
                    :key="col.name"
                    :props="props"
                    class="text-italic text-accent"
                  >
                    {{ col.label }}
                  </q-th>
                 <!--  <q-th>
                    <span class="text-italic text-accent">Actions</span>
                  </q-th> -->
                </q-tr>
              </template>
              <template v-slot:body="props">
                <q-tr :props="props">
                  <q-td>
                    <q-checkbox dense color="secondary" v-model="props.selected"/>
                  </q-td>
                  <q-td
                    v-for="col in props.cols"
                    :key="col.name"
                    :props="props"
                  >
                    {{ col.value }}
                  </q-td>
                   <!-- <q-td>
                    <q-btn flat dense icon="edit" color="secondary" @click="toEdit(props.row)"/>
                    <q-btn flat dense icon="delete" color="accent" @click="toDelete(props.row.id)">
                      <q-space/>
                    </q-btn>
                  </q-td> -->
                </q-tr>
              </template>
            </q-table>
          </div>
          <br/>
          <br/>

          <div style="width: 100%;">
            <q-banner v-if="!electricityData.length" class="bg-red-1 q-pa-md" style="min-width: 800px">
              <template v-slot:avatar>
                <q-icon name="sentiment_dissatisfied" color="accent" />
              </template>
              No records found!
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
              :selected-rows-label="getSelectedString"
              selection="multiple"
              :selected.sync="selected"
              title="Plumbing Materials"
            >
              <template v-slot:header="props">
                <q-tr :props="props">
                  <q-th key="selected">
                    <q-checkbox dense color="secondary" v-model="props.selected"/>
                  </q-th>
                  <q-th
                    v-for="col in props.cols"
                    :key="col.name"
                    :props="props"
                    class="text-italic text-accent"
                  >
                    {{ col.label }}
                  </q-th>
                 <!--  <q-th>
                    <span class="text-italic text-accent">Actions</span>
                  </q-th> -->
                </q-tr>
              </template>
              <template v-slot:body="props">
                <q-tr :props="props">
                  <q-td>
                    <q-checkbox dense color="secondary" v-model="props.selected"/>
                  </q-td>
                  <q-td
                    v-for="col in props.cols"
                    :key="col.name"
                    :props="props"
                  >
                    {{ col.value }}
                  </q-td>
                   <!-- <q-td>
                    <q-btn flat dense icon="edit" color="secondary" @click="toEdit(props.row)"/>
                    <q-btn flat dense icon="delete" color="accent" @click="toDelete(props.row.id)">
                      <q-space/>
                    </q-btn>
                  </q-td> -->
                </q-tr>
              </template>
            </q-table>
          </div>
          <br/>
          <br/>

    <div style="width: 100%;">
            <q-banner v-if="!transportationData.length" class="bg-red-1 q-pa-md" style="min-width: 800px">
              <template v-slot:avatar>
                <q-icon name="sentiment_dissatisfied" color="accent" />
              </template>
              No records found!
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
              :selected-rows-label="getSelectedString"
              selection="multiple"
              :selected.sync="selected"
              title="Plumbing Materials"
            >
              <template v-slot:header="props">
                <q-tr :props="props">
                  <q-th key="selected">
                    <q-checkbox dense color="secondary" v-model="props.selected"/>
                  </q-th>
                  <q-th
                    v-for="col in props.cols"
                    :key="col.name"
                    :props="props"
                    class="text-italic text-accent"
                  >
                    {{ col.label }}
                  </q-th>
                 <!--  <q-th>
                    <span class="text-italic text-accent">Actions</span>
                  </q-th> -->
                </q-tr>
              </template>
              <template v-slot:body="props">
                <q-tr :props="props">
                  <q-td>
                    <q-checkbox dense color="secondary" v-model="props.selected"/>
                  </q-td>
                  <q-td
                    v-for="col in props.cols"
                    :key="col.name"
                    :props="props"
                  >
                    {{ col.value }}
                  </q-td>
                   <!-- <q-td>
                    <q-btn flat dense icon="edit" color="secondary" @click="toEdit(props.row)"/>
                    <q-btn flat dense icon="delete" color="accent" @click="toDelete(props.row.id)">
                      <q-space/>
                    </q-btn>
                  </q-td> -->
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
import { db } from 'boot/firebase'
import { date } from 'quasar'

export default {
  data () {
    return {
      selected: [],
      separator: 'cell',
      dense: false,
      editedIndex: -1,
      edit_dialog: false,
      add_dialog: false,
      filter: '',
      activeMaterial: null,
      editedItem: {
        name: '',
        description: '',
        stockNo: '',
        unit: '',
        value: 0,
        quantity: 0,
        category: ''
      },
      defaultItem: {
        name: '',
        description: '',
        stockNo: '',
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
        { name: 'stockNo', label: 'Stock No.', field: 'stockNo', align: 'left' },
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
    getSelectedString () {
      return this.selected.length === 0 ? '' : `${this.selected.length} request${this.selected.length > 1 ? 's' : ''} selected of ${this.pending.length}`
    },
    addMaterial () {
      db.collection('materials').add(this.defaultItem)
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

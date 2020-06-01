<template>
  <q-layout view="hHh lpR fFf">
    <q-page-container>
        <q-page class="flex flex-center text-center">
          <div class="q-gutter-sm flex text-center">
            <div style="width: 100%; height: 50%;">
              <h2> Materials</h2> {{ date }}
              <q-input borderless dense debounce="300" v-model="filter" placeholder="Search">
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>

            <div style="width: 100%;">
            <q-table
              class="my-sticky-header-table"
              :data="plumbingData"
              :columns="columns"
              row-key="name"
              :filter="filter"
              hide-bottom
              dense
              title="Plumbing Materials"
            >
              <template v-slot:body="props">
                <q-tr :props="props">
                  <q-td key="name" :props="props">
                    {{ props.row.name }}
                  </q-td>
                  <q-td key="description" :props="props">
                    {{ props.row.description }}
                  </q-td>
                  <q-td key="stockNo" :props="props">
                    {{ props.row.stockNo }}
                  </q-td>
                  <q-td key="unit" :props="props">
                    {{ props.row.unit }}
                  </q-td>
                  <q-td key="value" :props="props">
                    {{ props.row.value }}
                  </q-td>
                  <q-td key="quantity" :props="props">
                    {{ props.row.quantity }}
                  </q-td>
                  <q-td key="category" :props="props">
                    {{ props.row.category }}
                  </q-td>
                  <q-td key="toEdit" :props="props">
                    {{ props.row.toEdit }}
                    <q-btn class="bg-secondary" push label="Update" @click="change=true">
                        <q-popup-edit v-model="change" persistent>
                          <div class="q-pa-xs q-ma-xs" align="right">
                            <q-input class="q-pa-xs" outlined dense v-model="name" label="Name">
                              <template v-slot:append>
                                <q-icon name="close" @click="name = ''" class="cursor-pointer" />
                              </template>
                            </q-input>
                            <q-input class="q-pa-xs" outlined dense v-model="description" label="Description">
                              <template v-slot:append>
                                <q-icon name="close" @click="description = ''" class="cursor-pointer" />
                              </template>
                            </q-input>
                            <q-input class="q-pa-xs" outlined dense v-model="stockNo" label="Stock No.">
                              <template v-slot:append>
                                <q-icon name="close" @click="stockNo = ''" class="cursor-pointer" />
                              </template>
                            </q-input>
                            <q-input class="q-pa-xs" outlined dense v-model="unit" label="Unit">
                              <template v-slot:append>
                                <q-icon name="close" @click="unit = ''" class="cursor-pointer" />
                              </template>
                            </q-input>
                            <q-input class="q-pa-xs" outlined dense v-model="value" label="Value">
                              <template v-slot:append>
                                <q-icon name="close" @click="value = ''" class="cursor-pointer" />
                              </template>
                            </q-input>
                            <q-input class="q-pa-xs" outlined dense type="number" v-model="quantity" label="Quantity"/>
                            <q-select outlined dense class="q-pa-xs" v-model="category" :options="options" label="Category" />
                            <br/>
                            <q-btn flat label="Close" v-close-popup/>
                            <q-btn flat label="Set" @click="toEdit(props.row.id, quantity, name, description, stockNo, unit, value, category)"/>
                          </div>
                        </q-popup-edit>
                    </q-btn>
                  </q-td>
                  <q-td key="toDelete" :props="props">
                    {{ props.row.toDelete }}
                    <q-btn class="bg-primary" push label="Delete" @click="toDelete(props.row.id)">
                      <q-space/>
                    </q-btn>
                  </q-td>
                </q-tr>
              </template>
            </q-table>
          </div>
          <br/>
<!-- ELEC  -->
           <div style="width: 100%;">
            <q-table
              class="my-sticky-header-table"
              :data="electricityData"
              :columns="columns"
              row-key="name"
              :filter="filter"
              hide-bottom
              dense
              title="Electric Materials"
            >
              <template v-slot:body="props">
                <q-tr :props="props">
                  <q-td key="name" :props="props">
                    {{ props.row.name }}
                  </q-td>
                  <q-td key="description" :props="props">
                    {{ props.row.description }}
                  </q-td>
                  <q-td key="stockNo" :props="props">
                    {{ props.row.stockNo }}
                  </q-td>
                  <q-td key="unit" :props="props">
                    {{ props.row.unit }}
                  </q-td>
                  <q-td key="value" :props="props">
                    {{ props.row.value }}
                  </q-td>
                  <q-td key="quantity" :props="props">
                    {{ props.row.quantity }}
                  </q-td>
                  <q-td key="category" :props="props">
                    {{ props.row.category }}
                  </q-td>
                  <q-td key="toEdit" :props="props">
                    {{ props.row.toEdit }}
                    <q-btn class="bg-secondary" push label="Update" @click="change=true">
                        <q-popup-edit v-model="change" persistent>
                          <div class="q-pa-xs q-ma-xs" align="right">
                            <q-input class="q-pa-xs" outlined dense v-model="name" label="Name">
                              <template v-slot:append>
                                <q-icon name="close" @click="name = ''" class="cursor-pointer" />
                              </template>
                            </q-input>
                            <q-input class="q-pa-xs" outlined dense v-model="description" label="Description">
                              <template v-slot:append>
                                <q-icon name="close" @click="description = ''" class="cursor-pointer" />
                              </template>
                            </q-input>
                            <q-input class="q-pa-xs" outlined dense v-model="stockNo" label="Stock No.">
                              <template v-slot:append>
                                <q-icon name="close" @click="stockNo = ''" class="cursor-pointer" />
                              </template>
                            </q-input>
                            <q-input class="q-pa-xs" outlined dense v-model="unit" label="Unit">
                              <template v-slot:append>
                                <q-icon name="close" @click="unit = ''" class="cursor-pointer" />
                              </template>
                            </q-input>
                            <q-input class="q-pa-xs" outlined dense v-model="value" label="Value">
                              <template v-slot:append>
                                <q-icon name="close" @click="value = ''" class="cursor-pointer" />
                              </template>
                            </q-input>
                            <q-input class="q-pa-xs" outlined dense type="number" v-model="quantity" label="Quantity"/>
                            <q-select outlined dense class="q-pa-xs" v-model="category" :options="options" label="Category" />
                            <br/>
                            <q-btn flat label="Close" v-close-popup/>
                            <q-btn flat label="Set" @click="toEdit(props.row.id, quantity, name, description, stockNo, unit, value, category)"/>
                          </div>
                        </q-popup-edit>
                    </q-btn>
                  </q-td>
                  <q-td key="toDelete" :props="props">
                    {{ props.row.toDelete }}
                    <q-btn class="bg-primary" push label="Delete" @click="toDelete(props.row.id)">
                      <q-space/>
                    </q-btn>
                  </q-td>
                </q-tr>
              </template>
            </q-table>
          </div>
          <br/>
<!-- GROUNDS -->
           <div style="width: 100%;">
            <q-table
              class="my-sticky-header-table"
              :data="groundsData"
              :columns="columns"
              row-key="name"
              :filter="filter"
              hide-bottom
              dense
              title="Grounds Materials"
            >
              <template v-slot:body="props">
                <q-tr :props="props">
                  <q-td key="name" :props="props">
                    {{ props.row.name }}
                  </q-td>
                  <q-td key="description" :props="props">
                    {{ props.row.description }}
                  </q-td>
                  <q-td key="stockNo" :props="props">
                    {{ props.row.stockNo }}
                  </q-td>
                  <q-td key="unit" :props="props">
                    {{ props.row.unit }}
                  </q-td>
                  <q-td key="value" :props="props">
                    {{ props.row.value }}
                  </q-td>
                  <q-td key="quantity" :props="props">
                    {{ props.row.quantity }}
                  </q-td>
                  <q-td key="category" :props="props">
                    {{ props.row.category }}
                  </q-td>
                  <q-td key="toEdit" :props="props">
                    {{ props.row.toEdit }}
                    <q-btn class="bg-secondary" push label="Update" @click="change=true">
                        <q-popup-edit v-model="change" persistent>
                          <div class="q-pa-xs q-ma-xs" align="right">
                            <q-input class="q-pa-xs" outlined dense v-model="name" label="Name">
                              <template v-slot:append>
                                <q-icon name="close" @click="name = ''" class="cursor-pointer" />
                              </template>
                            </q-input>
                            <q-input class="q-pa-xs" outlined dense v-model="description" label="Description">
                              <template v-slot:append>
                                <q-icon name="close" @click="description = ''" class="cursor-pointer" />
                              </template>
                            </q-input>
                            <q-input class="q-pa-xs" outlined dense v-model="stockNo" label="Stock No.">
                              <template v-slot:append>
                                <q-icon name="close" @click="stockNo = ''" class="cursor-pointer" />
                              </template>
                            </q-input>
                            <q-input class="q-pa-xs" outlined dense v-model="unit" label="Unit">
                              <template v-slot:append>
                                <q-icon name="close" @click="unit = ''" class="cursor-pointer" />
                              </template>
                            </q-input>
                            <q-input class="q-pa-xs" outlined dense v-model="value" label="Value">
                              <template v-slot:append>
                                <q-icon name="close" @click="value = ''" class="cursor-pointer" />
                              </template>
                            </q-input>
                            <q-input class="q-pa-xs" outlined dense type="number" v-model="quantity" label="Quantity"/>
                            <q-select outlined dense class="q-pa-xs" v-model="category" :options="options" label="Category" />
                            <br/>
                            <q-btn flat label="Close" v-close-popup/>
                            <q-btn flat label="Set" @click="toEdit(props.row.id, quantity, name, description, stockNo, unit, value, category)"/>
                          </div>
                        </q-popup-edit>
                    </q-btn>
                  </q-td>
                  <q-td key="toDelete" :props="props">
                    {{ props.row.toDelete }}
                    <q-btn class="bg-primary" push label="Delete" @click="toDelete(props.row.id)">
                      <q-space/>
                    </q-btn>
                  </q-td>
                </q-tr>
              </template>
            </q-table>
          </div>
          <br/>
<!-- TRANSPO -->
           <div style="width: 100%;">
            <q-table
              class="my-sticky-header-table"
              :data="transportationData"
              :columns="columns"
              row-key="name"
              :filter="filter"
              hide-bottom
              dense
              title="Transportation Materials"
            >
              <template v-slot:body="props">
                <q-tr :props="props">
                  <q-td key="name" :props="props">
                    {{ props.row.name }}
                  </q-td>
                  <q-td key="description" :props="props">
                    {{ props.row.description }}
                  </q-td>
                  <q-td key="stockNo" :props="props">
                    {{ props.row.stockNo }}
                  </q-td>
                  <q-td key="unit" :props="props">
                    {{ props.row.unit }}
                  </q-td>
                  <q-td key="value" :props="props">
                    {{ props.row.value }}
                  </q-td>
                  <q-td key="quantity" :props="props">
                    {{ props.row.quantity }}
                  </q-td>
                  <q-td key="category" :props="props">
                    {{ props.row.category }}
                  </q-td>
                  <q-td key="toEdit" :props="props">
                    {{ props.row.toEdit }}
                    <q-btn class="bg-secondary" push label="Update" @click="change=true">
                        <q-popup-edit v-model="change" persistent>
                          <div class="q-pa-xs q-ma-xs" align="right">
                            <q-input class="q-pa-xs" outlined dense v-model="name" label="Name">
                              <template v-slot:append>
                                <q-icon name="close" @click="name = ''" class="cursor-pointer" />
                              </template>
                            </q-input>
                            <q-input class="q-pa-xs" outlined dense v-model="description" label="Description">
                              <template v-slot:append>
                                <q-icon name="close" @click="description = ''" class="cursor-pointer" />
                              </template>
                            </q-input>
                            <q-input class="q-pa-xs" outlined dense v-model="stockNo" label="Stock No.">
                              <template v-slot:append>
                                <q-icon name="close" @click="stockNo = ''" class="cursor-pointer" />
                              </template>
                            </q-input>
                            <q-input class="q-pa-xs" outlined dense v-model="unit" label="Unit">
                              <template v-slot:append>
                                <q-icon name="close" @click="unit = ''" class="cursor-pointer" />
                              </template>
                            </q-input>
                            <q-input class="q-pa-xs" outlined dense v-model="value" label="Value">
                              <template v-slot:append>
                                <q-icon name="close" @click="value = ''" class="cursor-pointer" />
                              </template>
                            </q-input>
                            <q-input class="q-pa-xs" outlined dense type="number" v-model="quantity" label="Quantity"/>
                            <q-select outlined dense class="q-pa-xs" v-model="category" :options="options" label="Category" />
                            <br/>
                            <q-btn flat label="Close" v-close-popup/>
                            <q-btn flat label="Set" @click="toEdit(props.row.id, quantity, name, description, stockNo, unit, value, category)"/>
                          </div>
                        </q-popup-edit>
                    </q-btn>
                  </q-td>
                  <q-td key="toDelete" :props="props">
                    {{ props.row.toDelete }}
                    <q-btn class="bg-primary" push label="Delete" @click="toDelete(props.row.id)">
                      <q-space/>
                    </q-btn>
                  </q-td>
                </q-tr>
              </template>
            </q-table>
            <br/>
          <q-btn no-caps push class="q-mr-sm" color="secondary" label="Add Material" @click="add=true"/>
            <q-dialog v-model="add" class="bg-secondary">
              <q-card>
                <q-card-section class="row items-center q-pb-none">
                  <div class="text-h6">Add Material</div>
                  <q-space />
                  <q-btn icon="close" flat round dense v-close-popup />
                </q-card-section>

                <q-card-section>
                  <q-input class="q-pa-xs" outlined dense v-model="newName" label="Material Name"/>
                  <q-input class="q-pa-xs" outlined dense v-model="newDescription" label="Description"/>
                  <q-input class="q-pa-xs" outlined dense v-model="newStockNo" label="Stock No."/>
                  <q-input class="q-pa-xs" outlined dense v-model="newUnit" label="Unit of Measurement"/>
                  <q-input class="q-pa-xs" outlined dense v-model="newValue" label="Unit Value"/>
                  <q-input class="q-pa-xs" outlined type="number" dense v-model="newQuantity" label="Quantity" />
                  <q-select outlined dense class="q-pa-xs" v-model="category" :options="options" label="Category" />
                  <br/>
                  <q-btn @click="addMaterial" class="q-pa-xs" color="primary" label="Submit"/>
                </q-card-section>
              </q-card>
            </q-dialog>
          <q-btn no-caps push @click="$router.push('/InventoryHomepage')" class="q-mr-sm" label="Generate File" color="secondary"/>
          </div>

          </div>
          </div>
          </q-page>
        <router-view/>
    </q-page-container>
  </q-layout>
</template>

<style lang="sass">
.my-sticky-header-table
  .q-table__top,
  thead tr:first-child th
    background-color: #9C3B3B

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
      filter: '',
      newName: '',
      newDescription: '',
      newStockNo: '',
      newUnit: '',
      newValue: '',
      newQuantity: '',

      name: '',
      description: '',
      stockNo: '',
      unit: '',
      value: '',
      quantity: '',
      plumbingData: [],
      electricityData: [],
      groundsData: [],
      transportationData: [],
      options: [
        'Plumbing', 'Electricity', 'Grounds', 'Transportation'
      ],
      add: false,
      change: false,
      dense: false,
      category: '',
      columns: [
        { name: 'name', required: true, label: 'Name', align: 'left', sortable: true },
        { name: 'description', label: 'Description', field: 'description', align: 'left' },
        { name: 'stockNo', label: 'Stock No.', field: 'stockNo', sortable: true, align: 'left' },
        { name: 'unit', label: 'Unit of Measurement.', field: 'unit', sortable: true, align: 'left' },
        { name: 'value', label: 'Unit Value', field: 'value', sortable: true, align: 'left' },
        { name: 'quantity', label: 'Quantity', field: 'quantity', sortable: true, align: 'left' },
        { name: 'category', label: 'Category', field: 'category', sortable: true, align: 'left' },
        { name: 'toEdit', field: 'toEdit', align: 'left', label: 'Edit' },
        { name: 'toDelete', field: 'toDelete', align: 'left', label: 'Delete' }
      ]
    }
  },
  created () {
    this.getMaterial()
  },
  computed: {
    date () {
      let timeStamp = Date.now()
      return date.formatDate(timeStamp, 'dddd D MMMM YYYY')
    }
  },
  methods: {
    async getMaterial () {
      try {
        await db.collection('materials').get().then(querySnapshot => {
          querySnapshot.forEach(res => {
            const matData = {
              id: res.id,
              name: res.data().name,
              description: res.data().description,
              stockNo: res.data().stockNo,
              unit: res.data().unit,
              value: res.data().value,
              quantity: res.data().quantity,
              category: res.data().category
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
            // this.plumbingData.push(matData)
          })
        })
      } catch (error) {
        console.log(error)
      }
    },
    async addMaterial () {
      try {
        const matDb = await db.collection('materials').add({
          name: this.newName,
          description: this.newDescription,
          stockNo: this.newStockNo,
          unit: this.newUnit,
          value: this.newValue,
          quantity: this.newQuantity,
          category: this.category
        })
        this.newName = ''
        this.newDescription = ''
        this.newStockNo = ''
        this.newUnit = ''
        this.newValue = ''
        this.newQuantity = ''
        this.category = ''
        this.data.push({
          name: this.newName,
          description: this.description,
          stockNo: this.stockNo,
          unit: this.unit,
          value: this.category,
          quantity: this.newQuantity,
          category: this.category,
          id: matDb.id
        })
        window.location.reload()
      } catch (error) {
        console.log(error)
      }
    },
    toDelete (id) {
      this.$q.dialog({
        title: 'Delete material?',
        cancel: true,
        persistentL: true
      }).onOk(async () => {
        try {
          await db.collection('materials').doc(id).delete()
          // const matDb = await db.collection('materials').doc(id).delete()
          // console.log('Material deleted: ', matDb.id)
          window.location.reload()
        } catch (error) {
          console.log(error)
        }
      }
      )
    },
    async toEdit (id, updateQuantity, updateName, updateDescription, updateStockNo, updateUnit, updateValue, updateCategory) {
      // console.log('Gasulod sa method')
      this.id = id
      this.updateQuantity = updateQuantity
      this.updateName = updateName
      this.updateDescription = updateDescription
      this.updateStockNo = updateStockNo
      this.updateUnit = updateUnit
      this.updateValue = updateValue
      this.updateCategory = updateCategory
      try {
        // const matDb = await db.collection('materials').doc(this.id).update({
        if (updateName !== '') {
          await db.collection('materials').doc(this.id).update({
            name: updateName
          })
        }
        if (updateQuantity !== '') {
          await db.collection('materials').doc(this.id).update({
            quantity: updateQuantity
          })
        }
        if (updateDescription !== '') {
          await db.collection('materials').doc(this.id).update({
            description: updateDescription
          })
        }
        if (updateStockNo !== '') {
          await db.collection('materials').doc(this.id).update({
            stockNo: updateStockNo
          })
        }
        if (updateUnit !== '') {
          await db.collection('materials').doc(this.id).update({
            unit: updateUnit
          })
        }
        if (updateValue !== '') {
          await db.collection('materials').doc(this.id).update({
            value: updateValue
          })
        }
        if (updateCategory !== '') {
          await db.collection('materials').doc(this.id).update({
            category: updateCategory
          })
        }
        // await db.collection('materials').doc(this.id).update({
        //   name: updateName,
        //   quantity: updateQuantity,
        //   description: updateDescription,
        //   stockNo: updateStockNo,
        //   unit: updateUnit,
        //   value: updateValue,
        //   category: updateCategory
        // })
      } catch (error) {
        console.log(error)
      } finally {
        this.id = id
        this.name = updateName
        this.quantity = updateQuantity
        this.description = updateDescription
        this.stockNo = updateStockNo
        this.unit = updateUnit
        this.value = updateValue
        this.category = updateCategory
      }
      window.location.reload()
    }
  }
}
</script>

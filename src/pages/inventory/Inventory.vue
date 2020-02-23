<template>
   <q-layout view="hHh lpR fFf">
    <q-page-container>
        <q-page class="flex flex-center text-center">
          <div class="q-gutter-sm flex text-center">
            <div style="width: 100%; height: 50%;">
              <h2> Inventory </h2>
              <q-input borderless dense debounce="300" v-model="filter" placeholder="Search">
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>
            </div>
            <div style="width: 100%;">
            <q-table
              class="my-sticky-column-table"
              :data="data"
              :columns="columns"
              row-key="name"
              :filter="filter"
            >
              <template v-slot:body="props">
                <q-tr :props="props">
                  <q-td key="name" :props="props">
                    {{ props.row.name }}
                  </q-td>
                  <q-td key="quantity" :props="props">
                    {{ props.row.quantity }}
                  </q-td>
                  <q-td key="toEdit" :props="props">
                    {{ props.row.toEdit }}
                    <q-btn flat label="Edit" @click="change=true">
                        <q-popup-edit v-model="change" title="Update quantity" persistent>
                        <q-input type="number" v-model="props.row.quantity" dense autofocus hint="Use buttons to close"
                        />
                        <q-btn flat label="Close" v-close-popup/>
                        <q-btn flat label="Set" @click="toEdit(props.row.id)"/>
                        </q-popup-edit>
                    </q-btn>
                  </q-td>
                  <q-td key="toDelete" :props="props">
                    {{ props.row.toDelete }}
                    <q-btn flat label="Delete" @click="toDelete(props.row.id)">
                      <q-space/>
                    </q-btn>
                  </q-td>
                </q-tr>
              </template>
            </q-table>
            </div>
          <q-btn no-caps push class="q-mr-sm" color="secondary" label="Add Material" @click="add=true"/>
            <q-dialog v-model="add" class="bg-secondary">
              <q-card>
                <q-card-section class="row items-center q-pb-none">
                  <div class="text-h6">Add Material</div>
                  <q-space />
                  <q-btn icon="close" flat round dense v-close-popup />
                </q-card-section>

                <q-card-section>
                  <q-input dense v-model="new_name" label="Material Name"/>
                  <q-input dense v-model="new_quantity" label="Quantity" />
                  <br/>
                  <q-btn @click="addMaterial" label="Submit"/>
                </q-card-section>
              </q-card>
            </q-dialog>
          <q-btn no-caps push @click="$router.push('/InventoryHomepage')" class="q-mr-sm" label="Generate File" color="secondary"/>
          </div>
          </q-page>
        <router-view/>
    </q-page-container>
  </q-layout>
</template>

<style lang="sass">

  td:first-child
    background-color: #e8a87c

  th:first-child,
  td:first-child
    position: sticky
    left: 0
    z-index: 1
</style>

<script>
import { db } from 'boot/firebase'

export default {
  data () {
    return {
      filter: '',
      new_name: '',
      new_quantity: '',
      data: [],
      add: false,
      change: false,
      // toEdit: false,
      // toDelete: false,
      columns: [
        {
          name: 'name',
          required: true,
          label: 'Name',
          align: 'left',
          field: row => row.name,
          format: val => `${val}`,
          sortable: true
        },
        { name: 'quantity', label: 'Quantity', field: 'quantity', sortable: true, align: 'left' },
        { name: 'toEdit', field: 'toEdit', align: 'left' },
        { name: 'toDelete', field: 'toDelete', align: 'left' }
      ]
    }
  },
  created () {
    this.getMaterial()
  },
  methods: {
    async getMaterial () {
      try {
        const matDb = await db.collection('materials').get()

        matDb.forEach(res => {
          console.log(res)
          const matData = { id: res.id, name: res.data().name, quantity: res.data().quantity }
          this.data.push(matData)
        })
      } catch (error) {
        console.log(error)
      }
    },
    async addMaterial () {
      try {
        const matDb = await db.collection('materials').add({
          name: this.new_name,
          quantity: this.new_quantity
        })
        this.new_name = ''
        this.new_quantity = ''
        this.data.push({
          name: this.new_name,
          quantity: this.new_quantity,
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
    toEdit (id) {
      console.log('Gasulod sa method')
      // window.location.reload()
    }
  }
}
</script>

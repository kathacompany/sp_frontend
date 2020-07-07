<template>
  <q-layout view="hHh lpR fFf">
    <q-page-container>
        <q-page class="window-height window-width row justify-center">
          <div class="q-gutter-sm flex text-center">
            <div style="width: 100%; height: 50%;">
              <h5 class="text-weight-light">MATERIAL REQUESTS</h5>{{ date }}<br><br>
              <q-input outlined clearable color="secondary" dense debounce="300" v-model="filter" placeholder="Search by Material Name">
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>
              <br>

          <div style="width: 100%;">
            <q-banner v-if="!matData.length" class="bg-grey-2 q-pa-md" style="min-width: 800px; height: 150px">
              <template v-slot:avatar>
                <q-icon name="sentiment_dissatisfied" color="accent" />
              </template>
             <span class="text-h6 text-grey text-weight-thin">No Records Found!</span>
            </q-banner>
            <q-table
              class="my-sticky-header-table"
              :data="matData"
              :columns="columns"
              row-key="material"
              v-else
              :filter="filter"
              :separator="separator"
              hide-bottom
              dense
              title="Requests"
            >
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
      matData: [],
      columns: [
        { name: 'material', label: 'Material', field: 'material', align: 'left', sortable: true },
        { name: 'jobId', label: 'jobId', field: 'jobId', align: 'left', sortable: true },
        { name: 'quantity', label: 'Requested Quantity', field: 'quantity', align: 'left' },
        { name: 'status', label: 'Status', field: 'status', align: 'left' }
      ]
    }
  },
  async created () {
    try {
      await db.collection('material_requests').get().then(querySnapshot => {
        querySnapshot.forEach(doc => {
          const matData = {
            matId: doc.id,
            material: doc.data().material,
            jobId: doc.data().jobId,
            quantity: doc.data().quantity,
            foreman: doc.data().foreman,
            status: doc.data().status
          }
          this.matData.push(matData)
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

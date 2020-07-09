<template>
  <q-layout view="hHh lpR fFf">
    <q-page-container>
        <q-page class="window-height window-width row justify-center">
          <div class="q-gutter-sm flex text-center">
            <div style="width: 100%; height: 50%;">
              <h5 class="text-weight-light">MATERIAL REQUESTS</h5>{{ date }}<br><br>

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
                </q-tabs>

                <q-separator />

                <q-tab-panels v-model="tab" animated>
                  <q-tab-panel name="tab 1">

                    <div style="width: 100%;">
                      <q-banner v-if="!matData.length" class="bg-grey-2 q-pa-md" style="min-width: 800px; height: 150px">
                        <template v-slot:avatar>
                          <q-icon name="remove_shopping_cart" color="accent" />
                        </template>
                       <span class="text-h6 text-grey text-weight-thin">No Requested Materials!</span>
                      </q-banner>
                      <q-list bordered class="rounded-borders" style="width: 600px" v-for="data in matData" :key="data.id">
                      <q-item>

                      <q-item-section avatar center>
                        <q-icon name="shopping_cart" color="black" size="30px" />
                      </q-item-section>

                      <q-item-section class="col-2 gt-sm">
                        <q-item-label caption lines="2">Request/s, Material/s</q-item-label>
                        <q-item-label class="q-mt-sm">{{ data.materials.map(({request}) => request).join(', ') }}</q-item-label>
                        <q-item-label class="q-mt-sm">{{ data.materials.map(({material}) => material).join(', ') }}</q-item-label>
                      </q-item-section>

                      <q-item-section center>
                        <q-item-label lines="1">
                          <span class="text-weight-medium">{{ data.jobId }}</span>
                        </q-item-label>
                        <q-item-label class="text-weight-light text-secondary">
                          status: > {{ data.status }}
                        </q-item-label>
                      </q-item-section>

                      <q-item-section side>
                        <div class="text-grey-8 q-gutter-xs">
                          <q-btn class="gt-xs" size="12px" flat dense round icon="delete" color="accent" @click="toDelete(data.jobId)"/>
                        </div>
                      </q-item-section>
                    </q-item>
                  </q-list>
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
import { date } from 'quasar'

export default {
  data () {
    return {
      selected: [],
      separator: 'cell',
      tab: 'tab 1',
      dense: false,
      edit_dialog: false,
      editedIndex: -1,
      filter: '',
      activeMaterial: null,
      editedItem: {
        material: '',
        request: 0
      },
      matData: [],
      columns: [
        { name: 'material', label: 'Material', field: 'materials', align: 'left', sortable: true },
        { name: 'jobId', label: 'jobId', field: 'jobId', align: 'left', sortable: true },
        { name: 'status', label: 'Status', field: 'status', align: 'left' }
      ]
    }
  },
  async created () {
    const matRef = db.collection('material_requests')

    try {
      await matRef.get().then(querySnapshot => {
        querySnapshot.forEach(doc => {
          const matReq = (doc.data().material).map(item => {
            const container = {}
            container.material = item.material
            container.request = item.request
            return container
          })
          const matData = {
            id: doc.id,
            jobId: doc.data().jobId,
            status: doc.data().status,
            materials: matReq
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
      this.activeReq = this.editedItem.id
      console.log(this.activeReq)
    },
    toDelete (jobId) {
      this.$q.dialog({
        title: 'Delete Confirm',
        message: 'Your request  will be cancelled. Are you sure you want to continue?',
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
          await db.collection('material_requests').doc(jobId).delete()
          location.reload()
          this.$q.notify({
            avatar: 'delete',
            color: 'accent',
            message: 'Request cancelled'
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

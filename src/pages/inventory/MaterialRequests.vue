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
                        <span>
                          <q-icon name="shopping_cart" color="black" size="30px" />
                        </span>
                      </q-item-section>

                      <q-item-section class="col-2 gt-sm">

                        <q-item-label caption lines="2"><span>Request/s, Material/s</span></q-item-label>
                        <q-item-label class="text-weight-medium">{{ data.category }}</q-item-label>
                        <q-item-label class="q-mt-sm">{{ data.materials.map(({request}) => request).join(', ') }}</q-item-label>
                        <q-item-label class="q-mt-sm">{{ data.materials.map(({material}) => material).join(', ') }}</q-item-label>
                      </q-item-section>

                      <q-item-section center>
                        <q-item-label lines="1">
                          <span class="text-weight-medium">{{ data.jobId }}</span>
                        </q-item-label>
                        <q-item-label class="text-subtitle1 text-weight-light text-secondary">
                          status: > {{ data.status }}
                        </q-item-label>
                        <q-item-label class="text-weight-light text-secondary">
                          foreman: > {{ data.foreman }}
                        </q-item-label>
                      </q-item-section>

                      <q-item-section side>
                        <div class="text-grey-8 items-center q-gutter-xs">
                          <q-checkbox
                            v-model="selection"
                            color="secondary"
                            true-value="yes"
                            false-value="no"
                          />
                          <span v-if="selection==='yes'">
                            <q-btn class="gt-xs" size="20px" flat dense round icon="thumb_up_alt" color="secondary" @click="toEdit(data)"/>
                             <q-btn flat dense size="20px" color="secondary" round icon="thumb_down_alt" class="gt-xs" @click="toEditRej(data)"/>
                          </span>
                        </div>
                      </q-item-section>

                        <q-dialog v-model="edit_dialog" persistent transition-show="rotate" transition-hide="rotate">
                          <q-card style="width: 350px">
                            <q-bar class="bg-secondary text-white" style="height: 60px">
                              <div class="text-h6 text-weight-light">Edit Material Request</div>
                              <q-space />
                              <q-btn icon="close" flat round dense v-close-popup />
                            </q-bar>
                            <q-card-section>
                              <div class="q-pa-sm">
                                <span class="text-weight-medium">Approve the following material request/s: </span>
                                <q-item-section class="col-2 gt-sm">
                                  <q-item-label class="text-grey-6 q-mt-sm">Request/s : {{ data.materials.map(({request}) => request).join(', ') }}</q-item-label>
                                  <q-item-label class="text-grey-6 q-mt-sm">Material/s : {{ data.materials.map(({material}) => material).join(', ') }}</q-item-label>
                                  <q-item-label class="text-grey-6 q-mt-sm">Requested by : {{ data.foreman }}</q-item-label>
                                </q-item-section>
                              </div>
                            </q-card-section>
                            <q-card-actions class="justify-center">
                              <q-btn no-caps @click="toApprove" color="secondary"  class="text-weight-light"  label="Accept" v-close-popup/>
                            </q-card-actions>
                          </q-card>
                        </q-dialog>

                        <q-dialog v-model="reject" persistent>
                        <q-card style="width: 350px">
                          <q-bar class="bg-secondary text-white" style="height: 60px">
                            <div class="text-h6 text-weight-light">Reason of Reject</div>
                            <q-space />
                            <q-btn icon="close" flat round dense v-close-popup />
                          </q-bar>
                          <q-card-section>
                            <span class="text-h6  text-weight-medium q-ma-sm">Your cancelling the request!</span><br>
                            <span class="text-grey q-ma-sm">Please specify your reason.</span>
                            <q-input class="q-pa-xs" outlined dense clearable color="accent" type="textarea" autogrow v-model="reason" placeholder="Enter text here"/>
                          </q-card-section>
                          <q-card-actions align="right">
                            <q-btn flat class="q-ma-sm text-weight-light" label="Submit" color="secondary" @click="onReject" v-close-popup/>
                          </q-card-actions>
                        </q-card>
                      </q-dialog>
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
      reject: false,
      reason: '',
      dense: false,
      selection: 'no',
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
            foreman: doc.data().foreman,
            category: doc.data().category,
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
    toEdit (data, jobId) {
      this.edit_dialog = true
      this.editedItem = Object.assign({}, data)
      this.activeReq = this.editedItem.id
    },
    toApprove () {
      const matRef = db.collection('material_requests').doc(this.activeReq)
      matRef.update({
        status: 'for Release'
      })
        .then(
          location.reload(),
          this.$q.notify({
            color: 'secondary',
            message: 'Status updated'
          })
        )
        .catch(error => {
          console.error('Error: ', error)
        })
    },
    toEditRej (data, jobId) {
      this.reject = true
      this.editedItem = Object.assign({}, data)
      this.activeReq = this.editedItem.id
    },
    onReject () {
      const matRef = db.collection('material_requests').doc(this.activeReq)
      this.status = 'Rejected! ' + '(' + this.reason + ')'
      matRef.update({
        status: this.status
      })
        .then(
          location.reload(),
          this.$q.notify({
            color: 'secondary',
            message: 'Status updated'
          })
        )
        .catch(error => {
          console.error('Error: ', error)
        })
    },
    toDelete (jobId) {
      this.$q.dialog({
        title: 'Delete Confirm',
        message: 'The request  will be cancelled. Are you sure you want to continue?',
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

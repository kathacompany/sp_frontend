<template>
  <q-layout view="hHh lpR fFf">
    <q-page-container>
        <q-page class="window-height window-width row justify-center">
          <div class="q-gutter-sm flex text-center">
            <div style="width: 100%; height: 50%;">
              <h5 class="text-weight-light">MATERIAL REQUESTS</h5><span class="text-weight-medium">{{ date }}</span><br><br>

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
                <q-tab name="tab 1" label="Ongoing Requests" icon="add_shopping_cart">
                </q-tab>
                <q-tab name="tab 2" label="Done Requests" icon="assignment_turned_in">
                </q-tab>
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
                      <q-list bordered separator class="rounded-borders" style="width: 600px">
                        <q-item v-for="data in matData" :key="data.id">

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
                              <span class="text-weight-medium">JOB ID: {{ data.jobId }}</span>
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

                <q-tab-panel name="tab 2">

                  <div style="width: 100%;">
                    <q-banner v-if="!comData.length" class="bg-grey-2 q-pa-md" style="min-width: 800px; height: 150px">
                      <template v-slot:avatar>
                        <q-icon name="remove_shopping_cart" color="accent" />
                      </template>
                      <span class="text-h6 text-grey text-weight-thin">No Requested Materials!</span>
                    </q-banner>
                    <q-list bordered separator class="rounded-borders" style="width: 600px">
                      <q-item v-for="data in comData" :key="data.id">

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
                            <span class="text-weight-medium">JOB ID: {{ data.jobId }}</span>
                          </q-item-label>
                          <q-item-label class="text-weight-light text-secondary">
                            status: > {{ data.status }}
                          </q-item-label>
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

<script>
import { db } from 'boot/firebase'
import { LocalStorage, date } from 'quasar'

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
      comData: [],
      matData: [],
      columns: [
        { name: 'material', label: 'Material', field: 'materials', align: 'left', sortable: true },
        { name: 'jobId', label: 'jobId', field: 'jobId', align: 'left', sortable: true },
        { name: 'status', label: 'Status', field: 'status', align: 'left' }
      ]
    }
  },
  async created () {
    const user = JSON.parse(LocalStorage.getItem('user'))
    const matRef = db.collection('material_requests').where('foreId', '==', user.uid)

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
          if (matData.status === 'Done') {
            this.comData.push(matData)
          } else {
            this.matData.push(matData)
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

<template>
  <q-layout view="hHh lpR fFf">
    <q-page-container>
        <q-page class="window-height window-width row justify-center">
          <div class="q-gutter-sm flex text-center">
            <div style="width: 100%; height: 50%;">
              <h5 class="text-weight-light">MATERIAL REQUESTS</h5><span class="text-weight-medium">{{ date }}</span><br><br>
              <q-input v-if="matData.length || comData.length" outlined clearable color="secondary" dense debounce="300" v-model="filter" placeholder="Search">
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
                       <span class="text-h6 text-grey text-weight-thin">All caught up. No Requests!</span>
                      </q-banner>
                      <q-table
                        title="Material Requests"
                        :table-style="'counter-reset: cssRowCounter '"
                        v-else
                        dense
                        :data="matData"
                        :columns="column"
                        row-key="jobId"
                        :filter="filter"
                        :separator="separator"
                        :selected-rows-label="getSelectedString"
                        selection="single"
                        :selected.sync="selected"
                      >
                        <template v-slot:top-right v-if="selected.length">
                          <q-btn no-caps size="20px" flat icon="check_circle" class="text-weight-light" color="secondary" @click="approve=true"/>
                          <q-btn no-caps size="20px" flat icon="cancel" class="text-weight-light" color="accent" @click="reject=true"/>
                        </template>
                        <template v-slot:header="props">
                          <q-tr :props="props">
                            <q-th key="selected"/>
                            <q-th class="text-italic text-accent" auto-width>#</q-th>
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
                            <q-td>
                              <q-checkbox dense color="secondary" v-model="props.selected"/>
                            </q-td>
                            <q-td><span class="text-secondary text-weight-bold rowNumber"/></q-td>
                            <q-td auto-width>
                              <q-btn round dense color="accent" @click="props.expand = !props.expand" :icon="props.expand ? 'shopping_cart' : 'shopping_cart'" />
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
                              <div class="text-left"><span class="text-italic text-accent">Material/s</span><br/>{{ props.row.materials.map(({material}) => material).join(', ') }}</div><br/>
                              <div class="text-left"><span class="text-italic text-accent">Request/s</span><br/>{{ props.row.materials.map(({request}) => request).join(', ') }}</div>
                            </q-td>
                          </q-tr>
                        </template>
                      </q-table>

                      <q-dialog v-model="approve" persistent transition-show="rotate" transition-hide="rotate">
                        <q-card>
                          <q-bar class="bg-secondary text-white" style="height: 50px">
                            <div class="text-weight-light">Approve Confirm</div>
                          </q-bar>
                          <q-card-section>
                            <span class="q-ma-sm text-grey">Approve the following request?</span>
                          </q-card-section>

                          <q-card-actions align="right">
                            <q-btn flat label="Cancel" color="accent" v-close-popup />
                            <q-btn flat label="Accept" color="secondary" @click="toApprove(selected)" v-close-popup/>
                          </q-card-actions>
                        </q-card>
                      </q-dialog>

                      <q-dialog v-model="reject" persistent transition-show="rotate" transition-hide="rotate">
                        <q-card style="width: 350px">
                          <q-bar class="bg-accent text-white" style="height: 60px">
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
                            <q-btn flat class="q-ma-sm text-weight-light" label="Submit" color="accent" @click="onReject(selected)" v-close-popup/>
                          </q-card-actions>
                        </q-card>
                      </q-dialog>
                    </div>
                  </q-tab-panel>

                  <q-tab-panel name="tab 2">
                    <div style="width: 100%;">
                      <q-banner v-if="!comData.length" class="bg-grey-2 q-pa-md" style="min-width: 800px; height: 150px">
                        <template v-slot:avatar>
                          <q-icon name="remove_shopping_cart" color="accent" />
                        </template>
                       <span class="text-h6 text-grey text-weight-thin">No Done Requests!</span>
                      </q-banner>
                      <q-table
                        title="Material Requests"
                        :table-style="'counter-reset: cssRowCounter '"
                        v-else
                        dense
                        :data="comData"
                        :columns="column"
                        row-key="jobId"
                        :filter="filter"
                        :separator="separator"
                      >
                      <template v-slot:header="props">
                        <q-tr :props="props">
                          <q-th class="text-italic text-accent" auto-width>#</q-th>
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
                          <q-td><span class="text-secondary text-weight-bold rowNumber"/></q-td>
                          <q-td auto-width>
                            <q-btn round dense color="accent" @click="props.expand = !props.expand" :icon="props.expand ? 'shopping_cart' : 'shopping_cart'" />
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
                            <div class="text-left"><span class="text-italic text-accent">Material/s</span><br/>{{ props.row.materials.map(({material}) => material).join(', ') }}</div><br/>
                            <div class="text-left"><span class="text-italic text-accent">Request/s</span><br/>{{ props.row.materials.map(({request}) => request).join(', ') }}</div>
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

<script>
import { db } from 'boot/firebase'
import { date } from 'quasar'

export default {
  data () {
    return {
      editedIndex: -1,
      filter: '',
      separator: 'cell',
      tab: 'tab 1',
      reject: false,
      approve: false,
      done: false,
      dense: false,
      reason: '',
      editedItem: {
        status: '',
        foreman: '',
        category: '',
        materials: ''
      },
      selected: [],
      comData: [],
      matData: [],
      column: [
        { name: 'foreman', label: 'Requested By', field: 'foreman', align: 'left', sortable: true },
        { name: 'category', label: 'Category', field: 'category', align: 'left', sortable: true },
        { name: 'id', label: 'Job Id', field: 'jobId', align: 'left', sortable: true },
        { name: 'status', label: 'Status', field: 'status', align: 'left', sortable: true }
      ]
    }
  },
  async created () {
    const matRef = db.collection('material_requests').orderBy('category')

    try {
      await matRef.get().then(querySnapshot => {
        querySnapshot.forEach(doc => {
          const matReq = (doc.data().material).map(item => {
            const container = {}
            container.matId = item.matId
            container.material = item.material
            container.request = item.request
            container.quantity = item.quantity
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
      return this.selected.length === 0 ? '' : `${this.selected.length} request${this.selected.length > 1 ? 's' : ''} selected of ${this.matData.length}`
    },
    toApprove (selected) {
      for (var i = 0; i < selected.length; i++) {
        const jobId = selected[i]['jobId']
        const foreman = selected[i]['foreman']
        const mat = selected[i]['materials']

        for (i = 0; i < mat.length; i++) {
          const matId = mat[i]['matId']
          const request = parseInt(mat[i]['request'])
          const quantity = parseInt(mat[i]['quantity'])

          if (quantity <= request) {
            this.$q.notify({
              color: 'accent',
              message: 'Not enough quantity, Reject request!'
            })
          } else if (quantity > request) {
            try {
              const item = db.collection('materials').doc(matId)
              const matRef = db.collection('material_requests').doc(jobId)

              db.collection('materials').get().then(querySnapshot => {
                querySnapshot.forEach(doc => {
                  const total = parseInt(quantity - request)

                  item.update({
                    issued: foreman,
                    quantity: total
                  })
                  matRef.update({
                    status: 'Approve! for Release'
                  })
                  location.reload()
                  this.$q.notify({
                    color: 'secondary',
                    message: 'Status updated'
                  })
                })
              })
            } catch (error) {
              console.error('Error: ', error)
            }
          }
        }
      }
    },
    onReject (selected) {
      for (var i = 0; i < selected.length; i++) {
        const jobId = selected[i]['jobId']
        this.status = 'Rejected! ' + '(' + this.reason + ')'
        const matRef = db.collection('material_requests').doc(jobId)
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
      }
    }
  }
}
</script>

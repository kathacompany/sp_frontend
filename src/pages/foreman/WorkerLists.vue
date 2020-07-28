<template>
  <q-layout view="hHh lpR fFf">
    <q-page-container>
        <q-page class="window-height window-width row justify-center">
          <div class="q-gutter-sm flex text-center">
            <div style="width: 100%; height: 50%;">
              <h5 class="text-weight-light">WORKER LISTS</h5><span class="text-weight-medium">{{ date }}</span><br><br>
              <q-input  v-if="workers.length" outlined clearable color="secondary" dense debounce="300" v-model="filter" placeholder="Search">
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
                </q-tabs>
                <q-separator />

                <q-tab-panels v-model="tab" animated>
                  <q-tab-panel name="tab 1">

                    <div style="width: 100%;">
                      <q-banner v-if="!workers.length" class="bg-grey-2 q-pa-md" style="min-width: 800px; height: 150px">
                        <template v-slot:avatar>
                          <q-icon name="sentiment_dissatisfied" color="accent" />
                        </template>
                       <span class="text-h6 text-grey text-weight-thin">No Records Found!</span>
                       <template v-slot:action>
                        <q-btn class="text-weight-light q-ma-sm" flat icon="person_add" color="secondary" label="Worker" @click="add_dialog=true"/>
                      </template>
                      </q-banner>
                      <q-table
                        title="Workers"
                        :table-style="'counter-reset: cssRowCounter '"
                        :data="workers"
                        :separator="separator"
                        :columns="column"
                        v-else
                        row-key="id"
                        :filter="filter"
                        dense
                      >
                        <template v-slot:top-right>
                          <q-btn no-caps icon="person_add" unelevated class="q-ma-sm text-weight-light" label="Worker" color="secondary" @click="add_dialog=true"/>
                        </template>
                        <template v-slot:no-data="{ icon, message, filter }">
                          <div class="full-width row flex-center text-accent q-gutter-sm">
                            <q-icon size="2em" name="sentiment_dissatisfied" />
                            <span>
                              Well this is sad... {{ message }}
                            </span>
                            <q-icon size="2em" :name="filter ? 'filter_b_and_w' : icon" />
                          </div>
                        </template>
                        <template v-slot:header="props">
                          <q-tr :props="props">
                            <q-th class="text-italic text-accent" auto-width>#</q-th>
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
                            <q-td><span class="text-secondary text-weight-bold rowNumber"/></q-td>
                            <q-td
                              v-for="col in props.cols"
                              :key="col.name"
                              :props="props"
                            >
                              {{ col.value }}
                            </q-td>
                            <q-td>
<!--                               <q-btn flat dense icon="edit" color="secondary" @click="toEdit(props.row)"/> -->
                              <q-btn flat dense icon="delete" color="accent" @click="toDelete(props.row.id)"/>
                              </q-td>
                            </q-tr>
                          </template>
                        </q-table>
                      </div>

                      <q-dialog v-model="add_dialog" persistent transition-show="rotate" transition-hide="rotate">
                        <q-card style="width: 400px">
                          <q-bar class="bg-secondary text-white" style="height: 60px">
                            <div class="text-h6 text-weight-light">Add Worker</div>
                            <q-space />
                            <q-btn icon="close" flat round dense v-close-popup />
                          </q-bar>
                          <q-card-section>
                            <q-banner v-if="!selection.length" class="text-center bg-grey-2 q-pa-md" style="min-width: 300px; height: 150px">
                              <template v-slot:avatar>
                                <q-icon name="sentiment_dissatisfied" color="accent" />
                              </template>
                             <span class="text-subtitle text-grey text-weight-light">No Records Found!</span>
                            </q-banner>
                            <q-table
                              title="Workers"
                              :table-style="'counter-reset: cssRowCounter '"
                              v-else
                              dense
                              :data="selection"
                              :columns="column"
                              row-key="id"
                              :filter="filter"
                              :separator="separator"
                              :selected-rows-label="getSelectedString"
                              selection="multiple"
                              :selected.sync="selected"
                            >
                              <template v-slot:header="props">
                                <q-tr :props="props">
                                  <q-th key="selected">
                                    <q-checkbox dense color="secondary" v-model="props.selected"/>
                                  </q-th>
                                  <q-th class="text-italic text-accent" auto-width>#</q-th>
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
                                  <q-td key="selected">
                                    <q-checkbox dense color="secondary" v-model="props.selected"/>
                                  </q-td>
                                  <q-td><span class="text-secondary text-weight-bold rowNumber"/></q-td>
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
                            <br>
                            <div v-for="data in selected" :key="data.id">
                              <q-input dense color="accent" v-model="data.name" label="Worker Name" readonly/>
                              <q-input  dense color="accent" v-model="data.position" label="Position" readonly/><br>
                            </div>
                          </q-card-section>
                          <q-card-actions>
                            <q-btn no-caps unelevated class="q-pa-xs full-width text-weight-light" label="Add Worker" color="secondary" @click="addWorker" v-close-popup/>
                          </q-card-actions>
                        </q-card>
                      </q-dialog>

                      <q-dialog v-model="edit_dialog" persistent transition-show="rotate" transition-hide="rotate">
                        <q-card style="width: 350px">
                          <q-bar class="bg-secondary text-white" style="height: 60px">
                            <div class="text-h6 text-weight-light">Update Worker</div>
                            <q-space />
                            <q-btn icon="close" flat round dense v-close-popup />
                          </q-bar>

                          <q-card-section>
                            <q-select outlined dense class="q-pa-xs" color="accent" v-model="editedItem.area" label="Area" readonly/>
                            <q-input outlined dense clearable class="q-pa-xs" color="accent" v-model="editedItem.name" label="Name" />
                            <q-input class="q-pa-xs" outlined dense clearable color="accent" v-model="editedItem.position" label="Position" />

                          </q-card-section>
                          <q-card-actions>
                            <q-btn no-caps unelevated class="full-width text-weight-light" @click="updateWorker" color="secondary" label="Save Changes" v-close-popup/>
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
import { LocalStorage, date } from 'quasar'
export default {
  data () {
    return {
      filter: '',
      separator: 'cell',
      tab: 'tab 1',
      edit_dialog: false,
      add_dialog: false,
      dense: false,
      area: '',
      data: {
        name: '',
        position: ''
      },
      editedItem: {
        name: '',
        area: '',
        position: ''
      },
      workers: [],
      selected: [],
      selection: [],
      column: [
        { name: 'name', required: true, label: 'Name', field: 'name', align: 'left', sortable: true },
        { name: 'position', label: 'Position', field: 'position', align: 'left', sortable: true },
        { name: 'area', label: 'Area', field: 'area', align: 'left', sortable: true }

      ]
    }
  },
  async created () {
    const user = JSON.parse(LocalStorage.getItem('user'))

    const useRef = db.collection('account').where('userId', '==', user.uid)
    await useRef.get().then(querySnapshot => {
      querySnapshot.forEach(doc => {
        this.foreman = doc.data().fullname
        this.area = doc.data().area
      })
      const workRef = db.collection('worker_list').where('area', '==', this.area)
      try {
        workRef.get().then(querySnapshot => {
          querySnapshot.forEach(res => {
            const matData = {
              id: res.id,
              name: res.data().name,
              position: res.data().position,
              area: res.data().area
            }
            this.workers.push(matData)
          })
        })
      } catch (error) {
        console.log(error)
      }
      const accRef = db.collection('account').where('area', '==', this.area).where('usertype', '==', 'worker').where('remarks', '==', 'None')
      try {
        accRef.get().then(querySnapshot => {
          querySnapshot.forEach(doc => {
            const matData = {
              id: doc.id,
              name: doc.data().fullname,
              position: doc.data().position,
              area: doc.data().area,
              remarks: doc.data().remarks
            }
            this.selection.push(matData)
          })
        })
      } catch (error) {
        console.log(error)
      }
    })
  },
  computed: {
    date () {
      let timeStamp = Date.now()
      return date.formatDate(timeStamp, 'dddd D MMMM YYYY')
    }
  },
  methods: {
    getSelectedString () {
      return this.selected.length === 0 ? '' : `${this.selected.length} request${this.selected.length > 1 ? 's' : ''} selected of ${this.selection.length}`
    },
    toEdit (item, id) {
      this.edit_dialog = true
      this.editedItem = Object.assign({}, item)
      this.activeWorker = this.editedItem.id
    },
    async addWorker () {
      const worker = db.collection('worker_list')
      Object.keys(this.selected).forEach(doc => {
        const accRef = db.collection('account').doc(this.selected[doc].id)
        worker.add({
          workerId: this.selected[doc].id,
          area: this.area,
          name: this.selected[doc].name,
          position: this.selected[doc].position
        })
          .then(
            accRef.set({
              remarks: 'Added'
            }, { merge: true }),
            location.reload(),
            this.$q.notify({
              color: 'secondary',
              message: 'Worker added successfully'
            })
          )
          .catch(error => {
            console.error('Error adding worker: ', error)
          })
      })
    },
    async updateWorker () {
      let docref = db.collection('worker_list').doc(this.activeWorker)
      await docref.update(this.editedItem)
        .then(
          location.reload(),
          this.$q.notify({
            color: 'secondary',
            message: 'Updated successfully'
          })
        )
        .catch(error => {
          console.error('Error updating worker: ', error)
        })
    },
    toDelete (id) {
      this.$q.dialog({
        title: 'Delete Confirm',
        message: 'The worker will no longer be assign to any work. Are you sure you want to continue?',
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
          await db.collection('worker_list').doc(id).delete()
          this.$q.notify({
            color: 'accent',
            message: 'Worker remove successfully'
          })
          window.location.reload()
        } catch (error) {
          console.log('Error removing worker', error)
        }
      })
    }
  }
}
</script>

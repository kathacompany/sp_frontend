<template>
  <q-layout view="hHh lpR fFf">
    <q-page-container>
        <q-page class="window-height window-width row justify-center">
          <div class="q-gutter-sm flex text-center">
            <div style="width: 100%; height: 50%;">
              <h5 class="text-weight-light">WORKER LISTS</h5> {{ date }}<br><br>
              <q-input  v-if="workers.length" outlined clearable color="secondary" dense debounce="300" v-model="filter" placeholder="Search by Name">
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
                  <q-btn no-caps icon="person_add"  class="text-weight-light" label="Add Worker" color="secondary" @click="add_dialog=true"/>
                  <br>
                  <br>
                    <q-dialog v-model="add_dialog" persistent transition-show="rotate" transition-hide="rotate">
                      <q-card style="width: 350px">
                        <q-bar class="bg-secondary text-white" style="height: 60px">
                          <div class="text-h6 text-weight-light">Add Worker</div>
                          <q-space />
                          <q-btn icon="close" flat round dense v-close-popup />
                        </q-bar>

                        <q-card-section>
                          <q-input class="q-pa-xs" outlined dense clearable color="accent" v-model="defaultItem.name" label="Worker Name"/>
                          <q-input  class="q-pa-xs" outlined dense clearable color="accent" v-model="defaultItem.position" label="Position" />
                          <q-select outlined dense class="q-pa-xs" color="accent" v-model="defaultItem.area" :options="options" label="Area"/>
                        </q-card-section>
                        <q-card-actions class="justify-center q-pa-xs">
                          <q-btn no-caps @click="addWorker" color="secondary" label="Add Worker" v-close-popup/>
                        </q-card-actions>
                      </q-card>
                    </q-dialog>

                      <div style="width: 100%;">
                        <q-banner v-if="!workers.length" class="bg-grey-2 q-pa-md" style="min-width: 800px; height: 150px">
                          <template v-slot:avatar>
                            <q-icon name="sentiment_dissatisfied" color="accent" />
                          </template>
                         <span class="text-h6 text-grey text-weight-thin">No Records Found!</span>
                        </q-banner>
                        <q-table
                          title="Workers"
                          class="my-sticky-header-table"
                          :data="workers"
                          :separator="separator"
                          :columns="column"
                          v-else
                          row-key="id"
                          :filter="filter"
                          hide-bottom
                          dense
                        >
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

                                   <q-dialog v-model="edit_dialog" persistent transition-show="rotate" transition-hide="rotate">
                                    <q-card style="width: 350px">
                                      <q-bar class="bg-secondary text-white" style="height: 60px">
                                        <div class="text-h6 text-weight-light">Update Worker</div>
                                        <q-space />
                                        <q-btn icon="close" flat round dense v-close-popup />
                                      </q-bar>

                                      <q-card-section>
                                        <q-input outlined dense clearable class="q-pa-xs" color="accent" v-model="editedItem.name" label="Name" />
                                        <q-input class="q-pa-xs" outlined dense clearable color="accent" v-model="editedItem.position" label="Position" />
                                        <q-select outlined dense class="q-pa-xs" color="accent" v-model="area" :options="options" label="Area"/>

                                      </q-card-section>
                                      <q-card-actions class="justify-center q-pa-xs">
                                        <q-btn no-caps class="text-weight-light" @click="updateWorker" color="secondary" label="Save Changes" v-close-popup/>
                                      </q-card-actions>
                                    </q-card>
                                  </q-dialog>
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
      activeWorker: null,
      defaultItem: {
        name: '',
        area: ''
      },
      editedItem: {
        name: '',
        area: ''
      },
      workers: [],
      options: [
        'Plumbing', 'Electricity', 'Grounds', 'Transportation'
      ],
      column: [
        { name: 'name', required: true, label: 'Name', field: 'name', align: 'left', sortable: true },
        { name: 'position', required: true, label: 'Position', field: 'posiyion', align: 'left', sortable: true },
        { name: 'area', label: 'Area', field: 'area', sortable: true, align: 'left' }
      ]
    }
  },
  created () {
    this.getEmployee()
  },
  computed: {
    date () {
      let timeStamp = Date.now()
      return date.formatDate(timeStamp, 'dddd D MMMM YYYY')
    }
  },
  methods: {
    async getEmployee () {
      const user = JSON.parse(LocalStorage.getItem('user'))
      const useRef = db.collection('account').where('userId', '==', user.uid)
      useRef.get().then(querySnapshot => {
        querySnapshot.forEach(doc => {
          this.foreman = doc.data().fullname
          this.area = doc.data().area
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
        })
      })
    },
    async addWorker () {
      try {
        db.collection('worker_list').add(this.defaultItem)
          .then(
            location.reload(),
            this.$q.notify({
              color: 'secondary',
              message: 'Worker added successfully'
            })
          )
        window.location.reload()
      } catch (error) {
        console.log(error)
      }
    },
    updateWorker () {
      let docref = db.collection('worker_list').doc(this.activeWorker)
      docref.update(this.editedItem)
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
    toEdit (item, id) {
      this.edit_dialog = true
      this.editedItem = Object.assign({}, item)
      this.activeWorker = this.editedItem.id
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

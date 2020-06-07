<template>
  <q-layout view="hHh lpR fFf">
    <q-page-container>
        <q-page class="window-height window-width row justify-center">
          <div class="q-gutter-sm flex text-center">
            <div style="width: 100%; height: 50%;">
              <h5>WORKER LISTS</h5> {{ date }}<br><br>
              <q-input outlined clearable color="secondary" dense debounce="300" v-model="filter" placeholder="Search by Name">
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>
              <br>
              <q-btn no-caps icon="person_add" label="Add Worker" color="secondary" @click="add_dialog=true"/>
              <br>
              <br>
                <q-dialog v-model="add_dialog">
                  <q-card style="width: 350px">
                    <q-card-section class="row items-center q-pb-none">
                      <div class="text-h6">New Worker</div>
                      <q-space />
                      <q-btn color="accent" icon="close" flat round dense v-close-popup />
                    </q-card-section>

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
                    <q-banner v-if="!employees.length" class="bg-red-1 q-pa-md" style="min-width: 800px">
                      <template v-slot:avatar>
                        <q-icon name="sentiment_dissatisfied" color="accent" />
                      </template>
                      No records found!
                    </q-banner>
                    <q-table
                      title="Workers"
                      class="my-sticky-header-table"
                      :data="employees"
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

                               <q-dialog v-model="edit_dialog">
                                <q-card style="width: 350px">
                                  <q-card-section class="row items-center q-pb-none">
                                    <div class="text-h6">Update Worker</div>
                                    <q-space />
                                    <q-btn color="accent" icon="close" flat round dense v-close-popup />
                                  </q-card-section>

                                  <q-card-section>
                                    <q-input outlined dense clearable class="q-pa-xs" color="accent" v-model="editedItem.name" label="Name" />
                                    <q-input class="q-pa-xs" outlined dense clearable color="accent" v-model="editedItem.position" label="Position" />
                                    <q-select outlined dense class="q-pa-xs" color="accent" v-model="editedItem.area" :options="options" label="Area"/>

                                  </q-card-section>
                                  <q-card-actions class="justify-center q-pa-xs">
                                    <q-btn no-caps @click="updateWorker" color="secondary" label="Save Changes" v-close-popup/>
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
                <br/>
                <br/>
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
      filter: '',
      separator: 'cell',
      edit_dialog: false,
      add_dialog: false,
      dense: false,
      activeWorker: null,
      defaultItem: {
        name: '',
        area: '',
        position: ''
      },
      editedItem: {
        name: '',
        area: '',
        position: ''
      },
      employees: [],
      options: [
        'Plumbing', 'Electricity', 'Grounds', 'Transportation'
      ],
      column: [
        // { name: 'id', required: true, label: 'Worker Id', field: 'id', align: 'left', sortable: true },
        { name: 'name', required: true, label: 'Name', field: 'name', align: 'left', sortable: true },
        { name: 'position', label: 'Position', field: 'position', align: 'left' },
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
      try {
        await db.collection('worker_list').get().then(querySnapshot => {
          querySnapshot.forEach(res => {
            const matData = {
              id: res.id,
              name: res.data().name,
              position: res.data().position,
              area: res.data().area
            }
            this.employees.push(matData)
          })
        })
      } catch (error) {
        console.log(error)
      }
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

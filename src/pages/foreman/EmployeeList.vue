<template>
  <q-layout view="hHh lpR fFf">
    <q-page-container>
        <q-page class="flex flex-center text-center">
          <div class="q-gutter-sm flex text-center">
            <div style="width: 100%; height: 50%;">
              <h2> Employee List </h2> {{ date }}
              <q-input borderless dense debounce="300" v-model="filter" placeholder="Search">
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>
<!-- EMPLOYEE LIST  -->
           <div style="width: 100%;">
            <q-table
              class="my-sticky-header-table"
              :data="employees"
              :columns="columns"
              row-key="name"
              :filter="filter"
              hide-bottom
            >
              <template v-slot:body="props">
                <q-tr :props="props">
                  <q-td key="name" :props="props">
                    {{ props.row.name }}
                  </q-td>
                  <q-td key="position" :props="props">
                    {{ props.row.position }}
                  </q-td>
                  <q-td key="area" :props="props">
                    {{ props.row.area }}
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
                            <q-select outlined dense class="q-pa-xs" v-model="position" :options="position" label="Position" />
                            <br/>
                            <q-btn flat label="Close" v-close-popup/>
                            <q-btn flat label="Set" @click="toEdit(props.row.id, name, position)"/>
                          </div>
                        </q-popup-edit>
                    </q-btn>
                  </q-td>
                  <q-td key="toDelete" :props="props">
                    {{ props.row.toDelete }}
                    <q-btn push label="Delete" @click="toDelete(props.row.id)">
                      <q-space/>
                    </q-btn>
                  </q-td>
                </q-tr>
              </template>
            </q-table>
            <br/>
          <q-btn no-caps push class="q-mr-sm" color="secondary" label="Add Employee" @click="add=true"/>
            <q-dialog v-model="add" class="bg-secondary">
              <q-card>
                <q-card-section class="row items-center q-pb-none">
                  <div class="text-h6">Add Employee</div>
                  <q-space />
                  <q-btn icon="close" flat round dense v-close-popup />
                </q-card-section>

                <q-card-section>
                  <q-input class="q-pa-xs" outlined dense v-model="newName" label="Employee Name"/>
                  <q-select outlined dense class="q-pa-xs" v-model="position" :options="position" label="Position" />
                  <br/>
                  <q-btn @click="addEmployee" class="q-pa-xs" label="Submit"/>
                </q-card-section>
              </q-card>
            </q-dialog>
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
      newPosition: '',
      newArea: '',

      name: '',
      area: '',
      employees: [],
      position: [
        'Worker', 'Head'
      ],
      add: false,
      change: false,
      dense: false,
      columns: [
        { name: 'name', required: true, label: 'Name', align: 'left', sortable: true },
        { name: 'position', label: 'Position', field: 'area', align: 'left' },
        { name: 'area', label: 'Area', field: 'area', sortable: true, align: 'left' },
        { name: 'toEdit', field: 'toEdit', align: 'left', label: 'Edit' },
        { name: 'toDelete', field: 'toDelete', align: 'left', label: 'Delete' }
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
        await db.collection('employee_list').get().then(querySnapshot => {
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
    async addEmployee () {
      try {
        const matDb = await db.collection('employee_list').add({
          name: this.newName,
          position: this.newPosition,
          area: this.newArea
        })
        this.newName = ''
        this.newPosition = ''
        this.newArea = ''
        this.data.push({
          name: this.newName,
          position: this.newPosition,
          area: this.newArea,
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
        persistentL: true,
        color: 'secondary'
      }).onOk(async () => {
        try {
          await db.collection('employee_list').doc(id).delete()
          window.location.reload()
        } catch (error) {
          console.log(error)
        }
      }
      )
    },
    async toEdit (id, updateName) {
      // console.log('Gasulod sa method')
      this.id = id
      this.updateName = updateName
      try {
        // const matDb = await db.collection('materials').doc(this.id).update({
        if (updateName !== '') {
          await db.collection('employee_list').doc(this.id).update({
            name: updateName
          })
        }
      } catch (error) {
        console.log(error)
      } finally {
        this.id = id
        this.name = updateName
      }
      window.location.reload()
    }
  }
}
</script>

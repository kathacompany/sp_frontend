<template>
  <q-layout view="hHh lpR fFf">
    <q-page-container>
        <q-page class="flex flex-center text-center">
          <div class="q-ma-md q-pa-md">
            <h4 style="margin-top: 20px"> Job Order Requests </h4>
              <q-input borderless dense debounce="300" v-model="filter" placeholder="Search">
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>
            <div style="width: 100%; height: 50%; margin-bottom: 10px">
              <q-table
                title="PENDING"
                class="my-sticky-column-table"
                :data="pending"
                :columns="column"
                row-key="id"
                hide-bottom
              >
              <template v-slot:body="props">
                <q-tr :props="props">
                  <q-td key="id" :props="props">
                    {{ props.row.id }}
                  </q-td>
                  <q-td key="category" :props="props">
                    {{ props.row.category }}
                  </q-td>
                  <q-td key="location" :props="props">
                    {{ props.row.location }}
                  </q-td>
                  <q-td key="description" :props="props">
                    {{ props.row.description }}
                  </q-td>
                  <q-td key="date" :props="props">
                    {{ props.row.date }}
                  </q-td>
                  <q-td key="telephone" :props="props">
                    {{ props.row.telephone }}
                  </q-td>
                  <q-tr :props="props">
                    <q-td key="approve" :props="props">
                      <q-btn class="bg-primary" push label="Approve" @click="approve(props.row.id, approved, status)"/>
                    </q-td>
                  </q-tr>
                </q-tr>
                </template>
              </q-table>
            </div>
          </div>
        </q-page>
    </q-page-container>
  </q-layout>
</template>

<style lang="sass">
  td:first-child
    background-color: #e1bee7

  th:first-child,
  td:first-child
    position: sticky
    left: 0
    z-index: 1
</style>

<script>
import * as firebase from 'firebase/app'
import 'firebase/firestore'

export default {
  data () {
    return {
      filter: '',
      pending: [],
      approved: true,
      status: 'Pending',
      column: [
        { name: 'id', align: 'left', label: 'JOB ID', field: 'id' },
        { name: 'category', align: 'left', label: 'CATEGORY', field: 'category', sortable: true },
        { name: 'location', align: 'left', label: 'LOCATION', field: 'location' },
        { name: 'description', align: 'left', label: 'DESCRIPTION', field: 'description' },
        { name: 'date', align: 'left', label: 'DATE', field: 'date' },
        { name: 'telephone', align: 'left', label: 'TELEPHONE', field: 'telephone' },
        { name: 'approve', align: 'left', field: 'approve' }
      ]
    }
  },
  created () {
    firebase.firestore().collection('job_orders').get().then(querySnapshot => {
      querySnapshot.forEach(doc => {
        const data = {
          id: doc.id,
          category: doc.data().category,
          location: doc.data().location,
          description: doc.data().description,
          date: doc.data().date,
          telephone: doc.data().telephone
        }
        this.pending.push(data)
      })
    })
  },
  methods: {
    approve (id, approved, status) {
      this.$q.dialog({
        title: 'Are you sure?',
        cancel: true,
        persistent: true
      }).onOk(data => {
        this.id = id
        this.approved = approved
        this.status = status
        firebase.firestore().collection('job_orders').doc(this.id).update({
          approve: approved,
          status: status
        })
        // console.log('>>>> OK', id, approved, status)
      }).onCancel(() => {
      })
    }
  },
  computed: {
    approvedRequests: function () {
      return this.pending.filter(function (u) {
        return u.approve
      })
    }
  }
}
</script>

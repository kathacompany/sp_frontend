<template v-slot:top-right>
  <q-layout view="hHh lpR fFf">
    <q-page-container>
        <q-page class="flex flex-center text-center">
          <div class="q-ma-md q-pa-md">
            <h4 style="margin-top: 20px"> Job Order Requests </h4>
              <q-input borderless dense debounce="300" v-model="filter" placeholder="Search by Category">
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>
            </div>
            <div style="width: 100%; height: 50%; margin-top: -30px; margin-bottom: 10px">
              <q-separator />
                <div><h6 style="margin-top: 10px">PENDING</h6></div>
              <q-card class="my-card" v-for="job in job_orders" v-bind:key="job.id" >
                <q-card-section class="bg-primary text-white">
                  JOB ID: {{job.id}} <pre></pre>
                  CATEGORY: {{job.category}} <pre></pre>
                </q-card-section>
                <q-card-actions align="center">
                   <q-btn no-caps push color="secondary" label="Open" class="text-white" @click="medium = true"/>
                     <q-dialog v-model="medium">
                      <q-card style="width: 100%; max-width: 50vw;">
                        <q-card-section>
                          <div class="text-h6 text-center">University of the Philippines Visayas</div>
                        </q-card-section>
                        <q-separator />
                        <q-card-section class="bg-secondary text-center text-white">
                          <div>JOB REQUEST DETAILS</div>
                        </q-card-section>
                          <q-card-section>
                            <div class="q-pa-md q-gutter-sm">
                              <q-table
                                card-class="bg-primary"
                                :data="job_orders"
                                :columns="columnA"
                                row-key="name"
                                hide-bottom
                              />
                              <q-table
                                card-class="bg-primary"
                                :data="job_orders"
                                :columns="columnB"
                                row-key="name"
                                hide-bottom
                              />
                            </div>
                          </q-card-section>
                        <q-separator />
                        <q-card-actions align="right" class="q-pa-sm">
                          <q-btn icon-right="archive" color="primary" label="Export to pdf" no-caps push/>
                          <q-btn no-caps push label="CLOSE" color="secondary" v-close-popup />
                        </q-card-actions>
                      </q-card>
                    </q-dialog>
                   <q-btn no-caps push color="secondary" label="View Status" class="text-white"/>
                </q-card-actions>
              </q-card>
          </div>
          <div style="width: 100%; height: 50%; margin-bottom: 10px">
            <q-separator />
                <div><h6 style="margin-top: 10px">ONGOING</h6></div>
          </div>
          <div style="width: 100%; height: 50%;">
            <q-separator />
                <div><h6 style="margin-top: 10px margin-bottom: 10px">COMPLETED</h6></div>
          </div>
        </q-page>
        <router-view/>
    </q-page-container>
  </q-layout>
</template>

<style lang="sass" scoped>
.q-card.my-card
    display: inline-block
    width: 20%
    margin: 10px
</style>

<script>
import * as firebase from 'firebase/app'
import 'firebase/firestore'

export default {
  data () {
    return {
      medium: false,
      filter: '',
      job_orders: [],
      category: null,
      unit: null,
      location: null,
      description: null,
      telephone: null,
      requestor: null,
      columnA: [
        {
          name: 'id',
          align: 'left',
          label: 'JOB ID',
          field: 'id'
        },
        {
          name: 'category',
          align: 'left',
          label: 'CATEGORY',
          field: 'category',
          sortable: true
        },
        {
          name: 'location',
          align: 'left',
          label: 'LOCATION',
          field: 'location'
        },
        {
          name: 'description',
          align: 'left',
          label: 'DESCRIPTION',
          field: 'description'
        }
      ],
<<<<<<< HEAD
      columnB: [
        {
          name: 'unit',
          align: 'left',
          label: 'REQUESTING UNIT',
          field: 'unit'
        },
        {
          name: 'date',
          align: 'left',
          label: 'DATE',
          field: 'date'
        },
        {
          name: 'telephone',
          align: 'left',
          label: 'TELEPHONE',
          field: 'telephone'
        },
        {
          name: 'requestor',
          align: 'left',
          label: 'REQUESTOR NAME',
          field: 'requestor'
=======
      data: [
        {
          id: 1,
          name: 'Construction',
          unit: 'DPSM',
          location: 'Miagao',
          date: '2018/12/01'
        },
        {
          id: 2,
          name: 'Plumbing',
          unit: 'DPSM',
          location: 'Miagao',
          date: '2018/12/01'
>>>>>>> 886acabcb22a184274edc4ddae3d7912310e917c
        }
      ]
    }
  },
  created () {
    firebase.firestore().collection('job_orders').get().then(querySnapshot => {
      querySnapshot.forEach(doc => {
        const data = {
          id: doc.id,
          category: doc.data().category,
          unit: doc.data().unit,
          location: doc.data().location,
          description: doc.data().description,
          date: doc.data().date,
          telephone: doc.data().telephone,
          requestor: doc.data().requestor
        }
        this.job_orders.push(data)
      })
    })
  }
}
</script>

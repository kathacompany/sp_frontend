<template>
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
            <div style="width: 100%; height: 50%; margin-bottom: 10px">
              <q-table
                title="PENDING"
                class="my-sticky-column-table"
                :data="pending"
                :columns="column"
                row-key="id"
                :selected-rows-label="getSelectedString"
                hide-bottom
                selection="multiple"
                :selected.sync="selected"
              />
              <q-btn no caps label="APPROVE" class="q-ma-md bg-secondary text-white" @click="dialog = true"/>
              <q-dialog v-model="dialog">
                <q-card class="bg-primary">
                    <q-card-section>
                      <cap>Please input details to proceed</cap>
                    </q-card-section>
                    <q-separator/>
                    <q-card-section>
                        <q-form class="q-gutter-md">
                          <q-input
                            square
                            filled
                            clearable
                            v-model="unit_head"
                            label="Name"
                          />
                          <q-input
                            square
                            filled
                            clearable
                            class="q-pa-xs"
                            v-model="password"
                            :disable="disable"
                            label="Password"
                            :type="isPwd ? 'password' : 'text'">
                                <template v-slot:append>
                                  <q-icon
                                    :name="isPwd ? 'visibility_off' : 'visibility'"
                                    class="cursor-pointer"
                                    @click="isPwd = !isPwd"
                                  />
                                </template>
                            </q-input>
                        </q-form>
                    </q-card-section>
                    <q-card-actions align="center">
                      <q-btn no caps label="SUBMIT" v-close-popup color="secondary"/>
                    </q-card-actions>
                </q-card>
              </q-dialog>
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
      unit_head: '',
      password: '',
      dialog: false,
      medium: false,
      filter: '',
      pending: [],
      category: null,
      unit: null,
      location: null,
      description: null,
      telephone: null,
      requestor: null,
      column: [
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
        },
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
        this.pending.push(data)
      })
    })
  }
}
</script>

<template>
  <q-layout view="hHh lpR fFf">
    <q-page-container>
        <q-page class="flex flex-center text-center">
          <div class="q-ma-md q-pa-md bg-primary">
            <div style="width: 100%; height: 50%;">
              <q-icon name="person" style="font-size:200px;"/>
            </div>
            <div style="width: 100%; height: 50%; margin-bottom: 10px">
             <q-table
                class="my-sticky-column-table"
                :data="account"
                :columns="personal"
                hide-bottom
              />
            </div>
            <div style="width: 100%; height: 50%; margin-bottom: 10px">
             <q-table
                class="my-sticky-column-table"
                :data="account"
                :columns="secondary"
                hide-bottom
              />
            </div>
            <q-btn no-caps class="q-pa-xs q-ma-xs" ref="btn" color="secondary" @click="opened=true" label="ADD INFO"/>

          <q-dialog v-model="opened" maximized>
            <q-layout class="no-shadow">
              <q-page-container>
                <q-page class="flex flex-center">
                  <q-card container class="bg-primary q-pa-auto q-ma-auto" style="width:40%;">
                    <q-card-section>
                      <div class="q-pa-auto">
                        <q-input class="q-ma-auto" required v-model="first_name" label="First Name"></q-input>
                        <q-input class="q-ma-auto" required v-model="last_name" label="Last Name"></q-input>
                        <q-input class="q-ma-auto" required v-model="middle_name" label="Middle Name"></q-input>
                         <q-input class="q-ma-auto" required v-model="unit" label="Unit"></q-input>
                        <q-input class="q-ma-auto" required v-model="position" label="Position"></q-input>
                        <q-input class="q-ma-auto" required v-model="mobile_number" label="Mobile Number"></q-input>
                        <q-input class="q-ma-auto" required v-model="email" label="Email"></q-input>
                      <q-card-actions >
                        <q-btn no-caps color="secondary" class="text-white" label="Save" @click="saveChanges" disable="false"/>
                        <q-btn no-caps color="secondary" label="Cancel" class="text-white" v-close-popup/>
                      </q-card-actions>
                      </div>
                    </q-card-section>
                  </q-card>
                </q-page>
              </q-page-container>
            </q-layout>
          </q-dialog>
          </div>
        </q-page>
    </q-page-container>
  </q-layout>
</template>

<style lang="sass">

  td:first-child
    background-color: white

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
      disabled: false,
      opened: false,
      account: [],
      firtst_name: null,
      last_name: null,
      middle_name: null,
      mobile_number: null,
      unit: null,
      email: null,
      position: null,
      personal: [
        {
          name: 'first_name',
          align: 'left',
          label: 'FIRST NAME',
          field: 'first_name'
        },
        {
          name: 'last_name',
          align: 'left',
          label: 'LAST NAME',
          field: 'last_name'
        },
        {
          name: 'middle_name',
          align: 'left',
          label: 'MIDDLE NAME',
          field: 'middle_name'
        },
        {
          name: 'mobile_number',
          align: 'left',
          label: 'MOBILE NUMBER',
          field: 'mobile_number'
        }
      ],
      secondary: [
        {
          name: 'unit',
          align: 'left',
          label: 'UNIT',
          field: 'unit'
        },
        {
          name: 'email',
          align: 'left',
          label: 'EMAIL',
          field: 'email'
        },
        {
          name: 'position',
          align: 'left',
          label: 'POSITION',
          field: 'position'
        }
      ]
    }
  },
  created () {
    firebase.firestore().collection('account').get().then(querySnapshot => {
      querySnapshot.forEach(doc => {
        const data = {
          first_name: doc.data().first_name,
          last_name: doc.data().last_name,
          middle_name: doc.data().middle_name,
          mobile_number: doc.data().mobile_number,
          unit: doc.data().unit,
          email: doc.data().email,
          position: doc.data().position
        }
        this.account.push(data)
      })
    })
  },
  methods: {
    saveChanges () {
      firebase.firestore().collection('account').add({
        first_name: this.first_name,
        last_name: this.last_name,
        middle_name: this.middle_name,
        unit: this.unit,
        position: this.position,
        mobile_number: this.mobile_number,
        email: this.email
      })
        .then(docRef => {
          console.log('Account added: ', docRef.id)
          location.reload()
        })
        .catch(error => {
          console.error('Error saving account: ', error)
        })
    }
  }
}
</script>

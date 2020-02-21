<template>
  <q-layout view="hHh lpR fFf">
    <q-page-container>
    <q-page class="flex flex-center text-center">
      <div style="width: 100%; height: 50%;">
        <q-icon name="person" style="font-size:100px;"/>
      </div>
      <div class="q-gutter-sm" style="margin-top: -70px">
        <q-table
          card-class="bg-primary"
          :data="account"
          :columns="profileColumns"
          hide-bottom
          style="width:500px;"
        />
         <q-table
          card-class="bg-primary"
          :data="account"
          :columns="tableColumns"
          hide-bottom
          style="width:500px;"
        />
        <q-btn rounded no-caps push class="q-pa-auto q-ma-auto" size="12px" color="secondary" @click="updateAccount" label="Edit Information"/>

        <q-btn rounded no-caps push class="q-pa-auto q-ma-auto" size="12px" color="secondary" @click="opened=true" label="Add Information"/>

          <q-dialog v-model="opened" maximized class="bg-white">
            <q-layout class="no-shadow">
              <q-page-container>
                <q-page class="flex flex-center">
                  <q-card container class="bg-primary q-pa-auto q-ma-auto" style="width:30%;">
                    <q-card-section>
                      <div class="q-pa-auto full-width">
                        <q-input class="q-ma-auto" required v-model="first_name" label="First Name"></q-input>
                        <q-input class="q-ma-auto" required v-model="last_name" label="Last Name"></q-input>
                        <q-input class="q-ma-auto" required v-model="middle_name" label="Middle Name"></q-input>
                         <q-input class="q-ma-auto" required v-model="unit" label="Unit"></q-input>
                        <q-input class="q-ma-auto" required v-model="position" label="Position"></q-input>
                        <q-input class="q-ma-auto" required v-model="mobile_number" label="Mobile Number"></q-input>
                        <q-input class="q-ma-auto" required v-model="email" label="Email"></q-input>
                      <q-card-actions >
                        <q-btn rounded no-caps push color="secondary" class="text-white" label="Save" @click="saveChanges" disable="false"/>
                        <q-btn rounded no-caps push color="secondary" label="Cancel" class="text-white" v-close-popup/>
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
  .q-pa-auto
    -webkit-text-fill-color: white;
</style>

<script>
import * as firebase from 'firebase/app'
import 'firebase/firestore'

export default {
  data () {
    return {
      account: [],
      opened: false,
      id: null,
      first_name: null,
      last_name: null,
      middle_name: null,
      unit: null,
      position: null,
      mobile_number: null,
      email: null,
      tableColumns: [
        {
          name: 'unit',
          required: true,
          label: 'Unit',
          align: 'left',
          field: 'unit'
        },
        {
          name: 'position',
          required: true,
          label: 'Position',
          align: 'left',
          field: 'position'
        },
        {
          name: 'mobile_number',
          required: true,
          label: 'Mobile Number',
          align: 'left',
          field: 'mobile_number'
        },
        {
          name: 'email',
          required: true,
          label: 'Email Address',
          align: 'left',
          field: 'email'
        }
      ],
      profileColumns: [
        {
          name: 'first_name',
          required: true,
          label: 'First Name',
          align: 'left',
          field: 'first_name'
        },
        {
          name: 'last_name',
          required: true,
          label: 'Last Name',
          align: 'left',
          field: 'last_name'
        },
        {
          name: 'middle_name',
          required: true,
          label: 'Middle Name',
          align: 'left',
          field: 'middle_name'
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
          unit: doc.data().unit,
          position: doc.data().position,
          mobile_number: doc.data().mobile_number,
          email: doc.data().email
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

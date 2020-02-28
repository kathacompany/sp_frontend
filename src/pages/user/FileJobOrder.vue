<template>
<q-layout view="hHh lpR fFf">
  <q-page  class="window-height window-width row justify-center items-center">
    <q-card>
      <q-card-section class="bg-primary">
        <h6 class="text-center q-ma-xs">JOB REQUEST FORM</h6>
      </q-card-section>
      <q-separator/>
      <q-card-section>
          <div class="col">
            <div class="row justify-center">
              <q-input
                filled
                v-model="date"
                mask="date"
                label="Date"
                :rules="['date']">
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                      <q-date v-model="date" @input="() => $refs.qDateProxy.hide()" />
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
              <q-select
                filled
                class="q-ma-sm"
                style="width: 18vw; margin-top: -10px;"
                v-model="category"
                :options="options"
                label="Category"
              />
            </div>
          </div>
            <div class="q-pa-sm">
                 <q-input
                  filled
                  v-model="description"
                  type="textarea"
                  label="Description"
                  :max-height="50"
                  rows="5"
                  lazy-rules
                  :rules="[
                    val => val !== null && val !== '' || 'Please describe the request'
                  ]"
                />
            </div>
            <div class="col q-ma-sm">
              <div class="row full-height justify-center">
                <q-input
                  filled
                  class="q-ma-xs"
                  style="width: 12vw"
                  v-model="unit"
                  label="Unit"
                  lazy-rules
                  :rules="[ val => val && val.length > 0 || 'Please type something']"
                />
                <q-input
                  filled
                  class="q-ma-xs"
                  style="width: 11vw"
                  v-model="location"
                  label="Location / Building"
                  lazy-rules
                  :rules="[ val => val && val.length > 0 || 'Please type something']"
                />
                <q-input
                  filled
                  class="q-ma-xs"
                  style="width: 10vw"
                  v-model="telephone"
                  label="Telephone"
                  lazy-rules
                  :rules="[
                    val => val !== null && val !== '' || 'Please type your telephone number'
                  ]"
                />
              </div>
            </div>
            <div class="col q-ma-sm">
              <div class="row full-height justify-center">
                <q-input
                  filled
                  class="q-pa-xs"
                  v-model="requestor" :disable="disable"
                  label="Requestor's Name"
                  lazy-rules
                  :rules="[ val => val && val.length > 0 || 'Please type your name']"
                />
                  <q-input
                  filled
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
              </div>
            </div>
        </q-card-section>
        <q-separator/>
        <q-card-actions align="center">
          <q-btn no-caps
            class="q-ma-sm size: 15x"
            label="FORWARD"
            @click="filedJob" color="secondary"
          />
        </q-card-actions>
      </q-card>
    </q-page>
  </q-layout>
</template>

<script>
import * as firebase from 'firebase/app'
import 'firebase/firestore'

export default {
  data () {
    return {
      disable: false,
      password: '',
      isPwd: true,
      category: 'null',
      options: [
        'Plumbing', 'Eletricity', 'Grounds', 'Transportation'
      ],
      date: null,
      telephone: null,
      unit: null,
      location: null,
      description: null,
      requestor: null
    }
  },
  methods: {
    filedJob () {
      firebase.firestore().collection('job_orders').add({
        category: this.category,
        date: this.date,
        telephone: this.telephone,
        unit: this.unit,
        location: this.location,
        description: this.description,
        requestor: this.requestor,
        password: this.password
      })
        .then(docRef => {
          console.log('Job Filed: ', docRef.id)
          this.$router.push('/UserJobOrders')
        })
        .catch(error => {
          console.error('Error filing job orders: ', error)
        })
    }
  }
}
</script>

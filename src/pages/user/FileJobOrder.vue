<template>
  <q-page class="q-ma-sm flex flex-center">
    <q-card>
      <q-card-section>
        <div class="text-h5 text-center">JOB REQUEST FORM</div>
      </q-card-section>
      <q-separator/>
      <q-card-section>
        <div style="width: 495px;">
          <div class="col">
            <div class="row">
              <q-input style="margin-top: 20px; margin-left: 8px;"
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
                style="width: 17vw"
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
              <div class="row">
                <q-input
                  filled
                  class="q-ma-xs"
                  style="width: 10vw"
                  v-model="unit"
                  label="Unit"
                  lazy-rules
                  :rules="[ val => val && val.length > 0 || 'Please type something']"
                />
                <q-input
                  filled
                  class="q-ma-xs"
                  style="width: 12vw"
                  v-model="location"
                  label="Location / Building"
                  lazy-rules
                  :rules="[ val => val && val.length > 0 || 'Please type something']"
                />
                <q-input
                  filled
                  class="q-ma-xs"
                  style="width: 11vw"
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
              <div class="row">
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
          </div>
        </q-card-section>
        <q-separator/>
        <q-card-actions>
          <q-toggle
            v-model="disable"
            class="q-ma-sm"
            label="Forward"
            dark
          />
          <q-btn no-caps push
            class="q-ma-sm"
            label="Submit"
            @click="filedJob" color="primary"
          />
        </q-card-actions>
    </q-card>
  </q-page>
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

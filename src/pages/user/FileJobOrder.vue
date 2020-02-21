<template>
<<<<<<< HEAD
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
=======
  <q-page class="flex flex-center">
  <div class="q-pa-md">
    <div style="width: 100%; height: 50%;">
      <h2> Job Order Request </h2>
    </div>
    <div class="q-pa-md">
      <q-input filled v-model="date" mask="date" :rules="['date']">
        <template v-slot:append>
          <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
              <q-date v-model="date" @input="() => $refs.qDateProxy.hide()" />
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
    <q-form
      @submit="onSubmit"
      class="q-gutter-sm"
    >
      <q-btn-dropdown push no-caps v-model="probType" color="primary" label="Problem Category/Name" dropdown-icon="change_history">
        <q-list>
        <q-item clickable v-close-popup>
            <q-item-section>
            <q-item-label> Plumbing</q-item-label>
            </q-item-section>
        </q-item>

        <q-item clickable v-close-popup>
            <q-item-section>
            <q-item-label> Electricity</q-item-label>
            </q-item-section>
        </q-item>

        <q-item clickable v-close-popup>
            <q-item-section>
            <q-item-label> Transportation </q-item-label>
            </q-item-section>
        </q-item>

        <q-item clickable v-close-popup>
            <q-item-section>
            <q-item-label> Operation </q-item-label>
            </q-item-section>
        </q-item>
        </q-list>
        </q-btn-dropdown>

      <q-input
        filled
        v-model="location"
        label="Location / Building"
        lazy-rules
        :rules="[ val => val && val.length > 0 || 'Please type something']"
      />
      <q-input
        filled
        v-model="tel"
        label="Telephone"
        lazy-rules
        :rules="[
          val => val !== null && val !== '' || 'Please type your telephone number'
        ]"
      />

      <div>
        <q-btn rounded label="Submit" type="submit" color="primary" @click="$router.push('/Homepage')"/>
      </div
      <q-input
        filled
        v-model="description"
        label="Description"
        lazy-rules
        :rules="[ val => val && val.length > 0 || 'Please type something']"
      />
        <q-btn no-caps rounded label="Upload Requestor Signature" color="secondary" @click="requestor=true"/>
          <q-dialog v-model="requestor">
            <q-layout class="no-shadow">
              <q-card container class="bg-primary q-ma-sm q-pa-md" style="width:80%;">
                <q-card-section>
                  <div class="q-pa-md full-width">
                    <q-input class="q-ma-sm" required v-model="requestorName" label="Requestor Name"></q-input>
                  <q-card-actions >
                    <q-btn rounded no-caps push color="secondary" class="text-white" @click="saveChanges" label="Upload E-Signature"/>
                    <q-btn rounded no-caps push color="secondary" label="Cancel" class="text-white" v-close-popup/>
                  </q-card-actions>
                  </div>
                </q-card-section>
              </q-card>
            </q-layout>
          </q-dialog>
        <q-btn no-caps rounded label="Upload Head Office Signature" color="secondary" @click="head=true"/>
          <q-dialog v-model="head">
            <q-layout class="no-shadow">
              <q-card container class="bg-primary q-ma-sm q-pa-md" style="width:80%;">
                <q-card-section>
                  <div class="q-pa-md full-width">
                    <q-input class="q-ma-sm" required v-model="headName" label="Head Name"></q-input>
                  <q-card-actions >
                    <q-btn rounded no-caps push color="secondary" class="text-white" @click="saveChanges" label="Upload E-Signature"/>
                    <q-btn rounded no-caps push color="secondary" label="Cancel" class="text-white" v-close-popup/>
                  </q-card-actions>
                  </div>
                </q-card-section>
              </q-card>
            </q-layout>
          </q-dialog>
        <q-btn rounded label="Submit" type="submit" color="secondary" @click="$router.push('/UserJobOrders')"/>
    </q-form>
  </div>
  </div>
>>>>>>> 886acabcb22a184274edc4ddae3d7912310e917c
  </q-page>
</template>

<script>
import * as firebase from 'firebase/app'
import 'firebase/firestore'

export default {
  data () {
    return {
<<<<<<< HEAD
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
=======
      probType: null,
      requestorName: null,
      headName: null,
      requestor: false,
      head: false,
      date: '2019/02/01',
      department: null,
      problem: null,
      tel: null,
      location: null,
      description: null,

      accept: false
>>>>>>> 886acabcb22a184274edc4ddae3d7912310e917c
    }
  }
}
</script>

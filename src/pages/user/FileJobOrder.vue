<template>
<q-layout view="hHh lpR fFf">
  <q-page  class="window-height window-width row justify-center items-center">
    <div class="absolute-center q-pa-sm" style="margin-top: -40px; min-width: 350px; max-width: 500px; max-height: 100%; border: solid #9C3B3B 2px;">
      <div class="q-pa-sm bg-accent text-h5 text-center text-white">JOB REQUEST FORM</div>
      <q-separator color="secondary"/>
        <q-form @submit.prevent.stop="onSubmit" @reset="onReset">
        <div class="col">
            <div class="row justify-center items-center">
              <q-select
                filled
                ref="date"
                color="secondary"
                v-model="date"
                mask="date"
                label="Date"
                lazy-rules
                :rules="[
                   val => val !== null && val !== '' || 'Date is required'
                ]">
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                      <q-date v-model="date" @input="() => $refs.qDateProxy.hide()" />
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-select>
              <q-select
                filled
                ref="category"
                color="secondary"
                class="q-ma-sm"
                style="min-width: 16vw; margin-top: 5px;"
                v-model="category"
                :options="['Plumbing', 'Eletricity', 'Grounds', 'Transportation']"
                label="Category"
                lazy-rules
                :rules="[
                   val => val !== null && val !== '' || 'Category is required'
                ]"
              />
              </div>
            </div>
            </q-form>
            <q-form @submit.prevent.stop="onSubmit" @reset="onReset">
            <div>
               <q-input
                filled
                ref="description"
                clearable
                color="secondary"
                v-model="description"
                type="textarea"
                label="Description"
                :max-height="50"
                rows="5"
                lazy-rules
                :rules="[
                  val => val !== null && val !== '' || 'Description is required'
                ]"
              />
              </div>
              </q-form>
              <q-form @submit.prevent.stop="onSubmit" @reset="onReset">
              <div class="col">
              <div class="row">
                <q-input
                  filled
                  ref="unit"
                  clearable
                  color="secondary"
                  class="q-ma-xs"
                  style="min-width: auto; width: 11vw;"
                  v-model="unit"
                  label="Unit"
                  lazy-rules
                  :rules="[ val => val !== null && val !== '' || 'Unit Name is required']"
                />
                <q-input
                  filled
                  ref="location"
                  clearable
                  color="secondary"
                  class="q-ma-xs"
                  style="min-width: auto; width: 12vw;"
                  v-model="location"
                  label="Location / Building"
                  lazy-rules
                  :rules="[ val => val !== null && val !== '' || 'Location is required']"
                />
                <q-input
                  filled
                  clearable
                  ref="telephone"
                  v-model="telephone"
                  label="Telephone"
                  mask="###"
                  hint="###"
                  color="secondary"
                  class="q-ma-xs"
                  style="min-width: auto; width: 10vw;"
                  lazy-rules
                  :rules="[
                    val => val !== null && val !== '' || 'Telephone is required'
                  ]"
                />
                </div>
                </div>
                </q-form>

              <q-separator color="secondary"/>
              <q-form @submit.prevent.stop="onSubmit" @reset="onReset">
              <div class="q-pa-sm row justify-center">
                <q-btn no-caps type="submit" label="FORWARD" color="secondary"/>
                <q-btn flat type="reset" class="q-ml-sm" label="RESET" color="secondary"/>
              </div>
            </q-form>
      </div>
    </q-page>
  </q-layout>
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
      category: '',
      options: [
        'Plumbing', 'Eletricity', 'Grounds', 'Transportation'
      ],
=======
      category: null,
>>>>>>> 463a21677031f679fb323bf2410525d549cd140d
      date: null,
      telephone: null,
      unit: null,
      location: null,
      description: null,
<<<<<<< HEAD
      requestor: null,
      status: null,
      approve: false
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
        password: this.password,
        status: this.status,
        approve: this.approve
      })
        .then(docRef => {
          console.log('Job Filed: ', docRef.id)
          this.$router.push('/UserJobOrders')
        })
        .catch(error => {
          console.error('Error filing job orders: ', error)
=======
      status: null,
      requestor: null,
      foreman: 'N/A'
    }
  },
  methods: {
    onSubmit () {
      let jobRef = firebase.firestore().collection('job_orders')
      if (this.date === null || this.category === null || this.telephone === null || this.location === null || this.description === null || this.unit === null) {
        this.$refs.date.validate()
        this.$refs.category.validate()
        this.$refs.description.validate()
        this.$refs.unit.validate()
        this.$refs.location.validate()
        this.$refs.telephone.validate()
      } else {
        jobRef.add({
          status: 'for Unit Head approval',
          category: this.category,
          date: this.date,
          telephone: this.telephone,
          unit: this.unit,
          location: this.location,
          description: this.description,
          requestor: this.requestor,
          foreman: this.foreman
>>>>>>> 463a21677031f679fb323bf2410525d549cd140d
        })
          .then(doc => {
            this.$router.push('/UserJobOrders')
            this.$q.notify({
              color: 'secondary',
              message: 'Forwarded Successfully'
            })
          })
          .catch(error => {
            console.error('Error fowarding job order: ', error)
          })
      }
    },
    onReset () {
      this.date = null
      this.category = null
      this.description = null
      this.unit = null
      this.location = null
      this.telephone = null

      this.$refs.date.resetValidation()
      this.$refs.category.resetValidation()
      this.$refs.description.resetValidation()
      this.$refs.unit.resetValidation()
      this.$refs.location.resetValidation()
      this.$refs.telephone.resetValidation()
    }
  }
}
</script>

<template>
<q-layout view="hHh lpR fFf">
  <q-page-container>
    <q-page class="window-height window-width row justify-center">
      <div class="q-gutter-sm flex text-center">
        <div style="min-width: 350px; margin-top: 30px">

          <q-card style="width: 700px">
            <q-card-section align="center">
              <div class="text-h5 text-secondary text-weight-medium">JOB REQUEST FORM</div>
              <div class="q-pa-sm text-subtitle text-accent">
                <span>* Repair of Vehicles and Equipment </span>
                <span>* Renovation of Existing Physical Structures *</span><br>
                <span class="q-pa-sm text-black text-subtitle1 text-weight-medium">{{today}}</span>
              </div>
            </q-card-section>
            <q-separator color="secondary"/>
            <q-card-section>
              <div class="col">
                <div class="row justify-center">
                  <q-input
                    outlined
                    dense
                    class="q-pa-sm"
                    readonly
                    style="width: 20vw;"
                    color="accent"
                    v-model="date"
                    label="Date"
                    lazy-rules
                    :rules="[val => val !== null && val !== '' || 'Date is required']">
                    <template v-slot:prepend>
                      <q-icon color="accent" name="today"/>
                    </template>
                  </q-input>
                  <q-select
                    outlined
                    dense
                    ref="category"
                    color="accent"
                    class="q-pa-sm"
                    v-model="category"
                    style="width: 20vw;"
                    use-chips
                    stack-label
                    :options="['Plumbing', 'Electricity', 'Grounds', 'Transportation']"
                    label="Category"
                    lazy-rules
                    :rules="[
                       val => val !== null && val !== '' || 'Category is required'
                    ]">
                    <template v-slot:prepend>
                      <q-icon color="accent" name="category" />
                    </template>
                  </q-select>
                </div>
              </div>
              <div class="col">
                <div class="row justify-center">
                  <q-input
                    outlined
                    dense
                    ref="location"
                    readonly
                    color="accent"
                    class="q-pa-sm"
                    style="width: 20vw;"
                    v-model="location"
                    label="Building/Location"
                    lazy-rules
                    :rules="[ val => val !== null && val !== '' || 'Location is required']"
                  >
                    <template v-slot:prepend>
                      <q-icon color="accent" name="place"/>
                    </template>
                  </q-input>
                  <q-input
                    outlined
                    dense
                    readonly
                    ref="telephone"
                    v-model="telephone"
                    label="Telephone"
                    mask="(###) ### - ####"
                    fill-mask
                    color="accent"
                    class="q-pa-sm"
                    style="width: 20vw;"
                    lazy-rules
                    :rules="[ val => val !== null && val !== '' || 'Telephone is required']">
                    <template v-slot:prepend>
                      <q-icon color="accent" name="phone"/>
                    </template>
                  </q-input>
                </div>
              </div>
              <div class="row justify-center">
                <q-input
                    outlined
                    dense
                    ref="unit"
                    readonly
                    color="accent"
                    class="q-pa-sm"
                    style="width: 40vw;"
                    v-model="unit"
                    label="Requesting Unit"
                    lazy-rules
                    :rules="[ val => val !== null && val !== '' || 'Unit Name is required']">
                    <template v-slot:prepend>
                      <q-icon color="accent" name="local_library"/>
                    </template>
                </q-input>
                <q-input
                    outlined
                    dense
                    class="q-pa-sm"
                    ref="description"
                    clearable
                    color="accent"
                    style="width: 40vw;"
                    v-model="description"
                    type="textarea"
                    label="Description of Request"
                    lazy-rules
                    :rules="[ val => val !== null && val !== '' || 'Description is required']"/>
              </div>
            </q-card-section>
            <br>
            <q-separator color="secondary"/>

            <q-card-actions class="q-pa-sm justify-center">
              <q-btn no-caps unelevated icon-right="send" class="text-weight-light" @click="onSubmit" label="Forward" color="secondary"/>
              <q-btn no-caps flat @click="onReset" class="text-weight-light" label="Reset" color="accent"/>
            </q-card-actions>

            </q-card>
          </div>
        </div>
      </q-page>
  </q-page-container>
  </q-layout>
</template>

<script>
import { firebaseAuth, db } from 'boot/firebase'
import { LocalStorage, date } from 'quasar'

export default {
  data () {
    let timeStamp = Date.now()
    let rightNow = date.formatDate(timeStamp, 'YYYY-MM-DD')
    return {
      dense: false,
      category: null,
      telephone: null,
      unit: null,
      location: null,
      description: null,
      requestor: null,
      foreman: 'N/A',
      status: 'for Unit Head approval',
      date: rightNow
    }
  },
  computed: {
    today () {
      let timeStamp = Date.now()
      return date.formatDate(timeStamp, 'dddd D MMMM YYYY')
    }
  },
  created () {
    const user = JSON.parse(LocalStorage.getItem('user'))
    let useRef = db.collection('account').where('userId', '==', user.uid)

    useRef.get().then(querySnapshot => {
      querySnapshot.forEach(doc => {
        this.requestor = doc.data().fullname
        this.unit = doc.data().unit
        this.location = doc.data().location
        this.telephone = doc.data().telephone
      })
    })
  },
  methods: {
    async onSubmit () {
      let jobRef = db.collection('job_orders')
      let userId = firebaseAuth.currentUser.uid
      if (this.date === null || this.category === null || this.telephone === null || this.location === null || this.description === null || this.unit === null) {
        this.$refs.date.validate()
        this.$refs.category.validate()
        this.$refs.description.validate()
        this.$refs.unit.validate()
        this.$refs.location.validate()
        this.$refs.telephone.validate()
      } else {
        jobRef.add({
          userId: userId,
          status: this.status,
          category: this.category,
          date: this.date,
          telephone: this.telephone,
          unit: this.unit,
          location: this.location,
          description: this.description,
          requestor: this.requestor,
          foreman: this.foreman
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
    async onReset () {
      this.category = null
      this.description = null

      this.$refs.category.resetValidation()
      this.$refs.description.resetValidation()
    }
  }
}
</script>

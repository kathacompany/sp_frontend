<template>
<q-layout view="hHh lpR fFf">
  <q-page-container>
    <q-page class="window-height window-width row justify-center">
      <div class="q-gutter-sm flex text-center">
        <div style="min-width: 350px; max-height: 100%; margin-top: 40px">

          <q-card style="width: 700px">
            <q-card-section align="center">
              <div class="text-h5">JOB REQUEST FORM</div>
              <div class="q-pa-sm text-subtitle1">{{today}}</div>
            </q-card-section>
            <q-separator color="secondary"/>
            <div class="text-overline text-accent">(Repair of Vehicles and Equipment/ Renovation of Existing Physical Structures)</div>
            <br>

            <q-card-section class="q-pa-sm">
              <div class="col">
                <div class="row justify-center">
                  <q-input
                    outlined
                    dense
                    ref="date"
                    color="accent"
                    v-model="date"
                    mask="date"
                    label="Date"
                    lazy-rules
                    :rules="[
                       val => val !== null && val !== '' || 'Date is required'
                    ]">
                    <template v-slot:append>
                      <q-icon name="today" class="cursor-pointer">
                        <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                          <q-date v-model="date" @input="() => $refs.qDateProxy.hide()" />
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                  <q-select
                    outlined
                    dense
                    ref="category"
                    color="accent"
                    class="q-ma-sm"
                    style="min-width: 16vw; margin-top: 8px;"
                    v-model="category"
                    :options="['Plumbing', 'Electricity', 'Grounds', 'Transportation']"
                    label="Category"
                    lazy-rules
                    :rules="[
                       val => val !== null && val !== '' || 'Category is required'
                    ]">
                    <template v-slot:prepend>
                      <q-icon name="category" />
                    </template>
                  </q-select>
                </div>
              </div>
            </q-card-section>

            <q-card-section class="q-pa-sm">
              <div class="row justify-center">
               <q-input
                outlined
                ref="description"
                clearable
                color="accent"
                style="width: 43vw;"
                v-model="description"
                type="textarea"
                label="Description of Request"
                lazy-rules
                :rules="[ val => val !== null && val !== '' || 'Description is required']"/>
              </div>
            </q-card-section>

            <q-card-section class="q-pa-sm">
              <div class="col">
                <div class="row justify-center">
                  <q-input
                    outlined
                    dense
                    ref="unit"
                    clearable
                    color="accent"
                    class="q-ma-xs"
                    style="min-width: auto; width: 15vw;"
                    v-model="unit"
                    label="Requesting Unit"
                    lazy-rules
                    :rules="[ val => val !== null && val !== '' || 'Unit Name is required']">
                    <template v-slot:prepend>
                      <q-icon name="local_library"/>
                    </template>
                  </q-input>
                  <q-input
                    outlined
                    dense
                    ref="location"
                    clearable
                    color="accent"
                    class="q-ma-xs"
                    style="min-width: auto; width: 12vw;"
                    v-model="location"
                    label="Building"
                    lazy-rules
                    :rules="[ val => val !== null && val !== '' || 'Location is required']"
                  >
                    <template v-slot:prepend>
                      <q-icon name="place"/>
                    </template>
                  </q-input>
                  <q-input
                    outlined
                    dense
                    clearable
                    ref="telephone"
                    v-model="telephone"
                    label="Telephone"
                    mask="(###) ### - ####"
                    fill-mask
                    color="accent"
                    class="q-ma-xs"
                    style="min-width: auto; width: 15vw;"
                    lazy-rules
                    :rules="[ val => val !== null && val !== '' || 'Telephone is required']">
                    <template v-slot:prepend>
                      <q-icon name="phone"/>
                    </template>
                  </q-input>
                </div>
              </div>
            </q-card-section>
            <q-separator color="secondary"/>

            <q-card-actions align="center">
              <q-btn no-caps icon-right="send" @click="onSubmit" label="Forward" color="secondary"/>
              <q-btn no-caps flat @click="onReset" class="q-ml-md" label="Reset" color="accent"/>
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
import { date } from 'quasar'

export default {
  data () {
    return {
      dense: false,
      category: null,
      date: null,
      telephone: null,
      unit: null,
      location: null,
      description: null,
      status: 'for Unit Head approval',
      requestor: null,
      foreman: 'N/A'
    }
  },
  computed: {
    today () {
      let timeStamp = Date.now()
      return date.formatDate(timeStamp, 'dddd D MMMM YYYY')
    }
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

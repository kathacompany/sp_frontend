<template>
<q-layout view="hHh lpR fFf">
  <q-page-container>
    <q-page class="window-height window-width row justify-center">
      <div class="q-gutter-sm flex text-center">
        <div style="min-width: 350px; max-height: 100%; margin-top: 40px">

          <q-card class="q-pa-sm" style="width: 700px">
            <q-card-section align="center">
              <div class="text-h5 text-weight-light">ACCOUNT DETAILS</div>
              <div class="col">
                <div class="row justify-center">
                  <div class="q-pa-sm text-subtitle1"><q-icon name="face" color="secondary"/> {{user.usertype}}</div>
                  <div class="q-pa-sm text-subtitle1">{{date}}</div>
                </div>
              </div>
            </q-card-section>
            <q-separator color="secondary"/>
            <br>

            <q-card-section>
              <div class="row justify-center">
                <div class="col q-pa-sm">
                  <q-avatar v-if="user.image" ref="image" size="150px">
                    <img v-if="user.image" :src="user.image" @error="replaceByDefault">
                  </q-avatar>
                  <q-avatar v-else size="150px" ref="imageDef" font-size="120px" color="grey-3" text-color="primary" icon="person" />
                  <br>
                  <br>
                  <q-btn no-caps dense flat color="accent" @click="hidden = !hidden" icon="add_a_photo" :disable="disable"/>
                  <q-input type="file" color="accent" outlined style="width: 20vw;" ref="image" v-model="user.image" dense v-if="!hidden" @change="onGetImage" :disable="disable" lazy-rules :rules="[val => val !== null && val !== '' || 'Image is required']"/>
                </div>
                <div class="col" style="margin-top: 35px;">
                  <q-input style="width: 20vw" class="q-pa-sm" outlined dense color="accent" v-model="user.unit" label="Unit" :disable="disable" lazy-rules :rules="[val => val !== null && val !== '' || 'Unit is required']">
                    <template v-slot:prepend>
                      <q-icon name="local_library" />
                    </template>
                  </q-input>
                  <q-input style="width: 20vw" class="q-pa-sm" outlined dense color="accent" v-model="user.position" label="Position" :disable="disable" lazy-rules :rules="[val => val !== null && val !== '' || 'Position is required']">
                    <template v-slot:prepend>
                      <q-icon name="work" />
                    </template>
                  </q-input>
                </div>
              </div>
            </q-card-section>
            <q-separator color="secondary"/>
            <br>

            <q-card-section align="center">
              <div class="row justify-center">
                <div class="col">
                  <q-input style="width: 25vw" class="q-pa-sm" outlined dense clearable color="accent" v-model="user.fullname" label="Full Name" :disable="disable" lazy-rules :rules="[val => val !== null && val !== '' || 'Name is required']">
                    <template v-slot:prepend>
                      <q-icon name="person_pin" />
                    </template>
                  </q-input>
                 <!--  <q-input style="width: 25vw" class="q-pa-sm" outlined dense clearable color="accent" v-model="user.name.lastname" label="Last Name" :disable="disable" lazy-rules :rules="[val => val !== null && val !== '' || 'Last Name is required']">
                    <template v-slot:prepend>
                      <q-icon name="person_pin" />
                    </template>
                  </q-input> -->
                  <q-input style="width: 25vw" class="q-pa-sm" outlined dense clearable color="accent" v-model="user.telephone" label="Telephone" :disable="disable" lazy-rules :rules="[val => val !== null && val !== '' || 'Mobile is required']">
                    <template v-slot:prepend>
                      <q-icon name="phone" />
                    </template>
                  </q-input>
                  <q-input style="width: 25vw" class="q-pa-sm" outlined dense color="accent" :value="user.email" label="Email" :disable="disable" lazy-rules :rules="[val => val !== null && val !== '' || 'Email is required']">
                    <template v-slot:prepend>
                      <q-icon name="email" />
                    </template>
                  </q-input>
                </div>
              </div>
            </q-card-section>
            <q-separator color="secondary"/>

            <q-card-actions align="center">
              <q-btn no-caps v-model="disable" color="secondary" @click="disable = !disable" v-if="disable" icon="edit" label="Edit Profile"/>
              <q-btn no-caps flat color="secondary" v-else-if="!disable" label="Save" @click="saveChanges"/>
              <q-btn no-caps flat color="accent" @click="disable = true" v-if="!disable" label="Cancel"/>
            </q-card-actions>

            </q-card>
          </div>
        </div>
      </q-page>
  </q-page-container>
  </q-layout>
</template>

<style lang="sass">

  th:first-child,
  td:first-child
    position: sticky
    left: 0
    z-index: 1
</style>

<script>
import { firebaseAuth, db } from 'boot/firebase'
import { LocalStorage, date } from 'quasar'

export default {
  props: ['usertype'],
  data () {
    return {
      error: null,
      hidden: true,
      editedIndex: -1,
      disable: true,
      userId: null,
      imageDef: null,
      user: {
        usertype: '',
        image: '',
        fullname: '',
        mobile: '',
        unit: '',
        email: '',
        position: ''
      }
    }
  },
  created () {
    const user = JSON.parse(LocalStorage.getItem('user'))
    db.collection('account').where('userId', '==', user.uid).get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          const userData = {
            id: doc.id,
            usertype: doc.data().usertype,
            fullname: doc.data().fullname,
            telephone: doc.data().telephone,
            email: doc.data().email,
            image: doc.data().image,
            position: doc.data().position,
            unit: doc.data().unit
          }
          this.user = Object.assign({}, userData)
          this.docId = this.user.id
        })
      })
  },
  computed: {
    date () {
      let timeStamp = Date.now()
      return date.formatDate(timeStamp, 'dddd D MMMM YYYY')
    }
  },
  methods: {
    replaceByDefault (error) {
      if (error) {
        this.user.image = this.imageDef
      }
    },
    onGetImage (event) {
      const file = event.target.files[0]
      this.user.image = URL.createObjectURL(file)
      this.hidden = true
    },
    saveChanges () {
      this.disable = true
      var currentUser = firebaseAuth.currentUser.uid
      if (this.user !== '') {
        let useRef = db.collection('account').doc(this.docId)
        useRef.update(this.user)
        this.$q.notify({
          color: 'secondary',
          message: 'Updated successfully'
        })
      } else {
        let setRef = db.collection('account').doc(currentUser)
        setRef.set(this.user)
        this.$q.notify({
          color: 'secondary',
          message: 'Updated successfully'
        })
      }
    }
  }
}
</script>

<template>
<q-layout view="hHh lpR fFf">
  <q-page-container>
    <q-page class="window-height window-width row justify-center">
      <div class="q-gutter-sm flex text-center">
        <div style="min-width: 350px; max-height: 100%; margin-top: 30px">

          <q-card class="q-pa-xs" style="width: 700px; height: 650px">
            <q-card-section align="center">
              <div class="text-weight-medium">{{ date }}</div>
              <div class="q-pa-sm text-subtitle text-weight-light">
                <q-icon name="face" color="secondary"/> {{user.usertype}}
              </div>
            </q-card-section>

              <q-tabs
                v-model="tab"
                dense
                class="text-grey"
                align="justify"
                active-color="secondary"
                indicator-color="accent"
                narrow-indicator
              >
                <q-tab name="tab 1" label="My Profile" icon="account_box"/>
                <q-tab name="tab 2" label="Account Settings" icon="settings_applications"/>
              </q-tabs>
              <q-separator/>

              <q-tab-panels
                v-model="tab"
                animated
                transition-prev="fade"
                transition-next="fade"
              >
                <q-tab-panel name="tab 1">
                  <q-card-section >
                    <div align="center">
                      <q-input style="width: 35vw" class="q-pa-xs" v-model="user.unit" label="Unit" readonly>
                        <template v-slot:before>
                          <q-icon color="accent" name="local_library" />
                        </template>
                      </q-input>
                      <q-input style="width: 35vw" class="q-pa-xs" v-model="user.position" label="Position" readonly>
                        <template v-slot:before>
                          <q-icon color="accent" name="work" />
                        </template>
                      </q-input>
                      <br>
                      <br>
                      <q-input style="width: 35vw" class="q-pa-xs" v-model="user.fullname" label="Full Name" readonly>
                        <template v-slot:before>
                          <q-icon color="accent" name="person_pin" />
                        </template>
                      </q-input>
                      <q-input style="width: 35vw" class="q-pa-xs" v-model="user.location" label="Location" readonly>
                        <template v-slot:before>
                          <q-icon color="accent" name="place" />
                        </template>
                      </q-input>
                      <q-input style="width: 35vw" class="q-pa-xs" v-model="user.telephone" label="Telephone" mask="(###) ### - ####"   fill-mask readonly>
                        <template v-slot:before>
                          <q-icon color="accent" name="phone" />
                        </template>
                      </q-input>
                    </div>
                  </q-card-section>
                </q-tab-panel>

                <q-tab-panel name="tab 2">
                  <q-card-section align="center" v-for="data in currentUser" :key="data.key">
                    <q-input style="width: 35vw" class="q-pa-xs" v-model="user.userId" label="JOPSIS ID" readonly>
                      <template v-slot:before>
                        <span class="text-accent text-weight-bold">J</span>
                      </template>
                    </q-input>

                    <q-input bottom-slots style="width: 35vw" class="q-pa-xs" v-model="user.email" label="Email" readonly>
                      <template v-slot:before>
                        <q-icon color="accent" name="email"/>
                      </template>

                      <template v-slot:hint>
                       <span class="text-secondary text-weight-medium" v-if="data.emailVerified">*VERIFIED</span>
                       <span class="text-accent text-weight-medium" v-else>*UNVERIFIED</span>
                      </template>

                      <template v-slot:after v-if="!data.emailVerified">
                        <q-btn rounded unelevated class="q-pa-xs" color="secondary" icon-right="send" @click="emailVerify" label="Verify Email"/>
                      </template>
                    </q-input>
                  </q-card-section>
                  <br>
                  <q-card-section align="center">
                    <q-btn flat class="text-h6 text-weight-medium q-pa-xs" color="secondary" label="Change Password" @click="disable=false"/>
                    <q-btn flat class="text-h6 text-weight-medium q-pa-xs" color="accent" label="Cancel" v-if="!disable" @click="onCancel"/>
                    <q-separator/>
                    <div style="width: 320px"  class="q-pa-sm q-pt-md">
                      <q-input v-if="!disable" outlined dense ref="currentPassword" clearable color="secondary" class="q-pa-sm" v-model="currentPassword" label="Current Password" :type="isPwd ? 'password' : 'text'" :disable="disable" lazy-rules :rules="[val => val !== null && val !== '' || 'Current password is required']">
                        <template v-slot:prepend>
                          <q-icon color="accent" name="lock"/>
                        </template>
                        <template v-slot:append>
                          <q-icon
                          v-if="currentPassword"
                          :name="isPwd ? 'visibility_off' : 'visibility'"
                          class="cursor-pointer"
                          @click="isPwd = !isPwd"
                          />
                        </template>
                      </q-input>
                      <q-input v-if="!disable" outlined dense ref="newPassword" clearable bottom-slots color="secondary" class="q-pa-sm" v-model="newPassword" label="New Password" :type="isPwd ? 'password' : 'text'" :disable="disable" lazy-rules :rules="[val => val !== null && val !== '' || 'New Password is required']">
                        <template v-slot:prepend>
                          <q-icon color="accent" name="lock"/>
                        </template>
                        <template v-slot:hint>
                         <span class="text-accent">Password atleast 8 characters</span>
                        </template>
                        <template v-slot:append>
                          <q-icon
                          v-if="newPassword"
                          :name="isPwd ? 'visibility_off' : 'visibility'"
                          class="cursor-pointer"
                          @click="isPwd = !isPwd"
                          />
                        </template>
                      </q-input>
                      <div class="q-pa-sm q-pt-md">
                        <q-btn unelevated class="full-width q-pa-xs" color="secondary" label="Save" v-if="!disable" @click="onUpdate"/>
                      </div>
                    </div>
                  </q-card-section>

                </q-tab-panel>
              </q-tab-panels>
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
    return {
      tab: 'tab 1',
      isPwd: true,
      disable: true,
      newPassword: '',
      currentPassword: '',
      currentUser: [],
      user: {
        usertype: '',
        fullname: '',
        mobile: '',
        unit: '',
        email: '',
        position: '',
        location: '',
        telephone: ''
      }
    }
  },
  created () {
    const currentUser = JSON.parse(LocalStorage.getItem('user'))
    db.collection('account').where('userId', '==', currentUser.uid).onSnapshot(querySnapshot => {
      querySnapshot.forEach(doc => {
        const userData = {
          userId: doc.id,
          usertype: doc.data().usertype,
          fullname: doc.data().fullname,
          email: doc.data().email,
          area: doc.data().area,
          position: doc.data().position,
          unit: doc.data().unit,
          location: doc.data().location,
          telephone: doc.data().telephone
        }
        this.user = Object.assign({}, userData)
        this.currentUser.push(currentUser)
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
    async emailVerify () {
      const currentUser = firebaseAuth.currentUser

      await currentUser.sendEmailVerification()
        .then(() => {
          this.$q.notify({
            icon: 'sentiment_satisfied_alt',
            color: 'secondary',
            message: 'A link was sent to ' + currentUser.email
          })
        }).catch((error) => {
          this.$q.notify(error)
        })
    },
    reAuth (currentEmail, currentPassword) {
      return firebaseAuth.signInWithEmailAndPassword(currentEmail, currentPassword)
    },
    async onUpdate () {
      const currentUser = firebaseAuth.currentUser

      if (this.newPassword === '' || this.currentPassword === '' || this.newPassword === null || this.currentPassword === null) {
        this.$refs.newPassword.validate()
        this.$refs.currentPassword.validate()
      } else {
        await this.reAuth(currentUser.email, this.currentPassword).then(() => {
          currentUser.updatePassword(this.newPassword)
            .then(() => {
              firebaseAuth.signOut()
              this.$q.notify({
                icon: 'sentiment_satisfied_alt',
                color: 'accent',
                message: 'Passwor successfully changed. You can now re-login with your new password'
              })
            }).catch((error) => {
              this.$q.notify(error)
            })
        })
      }
    },
    onCancel () {
      this.disable = true
      this.$refs.newPassword.resetValidation()
      this.$refs.currentPassword.resetValidation()
    }
  }
}
</script>

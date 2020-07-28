<template>
    <q-page class="flex flex-center" style="background:linear-gradient(to top, #3B9C9C, #B0E0E6">
        <div class="row" style="padding: 5px; border:ridge #9C3B3B 1px; max-width: 100%;">
          <div class="col bg-secondary" style="width: 300px; min-width: 100px">
            <img src="statics/logo.png" style="margin-top: 50px; width: 150px;height: 150px"/>
              <h3 style="padding-top: 40px; margin: 0px">JOPSIS</h3>
                <h5 style="margin: 0px">Welcome Back!</h5>
          </div>
          <div class="col" style="width: 300px; min-width: 100px">
            <q-card class="bg-accent">
              <q-form>
                <q-select
                  outlined
                  ref="usertype"
                  color="secondary"
                  class="q-pa-md"
                  v-model="usertype"
                  label="Usertype"
                  lazy-rules
                  :rules="[val => val !== null && val !== '' && val !== undefined || 'Please select usertype!']"
                  :options="[
                  {label: 'Unit Requestor', value: 'Unit Requestor'},
                  {label: 'Unit Head', value: 'Unit Head'},
                  {label: 'CDMO Head', value: 'CDMO Head'},
                  {label: 'Foreman', value: 'Foreman'},
                  {label: 'Inventory Staff', value: 'Inventory Staff'},
                  {label: 'Worker', value: 'Worker'},
                  {label: 'Admin', value: 'Admin'}
                  ]">
                  <template v-slot:prepend>
                    <q-icon name="face"/>
                  </template>
                </q-select>
                <q-separator/>
                <q-card-section>
                  <span class="text-h6 text-weight-light" v-if="usertype.value">{{ usertype.value }}  Log In</span><br>
                    <q-input
                      outlined
                      clearable
                      ref="email"
                      icon="email"
                      v-model="email"
                      type="email"
                      color="secondary"
                      placeholder="Email"
                      lazy-rules
                      :rules="[val => val !== null && val !== '' || 'Email is required!']">
                      <template v-slot:prepend>
                        <q-icon name="email"/>
                      </template>
                    </q-input>
                    <q-input
                      outlined
                      clearable
                      ref="password"
                      v-model="password"
                      :type="isPwd ? 'password' : 'text'"
                      color="secondary"
                      placeholder="Password"
                      lazy-rules
                      :rules="[val => val !== null && val !== '' || 'Password atleast 8 characters is required!']">
                      <template v-slot:prepend>
                        <q-icon name="lock"/>
                      </template>
                      <template v-slot:append>
                        <q-icon v-if="password"
                        :name="isPwd ? 'visibility_off' : 'visibility'"
                        class="cursor-pointer"
                        @click="isPwd = !isPwd"/>
                      </template>
                    </q-input>
                </q-card-section>
               </q-form>
              <div style="margin-top: -20px">
                <q-card-actions>
                  <q-btn unelevated class="full-width" label="LOGIN"  color="secondary" @click="onLogin" icon-right="login"/>
                  <q-btn flat no-caps class="text-weight-light" label="Forgot Password" @click="forgot_dialog=true" icon-right="help"/>
                </q-card-actions>
              </div>

              <q-dialog v-model="forgot_dialog" persistent transition-show="rotate" transition-hide="rotate">
                <q-card style="width: 350px">
                  <q-bar class="bg-secondary text-white" style="height: 60px">
                    <div class="text-h6 text-weight-medium">Forgot your Password?</div>
                    <q-space />
                    <q-btn icon="close" flat round dense v-close-popup />
                  </q-bar>
                  <q-card-section>
                    <span class="text-subtitle text-grey text-weight-light">Provide an email to receive reset information</span><br>
                    <q-input class="q-pa-xs" outlined dense clearable color="secondary" type="email" v-model="forEmail" placeholder="Email Address">
                       <template v-slot:prepend>
                        <q-icon name="email"/>
                      </template>
                    </q-input>
                  </q-card-section>
                  <q-card-actions align="right">
                    <q-btn flat class="q-ma-sm" label="Submit" color="secondary" @click="resetPassword"/>
                  </q-card-actions>
                </q-card>
              </q-dialog>

            </q-card>
          </div>
        </div>
    </q-page>
</template>

<script>
import { Loading } from 'quasar'
import { db, firebaseAuth } from 'boot/firebase'

export default {
  data () {
    return {
      forEmail: null,
      usertype: '',
      email: null,
      password: null,
      isPwd: true,
      forgot_dialog: false
    }
  },
  methods: {
    onWelcome (id, usertype) {
      const account = db.collection('account').doc(id.claims.user_id)
      if (id.claims.email_verified) {
        account.set({
          signedIn: id.authTime
        }, { merge: true })
        this.$q.dialog({
          title: 'WELCOME BACK,' + ' ' + id.claims.name + '!',
          bgcolor: 'secondary',
          message: 'You are logged in as' + ' ' + usertype,
          ok: {
            outline: true,
            color: 'secondary',
            label: 'Got It',
            icon: 'face'
          }
        })
      } else {
        account.set({
          signedIn: id.authTime
        }, { merge: true })
        this.$q.dialog({
          persistent: true,
          title: 'WELCOME,' + ' ' + id.claims.name + '!',
          bgcolor: 'secondary',
          message: 'You are logged in as' + ' ' + usertype + '. ' + 'Please verify your email address by clicking the button below',
          ok: {
            outline: true,
            color: 'secondary',
            label: 'Verify Email',
            icon: 'email'
          },
          cancel: {
            flat: true,
            color: 'secondary',
            label: 'Later'
          }
        }).onOk(async () => {
          await this.emailVerify()
        })
      }
    },
    async emailVerify () {
      const currentUser = firebaseAuth.currentUser

      await currentUser.sendEmailVerification()
        .then(() => {
          this.$q.notify({
            icon: 'sentiment_satisfied_alt',
            color: 'accent',
            message: 'A link was sent to ' + currentUser.email
          })
          firebaseAuth.signOut()
        }).catch((error) => {
          this.$q.notify(error)
        })
    },
    async resetPassword () {
      const emailAddress = this.forEmail

      await firebaseAuth.sendPasswordResetEmail(emailAddress)
        .then(() => {
          this.$q.notify({
            icon: 'sentiment_satisfied_alt',
            color: 'accent',
            message: 'A link was sent to ' + emailAddress
          })
          this.forgot_dialog = false
        })
        .catch(error => {
          this.$q.notify(error)
        })
    },
    async onLogin () {
      try {
        if (this.usertype.value === undefined || this.usertype.value === '' || this.email === null || this.password === null) {
          this.$refs.usertype.validate()
          this.$refs.email.validate()
          this.$refs.password.validate()
        }
        await firebaseAuth.signInWithEmailAndPassword(this.email, this.password)
          .then(
            user => {
              Loading.show()
              firebaseAuth.currentUser.getIdTokenResult(true)
                .then((idTokenResult) => {
                  if (this.usertype.value === 'Unit Requestor' && idTokenResult.claims.requestor) {
                    this.$router.push('/UserHomepage')
                    Loading.hide()
                    this.onWelcome(idTokenResult, this.usertype.value)
                  } else if (this.usertype.value === 'Unit Head' && idTokenResult.claims.unit_head) {
                    this.$router.push('/HeadHomepage')
                    Loading.hide()
                    this.onWelcome(idTokenResult, this.usertype.value)
                  } else if (this.usertype.value === 'CDMO Head' && idTokenResult.claims.cdmo_head) {
                    this.$router.push('/CDMOHomepage')
                    Loading.hide()
                    this.onWelcome(idTokenResult, this.usertype.value)
                  } else if (this.usertype.value === 'Inventory Staff' && idTokenResult.claims.inventory) {
                    this.$router.push('/InventoryHomepage')
                    Loading.hide()
                    this.onWelcome(idTokenResult, this.usertype.value)
                  } else if (this.usertype.value === 'Foreman' && idTokenResult.claims.foreman) {
                    this.$router.push('/ForemanHomepage')
                    Loading.hide()
                    this.onWelcome(idTokenResult, this.usertype.value)
                  } else if (this.usertype.value === 'Worker' && idTokenResult.claims.worker) {
                    this.$router.push('/WorkerHomepage')
                    Loading.hide()
                    this.onWelcome(idTokenResult, this.usertype.value)
                  } else if (this.usertype.value === 'Admin' && idTokenResult.claims.admin) {
                    this.$router.push('/AdminHomepage')
                    Loading.hide()
                    this.$q.dialog({
                      title: 'WELCOME!',
                      color: 'secondary',
                      message: 'You are logged in as Admin',
                      ok: {
                        outline: true,
                        color: 'secondary',
                        label: 'Got It',
                        icon: 'face'
                      }
                    })
                  } else {
                    Loading.hide()
                    firebaseAuth.signOut()
                    this.$q.notify({
                      icon: 'error',
                      message: 'Selected usertype is incorrect.'
                    })
                  }
                })
                .catch(error => {
                  this.$q.notify(error)
                })
            })
          .catch(error => {
            this.$q.notify(error)
          })
      } catch (error) {
        this.$q.notify(error)
      }
    }
  }
}
</script>

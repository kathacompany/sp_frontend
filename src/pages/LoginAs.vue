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
              <q-card-section>
                <div class="text-h6">Log In</div>
              </q-card-section>
              <q-separator/>
              <q-card-section>
                <q-form>
                  <q-select
                  outlined
                  clearable
                  ref="usertype"
                  color="secondary"
                  class="full-width"
                  v-model="usertype"
                  :options="['Unit Requestor', 'Unit Head', 'Administrative Staff', 'Foreman', 'Inventory Staff', 'Worker']"
                  label="Usertype"
                  lazy-rules
                  :rules="[
                     val => val !== null && val !== '' || 'Please select usertype!'
                  ]">
                    <template v-slot:prepend>
                      <q-icon name="face"/>
                    </template>
                  </q-select>
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
                  :rules="[
                    val => val !== null && val !== '' || 'Email is required!'
                  ]">
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
                  :rules="[
                    val => val !== null && val !== '' || 'Password atleast 8 characters is required!'
                  ]">
                    <template v-slot:prepend>
                      <q-icon name="lock"/>
                    </template>
                    <template v-slot:append>
                      <q-icon v-if="password" :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="isPwd = !isPwd"/>
                    </template>
                  </q-input>
                </q-form>
              </q-card-section>
              <div style="margin-top: -15px">
              <q-card-actions align="center">
                <q-btn class="full-width" label="LOGIN"  color="secondary" @click="onLogin"/>
                <q-btn flat label="Forgot password?" @click="dialog = true"/>
              </q-card-actions>
            </div>
            </q-card>
          </div>
            <q-dialog v-model="dialog">
              <q-card container class="text-accent">
                  <q-card-section>
                    <div class="text-h6">Enter Email Address</div>
                  </q-card-section>
                  <q-card-section>
                    <q-input v-model="email" hint="Press Enter to continue" autofocus @keyup.enter="sentEmail = true" />
                  </q-card-section>
                  <q-card-actions align="right" class="text-secondary">
                    <q-btn flat label="Cancel" v-close-popup />
                  </q-card-actions>
              </q-card>
            </q-dialog>
              <q-dialog v-model="sentEmail">
                <q-card container class="flex flex-center">
                  <q-card-section class="text-accent">
                    A link was sent to your email!
                      <q-card-actions align="right">
                      <q-btn flat label="Close" color="secondary" v-close-popup/>
                      </q-card-actions>
                  </q-card-section>
                </q-card>
              </q-dialog>
        </div>
    </q-page>
</template>

<script>
import { Loading } from 'quasar'
import { firebaseAuth, db } from 'boot/firebase'

export default {
  data () {
    return {
      usertype: null,
      email: null,
      password: null,
      isPwd: true,
      error: '',
      layout: false,
      dialog: false,
      sentEmail: false
    }
  },
  created () {
    db.collection('account').get().then(querySnapshot => {
      querySnapshot.forEach(doc => {
        const userRef = {
          id: doc.id,
          userId: doc.data().userId
        }
        this.userId = userRef.userId
        this.id = userRef.id
      })
    })
  },
  methods: {
    addAuth () {
      this.currentuser = firebaseAuth.currentUser.uid
      // let setRef = db.collection('account').doc(this.id)
      let setRef = db.collection('account').doc(this.currentuser)
      setRef.set({
        userId: this.currentuser,
        email: this.email,
        usertype: this.usertype
      },
      { merge: true }
      )
        .catch(error => {
          console.error('Error message: ', error)
        })
      // } else {
      //   setRef.update({
      //     userId: this.currentuser,
      //     email: this.email,
      //     usertype: this.usertype
      //   })
      //     .catch(error => {
      //       console.log('user already existed, updated!', error)
      //     })
      // }
    },
    async onLogin () {
      try {
        if (this.usertype === null || this.email === null || this.password === null) {
          this.$refs.usertype.validate()
          this.$refs.email.validate()
          this.$refs.password.validate()
        } else if (this.usertype === 'Unit Requestor' && this.email === 'requestor@gmail.com' && this.password === '12345678') {
          Loading.show()
          await firebaseAuth
            .signInWithEmailAndPassword(this.email, this.password)
            .then(
              user => {
                this.$router.push('/UserHomepage')
                Loading.hide()
                this.$q.dialog({
                  title: 'Welcome!',
                  color: 'secondary',
                  message: 'You are logged in as Unit Requestor',
                  ok: 'OK'
                })
              })
          this.addAuth()
        } else if (this.usertype === 'Unit Head' && this.email === 'head@gmail.com' && this.password === '12345678') {
          Loading.show()
          await firebaseAuth
            .signInWithEmailAndPassword(this.email, this.password)
            .then(
              user => {
                this.$router.push('/HeadHomepage')
                Loading.hide()
                this.$q.dialog({
                  title: 'Welcome!',
                  color: 'secondary',
                  message: 'You are logged in as Unit Head',
                  ok: 'OK'
                })
              })
          this.addAuth()
        } else if (this.usertype === 'Administrative Staff' && this.email === 'administrative@gmail.com' && this.password === '12345678') {
          Loading.show()
          await firebaseAuth
            .signInWithEmailAndPassword(this.email, this.password)
            .then(
              user => {
                this.$router.push('/AdministrativeHomepage')
                Loading.hide()
                this.$q.dialog({
                  title: 'Welcome!',
                  color: 'secondary',
                  message: 'You are logged in as Administrative Staff',
                  ok: 'OK'
                })
              })
          this.addAuth()
        } else if (this.usertype === 'Foreman' && this.email === 'foreman@gmail.com' && this.password === '12345678') {
          Loading.show()
          await firebaseAuth
            .signInWithEmailAndPassword(this.email, this.password)
            .then(
              user => {
                this.$router.push('/ForemanHomepage')
                Loading.hide()
                this.$q.dialog({
                  title: 'Welcome!',
                  color: 'secondary',
                  message: 'You are logged in as Foreman',
                  ok: 'OK'
                })
              })
          this.addAuth()
        } else if (this.usertype === 'Inventory Staff' && this.email === 'inventory@gmail.com' && this.password === '12345678') {
          Loading.show()
          await firebaseAuth
            .signInWithEmailAndPassword(this.email, this.password)
            .then(
              user => {
                this.$router.push('/InventoryHomepage')
                Loading.hide()
                this.$q.dialog({
                  title: 'Welcome!',
                  color: 'secondary',
                  message: 'You are logged in as Inventory Staff',
                  ok: 'OK'
                })
              })
          this.addAuth()
        } else if (this.usertype === 'Worker' && this.email === 'worker@gmail.com' && this.password === '12345678') {
          Loading.show()
          await firebaseAuth
            .signInWithEmailAndPassword(this.email, this.password)
            .then(
              user => {
                this.$router.push('/WorkerHomepage')
                Loading.hide()
                this.$q.dialog({
                  title: 'Welcome!',
                  color: 'secondary',
                  message: 'You are logged in as Worker',
                  ok: 'OK'
                })
              })
          this.addAuth()
        } else {
          this.$q.dialog({
            title: 'Alert!',
            color: 'secondary',
            message: 'Usertype or Email or Password is incorrect!',
            ok: 'Try Again'
          })
        }
      } catch (error) {
        console.log('error message', error)
      }
    }
  }
}
</script>

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
                  :options="[{label: 'Unit Requestor', value: 'Unit Requestor'},
                            {label: 'Unit Head', value: 'Unit Head'},
                            {label: 'Administrative Staff', value: 'Administrative Staff'},
                            {label: 'Foreman', value: 'Foreman'},
                            {label: 'Inventory Staff', value: 'Inventory Staff'},
                            {label: 'Worker', value: 'Worker'},
                            {label: 'Root', value: 'Root'},
                            ]">
                  <template v-slot:prepend>
                    <q-icon name="face"/>
                  </template>
                </q-select>
                <q-separator/>
                <q-card-section>
                  <div class="text-h6 text-weight-light">{{ usertype.value }}  Log In</div>
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
                        <q-icon v-if="password" :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="isPwd = !isPwd"/>
                      </template>
                    </q-input>
                </q-card-section>
               </q-form>
              <div style="margin-top: -15px">
              <q-card-actions align="center">
                <q-btn class="full-width text-weight-light" label="LOGIN"  color="secondary" @click="onLogin"/>
              </q-card-actions>
            </div>
            </q-card>
          </div>
        </div>
    </q-page>
</template>

<script>
import { LocalStorage, Loading } from 'quasar'
import { firebaseAuth, db } from 'boot/firebase'

export default {
  data () {
    return {
      usertype: '',
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
          userId: doc.data().userId,
          user: doc.data().user
        }
        this.userId = userRef.userId
        this.id = userRef.id
        this.user = userRef.user
      })
    })
  },
  methods: {
    addAuth () {
      const user = JSON.parse(LocalStorage.getItem('user'))
      let setRef = db.collection('account').where('userId', '==', user.uid)

      setRef.get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          doc.ref.update({
            userId: user.uid,
            email: this.email,
            usertype: this.usertype.value
          })
        })
      })
        .catch(error => {
          console.error('Error message: ', error)
        })
    },
    async onLogin () {
      try {
        if (this.usertype.value === undefined || this.usertype.value === '' || this.email === null || this.password === null) {
          this.$refs.usertype.validate()
          this.$refs.email.validate()
          this.$refs.password.validate()
        } else if (this.usertype.value === 'Unit Requestor') {
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
        } else if (this.usertype.value === 'Unit Head') {
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
        } else if (this.usertype.value === 'Administrative Staff') {
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
        } else if (this.usertype.value === 'Foreman') {
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
        } else if (this.usertype.value === 'Inventory Staff') {
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
        } else if (this.usertype.value === 'Worker') {
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
        } else if (this.usertype.value === 'Root') {
          Loading.show()
          await firebaseAuth
            .signInWithEmailAndPassword(this.email, this.password)
            .then(
              user => {
                this.$router.push('/RootHomepage')
                Loading.hide()
                this.$q.dialog({
                  title: 'Welcome!',
                  color: 'secondary',
                  message: 'You are logged in as Superuser',
                  ok: 'OK'
                })
              })
          this.addAuth()
        } else {
          Loading.hide()
          this.$q.dialog({
            title: 'Alert!',
            color: 'secondary',
            message: 'Usertype or Email or Password is incorrect!',
            ok: 'Try Again'
          })
        }
      } catch (error) {
        alert(error)
        Loading.hide()
        console.log(error)
      }
    }
  }
}
</script>

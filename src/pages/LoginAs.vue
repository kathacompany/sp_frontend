<template>
<<<<<<< HEAD
    <q-page class="flex flex-center">
        <q-card class="bg-primary text-center" shadow-3 style="padding:20px;">
            <q-card-section>
            <!-- <q-card-section class="bg-secondary"> -->
            <div class="text-h4">Welcome to JOPSIS</div>
            </q-card-section>
            <q-separator/>
            <q-card-section>
           <div class="q-gutter-sm">
                <q-btn-dropdown no caps color="secondary" label="UNIT" dropdown-icon="change_history">
                    <q-list>
                    <q-item clickable v-close-popup @click="$router.push('/UserLogin')">
                        <q-item-section>
                        <q-item-label> Unit Requestor</q-item-label>
                        </q-item-section>
                    </q-item>

                    <q-item clickable v-close-popup @click="$router.push('/HeadLogin')">
                        <q-item-section>
                        <q-item-label>Unit Head</q-item-label>
                        </q-item-section>
                    </q-item>
                  </q-list>
                </q-btn-dropdown>
                 <q-btn-dropdown no caps v-model="usertype" color="secondary" label="CDMO Staff" dropdown-icon="change_history">
                    <q-list>
                    <q-item clickable v-close-popup @click="$router.push('/AdministrativeLogin')">
                        <q-item-section>
                        <q-item-label> Administrative Staff</q-item-label>
                        </q-item-section>
                    </q-item>

                    <q-item clickable v-close-popup @click="$router.push('/InventoryLogin')">
                        <q-item-section>
                        <q-item-label>Inventory Staff</q-item-label>
                        </q-item-section>
                    </q-item>

                    <q-item clickable v-close-popup @click="$router.push('/ForemenLogin')">
                        <q-item-section>
                        <q-item-label>Foreman</q-item-label>
                        </q-item-section>
                    </q-item>

                    <q-item clickable v-close-popup @click="$router.push('/WorkerLogin')">
                        <q-item-section>
                        <q-item-label>Worker</q-item-label>
                        </q-item-section>
                    </q-item>
                    </q-list>
                    </q-btn-dropdown>
                </div>
            </q-card-section>
        </q-card>
        <!-- <q-card rounded class="bg-primary" style="padding:50px;">
            <q-input v-model="email"
            label="Email"></q-input>
            <q-input v-model="password" label="Password" type="password"></q-input>
            <br/>
            <q-btn push rounded no-caps @click="login" class="q-mr-xs" label="LOGIN" color="secondary"/>
            <q-btn push rounded no-caps v-go-back="'/'" class="q-mr-xs" label="CANCEL" color="secondary"/>
            <br/>
            <q-btn flat class="q-mr-sm" label="Forgot password?" color="primary" @click="dialog = true"/>
        </q-card>
            <q-dialog v-model="dialog">
            <q-card container class="bg-white" style="padding:40px;">
                <q-card-section>
                <div class="text-h6">Enter Email Address</div>
                </q-card-section>

                <q-card-section>
                <q-input dense v-model="email" label="Press Enter to continue" autofocus @keyup.enter="sentEmail = true" />
                </q-card-section>
                <br>
                <q-card-actions align="right" class="text-primary">
                <q-btn flat label="Cancel" v-close-popup />
                </q-card-actions>
=======
    <q-page class="flex flex-center" style="background:linear-gradient(to top, #3B9C9C, #B0E0E6">
        <div class="row" style="padding: 5px; border:ridge #9C3B3B 2px; max-width: 100%;">
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
                  filled
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
                  square
                  filled
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
                  square
                  filled
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
>>>>>>> 463a21677031f679fb323bf2410525d549cd140d
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

import { firebaseAuth } from 'boot/firebase'

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
  methods: {
    onLogin: function (e) {
      if (this.usertype === null || this.email === null || this.password === null) {
        this.$refs.usertype.validate()
        this.$refs.email.validate()
        this.$refs.password.validate()
      } else if (this.usertype === 'Unit Requestor' && this.email === 'requestor@gmail.com' && this.password === '12345678') {
        firebaseAuth
          .signInWithEmailAndPassword(this.email, this.password)
          .then(
            user => {
              this.$router.push('/UserHomepage')
              this.$q.dialog({
                title: 'Welcome!',
                color: 'secondary',
                message: 'You are logged in as Unit Requestor',
                ok: 'OK'
              })
            },
            err => {
              console.log(err.message)
            }
          )
      } else if (this.usertype === 'Unit Head' && this.email === 'head@gmail.com' && this.password === '12345678') {
        firebaseAuth
          .signInWithEmailAndPassword(this.email, this.password)
          .then(
            user => {
              this.$router.replace('/HeadHomepage')
              this.$q.dialog({
                title: 'Welcome!',
                color: 'secondary',
                message: 'You are logged in as Unit Head',
                ok: 'OK'
              })
            },
            err => {
              console.log(err.message)
            }
          )
      } else if (this.usertype === 'Administrative Staff' && this.email === 'administrative@gmail.com' && this.password === '12345678') {
        firebaseAuth
          .signInWithEmailAndPassword(this.email, this.password)
          .then(
            user => {
              this.$router.push('/AdministrativeHomepage')
              this.$q.dialog({
                title: 'Welcome!',
                color: 'secondary',
                message: 'You are logged in as Administrative Staff',
                ok: 'OK'
              })
            },
            err => {
              console.log(err.message)
            }
          )
      } else if (this.usertype === 'Foreman' && this.email === 'foreman@gmail.com' && this.password === '12345678') {
        firebaseAuth
          .signInWithEmailAndPassword(this.email, this.password)
          .then(
            user => {
              this.$router.push('/ForemanHomepage')
              this.$q.dialog({
                title: 'Welcome!',
                color: 'secondary',
                message: 'You are logged in as Foreman',
                ok: 'OK'
              })
            },
            err => {
              console.log(err.message)
            }
          )
      } else if (this.usertype === 'Inventory Staff' && this.email === 'inventory@gmail.com' && this.password === '12345678') {
        firebaseAuth
          .signInWithEmailAndPassword(this.email, this.password)
          .then(
            user => {
              this.$router.push('/InventoryHomepage')
              this.$q.dialog({
                title: 'Welcome!',
                color: 'secondary',
                message: 'You are logged in as Inventory Staff',
                ok: 'OK'
              })
            },
            err => {
              console.log(err.message)
            }
          )
      } else if (this.usertype === 'Worker' && this.email === 'worker@gmail.com' && this.password === '12345678') {
        firebaseAuth
          .signInWithEmailAndPassword(this.email, this.password)
          .then(
            user => {
              this.$router.push('/WorkerHomepage')
              this.$q.dialog({
                title: 'Welcome!',
                color: 'secondary',
                message: 'You are logged in as Worker',
                ok: 'OK'
              })
            },
            err => {
              console.log(err.message)
            }
          )
      } else {
        this.$q.dialog({
          title: 'Alert!',
          color: 'secondary',
          message: 'Usertype or Email or Password is incorrect',
          ok: 'OK'
        })
      }
      e.preventDefault()
    }
  }
}

</script>

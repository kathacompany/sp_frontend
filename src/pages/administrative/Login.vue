<template>
  <q-page class="window-height window-width row justify-center items-center">
    <div class="column" style="width: 25%">
        <q-card class="bg-primary shadow-3">
          <q-card-section class="bg-secondary">
            <div class="text-h6">Administrative Staff Login</div>
          </q-card-section>
          <q-separator/>
          <q-card-section>
            <q-form class="q-gutter-md">
              <q-input square filled icon="email" v-model="email" type="email" color="secondary" label="Email">
                <template v-slot:prepend>
                  <q-icon name="email"/>
                </template>
                <template v-slot:append>
                  <q-icon v-if="email !== ''" name="close" @click="email = ''" class="cursor-pointer" />
                </template>
              </q-input>
              <q-input square filled v-model="password" type="password" color="secondary" label="Password">
                 <template v-slot:prepend>
                  <q-icon name="lock"/>
                </template>
                <template v-slot:append>
                  <q-icon v-if="password !== ''" name="close" @click="password = ''" class="cursor-pointer" />
                </template>
              </q-input>
            </q-form>
          </q-card-section>
          <q-card-actions class="q-px-md">
            <q-btn unelevated class="full-width" label="LOGIN"  color="secondary" @click="login"/>
            <q-btn unelevated class="full-width" flat label="Forgot password?" @click="dialog = true"/>
          </q-card-actions>
        </q-card>
        <q-dialog v-model="dialog">
          <q-card container class="bg-white">
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
          </q-card>
        </q-dialog>
          <div>
            <q-dialog v-model="sentEmail">
              <q-card container class="flex flex-center">
                <q-card-section>
                  A link was sent to your email
                    <q-card-actions align="right">
                    <q-btn flat label="Close" color="secondary" v-close-popup/>
                    </q-card-actions>
                </q-card-section>
              </q-card>
            </q-dialog>
        </div>
    </div>
  </q-page>
</template>

<style>
</style>

<script>
import * as firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'

export default {
  data () {
    return {
      email: '',
      password: '',
      error: '',
      layout: false,
      dialog: false,
      sentEmail: false
    }
  },
  methods: {
    login: function (e) {
      firebase
        .auth()
        .signInWithEmailAndPassword(this.email, this.password)
        .then(
          user => {
            this.$router.push('/AdministrativeHomepage')
          },
          err => {
            alert(err.message)
          }
        )
      e.preventDefault()
    }
  }
}

</script>

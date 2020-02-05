<template>
    <q-page class="flex flex-center">
        <q-card rounded class="bg-primary" style="padding:50px;">
            <q-input v-model="email"
            label="Email"></q-input>
            <q-input v-model="password" label="Password" type="password"></q-input>
            <br/>
            <q-btn push rounded no-caps @click="login" class="q-mr-sm" label="LOGIN" color="secondary"/>
            <q-btn push rounded no-caps v-go-back="'/'" class="q-mr-sm" label="CANCEL" color="light"/>
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
            this.$router.push('/WorkerHomepage')
            alert(`You are logged in as ${this.email}`)
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

<template>
    <q-page class="flex flex-center">
        <q-card rounded class="bg-primary" style="padding:20px;">
            <h4> Welcome to JOPSIS </h4>
            <div class="q-gutter-sm">
                <q-btn no caps push v-model="usertype" color="secondary" label="University Unit" @click="$router.push('/UserLogin')"/>
                 <q-btn-dropdown push no caps v-model="usertype" color="secondary" label="CDMO Staff" dropdown-icon="change_history">
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
             </q-card>
            </q-dialog>
        </div> -->
    </q-page>
</template>

<style>
</style>

<script>
// import * as firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
// import 'firebase/database/account'

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
  }
  // },
  // methods: {
  //   login: function (e) {
  //     // firebase.database.collection('account').doc(account.user_type).get().then(doc => {})
  //     firebase
  //       .auth()
  //       .signInWithEmailAndPassword(this.email, this.password)
  //       .then(
  //         user => {
  //           if (this.user_type === 'unit') {
  //             this.$router.push('/UnitHomepage')
  //             alert(`You are logged in as ${this.email}`)
  //           }
  //           if (this.user_type === 'staff') {
  //             this.$router.push('/AdministrativeHomepage')
  //             alert(`You are logged in as ${this.email}`)
  //           }
  //           if (this.user_type === 'foreman') {
  //             this.$router.push('/ForemenHomepage')
  //             alert(`You are logged in as ${this.email}`)
  //           }
  //           if (this.user_type === 'worker') {
  //             this.$router.push('/WorkerHomepage')
  //             alert(`You are logged in as ${this.email}`)
  //           }
  //           if (this.user_type === 'inventory') {
  //             this.$router.push('/InventoryHomepage')
  //             alert(`You are logged in as ${this.email}`)
  //           }
  //           this.$router.push('/InventoryHomepage')
  //           alert(`You are logged in as ${this.email}`)
  //         },
  //         err => {
  //           alert(err.message)
  //         }
  //       )
  //     e.preventDefault()
  //   }
  // }
}

</script>

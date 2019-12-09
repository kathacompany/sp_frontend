<template>
    <form @submit.prevent="submitForm">
    <q-page class="flex flex-center">
        <q-card rounded class="bg-primary" style="padding:50px;">
            <q-input
            v-model="formData.email"
            :rules="[ val => isValidEmailAddress(val) || 'Please enter a valid email address.']"
            ref="email"
            lazy-rules
            label="Email"
            stack-label />
            <q-input
            v-model="formData.password"
            label="Password"
            type="password"
            :rules="[ val => val.length >= 6 || 'Please enter at least 6 characters.']"
            ref="password"
            lazy-rules
            stack-label/>
            <br/>
            <q-btn push rounded no-caps type="submit" class="q-mr-sm" label="Login" color="secondary" @click="$router.push('/AdministrativeHomepage')"/>
            <!-- <q-btn push rounded no-caps type="submit" class="q-mr-sm" label="Login" color="secondary"/> -->
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
</form>
</template>

<style>
</style>

<script>
// import { mapActions } from 'vuex'
export default {
  data () {
    return {
      formData: {
        email: '',
        password: ''
      },
      layout: false,
      dialog: false,
      sentEmail: false
    }
  }
  // },
  // methods: {
  //   ...mapActions('auth', ['loginUser']),
  //   isValidEmailAddress (email) {
  //     var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/
  //     return re.test(String(email).toLowerCase())
  //   },
  //   submitForm () {
  //     this.$refs.email.validate()
  //     this.$refs.password.validate()
  //     if (!this.$refs.email.hasError && !this.$refs.password.hasError) {
  //       this.loginUser(this.formData)
  //     }
  //   }
  // },
  // filters: {
  //   titleCase (value) {
  //     return value.charAt(0).toUpperCase() + value.slice(1)
  //   }
  // }
}
</script>

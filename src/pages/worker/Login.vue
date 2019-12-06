<template>
    <q-page class="flex flex-center">
        <q-card rounded class="bg-primary" style="padding:50px;">
            <q-input v-model="username" label="Username"></q-input>
            <q-input v-model="Email" label="Password" type="password"></q-input>
            <br/>
            <q-btn push rounded no-caps @click="$router.push('/WorkerHomepage')" class="q-mr-sm" label="LOGIN" color="secondary"/>
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
export default {
  data () {
    return {
      username: '',
      password: '',
      email: '',
      layout: false,
      dialog: false,
      sentEmail: false

    }
  }
}
</script>

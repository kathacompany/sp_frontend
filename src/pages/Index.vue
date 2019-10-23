<template>
    <q-page class="flex flex-center">
        <div class="bg-blue">
            <q-input v-model="username" label="Name"></q-input>
            <q-input v-model="Email" label="Email"></q-input>
            <br/>
            <q-btn class="q-mr-sm" label="LOGIN" color="positive"/>
            <q-btn flat class="q-mr-sm" label="Forgot password?" color="positive" @click="dialog = true"/>
        </div>
        <div class="q-pa-md q-gutter-sm">
            <q-dialog v-model="dialog">
            <q-card style="min-width: 400px" container class="bg-white">
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
        </div>
        <div>
            <q-dialog v-model="sentEmail">
            <q-card container class="bg-white">
                <q-card-section>
                A link was sent to your email
                    <q-card-actions align="right">
                    <q-btn flat label="Close" color="primary" v-close-popup/>
                    </q-card-actions>
                </q-card-section>
            </q-card>
            </q-dialog>
        </div>
    </q-page>
</template>

<style>
    .bg-blue{
        padding: 50px;
        width: 450px;
        text-align: center;
        opacity:;
    }
    .bg-white{
        padding: 20px;
    }
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

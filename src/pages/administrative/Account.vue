<template>
  <q-layout view="hHh lpR fFf">
    <q-page-container>
    <q-page class="flex flex-center text-center">
      <div style="width: 100%; height: 50%;">
        <q-icon name="person" style="font-size:200px;"/>
      </div>
      <div class="q-gutter-md">
        <q-table
          card-class="bg-primary"
          :data="tableData"
          :columns="tableColumns"
          hide-bottom
          style="width:500px;"
        />
        <q-table
          card-class="bg-primary"
          :data="profileData"
          :columns="profileColumns"
          hide-bottom
          style="width:500px;"
        />
        <q-btn rounded no-caps push class="q-pa-sm q-ma-sm" color="secondary" @click="opened=true" label="Edit Information"/>

          <q-dialog v-model="opened" maximized class="bg-white">
            <q-layout class="no-shadow">
              <q-page-container>
                <q-page class="flex flex-center">
                  <q-card container class="bg-primary q-ma-sm q-pa-md" style="width:80%;">
                    <q-card-section>
                      <div class="q-pa-md full-width">
                        <q-input class="q-ma-sm" required v-model="newFirstName" label="First Name"></q-input>
                        <q-input class="q-ma-sm" required v-model="newLastName" label="Last Mame"></q-input>
                        <q-input class="q-ma-sm" required v-model="newMiddleName" label="Middle Name"></q-input>
                        <q-input class="q-ma-sm" required v-model="newSuffix" label="Suffix"></q-input>
                        <q-input class="q-ma-sm" required v-model="newEmail" label="Email"></q-input>
                      <q-card-actions >
                        <q-btn rounded no-caps push color="secondary" class="text-white" @click="saveChanges" label="Save Changes"/>
                        <q-btn rounded no-caps push color="secondary" label="Cancel" class="text-white" v-close-popup/>
                      </q-card-actions>
                      </div>
                    </q-card-section>
                  </q-card>
                </q-page>
              </q-page-container>
            </q-layout>
          </q-dialog>
        </div>
    </q-page>
    </q-page-container>
  </q-layout>
</template>

<style lang="sass">
  .q-pa-md
    -webkit-text-fill-color: white;
</style>

<script>
// import AuthService from 'src/services/auth'

export default {
  created () {
    this.getUserDetails()
  },
  profile: '',
  data: () => ({
    opened: false,
    newFirstName: '',
    newLastName: '',
    newMiddleName: '',
    newSuffix: '',
    newEmail: '',
    profiledata: {
      first_name: '',
      last_name: '',
      middle_name: '',
      suffix_name: '',
      profileData: [],
      username: '',
      email: '',
      mobile_number: ''
    },
    tableColumns: [
      {
        name: 'username',
        required: true,
        label: 'Username',
        align: 'left',
        field: 'username'
      },
      {
        name: 'email',
        required: true,
        label: 'Email Address',
        align: 'left',
        field: 'email'
      },
      {
        name: 'mobile_number',
        required: true,
        label: 'Mobile Number',
        align: 'left',
        field: 'mobile_number'
      }
    ],
    profileColumns: [
      {
        name: 'first_name',
        required: true,
        label: 'First Name',
        align: 'left',
        field: 'first_name'
      },
      {
        name: 'last_name',
        required: true,
        label: 'Last Name',
        align: 'left',
        field: 'last_name'
      },
      {
        name: 'middle_name',
        required: true,
        label: 'Middle Name',
        align: 'left',
        field: 'middle_name'
      },
      {
        name: 'suffix_name',
        required: true,
        label: 'Suffix Name',
        align: 'left',
        field: 'suffix_name'
      }
    ],
    tableData: [],
    profile: []
  }),
  methods: {
    async getUserDetails () {
      let profile = this.$q.localStorage.getItem('user').profile
      let details = this.$q.localStorage.getItem('user')
      this.profileData = [profile]
      this.tableData = [details]
    }
    // },
    // async saveChanges () {
    //   let user = {
    //     email: this.newEmail
    //   }
    //   let profile = {
    //     first_name: this.newFirstName,
    //     last_name: this.newLastName,
    //     middle_name: this.newMiddleName,
    //     suffix_name: this.newSuffix
    //   }
    //   try {
    //     await Promise.all([
    //       AuthService.updateUser(user),
    //       AuthService.updateProfile(profile)
    //     ])
    //     let { data: userData } = await AuthService.me()
    //     this.$q.localStorage.set('user', userData)
    //     this.getUserDetails()
    //     this.opened = false
    //   } catch (e) {
    //     console.error(e)
    //   }
    // }
  }
}
</script>

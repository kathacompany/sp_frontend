<template>
    <q-layout view="hHh Lpr lff">
      <q-header elevated class="bg-white">
        <q-toolbar>
          <q-btn flat @click="drawer = !drawer" icon="eva-menu-2-outline" color="secondary"/>
          <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="40" height="40" viewBox="0 0 172 172" style=" fill:#000000;"><g transform=""><g fill="none" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><path d="M0,172v-172h172v172z" fill="none"></path><g><path d="M140.22569,118.69075c-0.01612,-1.4835 -1.23087,-2.67406 -2.71706,-2.65794l-5.375,0.05644c-1.4835,0.01613 -2.67406,1.23087 -2.65794,2.71706c0.01613,1.4835 1.23087,2.67406 2.71706,2.65794l5.375,-0.05644c1.4835,-0.01613 2.67406,-1.23356 2.65794,-2.71706zM139.69088,132.69263c0.16125,-1.47544 -0.90569,-2.80306 -2.38112,-2.96162l-5.34275,-0.58319c-1.47544,-0.16125 -2.80306,0.90569 -2.96162,2.38112c-0.15856,1.47544 0.90569,2.80306 2.38112,2.96162l5.34275,0.58319c1.47544,0.16125 2.80038,-0.90569 2.96162,-2.38113zM134.74587,147.28844c0.60738,-1.3545 0,-2.9455 -1.3545,-3.55019l-4.90469,-2.19837c-1.3545,-0.60738 -2.9455,0 -3.55019,1.3545c-0.60469,1.3545 0,2.9455 1.3545,3.55019l4.90469,2.19837c1.3545,0.60737 2.9455,0 3.55019,-1.3545zM126.17544,160.00569c1.01856,-1.08038 0.9675,-2.78156 -0.11288,-3.80013l-3.91031,-3.68725c-1.08038,-1.01856 -2.78156,-0.9675 -3.80013,0.11288c-1.01856,1.08038 -0.9675,2.78156 0.11288,3.80012l3.91031,3.68725c1.08038,1.01587 2.78156,0.96481 3.80013,-0.11288z" fill="#8f48a9"></path><path d="M53.75,158.5625c-1.48619,0 -2.6875,-1.204 -2.6875,-2.6875v-10.75c0,-1.4835 1.20131,-2.6875 2.6875,-2.6875h21.5c10.37106,0 18.8125,-8.43875 18.8125,-18.8125v-104.8125c0,-1.4835 1.20131,-2.6875 2.6875,-2.6875h21.5c1.48619,0 2.6875,1.204 2.6875,2.6875v104.36369c0,19.11619 -15.46387,34.90256 -34.54512,35.35675c-0.12631,0.01881 -0.258,0.02956 -0.39238,0.02956z" fill="#b1bcf6"></path><path d="M93.83944,18.60019v113.07656c7.80181,-0.06181 14.10938,-6.39356 14.10938,-14.20881v-84.65625c0,-7.81794 -6.31025,-14.14969 -14.10937,-14.2115z" fill="#92a1de"></path><path d="M107.5,43c-1.4835,0 -2.6875,-1.204 -2.6875,-2.6875v-10.75c0,-1.4835 1.204,-2.6875 2.6875,-2.6875c1.4835,0 2.6875,1.204 2.6875,2.6875v10.75c0,1.4835 -1.204,2.6875 -2.6875,2.6875zM107.5,75.25c-1.4835,0 -2.6875,-1.204 -2.6875,-2.6875v-21.5c0,-1.4835 1.204,-2.6875 2.6875,-2.6875c1.4835,0 2.6875,1.204 2.6875,2.6875v21.5c0,1.4835 -1.204,2.6875 -2.6875,2.6875z" fill="#8f48a9"></path><path d="M118.25,18.8125v67.1875v26.875v10.30119c0,17.90681 -14.39962,32.43275 -32.25,32.67462v0.02419h-0.44881h-15.67619h-16.125v-10.75h16.125h5.375c11.87337,0 21.5,-9.62662 21.5,-21.5v-37.625v-10.75v-56.4375h21.5M118.25,13.4375h-21.5c-2.96969,0 -5.375,2.40531 -5.375,5.375v56.4375v10.75v37.625c0,8.89025 -7.23475,16.125 -16.125,16.125h-5.375h-16.125c-2.96969,0 -5.375,2.40531 -5.375,5.375v10.75c0,2.96969 2.40531,5.375 5.375,5.375h16.125h15.67619h0.44881c0.20694,0 0.4085,-0.01075 0.61006,-0.03494c20.45994,-0.56438 37.01494,-17.51713 37.01494,-38.03888v-10.30119v-26.875v-67.1875c0,-2.96969 -2.40531,-5.375 -5.375,-5.375z" fill="#8f48a9"></path></g><path d="" fill="none"></path></g></g></svg>
          <q-toolbar-title class="q-pa-sm text-secondary">JOPSIS
          </q-toolbar-title>
          <q-btn flat round dense icon="notifications" class="q-mr-xs bg-secondary" />
        </q-toolbar>
      </q-header>

      <q-drawer
        v-model="drawer"
        show-if-above
        :mini="miniState"
        @mouseover="miniState = false"
        @mouseout="miniState = true"
        mini-to-overlay

        :width="250"
        :breakpoint="500"
        bordered
        content-class="bg-secondary"
      >
        <q-scroll-area class="fit q-pa-sm">
          <q-list padding class="q-mr-ma">
            <q-item clickable v-ripple @click="$router.push('/InventoryHomepage')">
              <q-item-section avatar>
                <q-icon name="home" color="white"/>
              </q-item-section>

              <q-item-section>
                Homepage
              </q-item-section>
            </q-item>

            <q-separator />

            <q-item clickable v-ripple @click="$router.push('/Inventory')">
              <q-item-section avatar>
                <q-icon name="list_alt" color="white"/>
              </q-item-section>

              <q-item-section>
                Inventory
              </q-item-section>
            </q-item>

            <q-separator />

            <q-item clickable v-ripple @click="$router.push('/MaterialRequests')">
              <q-item-section avatar>
                <q-icon name="shopping_cart" color="white" />
              </q-item-section>

              <q-item-section>
                Material Requests
              </q-item-section>
            </q-item>

            <q-separator />

            <q-item clickable v-ripple @click="$router.push('/InventoryAccount')">
              <q-item-section avatar>
                <q-icon name="person" color="white" />
              </q-item-section>

              <q-item-section>
                Account Details
              </q-item-section>
            </q-item>

            <q-separator />

            <q-item clickable v-ripple>
              <q-item-section avatar>
                <q-icon name="eva-person-remove" color="white" />
              </q-item-section>

               <q-item-section @click="logoutUser">
                Log Out
              </q-item-section>
            </q-item>
          </q-list>
        </q-scroll-area>
      </q-drawer>

      <q-page-container class="page-container">
      <transition
              name="transitions"
              enter-active-class="animated fadeIn"
              leave-active-class="animated fadeOut"
              mode="out-in"
      >
        <router-view/>
      </transition>
      </q-page-container>
  </q-layout>
</template>

<script>
import { firebaseAuth } from 'boot/firebase'

export default {
  data () {
    return {
      drawer: false,
      miniState: true
    }
  },
  methods: {
    logoutUser: function () {
      firebaseAuth
        .signOut()
        .then(
          user => {
            this.$router.push('/')
          })
        .catch(err => {
          console.log('error.message:', err)
        })
    }
  }
}
</script>

<style scoped>
.q-mr-ma {
  -webkit-text-fill-color: white;
}
</style>

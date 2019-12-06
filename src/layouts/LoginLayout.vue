<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container class="bg-white">
      <transition
        name="transitions"
        enter-active-class="animated fadeIn"
        leave-active-class="animated fadeOut"
        mode="out-in"
      >
        <router-view class="page-container"/>
      </transition>
    </q-page-container>
  </q-layout>
</template>

<script>
import { openURL } from 'quasar'

export default {
  data () {
    return {
    }
  },
  methods: {
    openURL
  }
}
</script>

<style scoped>
.page-container {
  -webkit-text-fill-color: white;
  text-align: center;
}
</style>

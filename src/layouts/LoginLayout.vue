<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container class="bg-white">
      <router-view class="page-container"/>
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
}
</style>

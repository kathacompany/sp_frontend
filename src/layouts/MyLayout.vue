<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title>
          JOPSIS
        </q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <router-view class="page-container"/>
    </q-page-container>
  </q-layout>
</template>

<script>
import { openURL } from 'quasar'

export default {
  name: 'MyLayout',
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
.page-container{
  background-color: #dcf5f5;
}
</style>

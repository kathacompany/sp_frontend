<template>
  <q-layout view="hHh lpR fFf">
    <q-page-container>
        <q-page class="window-height window-width row justify-center">
          <div class="q-gutter-sm flex text-center">
            <div style="width: 100%; height: 50%;">
              <h5>MATERIAL REQUESTS</h5>{{ date }}<br><br>
              <q-input outlined clearable color="secondary" dense debounce="300" v-model="filter" placeholder="Search by Material Name">
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>
              <br>
        </div>
      </div>
    </q-page>
  <router-view/>
</q-page-container>
</q-layout>
</template>

<style lang="sass">

  th:first-child,
  td:first-child
    position: sticky
    left: 0
    z-index: 1
</style>

<script>
import { date } from 'quasar'

export default {
  data () {
    return {
      filter: ''
    }
  },
  computed: {
    date () {
      let timeStamp = Date.now()
      return date.formatDate(timeStamp, 'dddd D MMMM YYYY')
    }
  }
}
</script>

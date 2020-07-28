<template>
  <q-layout view="hHh lpR fFf">
    <q-page-container>
        <q-page class="window-height window-width row absolute-center text-center">
            <div class="container" style="width: 100%; height: 100%;">
              <div class="bg-white text-secondary">
                <div style="font-size: 65px; font-weight: 750;">J O P S I S</div>
                <div class="text-h5 text-weight-light">Job Order Processing Scheduling Inventory System</div>
                <div class="text-sutitle text-weight-medium">{{ today }}</div><br>
              </div>
              <div style="width: 100%; height: 100%;">
              <q-carousel
                animated
                v-model="announcement"
                navigation
                swipeable
                infinite
                autoplay
                vertical
                control-type="push"
                control-color="secondary"
                transition-prev="slide-right"
                transition-next="slide-left"
                height="100%"
                class="rounded-borders"
                >
                <q-carousel-slide v-if="!announcements.length" class="column no-wrap flex-center" img-src="statics/bg2.jpg" name="announcement">
                  <div style="margin-top: -200px;" class="text-center custom-caption">
                    <q-badge outline color="white">
                      <div class="bg-secondary text-h4 text-weight-light"><q-icon name="campaign" size="40px"/>No Announcements!</div>
                    </q-badge>
                  </div>
                </q-carousel-slide>
                <q-carousel-slide v-else class="column no-wrap flex-center" img-src="statics/bg2.jpg" v-for="announcement in announcements" :key="announcement.id" :name="announcement.title">
                  <div style="margin-top: -200px;" class="text-center custom-caption" v-show="showSimulatedReturnData">
                    <q-badge color="secondary">
                      <q-icon name="campaign" size="40px"/>
                      <div class="text-h3 text-weight-light">{{ announcement.title }}</div>
                    </q-badge>
                    <br>
                    <q-badge outline color="white">
                      <div class="bg-secondary text-h4 text-weight-thin">{{ announcement.details }}</div>
                    </q-badge>
                  </div>
                </q-carousel-slide>
              </q-carousel>
              <q-inner-loading :showing="visible">
                <q-spinner-hourglass size="80px" color="grey" />
                <div class="text-h5 text-grey text-weight-light">Just a moment...</div>
              </q-inner-loading>
            </div>
          </div>
        </q-page>
      <router-view/>
    </q-page-container>
  </q-layout>
</template>

<script>
import { date } from 'quasar'
import { db } from 'boot/firebase'

export default {
  data () {
    return {
      announcement: 'announcement',
      announcements: [],
      title: '',
      details: '',
      visible: false,
      showSimulatedReturnData: false
    }
  },
  computed: {
    today () {
      let timeStamp = Date.now()
      return date.formatDate(timeStamp, 'dddd D MMMM YYYY')
    }
  },
  async created () {
    const anRef = db.collection('announcements').where('post', '==', 'Public')
    await anRef.get().then(querySnapshot => {
      querySnapshot.forEach(doc => {
        const annData = {
          id: doc.id,
          title: doc.data().title,
          details: doc.data().details,
          audience: doc.data().audience
        }
        for (var i = 0; i < annData.audience.length; i++) {
          if (annData.audience[i] === 'Worker') {
            this.showSchedWorkDataLoading()
            this.announcements.push(annData)
          }
        }
      })
    })
  },
  methods: {
    showSchedWorkDataLoading () {
      this.visible = true
      this.showSimulatedReturnData = false
      setTimeout(() => {
        this.visible = false
        this.showSimulatedReturnData = true
      }, 3000)
    }
  }
}
</script>

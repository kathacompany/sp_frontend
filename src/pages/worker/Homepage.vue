<template>
  <q-layout view="hHh lpR fFf">
    <q-page-container>
        <q-page class="flex flex-center text-center">
          <q-img class="container"  src="statics/bg7.jpg">

            <div class="container" style="width: 100%; height: 100%;">
              <span style="font-size: 70px;font-weight: 800;"> JOPSIS </span>
              <br/>
              <span style="font-size: 20px;font-weight: 100;"> Job Order Processing Scheduling and Inventory System </span>
              <br/>
              <br/>
              <div>
                <q-carousel
                    animated
                    v-model="announcement"
                    navigation
                    swipeable
                    infinite
                    autoplay
                    transition-prev="slide-right"
                    transition-next="slide-left"
                    class="carousel"
                    >
                  <q-carousel-slide v-for="announcement in announcements" :key="announcement.title" :name="announcement.id">
                    <br/>
                    <br/>
                    <h3 class="text-weight-light">{{ announcement.title }}</h3>
                    <h4 class="text-weight-light">{{ announcement.details }}</h4>
                  </q-carousel-slide>
                </q-carousel>
              </div>
            </div>

          </q-img>
        </q-page>
        <router-view/>
    </q-page-container>
  </q-layout>
</template>

<style>
.bg-primary{
  padding:30px;
  width: 280px;
}
.carousel{
  height:380px;
  /* background-color: lightseagreen; */
  background: radial-gradient(circle, lightseagreen 10%, teal 80%);
}
</style>

<script>
import { date } from 'quasar'
import { db } from 'boot/firebase'

export default {
  data () {
    const announcements = [
      {
        id: 1,
        title: 'Announcements',
        details: '\n\n'
      }
    ]
    let timeStamp = Date.now()
    let rightNow = date.formatDate(timeStamp, 'YYYY-MM-DD')
    return {
      announcement: 1,
      announcements,
      date: rightNow,
      title: '',
      details: ''
    }
  },
  computed: {
    today () {
      let timeStamp = Date.now()
      return date.formatDate(timeStamp, 'dddd D MMMM YYYY')
    }
  },
  created () {
    let announcementsRef = db.collection('announcements').where('post', '==', 'Public')
    announcementsRef.get().then(querySnapshot => {
      querySnapshot.forEach(doc => {
        const audienceRef = (doc.data().audience)
        const annData = {
          id: doc.id,
          title: doc.data().title,
          details: doc.data().details,
          dateOfAnnouncement: doc.data().dateOfAnnouncement,
          post: doc.data().post,
          audience: audienceRef
        }
        for (var i = 0; i <= 4; i++) {
          if (annData.audience[i] === 'Worker') {
            this.announcements.push(annData)
          }
        }
      })
    })
  }
}
</script>

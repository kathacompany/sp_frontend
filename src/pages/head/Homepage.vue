<template>
  <q-layout view="hHh lpR fFf">
    <q-page-container>
        <q-page class="flex text-center">
          <div style="width: 100%; height: 50%;">
           <h6 class="text-weight-light">{{ today }}</h6>

            <q-carousel
              animated
              v-model="announcement"
              arrows
              navigation
              infinite
              >
            <q-carousel-slide v-for="announcement in announcements" :key="announcement.title" :name="announcement.id" class="bg-teal-4">
              <br/>
              <br/>
              <br/>
              <h1 class="text-weight-light">{{ announcement.title }}</h1>
              <h5 class="text-weight-light">{{ announcement.details }}</h5>
            </q-carousel-slide>
          </q-carousel>

          </div>
          <div>
          <br/>
          </div>
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
        details: ''
      }
    ]
    let timeStamp = Date.now()
    let rightNow = date.formatDate(timeStamp, 'YYYY-MM-DD')
    return {
      announcement: 1,
      announcements,
      date: rightNow,
      title: '',
      details: '',
      column: [
        { name: 'title', field: 'title', align: 'left', label: '' },
        { name: 'details', field: 'details', align: 'left', label: '' }
      ]
    }
  },
  computed: {
    today () {
      let timeStamp = Date.now()
      return date.formatDate(timeStamp, 'dddd D MMMM YYYY')
    }
  },
  created () {
    let announcementsRef = db.collection('announcements')

    announcementsRef.get().then(querySnapshot => {
      querySnapshot.forEach(doc => {
        const data = {
          id: doc.id,
          title: doc.data().title,
          details: doc.data().details,
          dateOfAnnouncement: doc.data().dateOfAnnouncement,
          post: doc.data().post
        }
        if (data.post === 'public') {
          this.announcements.push(data)
        }
      })
    })
  }
}
</script>

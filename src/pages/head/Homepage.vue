<template>
  <q-layout view="hHh lpR fFf">
    <q-page-container>
        <q-page class="flex text-center">
          <div style="width: 100%; height: 50%;">
           <h6 class="text-weight-light">{{ today }}</h6>

          <div class="container" style="width: 100%; height: 100%;">
            <img src="statics/bg7.jpg" width="100%" height="60%" align="right"/>
            <div class="absolute-full text-subtitle2 flex flex-center" style="font-size: 70px;font-weight: 800; margin-left: -800px; margin-top: -160px;">
              JOPSIS
            </div>
            <div class="absolute-full text-subtitle2 flex flex-center" style="font-size: 20px;font-weight: 100; margin-left: -650px; margin-top: -50px;">
              Job Order Processing Scheduling and Inventory System
            </div>

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

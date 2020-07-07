<template>
  <q-layout view="hHh lpR fFf">
    <q-page-container>
        <q-page class="flex flex-center text-center">
          <div style="width: 100%; height: 50%;">
            <q-carousel
              animated
              v-model="slide"
              navigation
              infinite
              arrows
              transition-prev="slide-right"
              transition-next="slide-left"
            >
              <q-carousel-slide :name="1" class="bg-teal-4" style="border: 2px solid grey">
                <div class="absolute-center text-primary">
                  <span class="text-h3">Attention to all units</span><br>
                  <span class="text-h5 text-weight-light">All job pending requests will be delayed for 2 days</span>
                </div>
                <div class="absolute-center text-h6 text-weight-light text-primary"></div>
              </q-carousel-slide>
              <q-carousel-slide :name="2" />
              <q-carousel-slide :name="3" img-src="https://cdn.quasar.dev/img/parallax1.jpg" />
              <q-carousel-slide :name="4" img-src="https://cdn.quasar.dev/img/parallax2.jpg" />
              <q-carousel-slide :name="5" img-src="https://cdn.quasar.dev/img/quasar.jpg" />
            </q-carousel>
            <!-- <img src="statics/btr1.jpg" /> -->
          </div>
          <div>
            <q-btn no-caps icon="campaign" @click="add_dialog=true" class="q-mr-sm q-pa-sm text-h6 text-weight-light" label="Create Announcement" color="secondary"/>

            <q-dialog persistent transition-show="rotate" transition-hide="rotate" v-model="add_dialog">
                <q-card style="width: 400px">
                  <q-bar class="bg-secondary text-white" style="height: 60px">
                    <div class="text-weight-light">Create Announcement</div>
                      <q-space />
                    <q-btn flat icon="close" round dense v-close-popup />
                  </q-bar>
                  <q-card-section>
                   <q-input
                    outlined
                    ref="description"
                    clearable
                    color="accent"
                    v-model="ann"
                    type="textarea"
                    label="Announcement"
                    lazy-rules
                    :rules="[ val => val !== null && val !== '' || 'Input is required']"/>
                  </q-card-section>
                  <q-card-actions align="center">
                    <q-btn no-caps class="text-weight-light" label="Create" color="secondary" @click="onSave"/>
                  </q-card-actions>
                </q-card>
              </q-dialog>
            <h6 class="text-weight-light">{{ date }}</h6>
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

export default {
  data () {
    return {
      ann: '',
      slide: 1,
      add_dialog: false
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

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
              autoplay
              transition-prev="slide-right"
              transition-next="slide-left"
            >
              <q-carousel-slide :name="1" img-src="statics/btr1.jpg" />
              <q-carousel-slide :name="2" img-src="https://cdn.quasar.dev/img/mountains.jpg" />
              <q-carousel-slide :name="3" img-src="https://cdn.quasar.dev/img/parallax1.jpg" />
              <q-carousel-slide :name="4" img-src="https://cdn.quasar.dev/img/parallax2.jpg" />
              <q-carousel-slide :name="5" img-src="https://cdn.quasar.dev/img/quasar.jpg" />
            </q-carousel>
            <!-- <img src="statics/btr1.jpg" /> -->
          </div>
          <div class="q-gutter-sm flex flex-row text-center">
            <q-card rounded class="bg-primary">
                <q-icon name="camera" style="font-size: 4rem;"/><br>
                <q-btn no-caps rounded push @click="$router.push('/AdministrativeHomepage')" class="q-mr-sm" label="Upload Photo Announcement" color="secondary"/>
            </q-card>
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
export default {
  data () {
    return {
      slide: 1
    }
  }
}
</script>

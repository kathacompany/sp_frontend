<template>
  <q-page class="flex flex-center">
  <div class="q-pa-md">
    <div style="width: 100%; height: 50%;">
      <h2> Job Order Requests </h2>
    </div>
    <div class="q-pa-md">
    <q-form
      @submit="onSubmit"
      @reset="onReset"
      class="q-gutter-s,"
    >
      <q-input
        filled
        v-model="department"
        label="Department"
        lazy-rules
        :rules="[ val => val && val.length > 0 || 'Please type something']"
      />

      <q-input
        filled
        v-model="loc"
        label="Location"
        lazy-rules
        :rules="[ val => val && val.length > 0 || 'Please type something']"
      />

      <q-input
        filled
        v-model="tel"
        label="Telephone"
        lazy-rules
        :rules="[
          val => val !== null && val !== '' || 'Please type your age',
          val => val > 0 && val < 100 || 'Please type a real age'
        ]"
      />

      <div>
        <q-btn rounded label="Submit" type="submit" color="primary" @click="$router.push('/Homepage')"/>
      </div>
    </q-form>
  </div>
  </div>
  </q-page>
</template>
<script>
export default {
  data () {
    return {
      department: null,
      problem: null,
      tel: null,
      loc: null,

      accept: false
    }
  }
}
</script>

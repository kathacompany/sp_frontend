<template>
  <div class="fixed-center text-center">
    <p>
      <img
        src="~assets/sad.svg"
        style="width:50vw;max-width:300px;"
      >
    </p>
    <p class="text-fad">Sorry, nothing here...<strong>(404)</strong></p>
    <q-btn class="q-ma-md"
      color="secondary"
      style="width:200px;"
      to="/"
      label="Go back"
    />
  </div>
</template>

<script>
export default {
  name: 'Error404'
}
</script>

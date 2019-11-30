<template>
  <q-layout view="hHh lpR fFf">
    <q-page-container>
        <q-page class="flex flex-center">
          <div class="q-gutter-sm flex flex-row text-center">
            <q-card rounded class="bg-primary">
                <q-icon name="inbox" style="font-size: 4rem;"/>
                <q-btn rounded @click="$router.push('/Homepage')" class="q-mr-sm" label="Job Order Requests" color="secondary"/>
            </q-card>
            <q-card rounded class="bg-primary text-center">
                <q-icon name="drafts" style="font-size: 4rem;"/>
                <q-btn rounded @click="$router.push('/Homepage')" class="q-mr-sm" label="Employees / Staff" color="secondary"/>
            </q-card>
            <q-card rounded class="bg-primary text-center">
                <q-icon name="person" style="font-size: 4rem;"/>
                <q-btn rounded @click="$router.push('/Homepage')" class="q-mr-sm" label="Account Details" color="secondary"/>
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

</script>

<template>
  <q-layout view="hHh lpR fFf">
    <q-page-container>
        <q-page class="flex flex-center text-center">
          <div style="width: 100%; height: 50%;">
            <img src="statics/btr1.jpg" />
          </div>
          <div class="q-gutter-sm flex flex-row text-center">
            <q-card rounded class="bg-primary">
                <q-icon name="inbox" style="font-size: 4rem;"/><br>
                <q-btn no-caps rounded push @click="$router.push('/ForemenJobOrders')" class="q-mr-sm" label="Job Order Requests" color="secondary"/>
            </q-card>
            <q-card rounded class="bg-primary text-center">
                <q-icon name="drafts" style="font-size: 4rem;"/><br>
                <q-btn no-caps rounded push @click="$router.push('/ForemenScheduleJobs')" class="q-mr-sm" label="Schedule a Job" color="secondary"/>
            </q-card>
            <q-card rounded class="bg-primary text-center">
                <q-icon name="person" style="font-size: 4rem;"/><br>
                <q-btn no-caps rounded push @click="$router.push('/ForemenEmployeeList')" class="q-mr-sm" label="Employee List" color="secondary"/>
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
m
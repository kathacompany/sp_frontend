<template>
  <q-page class="flex flex-center">
  <div class="q-pa-md">
    <div style="width: 100%; height: 50%;">
      <h2> Job Order Request </h2>
    </div>
    <div class="q-pa-md">
      <q-input filled v-model="date" mask="date" :rules="['date']">
        <template v-slot:append>
          <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
              <q-date v-model="date" @input="() => $refs.qDateProxy.hide()" />
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
    <q-form
      @submit="onSubmit"
      class="q-gutter-sm"
    >
      <q-btn-dropdown push no-caps v-model="probType" color="primary" label="Problem Category/Name" dropdown-icon="change_history">
        <q-list>
        <q-item clickable v-close-popup>
            <q-item-section>
            <q-item-label> Plumbing</q-item-label>
            </q-item-section>
        </q-item>

        <q-item clickable v-close-popup>
            <q-item-section>
            <q-item-label> Electricity</q-item-label>
            </q-item-section>
        </q-item>

        <q-item clickable v-close-popup>
            <q-item-section>
            <q-item-label> Transportation </q-item-label>
            </q-item-section>
        </q-item>

        <q-item clickable v-close-popup>
            <q-item-section>
            <q-item-label> Operation </q-item-label>
            </q-item-section>
        </q-item>
        </q-list>
        </q-btn-dropdown>

      <q-input
        filled
        v-model="location"
        label="Location / Building"
        lazy-rules
        :rules="[ val => val && val.length > 0 || 'Please type something']"
      />
      <q-input
        filled
        v-model="tel"
        label="Telephone"
        lazy-rules
        :rules="[
          val => val !== null && val !== '' || 'Please type your telephone number'
        ]"
      />

      <div>
        <q-btn rounded label="Submit" type="submit" color="primary" @click="$router.push('/Homepage')"/>
      </div
      <q-input
        filled
        v-model="description"
        label="Description"
        lazy-rules
        :rules="[ val => val && val.length > 0 || 'Please type something']"
      />
        <q-btn no-caps rounded label="Upload Requestor Signature" color="secondary" @click="requestor=true"/>
          <q-dialog v-model="requestor">
            <q-layout class="no-shadow">
              <q-card container class="bg-primary q-ma-sm q-pa-md" style="width:80%;">
                <q-card-section>
                  <div class="q-pa-md full-width">
                    <q-input class="q-ma-sm" required v-model="requestorName" label="Requestor Name"></q-input>
                  <q-card-actions >
                    <q-btn rounded no-caps push color="secondary" class="text-white" @click="saveChanges" label="Upload E-Signature"/>
                    <q-btn rounded no-caps push color="secondary" label="Cancel" class="text-white" v-close-popup/>
                  </q-card-actions>
                  </div>
                </q-card-section>
              </q-card>
            </q-layout>
          </q-dialog>
        <q-btn no-caps rounded label="Upload Head Office Signature" color="secondary" @click="head=true"/>
          <q-dialog v-model="head">
            <q-layout class="no-shadow">
              <q-card container class="bg-primary q-ma-sm q-pa-md" style="width:80%;">
                <q-card-section>
                  <div class="q-pa-md full-width">
                    <q-input class="q-ma-sm" required v-model="headName" label="Head Name"></q-input>
                  <q-card-actions >
                    <q-btn rounded no-caps push color="secondary" class="text-white" @click="saveChanges" label="Upload E-Signature"/>
                    <q-btn rounded no-caps push color="secondary" label="Cancel" class="text-white" v-close-popup/>
                  </q-card-actions>
                  </div>
                </q-card-section>
              </q-card>
            </q-layout>
          </q-dialog>
        <q-btn rounded label="Submit" type="submit" color="secondary" @click="$router.push('/UserJobOrders')"/>
    </q-form>
  </div>
  </div>
  </q-page>
</template>
<script>
export default {
  data () {
    return {
      probType: null,
      requestorName: null,
      headName: null,
      requestor: false,
      head: false,
      date: '2019/02/01',
      department: null,
      problem: null,
      tel: null,
      location: null,
      description: null,

      accept: false
    }
  }
}
</script>

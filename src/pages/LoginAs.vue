<template>
    <q-page class="flex flex-center">
        <q-card rounded class="bg-primary text-center" style="padding:40px;">
            <h3> Welcome to JOPSIS </h3>
            <div class="q-gutter-sm">
                <q-btn no caps push v-model="usertype" color="secondary" label="University Unit" @click="$router.push('/UserLogin')"/>
                <q-btn-dropdown push no caps v-model="usertype" color="secondary" label="CDMO Staff" dropdown-icon="change_history">
                    <q-list>
                    <q-item clickable v-close-popup @click="$router.push('/AdministrativeLogin')">
                        <q-item-section>
                        <q-item-label> Administrative Staff</q-item-label>
                        </q-item-section>
                    </q-item>

                    <q-item clickable v-close-popup @click="$router.push('/InventoryLogin')">
                        <q-item-section>
                        <q-item-label>Inventory Staff</q-item-label>
                        </q-item-section>
                    </q-item>

                    <q-item clickable v-close-popup @click="$router.push('/ForemenLogin')">
                        <q-item-section>
                        <q-item-label>Foreman</q-item-label>
                        </q-item-section>
                    </q-item>

                    <q-item clickable v-close-popup @click="$router.push('/WorkerLogin')">
                        <q-item-section>
                        <q-item-label>Worker</q-item-label>
                        </q-item-section>
                    </q-item>
                    </q-list>
                    </q-btn-dropdown>
                </div>
        </q-card>
    </q-page>
</template>

<style>
</style>

<script>
export default {
  data () {
    return {
      usertype: ''
    }
  }
}
</script>

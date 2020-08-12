<template>
  <q-layout view="hHh lpR fFf">
    <q-page-container>
        <q-page class="window-height window-width row justify-center">
          <div class="q-gutter-sm flex text-center">
            <div style="width: 100%; height: 50%;">
              <h5 class="text-weight-light">SESSION LOGS</h5><span class="text-weight-medium">{{ date }}</span><br><br>
              <q-input v-if="sessions.length" outlined clearable color="secondary" dense debounce="300" v-model="filter" placeholder="Search">
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>
              <br>

              <q-card>
                <q-tabs
                  v-model="tab"
                  dense
                  class="text-grey"
                  active-color="secondary"
                  indicator-color="accent"
                  align="justify"
                  narrow-indicator
                >
                </q-tabs>

                <q-separator />

                <q-tab-panels v-model="tab" animated>
                  <q-tab-panel name="tab 1">
                    <div style="width: 100%;">
                      <q-banner v-if="!sessions.length" class="bg-grey-2 q-pa-md" style="min-width: 800px; height: 150px">
                        <template v-slot:avatar>
                          <q-icon name="sentiment_dissatisfied" color="accent" />
                        </template>
                      <span class="text-h6 text-grey text-weight-thin">No Records Found!</span>
                      </q-banner>
                      <q-table
                        title="JOPSIS Users"
                        :table-style="'counter-reset: cssRowCounter '"
                        :data="sessions"
                        :columns="column"
                        row-key="name"
                        :filter="filter"
                        :separator="separator"
                        v-else
                        dense
                      >
                        <template v-slot:header="props">
                          <q-tr :props="props">
                            <q-th class="text-italic text-accent" auto-width>#</q-th>
                            <q-th class="text-italic text-accent" auto-width>Provider</q-th>
                            <q-th
                              v-for="col in props.cols"
                              :key="col.name"
                              :props="props"
                              class="text-italic text-accent"
                            >
                              {{ col.label }}
                            </q-th>
                          </q-tr>
                        </template>
                        <template v-slot:body="props">
                          <q-tr :props="props">
                            <q-td><span class="text-secondary text-weight-bold rowNumber"/></q-td>
                            <q-td><q-icon name="email" color="accent" size="25px" /></q-td>
                            <q-td
                              v-for="col in props.cols"
                              :key="col.name"
                              :props="props"
                            >
                              {{ col.value }}
                            </q-td>
                          </q-tr>
                        </template>
                      </q-table>
                    </div>
                  </q-tab-panel>
                </q-tab-panels>
              </q-card>
            </div>
          </div>
        </q-page>
      <router-view/>
    </q-page-container>
  </q-layout>
</template>

<script>
import { date } from 'quasar'
import { db } from 'boot/firebase'

export default {
  data () {
    return {
      separator: 'cell',
      confirm: false,
      reject: false,
      dense: false,
      filter: '',
      tab: 'tab 1',
      sessions: [],
      column: [
        { name: 'email', label: 'Identifier', field: 'email', align: 'left', sortable: true },
        { name: 'createdOn', label: 'Created', field: 'createdOn', align: 'left', sortable: true },
        { name: 'signedIn', label: 'Last Signed In', field: 'signedIn', align: 'left', sortable: true },
        { name: 'userId', label: 'User Id', field: 'userId', align: 'left', sortable: true }
      ]
    }
  },
  created () {
    db.collection('account').get().then(querySnapshot => {
      querySnapshot.forEach(doc => {
        var createdOn = doc.data().createdOn
        var formatedCOn = createdOn.toDate().toDateString()
        var signedIn = doc.data().signedIn
        var formatedSIn = date.formatDate(signedIn, 'ddd MMM D YYYY')
        const data = {
          id: doc.id,
          email: doc.data().email,
          createdOn: formatedCOn,
          usertype: doc.data().usertype,
          userId: doc.data().userId,
          signedIn: formatedSIn
        }
        this.sessions.push(data)
      })
    })
  },
  computed: {
    date () {
      let timeStamp = Date.now()
      return date.formatDate(timeStamp, 'dddd D MMMM YYYY')
    }
  }
}
</script>

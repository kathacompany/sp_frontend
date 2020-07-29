<template>
  <q-layout view="hHh lpR fFf">
    <q-page-container>
      <q-page class="window-height window-width row justify-center">
        <div class="q-gutter-sm flex text-center">
          <div style="width: 100%; height: 50%;">
            <h5 class="text-weight-light">ANNOUNCEMENTS</h5><span class="text-weight-medium">{{ today }}</span><br><br>
            <q-input v-if="announcements.length" outlined clearable color="secondary" dense debounce="300" v-model="filter" placeholder="Search">
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

              <q-tab-panels v-model="tab" animated>
                <q-tab-panel name="tab 1">
                  <div style="width: 100%">
                    <q-banner v-if="!announcements.length" class="bg-grey-2 q-pa-md" style="min-width: 800px; height: 150px">
                      <template v-slot:avatar>
                        <q-icon name="event_busy" color="accent" />
                      </template>
                      <span class="text-h6 text-grey text-weight-thin">No Announcements!</span>
                      <template v-slot:action>
                        <q-btn no-caps flat icon="campaign" @click="add_dialog=true" class="q-ma-sm text-weight-light" label="Create" color="secondary"/>
                      </template>
                    </q-banner>
                    <q-table
                      title="Announcements"
                      :table-style="'counter-reset: cssRowCounter '"
                      dense
                      v-else
                      row-key="id"
                      :filter="filter"
                      :separator="separator"
                      :data="announcements"
                      :columns="column"
                    >
                      <template v-slot:top-right>
                        <q-btn no-caps unelevated icon="campaign" @click="add_dialog=true" class="q-ma-sm text-weight-light" label="Create" color="secondary"/>
                      </template>
                      <template v-slot:header="props">
                        <q-tr :props="props">
                          <q-th class="text-italic text-accent" auto-width>#</q-th>
                          <q-th auto-width/>
                          <q-th
                            v-for="col in props.cols"
                            :key="col.name"
                            :props="props"
                            class="text-italic text-accent"
                          >
                            {{ col.label }}
                          </q-th>
                           <q-th>
                            <span class="text-italic text-accent">Actions</span>
                          </q-th>
                        </q-tr>
                      </template>

                      <template v-slot:body="props">
                        <q-tr :props="props">
                          <q-td><span class="text-secondary text-weight-bold rowNumber"/></q-td>
                           <q-td auto-width>
                            <q-btn round dense color="accent" @click="props.expand = !props.expand" :icon="props.expand ? 'description' : 'description'" />
                          </q-td>
                          <q-td
                            v-for="col in props.cols"
                            :key="col.name"
                            :props="props"
                          >
                            {{ col.value }}
                          </q-td>
                          <q-td>
                            <q-btn flat dense color="secondary" icon="lock" @click="privatePost(props.row.id)" />
                            <q-btn flat dense color="secondary" icon="public" @click="publicPost(props.row.id)" />
                            <q-btn flat dense color="accent" icon="delete" @click="deleteAnnouncement(props.row.id)" />
                          </q-td>
                        </q-tr>
                        <q-tr v-show="props.expand" :props="props">
                          <q-td colspan="100%">
                            <div class="text-left"><span class="text-italic text-accent">Details</span><br>{{ props.row.details }}</div><br>
                            <div class="text-left"><span class="text-italic text-accent">Audiences</span><br>{{ props.row.audience.map((audience) => audience).join(', ') }}</div>
                          </q-td>
                        </q-tr>
                      </template>
                    </q-table>
                  </div>

                    <q-dialog persistent v-model="add_dialog" transition-show="rotate" transition-hide="rotate">
                      <q-card style="width: 350px">
                        <q-bar class="bg-secondary text-white" style="height: 60px">
                          <div class="text-weight-light">Create Announcement</div>
                            <q-space />
                          <q-btn unelevated flat class="q-pa-xs text-weight-light" @click="onReset" label="Reset"/>
                          <q-btn flat icon="close" round dense v-close-popup />
                        </q-bar>
                        <q-card-section>
                         <q-input
                            outlined
                            dense
                            class="q-pa-xs"
                            color="accent"
                            v-model="date"
                            label="Date"
                            readonly
                            >
                            <template v-slot:append>
                              <q-icon name="today"/>
                            </template>
                          </q-input>
                          <q-select
                            outlined
                            dense
                            class="q-pa-xs"
                            ref="audience"
                            multiple
                            color="accent"
                            v-model="create.audience"
                            label="Audience"
                            use-chips
                            stack-label
                            :options="options"
                            lazy-rules
                            :rules="[ val => val !== null && val !== '' && val !== undefined || 'Audience is required']"
                          />
                          <q-input
                            outlined
                            dense
                            class="q-pa-xs"
                            clearable
                            ref="title"
                            color="accent"
                            v-model="create.title"
                            label="Title"
                            lazy-rules
                            :rules="[ val => val !== null && val !== '' && val !== undefined || 'Title is required']"
                            @input="val => { create.title = val.toUpperCase() }"
                          />
                          <q-input
                            outlined
                            dense
                            ref="details"
                            class="q-pa-xs"
                            clearable
                            color="accent"
                            type="textarea"
                            autogrow
                            v-model="create.details"
                            label="Details of Announcement"
                            lazy-rules
                            :rules="[ val => val !== null && val !== '' && val !== undefined || 'Details is required']"
                          />
                        </q-card-section>
                        <q-card-actions>
                          <q-btn no-caps unelevated class="full-width text-weight-light" label="Create" color="secondary" @click="onSubmit"/>
                        </q-card-actions>
                      </q-card>
                    </q-dialog>
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
    let timeStamp = Date.now()
    let rightNow = date.formatDate(timeStamp, 'YYYY-MM-DD')
    return {
      filter: '',
      separator: 'cell',
      tab: 'tab 1',
      add_dialog: false,
      publicAnnouncement: false,
      privateAnnouncement: false,
      create: {
        title: '',
        details: '',
        audience: []
      },
      date: rightNow,
      postPublic: 'Public',
      postPrivate: 'Private',
      announcements: [],
      options: ['Unit Requestor', 'Unit Head', 'CDMO Head', 'Foreman', 'Inventory Staff', 'Worker'],
      column: [
        { name: 'dateOfAnnouncement', field: 'dateOfAnnouncement', align: 'left', label: 'Date Created', sortable: true },
        { name: 'title', field: 'title', align: 'left', label: 'Title', sortable: true },
        { name: 'post', field: 'post', align: 'left', label: 'Post', sortable: true }
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
    const anRef = db.collection('announcements')

    anRef.get().then(querySnapshot => {
      querySnapshot.forEach(doc => {
        const data = {
          id: doc.id,
          post: doc.data().post,
          title: doc.data().title,
          details: doc.data().details,
          dateOfAnnouncement: doc.data().dateOfAnnouncement,
          audience: doc.data().audience
        }
        this.announcements.push(data)
      })
    })
  },
  methods: {
    async onSubmit () {
      const announcementsRef = db.collection('announcements')

      if (this.create.title === null || this.create.title === '' || this.create.title === undefined || this.create.details === null || this.create.details === '' || this.create.details === undefined || this.create.audience === null || this.create.audience === '' || this.create.audience === undefined) {
        this.$refs.title.validate()
        this.$refs.details.validate()
        this.$refs.audience.validate()
      } else {
        this.add_dialog = true
        announcementsRef.add({
          dateOfAnnouncement: this.date,
          post: this.postPrivate,
          title: this.create.title,
          details: this.create.details,
          audience: this.create.audience
        })
          .then(doc => {
            location.reload()
            this.$q.notify({
              color: 'secondary',
              message: 'Announced Successfully'
            })
          })
          .catch(error => {
            console.error('Error creating announcement: ', error)
          })
      }
    },
    async onReset () {
      this.create = {}

      this.$refs.title.resetValidation()
      this.$refs.details.resetValidation()
      this.$refs.audience.resetValidation()
    },
    deleteAnnouncement (id) {
      this.$q.dialog({
        title: 'Delete Confirm',
        message: 'The announcement will be deleted. Are you sure you want to continue?',
        cancel: {
          label: 'No',
          flat: true,
          color: 'accent'
        },
        ok: {
          label: 'Yes',
          flat: true,
          color: 'secondary'
        },
        persistentL: true
      }).onOk(async () => {
        try {
          await db.collection('announcements').doc(id).delete()
          location.reload()
          this.$q.notify({
            avatar: 'delete',
            color: 'accent',
            message: 'Announcement deleted successfully'
          })
        } catch (error) {
          console.log('Error deleting announcement', error)
        }
      })
    },
    publicPost (id) {
      this.$q.dialog({
        title: 'Update  to public?',
        message: 'The announcement will be public. Are you sure you want to continue?',
        cancel: {
          label: 'No',
          flat: true,
          color: 'accent'
        },
        ok: {
          label: 'Yes',
          flat: true,
          color: 'secondary'
        },
        persistentL: true
      }).onOk(async () => {
        try {
          await db.collection('announcements').doc(id).update({
            post: this.postPublic
          })
          location.reload()
          this.$q.notify({
            color: 'accent',
            message: 'Announcement updated successfully'
          })
        } catch (error) {
          console.log('Error updating announcement', error)
        }
      })
    },
    privatePost (id) {
      this.$q.dialog({
        title: 'Update  to private?',
        message: 'The announcement will be private. Are you sure you want to continue?',
        cancel: {
          label: 'No',
          flat: true,
          color: 'accent'
        },
        ok: {
          label: 'Yes',
          flat: true,
          color: 'secondary'
        },
        persistentL: true
      }).onOk(async () => {
        try {
          await db.collection('announcements').doc(id).update({
            post: this.postPrivate
          })
          location.reload()
          this.$q.notify({
            color: 'accent',
            message: 'Announcement updated successfully'
          })
        } catch (error) {
          console.log('Error updating announcement', error)
        }
      })
    }
  }
}
</script>

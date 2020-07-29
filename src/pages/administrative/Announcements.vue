<template>
  <q-layout view="hHh lpR fFf">
    <q-page-container>
        <q-page class="flex flex-center text-center">
          <div style="width: 100%; height: 50%;">
            <h6 class="text-weight-light">{{ today }}</h6>
            <br/>
            <q-btn no-caps icon="campaign" @click="add_dialog=true" class="q-mr-sm q-pa-sm text-h6 text-weight-light" label="Create Announcement" color="secondary"/>
            <br/>
            <br/>
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
                    dense
                    :disable="true"
                    color="accent"
                    v-model="date"
                    label="Date"
                    lazy-rules
                    :rules="[val => val !== null && val !== '' || 'Date is required']">
                    <template v-slot:append>
                      <q-icon name="today" class="cursor-pointer">
                        <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                          <q-date mask="YYYY-MM-DD" v-model="date" @input="() => $refs.qDateProxy.hide()" />
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>

                  <q-select
                    outlined
                    dense
                    clearable
                    ref="audience"
                    multiple
                    color="accent"
                    v-model="selected"
                    label="Audience"
                    :options="options"
                    lazy-rules
                    :rules="[ val => val !== null || 'Audience is required']">
                  </q-select>

                  <q-input
                    outlined
                    dense
                    clearable
                    ref="title"
                    color="accent"
                    v-model="newTitle"
                    label="Title"
                    lazy-rules
                    :rules="[ val => val !== null || 'Title is required']">
                  </q-input>
                  <q-input
                    outlined
                    dense
                    ref="details"
                    clearable
                    color="accent"
                    type="textarea"
                    autogrow
                    v-model="newDetails"
                    label="Details of Announcement"
                    lazy-rules
                    :rules="[ val => val !== null || 'Details is required']"/>
                  </q-card-section>
                  <q-card-actions align="center">
                    <q-btn no-caps class="text-weight-light" label="Create" color="secondary" @click="onSubmit" v-close-popup/>
                    <q-btn no-caps flat @click="onReset" class="text-weight-light" label="Reset" color="accent"/>
                  </q-card-actions>
                </q-card>
              </q-dialog>
              <br/>
          </div>
          <br/>
          <div>
            <q-banner v-if="!announcements.length" class="bg-grey-2 q-pa-md" style="min-width: 800px; height: 150px">
              <template v-slot:avatar>
                <q-icon name="event_busy" color="accent" />
              </template>
              <span class="text-h6 text-grey text-weight-thin">No Announcements!</span>
            </q-banner>
            <q-table
              title="Announcements"
              class="my-sticky-column-table"
              v-else
              dense
              :separator="separator"
              :data="announcements"
              :columns="column"
            >
            <template v-slot:header="props">
              <q-tr :props="props">
                <q-th auto-width />
                <q-th
                  v-for="col in props.cols"
                  :key="col.name"
                  :props="props"
                >
                  {{ col.label }}
                </q-th>
                 <q-th>
                  <span>Actions</span>
                </q-th>
              </q-tr>
            </template>

            <template v-slot:body="props">
              <q-tr :props="props">
                <q-td auto-width>
                </q-td>

                <q-td
                  v-for="col in props.cols"
                  :key="col.name"
                  :props="props"
                >
                  {{ col.value }}
                </q-td>
                <q-td>
                  <q-btn class="text-weight-light q-ma-sm" no-caps dense color="secondary" label="Private" @click="privatePost(props.row.id)" />
                  <q-btn class="text-weight-light q-ma-sm" no-caps dense color="secondary" label="Public" @click="publicPost(props.row.id)" />
                  <q-btn class="text-weight-light q-ma-sm" no-caps dense flat color="accent" icon="delete" @click="deleteAnnouncement(props.row.id)" />

                </q-td>
              </q-tr>
            </template>

            </q-table>
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
import { db } from 'boot/firebase'

export default {
  data () {
    let timeStamp = Date.now()
    let rightNow = date.formatDate(timeStamp, 'YYYY-MM-DD')
    return {
      add_dialog: false,
      separator: 'cell',
      date: rightNow,
      publicAnnouncement: false,
      privateAnnouncement: false,
      newTitle: '',
      newDetails: '',
      postPublic: 'Public',
      announcements: [],
      title: '',
      details: '',
      dateOfAnnouncement: '',
      postPrivate: 'Private',
      column: [
        { name: 'dateOfAnnouncement', field: 'dateOfAnnouncement', align: 'left', label: 'Date Filed', sortable: true },
        { name: 'title', field: 'title', align: 'left', label: 'Title', sortable: true },
        { name: 'details', field: 'details', align: 'left', label: 'Details' },
        { name: 'post', field: 'post', align: 'left', label: 'Post', sortable: true },
        { name: 'audience', field: 'audience', align: 'left', label: 'Audience', sortable: true }
      ],
      selected: [],
      options: [ 'Unit Requestor', 'Unit Head', 'Foreman', 'Worker' ]
    }
  },
  computed: {
    today () {
      let timeStamp = Date.now()
      return date.formatDate(timeStamp, 'dddd D MMMM YYYY')
    }
  },
  created () {
    let announcementsRef = db.collection('announcements')

    announcementsRef.get().then(querySnapshot => {
      querySnapshot.forEach(doc => {
        const audienceRef = (doc.data().audience)
        const data = {
          id: doc.id,
          post: doc.data().post,
          title: doc.data().title,
          details: doc.data().details,
          dateOfAnnouncement: doc.data().dateOfAnnouncement,
          audience: audienceRef
        }
        this.announcements.push(data)
      })
    })
  },
  methods: {
    async onSubmit () {
      let announcementsRef = db.collection('announcements')
      announcementsRef.add({
        dateOfAnnouncement: this.date,
        post: this.postPrivate,
        title: this.newTitle,
        details: this.newDetails,
        audience: this.selected
      })
        .then(doc => {
          location.reload()
          this.$q.notify({
            color: 'secondary',
            message: 'Announced Successfully'
          })
        })
        .catch(error => {
          console.error('Error announcing announcement: ', error)
        })
      this.newTitle = ''
      this.newDetails = ''
      this.selected = ''
    },
    async onReset () {
      this.newTitle = null
      this.newDetails = null
      this.selected = null
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

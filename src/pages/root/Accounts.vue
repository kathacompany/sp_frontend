<template>
  <q-layout view="hHh lpR fFf">
    <q-page-container>
        <q-page class="window-height window-width row justify-center">
          <div class="q-gutter-sm flex text-center">
            <div style="width: 100%; height: 50%;">
              <h5 class="text-weight-light">INVENTORY OF MATERIALS</h5>{{ date }}<br><br>
              <q-input v-if="!users.length || !cdmo.length || !foreman.length || !worker.length" outlined clearable color="secondary" dense debounce="300" v-model="filter" placeholder="Search by Material Name">
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
                  <q-tab name="tab 1" label="Tab 1" />
                  <q-tab name="tab 2" label="Tab 2" />
                  <q-tab name="tab 3" label="Tab 3" />
                  <q-tab name="tab 4" label="Tab 4" />
                </q-tabs>

                <q-separator />

                <q-tab-panels v-model="tab" animated>
                  <q-tab-panel name="tab 1">
                    <div class="q-pa-md">
                      <q-btn no-caps float="right" class="text-weight-light q-mr-sm" icon="person_add" color="secondary" label="Add Account" @click="add_dialog=true"/>
                    </div>

                      <q-dialog v-model="add_dialog" persistent transition-show="rotate" transition-hide="rotate">
                        <q-card style="width: 350px">
                          <q-bar class="bg-secondary text-white" style="height: 60px">
                            <div class="text-h6 text-weight-light">Add Account</div>
                            <q-space />
                            <q-btn icon="close" flat round dense v-close-popup />
                          </q-bar>
                          <q-card-section>
                            <q-select outlined class="q-pa-xs" dense clearable color="accent" v-model="defaultItem.usertype" :options="usertypes" label="Usertype" />
                            <q-input class="q-pa-xs" outlined dense clearable color="accent" v-model="defaultItem.email" label="Email"/>
                            <q-input class="q-pa-xs" outlined dense clearable color="accent" v-model="defaultItem.password" label="Password" :type="isPwd ? 'password' : 'text'"/>
                            <q-input class="q-pa-xs" outlined dense clearable color="accent" v-model="defaultItem.fullname" label="Full Name"/>
                            <q-input class="q-pa-xs" outlined dense clearable color="accent" v-model="defaultItem.unit" label="Unit"/>
                            <q-input class="q-pa-xs" outlined dense clearable color="accent" v-model="defaultItem.position" label="Position"/>
                            <q-input class="q-pa-xs" outlined dense clearable color="accent" v-model="defaultItem.location" label="Location"/>
                            <q-input outlined dense v-model="defaultItem.telephone" label="Telephone" mask="(###) ### - ####" fill-mask color="accent" class="q-ma-xs"/>

                          </q-card-section>
                          <q-card-actions class="justify-center q-pa-xs">
                            <q-btn no-caps class="text-weight-light" @click="addAccount" color="secondary" label="Add Account" v-close-popup/>
                          </q-card-actions>
                        </q-card>
                      </q-dialog>

                      <q-dialog v-model="edit_dialog" persistent transition-show="rotate" transition-hide="rotate">
                        <q-card style="width: 350px">
                          <q-bar class="bg-secondary text-white" style="height: 60px">
                            <div class="text-h6 text-weight-light">Edit Account</div>
                            <q-space />
                            <q-btn icon="close" flat round dense v-close-popup />
                          </q-bar>

                          <q-card-section>
                            <q-select outlined class="q-pa-xs" dense clearable color="accent" v-model="editedItem.usertype" :options="usertypes" label="Usertype" />
                            <q-input class="q-pa-xs" outlined dense clearable color="accent" v-model="editedItem.email" label="Email"/>
                            <q-input class="q-pa-xs" outlined dense clearable color="accent" v-model="editedItem.fullname" label="Full Name"/>
                            <q-input class="q-pa-xs" outlined dense clearable color="accent" v-model="editedItem.unit" label="Unit"/>
                            <q-input class="q-pa-xs" outlined dense clearable color="accent" v-model="editedItem.position" label="Position"/>
                            <q-input class="q-pa-xs" outlined dense clearable color="accent" v-model="editedItem.location" label="Location"/>
                            <q-input outlined dense v-model="editedItem.telephone" label="Telephone" mask="(###) ### - ####" fill-mask color="accent" class="q-ma-xs"/>>
                          </q-card-section>
                          <q-card-actions class="justify-center q-pa-xs">
                            <q-btn no-caps class="text-weight-light" @click="updateAccount" color="secondary" label="Save Changes" v-close-popup/>
                          </q-card-actions>
                        </q-card>
                      </q-dialog>

                  <div style="width: 100%;">
                  <q-banner v-if="!users.length" class="bg-grey-2 q-pa-md" style="min-width: 800px; height: 150px">
                    <template v-slot:avatar>
                      <q-icon name="sentiment_dissatisfied" color="accent" />
                    </template>
                  <span class="text-h6 text-grey text-weight-thin">No Records Found!</span>
                  </q-banner>
                  <q-table
                    class="my-sticky-header-table"
                    :data="users"
                    :columns="columns"
                    row-key="name"
                    :filter="filter"
                    :separator="separator"
                    v-else
                    hide-bottom
                    dense
                    title="Users"
                  >
                    <template v-slot:header="props">
                      <q-tr :props="props">
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
                        <q-td
                          v-for="col in props.cols"
                          :key="col.name"
                          :props="props"
                        >
                          {{ col.value }}
                        </q-td>
                         <q-td>
                          <q-btn flat dense icon="edit" color="secondary" @click="toEdit(props.row)"/>
                          <q-btn flat dense icon="delete" color="accent" @click="delAccount(props.row.id)">
                            <q-space/>
                          </q-btn>
                        </q-td>
                      </q-tr>
                    </template>
                  </q-table>
                </div>
              </q-tab-panel>

              <q-tab-panel name="tab 2">
                <div class="q-pa-md">
                  <q-btn no-caps float="right" class="text-weight-light q-mr-sm" icon="person_add" color="secondary" label="Add Account" @click="add_dialog=true"/>
                </div>

                <q-dialog v-model="add_dialog" persistent transition-show="rotate" transition-hide="rotate">
                  <q-card style="width: 350px">
                    <q-bar class="bg-secondary text-white" style="height: 60px">
                      <div class="text-h6 text-weight-light">Add Account</div>
                      <q-space />
                      <q-btn icon="close" flat round dense v-close-popup />
                    </q-bar>
                    <q-card-section>
                      <q-select outlined class="q-pa-xs" dense clearable color="accent" v-model="defaultItem.usertype" :options="usertypes" label="Usertype" />
                      <q-input class="q-pa-xs" outlined dense clearable color="accent" v-model="defaultItem.email" label="Email"/>
                      <q-input class="q-pa-xs" outlined dense clearable color="accent" v-model="defaultItem.password" label="Password" :type="isPwd ? 'password' : 'text'"/>
                      <q-input class="q-pa-xs" outlined dense clearable color="accent" v-model="defaultItem.fullname" label="Full Name"/>
                      <q-input class="q-pa-xs" outlined dense clearable color="accent" v-model="defaultItem.unit" label="Unit"/>
                      <q-input class="q-pa-xs" outlined dense clearable color="accent" v-model="defaultItem.position" label="Position"/>
                      <q-input class="q-pa-xs" outlined dense clearable color="accent" v-model="defaultItem.location" label="Location"/>
                      <q-input outlined dense v-model="defaultItem.telephone" label="Telephone" mask="(###) ### - ####" fill-mask color="accent" class="q-ma-xs"/>
                    </q-card-section>
                    <q-card-actions class="justify-center q-pa-xs">
                      <q-btn no-caps class="text-weight-light" @click="addAccount" color="secondary" label="Add Account" v-close-popup/>
                    </q-card-actions>
                  </q-card>
                </q-dialog>

                <q-dialog v-model="edit_dialog" persistent transition-show="rotate" transition-hide="rotate">
                  <q-card style="width: 350px">
                    <q-bar class="bg-secondary text-white" style="height: 60px">
                      <div class="text-h6 text-weight-light">Edit Account</div>
                      <q-space />
                      <q-btn icon="close" flat round dense v-close-popup />
                    </q-bar>

                    <q-card-section>
                      <q-select outlined class="q-pa-xs" dense clearable color="accent" v-model="editedItem.usertype" :options="usertypes" label="Usertype" />
                      <q-input class="q-pa-xs" outlined dense clearable color="accent" v-model="editedItem.email" label="Email"/>
                      <q-input class="q-pa-xs" outlined dense clearable color="accent" v-model="editedItem.fullname" label="Full Name"/>
                      <q-input class="q-pa-xs" outlined dense clearable color="accent" v-model="editedItem.unit" label="Unit"/>
                      <q-input class="q-pa-xs" outlined dense clearable color="accent" v-model="editedItem.position" label="Position"/>
                      <q-input class="q-pa-xs" outlined dense clearable color="accent" v-model="editedItem.location" label="Location"/>
                      <q-input outlined dense v-model="editedItem.telephone" label="Telephone" mask="(###) ### - ####" fill-mask color="accent" class="q-ma-xs"/>
                    </q-card-section>
                    <q-card-actions class="justify-center q-pa-xs">
                      <q-btn no-caps class="text-weight-light" @click="updateAccount" color="secondary" label="Save Changes" v-close-popup/>
                    </q-card-actions>
                  </q-card>
                </q-dialog>

                <div style="width: 100%;">
                  <q-banner v-if="!cdmo.length" class="bg-grey-2 q-pa-md" style="min-width: 800px; height: 150px">
                    <template v-slot:avatar>
                      <q-icon name="sentiment_dissatisfied" color="accent" />
                    </template>
                  <span class="text-h6 text-grey text-weight-thin">No Records Found!</span>
                  </q-banner>
                  <q-table
                    class="my-sticky-header-table"
                    :data="cdmo"
                    :columns="columns"
                    row-key="name"
                    :filter="filter"
                    :separator="separator"
                    v-else
                    hide-bottom
                    dense
                    title="CDMO"
                  >
                    <template v-slot:header="props">
                      <q-tr :props="props">
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
                        <q-td
                          v-for="col in props.cols"
                          :key="col.name"
                          :props="props"
                        >
                          {{ col.value }}
                        </q-td>
                         <q-td>
                          <q-btn flat dense icon="edit" color="secondary" @click="toEdit(props.row)"/>
                          <q-btn flat dense icon="delete" color="accent" @click="delAccount(props.row.id)">
                            <q-space/>
                          </q-btn>
                        </q-td>
                      </q-tr>
                    </template>
                  </q-table>
                </div>
              </q-tab-panel>

              <q-tab-panel name="tab 3">
                <div class="q-pa-md">
                  <q-btn no-caps float="right" class="text-weight-light q-mr-sm" icon="person_add" color="secondary" label="Add Account" @click="add_dialog=true"/>
                </div>

                <q-dialog v-model="add_dialog" persistent transition-show="rotate" transition-hide="rotate">
                  <q-card style="width: 350px">
                    <q-bar class="bg-secondary text-white" style="height: 60px">
                      <div class="text-h6 text-weight-light">Add Account</div>
                      <q-space />
                      <q-btn icon="close" flat round dense v-close-popup />
                    </q-bar>
                    <q-card-section>
                      <q-select outlined class="q-pa-xs" dense clearable color="accent" v-model="defaultItem.usertype" :options="usertypes" label="Usertype" />
                      <q-input class="q-pa-xs" outlined dense clearable color="accent" v-model="defaultItem.email" label="Email"/>
                      <q-input class="q-pa-xs" outlined dense clearable color="accent" v-model="defaultItem.password" label="Password" :type="isPwd ? 'password' : 'text'"/>
                      <q-input class="q-pa-xs" outlined dense clearable color="accent" v-model="defaultItem.fullname" label="Full Name"/>
                      <q-input class="q-pa-xs" outlined dense clearable color="accent" v-model="defaultItem.unit" label="Unit"/>
                      <q-input class="q-pa-xs" outlined dense clearable color="accent" v-model="defaultItem.area" label="Area"/>
                      <q-input class="q-pa-xs" outlined dense clearable color="accent" v-model="defaultItem.position" label="Position"/>
                      <q-input class="q-pa-xs" outlined dense clearable color="accent" v-model="defaultItem.location" label="Location"/>
                      <q-input outlined dense v-model="defaultItem.telephone" label="Telephone" mask="(###) ### - ####" fill-mask color="accent" class="q-ma-xs"/>
                    </q-card-section>
                    <q-card-actions class="justify-center q-pa-xs">
                      <q-btn no-caps class="text-weight-light" @click="addAccount" color="secondary" label="Add Account" v-close-popup/>
                    </q-card-actions>
                  </q-card>
                </q-dialog>

                <q-dialog v-model="edit_dialog" persistent transition-show="rotate" transition-hide="rotate">
                  <q-card style="width: 350px">
                    <q-bar class="bg-secondary text-white" style="height: 60px">
                      <div class="text-h6 text-weight-light">Edit Account</div>
                      <q-space />
                      <q-btn icon="close" flat round dense v-close-popup />
                    </q-bar>

                    <q-card-section>
                      <q-select outlined class="q-pa-xs" dense clearable color="accent" v-model="editedItem.usertype" :options="usertypes" label="Usertype" />
                      <q-input class="q-pa-xs" outlined dense clearable color="accent" v-model="editedItem.email" label="Email"/>
                      <q-input class="q-pa-xs" outlined dense clearable color="accent" v-model="editedItem.fullname" label="Full Name"/>
                      <q-input class="q-pa-xs" outlined dense clearable color="accent" v-model="editedItem.unit" label="Unit"/>
                      <q-input class="q-pa-xs" outlined dense clearable color="accent" v-model="editedItem.area" label="Area"/>
                      <q-input class="q-pa-xs" outlined dense clearable color="accent" v-model="editedItem.position" label="Position"/>
                      <q-input class="q-pa-xs" outlined dense clearable color="accent" v-model="editedItem.location" label="Location"/>
                      <q-input outlined dense v-model="editedItem.telephone" label="Telephone" mask="(###) ### - ####" fill-mask color="accent" class="q-ma-xs"/>
                    </q-card-section>
                    <q-card-actions class="justify-center q-pa-xs">
                      <q-btn no-caps class="text-weight-light" @click="updateAccount" color="secondary" label="Save Changes" v-close-popup/>
                    </q-card-actions>
                  </q-card>
                </q-dialog>

                <div style="width: 100%;">
                  <q-banner v-if="!foreman.length" class="bg-grey-2 q-pa-md" style="min-width: 800px; height: 150px">
                    <template v-slot:avatar>
                      <q-icon name="sentiment_dissatisfied" color="accent" />
                    </template>
                  <span class="text-h6 text-grey text-weight-thin">No Records Found!</span>
                  </q-banner>
                  <q-table
                    class="my-sticky-header-table"
                    :data="foreman"
                    :columns="forCol"
                    row-key="name"
                    :filter="filter"
                    :separator="separator"
                    v-else
                    hide-bottom
                    dense
                    title="Foreman"
                  >
                    <template v-slot:header="props">
                      <q-tr :props="props">
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
                        <q-td
                          v-for="col in props.cols"
                          :key="col.name"
                          :props="props"
                        >
                          {{ col.value }}
                        </q-td>
                         <q-td>
                          <q-btn flat dense icon="edit" color="secondary" @click="toEdit(props.row)"/>
                          <q-btn flat dense icon="delete" color="accent" @click="delAccount(props.row.id)">
                            <q-space/>
                          </q-btn>
                        </q-td>
                      </q-tr>
                    </template>
                  </q-table>
                </div>
              </q-tab-panel>

              <q-tab-panel name="tab 4">
                <div class="q-pa-md">
                  <q-btn no-caps float="right" class="text-weight-light q-mr-sm" icon="person_add" color="secondary" label="Add Account" @click="add_dialog=true"/>
                </div>

                <q-dialog v-model="add_dialog" persistent transition-show="rotate" transition-hide="rotate">
                  <q-card style="width: 350px">
                    <q-bar class="bg-secondary text-white" style="height: 60px">
                      <div class="text-h6 text-weight-light">Add Account</div>
                      <q-space />
                      <q-btn icon="close" flat round dense v-close-popup />
                    </q-bar>
                    <q-card-section>
                      <q-select outlined class="q-pa-xs" dense clearable color="accent" v-model="defaultItem.usertype" :options="usertypes" label="Usertype" />
                      <q-input class="q-pa-xs" outlined dense clearable color="accent" v-model="defaultItem.email" label="Email"/>
                      <q-input class="q-pa-xs" outlined dense clearable color="accent" v-model="defaultItem.password" label="Password" :type="isPwd ? 'password' : 'text'"/>
                      <q-input class="q-pa-xs" outlined dense clearable color="accent" v-model="defaultItem.fullname" label="Full Name"/>
                      <q-input class="q-pa-xs" outlined dense clearable color="accent" v-model="defaultItem.unit" label="Unit"/>
                      <q-input class="q-pa-xs" outlined dense clearable color="accent" v-model="defaultItem.area" label="Area"/>
                      <q-input class="q-pa-xs" outlined dense clearable color="accent" v-model="defaultItem.position" label="Position"/>
                      <q-input class="q-pa-xs" outlined dense clearable color="accent" v-model="defaultItem.location" label="Location"/>
                      <q-input outlined dense v-model="defaultItem.telephone" label="Telephone" mask="(###) ### - ####" fill-mask color="accent" class="q-ma-xs"/>
                    </q-card-section>
                    <q-card-actions class="justify-center q-pa-xs">
                      <q-btn no-caps class="text-weight-light" @click="addAccount" color="secondary" label="Add Account" v-close-popup/>
                    </q-card-actions>
                  </q-card>
                </q-dialog>

                <q-dialog v-model="edit_dialog" persistent transition-show="rotate" transition-hide="rotate">
                  <q-card style="width: 350px">
                    <q-bar class="bg-secondary text-white" style="height: 60px">
                      <div class="text-h6 text-weight-light">Edit Account</div>
                      <q-space />
                      <q-btn icon="close" flat round dense v-close-popup />
                    </q-bar>

                    <q-card-section>
                      <q-select outlined class="q-pa-xs" dense clearable color="accent" v-model="editedItem.usertype" :options="usertypes" label="Usertype" />
                      <q-input class="q-pa-xs" outlined dense clearable color="accent" v-model="editedItem.email" label="Email"/>
                      <q-input class="q-pa-xs" outlined dense clearable color="accent" v-model="editedItem.fullname" label="Full Name"/>
                      <q-input class="q-pa-xs" outlined dense clearable color="accent" v-model="editedItem.unit" label="Unit"/>
                      <q-input class="q-pa-xs" outlined dense clearable color="accent" v-model="editedItem.area" label="Area"/>
                      <q-input class="q-pa-xs" outlined dense clearable color="accent" v-model="editedItem.position" label="Position"/>
                      <q-input class="q-pa-xs" outlined dense clearable color="accent" v-model="editedItem.location" label="Location"/>
                      <q-input outlined dense v-model="editedItem.telephone" label="Telephone" mask="(###) ### - ####" fill-mask color="accent" class="q-ma-xs"/>
                    </q-card-section>
                    <q-card-actions class="justify-center q-pa-xs">
                      <q-btn no-caps class="text-weight-light" @click="updateAccount" color="secondary" label="Save Changes" v-close-popup/>
                    </q-card-actions>
                  </q-card>
                </q-dialog>

                <div style="width: 100%;">
                  <q-banner v-if="!worker.length" class="bg-grey-2 q-pa-md" style="min-width: 800px; height: 150px">
                    <template v-slot:avatar>
                      <q-icon name="sentiment_dissatisfied" color="accent" />
                    </template>
                  <span class="text-h6 text-grey text-weight-thin">No Records Found!</span>
                  </q-banner>
                  <q-table
                    class="my-sticky-header-table"
                    :data="worker"
                    :columns="forCol"
                    row-key="name"
                    :filter="filter"
                    :separator="separator"
                    v-else
                    hide-bottom
                    dense
                    title="Workers"
                  >
                    <template v-slot:header="props">
                        <q-tr :props="props">
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
                          <q-td
                            v-for="col in props.cols"
                            :key="col.name"
                            :props="props"
                          >
                            {{ col.value }}
                          </q-td>
                          <q-td>
                            <q-btn flat dense icon="edit" color="secondary" @click="toEdit(props.row)"/>
                            <q-btn flat dense icon="delete" color="accent" @click="delAccount(props.row.id)">
                              <q-space/>
                            </q-btn>
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

<style lang="sass">

  th:first-child,
  td:first-child
    position: sticky
    left: 0
    z-index: 1
</style>

<script>
import { firebaseAuth, db } from 'boot/firebase'
import { date } from 'quasar'

export default {

  data () {
    return {
      separator: 'cell',
      tab: 'tab 1',
      dense: false,
      isPwd: true,
      editedIndex: -1,
      edit_dialog: false,
      add_dialog: false,
      filter: '',
      editedItem: {
        usertype: '',
        fullname: '',
        mobile: '',
        email: '',
        image: '',
        position: '',
        unit: '',
        area: ''
      },
      defaultItem: {
        usertype: '',
        fullname: '',
        mobile: '',
        email: '',
        image: '',
        position: '',
        unit: '',
        area: ''
      },
      users: [],
      cdmo: [],
      foreman: [],
      worker: [],
      usertypes: [
        'Unit Requestor', 'Unit Head', 'Administrative Staff', 'Inventory Staff', 'Foreman', 'Worker'
      ],
      options: [
        'Plumbing', 'Electricity', 'Grounds', 'Transportation'
      ],
      columns: [
        { name: 'name', label: 'FullName', field: 'fullname', align: 'left', sortable: true },
        { name: 'email', label: 'Email.', field: 'email', align: 'left' },
        { name: 'unit', label: 'Unit', field: 'unit', align: 'left' },
        { name: 'position', label: 'position', field: 'position', align: 'left' },
        { name: 'telephone', label: 'Telephone', field: 'telephone', align: 'left' },
        { name: 'userId', label: 'UID', field: 'userId', align: 'left' }
      ],
      forCol: [
        { name: 'name', label: 'FullName', field: 'fullname', align: 'left', sortable: true },
        { name: 'email', label: 'Email.', field: 'email', align: 'left' },
        { name: 'area', label: 'Area', field: 'area', align: 'left' },
        { name: 'unit', label: 'Unit', field: 'unit', align: 'left' },
        { name: 'position', label: 'position', field: 'position', align: 'left' },
        { name: 'telephone', label: 'Telephone', field: 'telephone', align: 'left' },
        { name: 'userId', label: 'UID', field: 'userId', align: 'left' }
      ]
    }
  },
  async created () {
    try {
      await db.collection('account').get().then(querySnapshot => {
        querySnapshot.forEach(doc => {
          const userData = {
            id: doc.id,
            userId: doc.data().userId,
            usertype: doc.data().usertype,
            fullname: doc.data().fullname,
            telephone: doc.data().telephone,
            email: doc.data().email,
            position: doc.data().position,
            unit: doc.data().unit,
            location: doc.data().location,
            area: doc.data().category
          }
          if (userData.usertype === 'Unit Requestor' || userData.usertype === 'Unit Head') {
            this.users.push(userData)
          }
          if (userData.usertype === 'Administrative Staff' || userData.usertype === 'Inventory Staff') {
            this.cdmo.push(userData)
          }
          if (userData.usertype === 'Foreman') {
            this.foreman.push(userData)
          }
          if (userData.usertype === 'Worker') {
            this.worker.push(userData)
          }
        })
      })
    } catch (error) {
      console.log('error message', error)
    }
  },
  computed: {
    date () {
      let timeStamp = Date.now()
      return date.formatDate(timeStamp, 'dddd D MMMM YYYY')
    }
  },
  methods: {
    addAccount () {
      const acRef = db.collection('account')
      firebaseAuth.createUserWithEmailAndPassword(this.defaultItem.email, this.defaultItem.password)
        .then((authData) => {
          acRef.add({
            usertype: this.defaultItem.usertype,
            fullname: this.defaultItem.fullname,
            telephone: this.defaultItem.telephone,
            email: this.defaultItem.email,
            position: this.defaultItem.position,
            unit: this.defaultItem.unit,
            location: this.defaultItem.location
          })
          location.reload()
          this.$q.notify({
            avatar: 'Added',
            color: 'secondary',
            message: 'Account created'
          })
          console.log('User created successfully with payload-', authData)
        }).catch((_error) => {
          console.log('Login Failed!', _error)
        })
    },
    updateAccount () {
      const acRef = db.collection('account').doc(this.activeAccount)
      acRef.update(this.editedItem)
        .then(
          location.reload(),
          this.$q.notify({
            color: 'secondary',
            message: 'Account updated successfully'
          })
        )
        .catch(error => {
          console.error('Error updating account: ', error)
        })
    },
    toEdit (item, id) {
      this.edit_dialog = true
      this.editedItem = Object.assign({}, item)
      this.activeAccount = this.editedItem.id
    },
    delAccount (id) {
      // db.collection('users').document(firebaseAuth.getInstance().currentUser.uid).delete()
      // .addOnSuccessListener { FirebaseAuth.getInstance().currentUser!!.delete().addOnCompleteListener {//Go to login screen} }
      // .addOnFailureListener { ... }
      this.$q.dialog({
        title: 'Delete Confirm',
        message: 'The account will be deleted. Are you sure you want to continue?',
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
          db.collection('users').document(firebaseAuth.getCurrentUser.currentUser.uid).delete()
          await db.collection('account').doc(id).delete()
          location.reload()
          this.$q.notify({
            avatar: 'delete',
            color: 'accent',
            message: 'Account deleted successfully'
          })
        } catch (error) {
          console.log('Error deleting account', error)
        }
      }
      )
    }
  }
}
</script>

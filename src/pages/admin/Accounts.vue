<template>
  <q-layout view="hHh lpR fFf">
    <q-page-container>
        <q-page class="window-height window-width row justify-center">
          <div class="q-gutter-sm flex text-center">
            <div style="width: 100%; height: 50%;">
              <h5 class="text-weight-light">ACCOUNTS</h5><span class="text-weight-medium">{{ date }}</span><br><br>
              <q-input v-if="users.length || cdmo.length || foreman.length || worker.length" outlined clearable color="secondary" dense debounce="300" v-model="filter" placeholder="Search">
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
                  <q-tab name="tab 1" label="Unit" icon="people_alt"/>
                  <q-tab name="tab 2" label="CDMO" icon="domain"/>
                  <q-tab name="tab 3" label="Foremen" icon="engineering"/>
                  <q-tab name="tab 4" label="Workers" icon="group"/>
                </q-tabs>

                <q-separator />

                <q-tab-panels v-model="tab" animated>
                  <q-tab-panel name="tab 1">
                  <div style="width: 100%;">
                  <q-banner v-if="!users.length" class="bg-grey-2 q-pa-md" style="min-width: 800px; height: 150px">
                    <template v-slot:avatar>
                      <q-icon name="sentiment_dissatisfied" color="accent" />
                    </template>
                  <span class="text-h6 text-grey text-weight-thin">No Records Found!</span>
                    <template v-slot:action>
                      <q-btn outline class="text-weight-light q-ma-sm" icon="person_add" color="secondary" label="Account" @click="add_dialog=true"/>
                    </template>
                  </q-banner>
                  <q-table
                    title="Unit Users"
                    :table-style="'counter-reset: cssRowCounter '"
                    :data="users"
                    :columns="columns"
                    row-key="name"
                    :filter="filter"
                    :separator="separator"
                    v-else
                    dense
                  >
                    <template v-slot:top-right>
                      <q-btn
                        class="text-weight-light q-ma-sm"
                        unelevated
                        no-caps
                        color="secondary"
                        icon="person_add"
                        label="Account"
                        @click="add_dialog=true"
                      />
                    </template>
                    <template v-slot:header="props">
                      <q-tr :props="props">
                        <q-th class="text-italic text-accent" auto-width>#</q-th>
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
                        <q-td
                          v-for="col in props.cols"
                          :key="col.name"
                          :props="props"
                        >
                          {{ col.value }}
                        </q-td>
                         <q-td>
                          <q-btn flat dense icon="edit" color="secondary" @click="toEdit(props.row)"/>
                          <q-btn flat dense icon="person_remove" color="accent" @click="delAccount(props.row.id)">
                            <q-space/>
                          </q-btn>
                        </q-td>
                      </q-tr>
                    </template>
                  </q-table>
                </div>

                <q-dialog v-model="add_dialog" persistent transition-show="rotate" transition-hide="rotate">
                  <q-card style="width: 400px">
                    <q-bar class="bg-secondary text-white" style="height: 50px">
                      <div class="q-pa-sm text-h6 text-weight-light">Add Account</div>
                      <q-space />
                      <q-btn unelevated flat class="q-pa-xs text-weight-light" @click="resetDef" label="Reset"/>
                      <q-btn icon="close" flat round dense v-close-popup />
                    </q-bar>
                    <q-card-section>
                      <q-select
                        class="q-pa-xs"
                        outlined
                        dense
                        color="accent"
                        ref="usertype"
                        v-model="defaultItem.usertype"
                        :options="usertypes"
                        label="Usertype"
                        use-chips
                        stack-label
                        emit-value
                        map-options
                        lazy-rules
                        :rules="[val => val !== null && val !== '' && val !== undefined || 'Selection is required']"
                        >
                        <template v-slot:prepend>
                          <q-icon color="accent" name="face" />
                        </template>
                      </q-select>
                      <q-input
                        class="q-pa-xs"
                        outlined
                        dense
                        clearable
                        color="accent"
                        ref="email"
                        v-model="defaultItem.email"
                        label="Email"
                        @input="val => { defaultItem.email = val.toLowerCase() }"
                        lazy-rules
                        :rules="[val => val !== null && val !== '' && val !== undefined || 'Input is required']"
                        >
                        <template v-slot:prepend>
                          <q-icon color="accent" name="email" />
                        </template>
                      </q-input>
                      <!-- <q-input
                        @input="val => { defaultItem.photo = val[0] }"
                        class="q-pa-xs"
                        outlined
                        dense
                        color="accent"
                        type="file"
                        >
                        <template v-slot:prepend>
                          <q-icon color="accent" name="image" />
                        </template>
                      </q-input> -->
                      <q-input
                        class="q-pa-xs"
                        outlined
                        dense
                        ref="fullname"
                        clearable
                        color="accent"
                        v-model="defaultItem.fullname"
                        label="Full Name"
                        @input="val => { defaultItem.fullname = val.toUpperCase() }"
                        lazy-rules
                        :rules="[val => val !== null && val !== '' && val !== undefined || 'Input is required']"
                        >
                        <template v-slot:prepend>
                          <q-icon color="accent" name="person_pin" />
                        </template>
                      </q-input>
                      <q-input
                        outlined
                        dense
                        class="q-pa-xs"
                        clearable
                        ref="unit"
                        color="accent"
                        v-model="defaultItem.unit"
                        label="Unit"
                        @input="val => { defaultItem.unit = val.toUpperCase() }"
                         lazy-rules
                        :rules="[val => val !== null && val !== '' && val !== undefined || 'Input is required']"
                        >
                        <template v-slot:prepend>
                          <q-icon color="accent" name="local_library" />
                        </template>
                      </q-input>
                      <q-input
                        outlined
                        class="q-pa-xs"
                        dense
                        clearable
                        ref="position"
                        color="accent"
                        v-model="defaultItem.position"
                        label="Position"
                        @input="val => { defaultItem.position = val.toUpperCase() }"
                        lazy-rules
                        :rules="[val => val !== null && val !== '' && val !== undefined || 'Input is required']"
                        >
                        <template v-slot:prepend>
                          <q-icon color="accent" name="work" />
                        </template>
                      </q-input>
                      <q-input
                        class="q-pa-xs"
                        outlined
                        dense
                        clearable
                        ref="location"
                        color="accent"
                        v-model="defaultItem.location"
                        label="Location"
                        @input="val => { defaultItem.location = val.toUpperCase() }"
                        lazy-rules
                        :rules="[val => val !== null && val !== '' && val !== undefined || 'Input is required']"
                        >
                        <template v-slot:prepend>
                          <q-icon color="accent" name="place" />
                        </template>
                      </q-input>
                      <q-input
                        class="q-pa-xs"
                        outlined
                        dense
                        ref="phone"
                        clearable
                        color="accent"
                        v-model="defaultItem.telephone"
                        label="Telephone"
                        mask="(###) ### - ####"
                        fill-mask
                        lazy-rules
                        :rules="[val => val !== null && val !== '' && val !== undefined || 'Input is required']"
                        >
                        <template v-slot:prepend>
                          <q-icon color="accent" name="phone" />
                        </template>
                      </q-input>
                    </q-card-section>

                    <q-card-actions class="justify-center">
                      <q-btn unelevated class="full-width q-pa-xs" @click="addAccount" color="secondary" label="Add User"/>
                    </q-card-actions>
                  </q-card>
                </q-dialog>

                <q-dialog v-model="edit_dialog" persistent transition-show="rotate" transition-hide="rotate">
                  <q-card style="width: 400px">
                    <q-bar class="bg-secondary text-white" style="height: 50px">
                      <div class="q-pa-sm text-h6 text-weight-light">Edit Account</div>
                      <q-space />
                      <q-btn unelevated flat class="q-pa-xs text-weight-light" @click="resetEdit" label="Reset"/>
                      <q-btn icon="close" flat round dense v-close-popup />
                    </q-bar>
                    <q-card-section>
                      <q-select
                        class="q-pa-xs"
                        outlined
                        dense
                        color="accent"
                        ref="usertype"
                        v-model="editedItem.usertype"
                        :options="usertypes"
                        label="Usertype"
                        use-chips
                        stack-label
                        emit-value
                        map-options
                        lazy-rules
                        :rules="[val => val !== null && val !== '' && val !== undefined || 'Selection is required']"
                        >
                        <template v-slot:prepend>
                          <q-icon color="accent" name="face" />
                        </template>
                      </q-select>
<!--                       <q-input
                        class="q-pa-xs"
                        outlined
                        dense
                        clearable
                        color="accent"
                        ref="email"
                        v-model="editedItem.email"
                        label="Email"
                        readonly
                        >
                        <template v-slot:prepend>
                          <q-icon color="accent" name="email" />
                        </template>
                      </q-input> -->
                      <!-- <q-input
                        @input="val => { editedItem.photo = val[0] }"
                        class="q-pa-xs"
                        outlined
                        dense
                        color="accent"
                        type="file"
                        >
                        <template v-slot:prepend>
                          <q-icon color="accent" name="image" />
                        </template>
                      </q-input> -->
                      <q-input
                        class="q-pa-xs"
                        outlined
                        dense
                        ref="fullname"
                        clearable
                        color="accent"
                        v-model="editedItem.fullname"
                        label="Full Name"
                        @input="val => { editedItem.fullname = val.toUpperCase() }"
                        lazy-rules
                        :rules="[val => val !== null && val !== '' && val !== undefined || 'Input is required']"
                        >
                        <template v-slot:prepend>
                          <q-icon color="accent" name="person_pin" />
                        </template>
                      </q-input>
                      <q-input
                        outlined
                        dense
                        class="q-pa-xs"
                        clearable
                        ref="unit"
                        color="accent"
                        v-model="editedItem.unit"
                        label="Unit"
                        @input="val => { editedItem.unit = val.toUpperCase() }"
                         lazy-rules
                        :rules="[val => val !== null && val !== '' && val !== undefined || 'Input is required']"
                        >
                        <template v-slot:prepend>
                          <q-icon color="accent" name="local_library" />
                        </template>
                      </q-input>
                      <q-input
                        outlined
                        class="q-pa-xs"
                        dense
                        clearable
                        ref="position"
                        color="accent"
                        v-model="editedItem.position"
                        label="Position"
                        @input="val => { editedItem.position = val.toUpperCase() }"
                        lazy-rules
                        :rules="[val => val !== null && val !== '' && val !== undefined || 'Input is required']"
                        >
                        <template v-slot:prepend>
                          <q-icon color="accent" name="work" />
                        </template>
                      </q-input>
                      <q-input
                        class="q-pa-xs"
                        outlined
                        dense
                        clearable
                        ref="location"
                        color="accent"
                        v-model="editedItem.location"
                        label="Location"
                        @input="val => { editedItem.location = val.toUpperCase() }"
                        lazy-rules
                        :rules="[val => val !== null && val !== '' && val !== undefined || 'Input is required']"
                        >
                        <template v-slot:prepend>
                          <q-icon color="accent" name="place" />
                        </template>
                      </q-input>
                      <q-input
                        class="q-pa-xs"
                        outlined
                        dense
                        ref="phone"
                        clearable
                        color="accent"
                        v-model="editedItem.telephone"
                        label="Telephone"
                        mask="(###) ### - ####"
                        fill-mask
                        lazy-rules
                        :rules="[val => val !== null && val !== '' && val !== undefined || 'Input is required']"
                        >
                        <template v-slot:prepend>
                          <q-icon color="accent" name="phone" />
                        </template>
                      </q-input>
                    </q-card-section>

                    <q-card-actions class="justify-center">
                      <q-btn unelevated class="full-width q-pa-xs" @click="updateAccount" color="secondary" label="Edit User"/>
                    </q-card-actions>
                  </q-card>
                </q-dialog>

              </q-tab-panel>

              <q-tab-panel name="tab 2">

                <div style="width: 100%;">
                  <q-banner v-if="!cdmo.length" class="bg-grey-2 q-pa-md" style="min-width: 800px; height: 150px">
                    <template v-slot:avatar>
                      <q-icon name="sentiment_dissatisfied" color="accent" />
                    </template>
                  <span class="text-h6 text-grey text-weight-thin">No Records Found!</span>
                    <template v-slot:action>
                      <q-btn outline class="text-weight-light q-ma-sm" icon="person_add" color="secondary" label="Account" @click="add_dialog=true"/>
                    </template>
                  </q-banner>
                  <q-table
                    title="CDMO Staffs"
                    :table-style="'counter-reset: cssRowCounter '"
                    :data="cdmo"
                    :columns="columns"
                    row-key="name"
                    :filter="filter"
                    :separator="separator"
                    v-else
                    dense
                  >
                    <template v-slot:top-right>
                      <q-btn
                        class="text-weight-light q-ma-sm"
                        unelevated
                        no-caps
                        color="secondary"
                        icon="person_add"
                        label="Account"
                        @click="add_dialog=true"
                      />
                    </template>
                    <template v-slot:header="props">
                      <q-tr :props="props">
                        <q-th class="text-italic text-accent" auto-width>#</q-th>
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
                        <q-td
                          v-for="col in props.cols"
                          :key="col.name"
                          :props="props"
                        >
                          {{ col.value }}
                        </q-td>
                         <q-td>
                          <q-btn flat dense icon="edit" color="secondary" @click="toEdit(props.row)"/>
                          <q-btn flat dense icon="person_remove" color="accent" @click="delAccount(props.row.id)">
                            <q-space/>
                          </q-btn>
                        </q-td>
                      </q-tr>
                    </template>
                  </q-table>
                </div>

                <q-dialog v-model="add_dialog" persistent transition-show="rotate" transition-hide="rotate">
                  <q-card style="width: 400px">
                    <q-bar class="bg-secondary text-white" style="height: 50px">
                      <div class="q-pa-sm text-h6 text-weight-light">Add Account</div>
                      <q-space />
                      <q-btn unelevated flat class="q-pa-xs text-weight-light" @click="resetDef" label="Reset"/>
                      <q-btn icon="close" flat round dense v-close-popup />
                    </q-bar>
                    <q-card-section>
                      <q-select
                        class="q-pa-xs"
                        outlined
                        dense
                        color="accent"
                        ref="usertype"
                        v-model="defaultItem.usertype"
                        :options="usertypes"
                        label="Usertype"
                        use-chips
                        stack-label
                        emit-value
                        map-options
                        lazy-rules
                        :rules="[val => val !== null && val !== '' && val !== undefined || 'Selection is required']"
                        >
                        <template v-slot:prepend>
                          <q-icon color="accent" name="face" />
                        </template>
                      </q-select>
                      <q-input
                        class="q-pa-xs"
                        outlined
                        dense
                        clearable
                        color="accent"
                        ref="email"
                        v-model="defaultItem.email"
                        label="Email"
                        @input="val => { defaultItem.email = val.toLowerCase() }"
                        lazy-rules
                        :rules="[val => val !== null && val !== '' && val !== undefined || 'Input is required']"
                        >
                        <template v-slot:prepend>
                          <q-icon color="accent" name="email" />
                        </template>
                      </q-input>
                      <!-- <q-input
                        @input="val => { defaultItem.photo = val[0] }"
                        class="q-pa-xs"
                        outlined
                        dense
                        color="accent"
                        type="file"
                        >
                        <template v-slot:prepend>
                          <q-icon color="accent" name="image" />
                        </template>
                      </q-input> -->
                      <q-input
                        class="q-pa-xs"
                        outlined
                        dense
                        ref="fullname"
                        clearable
                        color="accent"
                        v-model="defaultItem.fullname"
                        label="Full Name"
                        @input="val => { defaultItem.fullname = val.toUpperCase() }"
                        lazy-rules
                        :rules="[val => val !== null && val !== '' && val !== undefined || 'Input is required']"
                        >
                        <template v-slot:prepend>
                          <q-icon color="accent" name="person_pin" />
                        </template>
                      </q-input>
                      <q-input
                        outlined
                        dense
                        class="q-pa-xs"
                        clearable
                        ref="unit"
                        color="accent"
                        v-model="defaultItem.unit"
                        label="Unit"
                        @input="val => { defaultItem.unit = val.toUpperCase() }"
                         lazy-rules
                        :rules="[val => val !== null && val !== '' && val !== undefined || 'Input is required']"
                        >
                        <template v-slot:prepend>
                          <q-icon color="accent" name="local_library" />
                        </template>
                      </q-input>
                      <q-input
                        outlined
                        class="q-pa-xs"
                        dense
                        clearable
                        ref="position"
                        color="accent"
                        v-model="defaultItem.position"
                        label="Position"
                        @input="val => { defaultItem.position = val.toUpperCase() }"
                        lazy-rules
                        :rules="[val => val !== null && val !== '' && val !== undefined || 'Input is required']"
                        >
                        <template v-slot:prepend>
                          <q-icon color="accent" name="work" />
                        </template>
                      </q-input>
                      <q-input
                        class="q-pa-xs"
                        outlined
                        dense
                        clearable
                        ref="location"
                        color="accent"
                        v-model="defaultItem.location"
                        label="Location"
                        @input="val => { defaultItem.location = val.toUpperCase() }"
                        lazy-rules
                        :rules="[val => val !== null && val !== '' && val !== undefined || 'Input is required']"
                        >
                        <template v-slot:prepend>
                          <q-icon color="accent" name="place" />
                        </template>
                      </q-input>
                      <q-input
                        class="q-pa-xs"
                        outlined
                        dense
                        ref="phone"
                        clearable
                        color="accent"
                        v-model="defaultItem.telephone"
                        label="Telephone"
                        mask="(###) ### - ####"
                        fill-mask
                        lazy-rules
                        :rules="[val => val !== null && val !== '' && val !== undefined || 'Input is required']"
                        >
                        <template v-slot:prepend>
                          <q-icon color="accent" name="phone" />
                        </template>
                      </q-input>
                    </q-card-section>

                    <q-card-actions class="justify-center">
                      <q-btn unelevated class="full-width q-pa-xs" @click="addAccount" color="secondary" label="Add User"/>
                    </q-card-actions>
                  </q-card>
                </q-dialog>

                <q-dialog v-model="edit_dialog" persistent transition-show="rotate" transition-hide="rotate">
                  <q-card style="width: 400px">
                    <q-bar class="bg-secondary text-white" style="height: 50px">
                      <div class="q-pa-sm text-h6 text-weight-light">Edit Account</div>
                      <q-space />
                      <q-btn unelevated flat class="q-pa-xs text-weight-light" @click="resetEdit" label="Reset"/>
                      <q-btn icon="close" flat round dense v-close-popup />
                    </q-bar>
                    <q-card-section>
                      <q-select
                        class="q-pa-xs"
                        outlined
                        dense
                        color="accent"
                        ref="usertype"
                        v-model="editedItem.usertype"
                        :options="usertypes"
                        label="Usertype"
                        use-chips
                        stack-label
                        emit-value
                        map-options
                        lazy-rules
                        :rules="[val => val !== null && val !== '' && val !== undefined || 'Selection is required']"
                        >
                        <template v-slot:prepend>
                          <q-icon color="accent" name="face" />
                        </template>
                      </q-select>
<!--                       <q-input
                        class="q-pa-xs"
                        outlined
                        dense
                        clearable
                        color="accent"
                        ref="email"
                        v-model="editedItem.email"
                        label="Email"
                        readonly
                        >
                        <template v-slot:prepend>
                          <q-icon color="accent" name="email" />
                        </template>
                      </q-input> -->
                      <!-- <q-input
                        @input="val => { editedItem.photo = val[0] }"
                        class="q-pa-xs"
                        outlined
                        dense
                        color="accent"
                        type="file"
                        >
                        <template v-slot:prepend>
                          <q-icon color="accent" name="image" />
                        </template>
                      </q-input> -->
                      <q-input
                        class="q-pa-xs"
                        outlined
                        dense
                        ref="fullname"
                        clearable
                        color="accent"
                        v-model="editedItem.fullname"
                        label="Full Name"
                        @input="val => { editedItem.fullname = val.toUpperCase() }"
                        lazy-rules
                        :rules="[val => val !== null && val !== '' && val !== undefined || 'Input is required']"
                        >
                        <template v-slot:prepend>
                          <q-icon color="accent" name="person_pin" />
                        </template>
                      </q-input>
                      <q-input
                        outlined
                        dense
                        class="q-pa-xs"
                        clearable
                        ref="unit"
                        color="accent"
                        v-model="editedItem.unit"
                        label="Unit"
                        @input="val => { editedItem.unit = val.toUpperCase() }"
                         lazy-rules
                        :rules="[val => val !== null && val !== '' && val !== undefined || 'Input is required']"
                        >
                        <template v-slot:prepend>
                          <q-icon color="accent" name="local_library" />
                        </template>
                      </q-input>
                      <q-input
                        outlined
                        class="q-pa-xs"
                        dense
                        clearable
                        ref="position"
                        color="accent"
                        v-model="editedItem.position"
                        label="Position"
                        @input="val => { editedItem.position = val.toUpperCase() }"
                        lazy-rules
                        :rules="[val => val !== null && val !== '' && val !== undefined || 'Input is required']"
                        >
                        <template v-slot:prepend>
                          <q-icon color="accent" name="work" />
                        </template>
                      </q-input>
                      <q-input
                        class="q-pa-xs"
                        outlined
                        dense
                        clearable
                        ref="location"
                        color="accent"
                        v-model="editedItem.location"
                        label="Location"
                        @input="val => { editedItem.location = val.toUpperCase() }"
                        lazy-rules
                        :rules="[val => val !== null && val !== '' && val !== undefined || 'Input is required']"
                        >
                        <template v-slot:prepend>
                          <q-icon color="accent" name="place" />
                        </template>
                      </q-input>
                      <q-input
                        class="q-pa-xs"
                        outlined
                        dense
                        ref="phone"
                        clearable
                        color="accent"
                        v-model="editedItem.telephone"
                        label="Telephone"
                        mask="(###) ### - ####"
                        fill-mask
                        lazy-rules
                        :rules="[val => val !== null && val !== '' && val !== undefined || 'Input is required']"
                        >
                        <template v-slot:prepend>
                          <q-icon color="accent" name="phone" />
                        </template>
                      </q-input>
                    </q-card-section>

                    <q-card-actions class="justify-center">
                      <q-btn unelevated class="full-width q-pa-xs" @click="updateAccount" color="secondary" label="Edit User"/>
                    </q-card-actions>
                  </q-card>
                </q-dialog>

              </q-tab-panel>

              <q-tab-panel name="tab 3">

                <div style="width: 100%;">
                  <q-banner v-if="!foreman.length" class="bg-grey-2 q-pa-md" style="min-width: 800px; height: 150px">
                    <template v-slot:avatar>
                      <q-icon name="sentiment_dissatisfied" color="accent" />
                    </template>
                  <span class="text-h6 text-grey text-weight-thin">No Records Found!</span>
                    <template v-slot:action>
                      <q-btn outline class="text-weight-light q-ma-sm" icon="person_add" color="secondary" label="Account" @click="add_dialog=true"/>
                    </template>
                  </q-banner>
                  <q-table
                    title="Foremen"
                    :table-style="'counter-reset: cssRowCounter '"
                    :data="foreman"
                    :columns="forCol"
                    row-key="name"
                    :filter="filter"
                    :separator="separator"
                    v-else
                    dense
                  >
                    <template v-slot:top-right>
                      <q-btn
                        class="text-weight-light q-ma-sm"
                        unelevated
                        no-caps
                        color="secondary"
                        icon="person_add"
                        label="Account"
                        @click="add_dialog=true"
                      />
                    </template>
                    <template v-slot:header="props">
                      <q-tr :props="props">
                        <q-th class="text-italic text-accent" auto-width>#</q-th>
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
                        <q-td
                          v-for="col in props.cols"
                          :key="col.name"
                          :props="props"
                        >
                          {{ col.value }}
                        </q-td>
                         <q-td>
                          <q-btn flat dense icon="edit" color="secondary" @click="toEdit(props.row)"/>
                          <q-btn flat dense icon="person_remove" color="accent" @click="delAccount(props.row.id)">
                            <q-space/>
                          </q-btn>
                        </q-td>
                      </q-tr>
                    </template>
                  </q-table>
                </div>
                <q-dialog v-model="add_dialog" persistent transition-show="rotate" transition-hide="rotate">
                  <q-card style="width: 400px">
                    <q-bar class="bg-secondary text-white" style="height: 50px">
                      <div class="q-pa-sm text-h6 text-weight-light">Add Account</div>
                      <q-space />
                      <q-btn unelevated flat class="q-pa-xs text-weight-light" @click="resetDef" label="Reset"/>
                      <q-btn icon="close" flat round dense v-close-popup />
                    </q-bar>
                    <q-card-section>
                      <q-select
                        class="q-pa-xs"
                        outlined
                        dense
                        color="accent"
                        ref="usertype"
                        v-model="defaultItem.usertype"
                        :options="usertypes"
                        label="Usertype"
                        use-chips
                        stack-label
                        emit-value
                        map-options
                        lazy-rules
                        :rules="[val => val !== null && val !== '' && val !== undefined || 'Selection is required']"
                        >
                        <template v-slot:prepend>
                          <q-icon color="accent" name="face" />
                        </template>
                      </q-select>
                      <q-select
                        class="q-pa-xs"
                        outlined
                        dense
                        color="accent"
                        ref="area"
                        v-model="defaultItem.area"
                        :options="areas"
                        label="Area"
                        use-chips
                        stack-label
                        lazy-rules
                        :rules="[val => val !== null && val !== '' && val !== undefined || 'Selection is required']"
                        >
                        <template v-slot:prepend>
                          <q-icon color="accent" name="category" />
                        </template>
                      </q-select>
                      <q-input
                        class="q-pa-xs"
                        outlined
                        dense
                        clearable
                        color="accent"
                        ref="email"
                        v-model="defaultItem.email"
                        label="Email"
                        @input="val => { defaultItem.email = val.toLowerCase() }"
                        lazy-rules
                        :rules="[val => val !== null && val !== '' && val !== undefined || 'Input is required']"
                        >
                        <template v-slot:prepend>
                          <q-icon color="accent" name="email" />
                        </template>
                      </q-input>
                      <!-- <q-input
                        @input="val => { defaultItem.photo = val[0] }"
                        class="q-pa-xs"
                        outlined
                        dense
                        color="accent"
                        type="file"
                        >
                        <template v-slot:prepend>
                          <q-icon color="accent" name="image" />
                        </template>
                      </q-input> -->
                      <q-input
                        class="q-pa-xs"
                        outlined
                        dense
                        ref="fullname"
                        clearable
                        color="accent"
                        v-model="defaultItem.fullname"
                        label="Full Name"
                        @input="val => { defaultItem.fullname = val.toUpperCase() }"
                        lazy-rules
                        :rules="[val => val !== null && val !== '' && val !== undefined || 'Input is required']"
                        >
                        <template v-slot:prepend>
                          <q-icon color="accent" name="person_pin" />
                        </template>
                      </q-input>
                      <q-input
                        outlined
                        dense
                        class="q-pa-xs"
                        clearable
                        ref="unit"
                        color="accent"
                        v-model="defaultItem.unit"
                        label="Unit"
                        @input="val => { defaultItem.unit = val.toUpperCase() }"
                         lazy-rules
                        :rules="[val => val !== null && val !== '' && val !== undefined || 'Input is required']"
                        >
                        <template v-slot:prepend>
                          <q-icon color="accent" name="local_library" />
                        </template>
                      </q-input>
                      <q-input
                        outlined
                        class="q-pa-xs"
                        dense
                        clearable
                        ref="position"
                        color="accent"
                        v-model="defaultItem.position"
                        label="Position"
                        @input="val => { defaultItem.position = val.toUpperCase() }"
                        lazy-rules
                        :rules="[val => val !== null && val !== '' && val !== undefined || 'Input is required']"
                        >
                        <template v-slot:prepend>
                          <q-icon color="accent" name="work" />
                        </template>
                      </q-input>
                      <q-input
                        class="q-pa-xs"
                        outlined
                        dense
                        clearable
                        ref="location"
                        color="accent"
                        v-model="defaultItem.location"
                        label="Location"
                        @input="val => { defaultItem.location = val.toUpperCase() }"
                        lazy-rules
                        :rules="[val => val !== null && val !== '' && val !== undefined || 'Input is required']"
                        >
                        <template v-slot:prepend>
                          <q-icon color="accent" name="place" />
                        </template>
                      </q-input>
                      <q-input
                        class="q-pa-xs"
                        outlined
                        dense
                        ref="phone"
                        clearable
                        color="accent"
                        v-model="defaultItem.telephone"
                        label="Telephone"
                        mask="(###) ### - ####"
                        fill-mask
                        lazy-rules
                        :rules="[val => val !== null && val !== '' && val !== undefined || 'Input is required']"
                        >
                        <template v-slot:prepend>
                          <q-icon color="accent" name="phone" />
                        </template>
                      </q-input>
                    </q-card-section>

                    <q-card-actions class="justify-center">
                      <q-btn unelevated class="full-width q-pa-xs" @click="addAccount" color="secondary" label="Add User"/>
                    </q-card-actions>
                  </q-card>
                </q-dialog>

                <q-dialog v-model="edit_dialog" persistent transition-show="rotate" transition-hide="rotate">
                  <q-card style="width: 400px;">
                    <q-bar class="bg-secondary text-white" style="height: 50px">
                      <div class="q-pa-sm text-h6 text-weight-light">Edit Account</div>
                      <q-space />
                      <q-btn unelevated flat class="q-pa-xs text-weight-light" @click="resetEdit" label="Reset"/>
                      <q-btn icon="close" flat round dense v-close-popup />
                    </q-bar>
                    <q-card-section>
                      <q-select
                        class="q-pa-xs"
                        outlined
                        dense
                        color="accent"
                        ref="usertype"
                        v-model="editedItem.usertype"
                        :options="usertypes"
                        label="Usertype"
                        use-chips
                        stack-label
                        emit-value
                        map-options
                        lazy-rules
                        :rules="[val => val !== null && val !== '' && val !== undefined || 'Selection is required']"
                        >
                        <template v-slot:prepend>
                          <q-icon color="accent" name="face" />
                        </template>
                      </q-select>
                      <q-select
                        class="q-pa-xs"
                        outlined
                        dense
                        color="accent"
                        ref="area"
                        v-model="editedItem.area"
                        :options="areas"
                        label="Area"
                        use-chips
                        stack-label
                        lazy-rules
                        :rules="[val => val !== null && val !== '' && val !== undefined || 'Selection is required']"
                        >
                        <template v-slot:prepend>
                          <q-icon color="accent" name="category" />
                        </template>
                      </q-select>
<!--                       <q-input
                        class="q-pa-xs"
                        outlined
                        dense
                        clearable
                        color="accent"
                        ref="email"
                        v-model="editedItem.email"
                        label="Email"
                        readonly
                        >
                        <template v-slot:prepend>
                          <q-icon color="accent" name="email" />
                        </template>
                      </q-input> -->
                      <!-- <q-input
                        @input="val => { editedItem.photo = val[0] }"
                        class="q-pa-xs"
                        outlined
                        dense
                        color="accent"
                        type="file"
                        >
                        <template v-slot:prepend>
                          <q-icon color="accent" name="image" />
                        </template>
                      </q-input> -->
                      <q-input
                        class="q-pa-xs"
                        outlined
                        dense
                        ref="fullname"
                        clearable
                        color="accent"
                        v-model="editedItem.fullname"
                        label="Full Name"
                        @input="val => { editedItem.fullname = val.toUpperCase() }"
                        lazy-rules
                        :rules="[val => val !== null && val !== '' && val !== undefined || 'Input is required']"
                        >
                        <template v-slot:prepend>
                          <q-icon color="accent" name="person_pin" />
                        </template>
                      </q-input>
                      <q-input
                        outlined
                        dense
                        class="q-pa-xs"
                        clearable
                        ref="unit"
                        color="accent"
                        v-model="editedItem.unit"
                        label="Unit"
                        @input="val => { editedItem.unit = val.toUpperCase() }"
                         lazy-rules
                        :rules="[val => val !== null && val !== '' && val !== undefined || 'Input is required']"
                        >
                        <template v-slot:prepend>
                          <q-icon color="accent" name="local_library" />
                        </template>
                      </q-input>
                      <q-input
                        outlined
                        class="q-pa-xs"
                        dense
                        clearable
                        ref="position"
                        color="accent"
                        v-model="editedItem.position"
                        label="Position"
                        @input="val => { editedItem.position = val.toUpperCase() }"
                        lazy-rules
                        :rules="[val => val !== null && val !== '' && val !== undefined || 'Input is required']"
                        >
                        <template v-slot:prepend>
                          <q-icon color="accent" name="work" />
                        </template>
                      </q-input>
                      <q-input
                        class="q-pa-xs"
                        outlined
                        dense
                        clearable
                        ref="location"
                        color="accent"
                        v-model="editedItem.location"
                        label="Location"
                        @input="val => { editedItem.location = val.toUpperCase() }"
                        lazy-rules
                        :rules="[val => val !== null && val !== '' && val !== undefined || 'Input is required']"
                        >
                        <template v-slot:prepend>
                          <q-icon color="accent" name="place" />
                        </template>
                      </q-input>
                      <q-input
                        class="q-pa-xs"
                        outlined
                        dense
                        ref="phone"
                        clearable
                        color="accent"
                        v-model="editedItem.telephone"
                        label="Telephone"
                        mask="(###) ### - ####"
                        fill-mask
                        lazy-rules
                        :rules="[val => val !== null && val !== '' && val !== undefined || 'Input is required']"
                        >
                        <template v-slot:prepend>
                          <q-icon color="accent" name="phone" />
                        </template>
                      </q-input>
                    </q-card-section>

                    <q-card-actions class="justify-center">
                      <q-btn unelevated class="full-width q-pa-xs" @click="updateAccount" color="secondary" label="Edit User"/>
                    </q-card-actions>
                  </q-card>
                </q-dialog>

              </q-tab-panel>

              <q-tab-panel name="tab 4">

                <div style="width: 100%;">
                  <q-banner v-if="!worker.length" class="bg-grey-2 q-pa-md" style="min-width: 800px; height: 150px">
                    <template v-slot:avatar>
                      <q-icon name="sentiment_dissatisfied" color="accent" />
                    </template>
                  <span class="text-h6 text-grey text-weight-thin">No Records Found!</span>
                    <template v-slot:action>
                      <q-btn outline class="text-weight-light q-ma-sm" icon="person_add" color="secondary" label="Account" @click="add_dialog=true"/>
                    </template>
                  </q-banner>
                  <q-table
                    title="Workers"
                    :table-style="'counter-reset: cssRowCounter '"
                    :data="worker"
                    :columns="forCol"
                    row-key="name"
                    :filter="filter"
                    :separator="separator"
                    v-else
                    dense
                  >
                    <template v-slot:top-right>
                      <q-btn
                        class="text-weight-light q-ma-sm"
                        unelevated
                        no-caps
                        color="secondary"
                        icon="person_add"
                        label="Account"
                        @click="add_dialog=true"
                      />
                    </template>
                    <template v-slot:header="props">
                        <q-tr :props="props">
                          <q-th class="text-italic text-accent" auto-width>#</q-th>
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
                          <q-td
                            v-for="col in props.cols"
                            :key="col.name"
                            :props="props"
                          >
                            {{ col.value }}
                          </q-td>
                          <q-td>
                            <q-btn flat dense icon="edit" color="secondary" @click="toEdit(props.row)"/>
                            <q-btn flat dense icon="person_remove" color="accent" @click="delAccount(props.row.id)">
                              <q-space/>
                            </q-btn>
                        </q-td>
                      </q-tr>
                    </template>
                  </q-table>
                </div>

                <q-dialog v-model="add_dialog" persistent transition-show="rotate" transition-hide="rotate">
                  <q-card style="width: 400px">
                    <q-bar class="bg-secondary text-white" style="height: 50px">
                      <div class="q-pa-sm text-h6 text-weight-light">Add Account</div>
                      <q-space />
                      <q-btn unelevated flat class="q-pa-xs text-weight-light" @click="resetDef" label="Reset"/>
                      <q-btn icon="close" flat round dense v-close-popup />
                    </q-bar>
                    <q-card-section>
                      <q-select
                        class="q-pa-xs"
                        outlined
                        dense
                        color="accent"
                        ref="usertype"
                        v-model="defaultItem.usertype"
                        :options="usertypes"
                        label="Usertype"
                        use-chips
                        stack-label
                        emit-value
                        map-options
                        lazy-rules
                        :rules="[val => val !== null && val !== '' && val !== undefined || 'Selection is required']"
                        >
                        <template v-slot:prepend>
                          <q-icon color="accent" name="face" />
                        </template>
                      </q-select>
                      <q-select
                        class="q-pa-xs"
                        outlined
                        dense
                        color="accent"
                        ref="area"
                        v-model="defaultItem.area"
                        :options="areas"
                        label="Area"
                        use-chips
                        stack-label
                        lazy-rules
                        :rules="[val => val !== null && val !== '' && val !== undefined || 'Selection is required']"
                        >
                        <template v-slot:prepend>
                          <q-icon color="accent" name="category" />
                        </template>
                      </q-select>
                      <q-input
                        class="q-pa-xs"
                        outlined
                        dense
                        clearable
                        color="accent"
                        ref="email"
                        v-model="defaultItem.email"
                        label="Email"
                        @input="val => { defaultItem.email = val.toLowerCase() }"
                        lazy-rules
                        :rules="[val => val !== null && val !== '' && val !== undefined || 'Input is required']"
                        >
                        <template v-slot:prepend>
                          <q-icon color="accent" name="email" />
                        </template>
                      </q-input>
                      <!-- <q-input
                        @input="val => { defaultItem.photo = val[0] }"
                        class="q-pa-xs"
                        outlined
                        dense
                        color="accent"
                        type="file"
                        >
                        <template v-slot:prepend>
                          <q-icon color="accent" name="image" />
                        </template>
                      </q-input> -->
                      <q-input
                        class="q-pa-xs"
                        outlined
                        dense
                        ref="fullname"
                        clearable
                        color="accent"
                        v-model="defaultItem.fullname"
                        label="Full Name"
                        @input="val => { defaultItem.fullname = val.toUpperCase() }"
                        lazy-rules
                        :rules="[val => val !== null && val !== '' && val !== undefined || 'Input is required']"
                        >
                        <template v-slot:prepend>
                          <q-icon color="accent" name="person_pin" />
                        </template>
                      </q-input>
                      <q-input
                        outlined
                        dense
                        class="q-pa-xs"
                        clearable
                        ref="unit"
                        color="accent"
                        v-model="defaultItem.unit"
                        label="Unit"
                        @input="val => { defaultItem.unit = val.toUpperCase() }"
                         lazy-rules
                        :rules="[val => val !== null && val !== '' && val !== undefined || 'Input is required']"
                        >
                        <template v-slot:prepend>
                          <q-icon color="accent" name="local_library" />
                        </template>
                      </q-input>
                      <q-input
                        outlined
                        class="q-pa-xs"
                        dense
                        clearable
                        ref="position"
                        color="accent"
                        v-model="defaultItem.position"
                        label="Position"
                        @input="val => { defaultItem.position = val.toUpperCase() }"
                        lazy-rules
                        :rules="[val => val !== null && val !== '' && val !== undefined || 'Input is required']"
                        >
                        <template v-slot:prepend>
                          <q-icon color="accent" name="work" />
                        </template>
                      </q-input>
                      <q-input
                        class="q-pa-xs"
                        outlined
                        dense
                        clearable
                        ref="location"
                        color="accent"
                        v-model="defaultItem.location"
                        label="Location"
                        @input="val => { defaultItem.location = val.toUpperCase() }"
                        lazy-rules
                        :rules="[val => val !== null && val !== '' && val !== undefined || 'Input is required']"
                        >
                        <template v-slot:prepend>
                          <q-icon color="accent" name="place" />
                        </template>
                      </q-input>
                      <q-input
                        class="q-pa-xs"
                        outlined
                        dense
                        ref="phone"
                        clearable
                        color="accent"
                        v-model="defaultItem.telephone"
                        label="Telephone"
                        mask="(###) ### - ####"
                        fill-mask
                        lazy-rules
                        :rules="[val => val !== null && val !== '' && val !== undefined || 'Input is required']"
                        >
                        <template v-slot:prepend>
                          <q-icon color="accent" name="phone" />
                        </template>
                      </q-input>
                    </q-card-section>

                    <q-card-actions class="justify-center">
                      <q-btn unelevated class="full-width q-pa-xs" @click="addAccount" color="secondary" label="Add User"/>
                    </q-card-actions>
                  </q-card>
                </q-dialog>

                <q-dialog v-model="edit_dialog" persistent transition-show="rotate" transition-hide="rotate">
                  <q-card style="width: 400px">
                    <q-bar class="bg-secondary text-white" style="height: 50px">
                      <div class="q-pa-sm text-h6 text-weight-light">Edit Account</div>
                      <q-space />
                      <q-btn unelevated flat class="q-pa-xs text-weight-light" @click="resetEdit" label="Reset"/>
                      <q-btn icon="close" flat round dense v-close-popup />
                    </q-bar>
                    <q-card-section>
                      <q-select
                        class="q-pa-xs"
                        outlined
                        dense
                        color="accent"
                        ref="usertype"
                        v-model="editedItem.usertype"
                        :options="usertypes"
                        label="Usertype"
                        use-chips
                        stack-label
                        emit-value
                        map-options
                        lazy-rules
                        :rules="[val => val !== null && val !== '' && val !== undefined || 'Selection is required']"
                        >
                        <template v-slot:prepend>
                          <q-icon color="accent" name="face" />
                        </template>
                      </q-select>
                      <q-select
                        class="q-pa-xs"
                        outlined
                        dense
                        color="accent"
                        ref="area"
                        v-model="editedItem.area"
                        :options="areas"
                        label="Area"
                        use-chips
                        stack-label
                        lazy-rules
                        :rules="[val => val !== null && val !== '' && val !== undefined || 'Selection is required']"
                        >
                        <template v-slot:prepend>
                          <q-icon color="accent" name="category" />
                        </template>
                      </q-select>
<!--                       <q-input
                        class="q-pa-xs"
                        outlined
                        dense
                        clearable
                        color="accent"
                        ref="email"
                        v-model="editedItem.email"
                        label="Email"
                        readonly
                        >
                        <template v-slot:prepend>
                          <q-icon color="accent" name="email" />
                        </template>
                      </q-input> -->
                      <!-- <q-input
                        @input="val => { editedItem.photo = val[0] }"
                        class="q-pa-xs"
                        outlined
                        dense
                        color="accent"
                        type="file"
                        >
                        <template v-slot:prepend>
                          <q-icon color="accent" name="image" />
                        </template>
                      </q-input> -->
                      <q-input
                        class="q-pa-xs"
                        outlined
                        dense
                        ref="fullname"
                        clearable
                        color="accent"
                        v-model="editedItem.fullname"
                        label="Full Name"
                        @input="val => { editedItem.fullname = val.toUpperCase() }"
                        lazy-rules
                        :rules="[val => val !== null && val !== '' && val !== undefined || 'Input is required']"
                        >
                        <template v-slot:prepend>
                          <q-icon color="accent" name="person_pin" />
                        </template>
                      </q-input>
                      <q-input
                        outlined
                        dense
                        class="q-pa-xs"
                        clearable
                        ref="unit"
                        color="accent"
                        v-model="editedItem.unit"
                        label="Unit"
                        @input="val => { editedItem.unit = val.toUpperCase() }"
                         lazy-rules
                        :rules="[val => val !== null && val !== '' && val !== undefined || 'Input is required']"
                        >
                        <template v-slot:prepend>
                          <q-icon color="accent" name="local_library" />
                        </template>
                      </q-input>
                      <q-input
                        outlined
                        class="q-pa-xs"
                        dense
                        clearable
                        ref="position"
                        color="accent"
                        v-model="editedItem.position"
                        label="Position"
                        @input="val => { editedItem.position = val.toUpperCase() }"
                        lazy-rules
                        :rules="[val => val !== null && val !== '' && val !== undefined || 'Input is required']"
                        >
                        <template v-slot:prepend>
                          <q-icon color="accent" name="work" />
                        </template>
                      </q-input>
                      <q-input
                        class="q-pa-xs"
                        outlined
                        dense
                        clearable
                        ref="location"
                        color="accent"
                        v-model="editedItem.location"
                        label="Location"
                        @input="val => { editedItem.location = val.toUpperCase() }"
                        lazy-rules
                        :rules="[val => val !== null && val !== '' && val !== undefined || 'Input is required']"
                        >
                        <template v-slot:prepend>
                          <q-icon color="accent" name="place" />
                        </template>
                      </q-input>
                      <q-input
                        class="q-pa-xs"
                        outlined
                        dense
                        ref="phone"
                        clearable
                        color="accent"
                        v-model="editedItem.telephone"
                        label="Telephone"
                        mask="(###) ### - ####"
                        fill-mask
                        lazy-rules
                        :rules="[val => val !== null && val !== '' && val !== undefined || 'Input is required']"
                        >
                        <template v-slot:prepend>
                          <q-icon color="accent" name="phone" />
                        </template>
                      </q-input>
                    </q-card-section>

                    <q-card-actions class="justify-center">
                      <q-btn unelevated class="full-width q-pa-xs" @click="updateAccount" color="secondary" label="Edit User"/>
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
import firebase from 'firebase'
import { db } from 'boot/firebase'
import { Loading, date } from 'quasar'

export default {

  data () {
    return {
      separator: 'cell',
      tab: 'tab 1',
      dense: false,
      editedIndex: -1,
      edit_dialog: false,
      add_dialog: false,
      filter: '',
      editedItem: {
        usertype: null,
        photo: null,
        fullname: '',
        telephone: '',
        email: '',
        position: '',
        unit: '',
        area: null
      },
      defaultItem: {
        usertype: null,
        photo: null,
        fullname: '',
        telephone: '',
        email: '',
        password: 'default123',
        position: '',
        unit: '',
        remarks: 'None',
        area: null
      },
      users: [],
      cdmo: [],
      foreman: [],
      worker: [],
      usertypes: [
        { label: 'Unit Requestor', value: 'requestor' },
        { label: 'Unit Head', value: 'unit_head' },
        { label: 'CDMO Head', value: 'cdmo_head' },
        { label: 'Foreman', value: 'foreman' },
        { label: 'Inventory Staff', value: 'inventory' },
        { label: 'Worker', value: 'worker' }
      ],
      areas: [ 'Electricity', 'Grounds', 'Plumbing', 'Transportation' ],
      columns: [
        { name: 'usertype', label: 'Usertype', field: 'usertype', align: 'left', sortable: true },
        { name: 'name', label: 'Full Name', field: 'fullname', align: 'left', sortable: true },
        { name: 'email', label: 'Email', field: 'email', align: 'left', sortable: true },
        { name: 'unit', label: 'Unit', field: 'unit', align: 'left', sortable: true },
        { name: 'position', label: 'Position', field: 'position', align: 'left', sortable: true },
        { name: 'telephone', label: 'Telephone', field: 'telephone', align: 'left', sortable: true },
        { name: 'location', label: 'Location', field: 'location', align: 'left', sortable: true }
      ],
      forCol: [
        { name: 'usertype', label: 'Usertype', field: 'usertype', align: 'left', sortable: true },
        { name: 'name', label: 'Full Name', field: 'fullname', align: 'left', sortable: true },
        { name: 'email', label: 'Email', field: 'email', align: 'left', sortable: true },
        { name: 'area', label: 'Area', field: 'area', align: 'left', sortable: true },
        { name: 'unit', label: 'Unit', field: 'unit', align: 'left', sortable: true },
        { name: 'position', label: 'Position', field: 'position', align: 'left', sortable: true },
        { name: 'telephone', label: 'Telephone', field: 'telephone', align: 'left', sortable: true },
        { name: 'location', label: 'Location', field: 'location', align: 'left', sortable: true }
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
            area: doc.data().area
          }
          if (userData.usertype === 'requestor' || userData.usertype === 'unit_head') {
            this.users.push(userData)
          }
          if (userData.usertype === 'cdmo_head' || userData.usertype === 'inventory') {
            this.cdmo.push(userData)
          }
          if (userData.usertype === 'foreman') {
            this.foreman.push(userData)
          }
          if (userData.usertype === 'worker') {
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
    resetDef () {
      this.defaultItem = {}

      this.$refs.usertype.resetValidation()
      this.$refs.fullname.resetValidation()
      this.$refs.email.resetValidation()
      this.$refs.position.resetValidation()
      this.$refs.unit.resetValidation()
      this.$refs.location.resetValidation()
      this.$refs.phone.resetValidation()
      this.$refs.area.resetValidation()
    },
    resetEdit () {
      this.editedItem = {}

      this.$refs.usertype.resetValidation()
      this.$refs.fullname.resetValidation()
      this.$refs.email.resetValidation()
      this.$refs.position.resetValidation()
      this.$refs.unit.resetValidation()
      this.$refs.location.resetValidation()
      this.$refs.phone.resetValidation()
      this.$refs.area.resetValidation()
    },
    async addAccount () {
      try {
        const createUser = firebase.functions().httpsCallable('onCreate')

        if (this.defaultItem.usertype === '' || this.defaultItem.fullname === '' || this.defaultItem.email === '' || this.defaultItem.telephone === '' || this.defaultItem.location === '' || this.defaultItem.position === '' || this.defaultItem.unit === '' || this.defaultItem.usertype === null || this.defaultItem.fullname === null || this.defaultItem.email === null || this.defaultItem.telephone === null || this.defaultItem.location === null || this.defaultItem.position === null || this.defaultItem.unit === null || this.defaultItem.usertype === undefined || this.defaultItem.fullname === undefined || this.defaultItem.email === undefined || this.defaultItem.telephone === undefined || this.defaultItem.location === undefined || this.defaultItem.position === undefined || this.defaultItem.unit === undefined) {
          this.$refs.usertype.validate()
          this.$refs.fullname.validate()
          this.$refs.email.validate()
          this.$refs.position.validate()
          this.$refs.unit.validate()
          this.$refs.location.validate()
          this.$refs.phone.validate()
          this.$refs.area.validate()
        } else {
          Loading.show()
          await createUser(this.defaultItem)

          location.reload()
          Loading.hide()
          this.$q.notify({
            color: 'secondary',
            message: 'Account added'
          })
          this.add_dialog = false
        }
      } catch (error) {
        Loading.hide()
        this.$q.notify('Adding ' + error)
      }
    },
    toEdit (item, userId) {
      this.edit_dialog = true
      this.editedItem = Object.assign({}, item)
      this.activeAccount = this.editedItem.userId
    },
    async updateAccount () {
      Loading.show()

      const updateUser = firebase.functions().httpsCallable('onUpdate')

      try {
        await updateUser({
          userId: this.editedItem.userId,
          usertype: this.editedItem.usertype,
          fullname: this.editedItem.fullname,
          telephone: this.editedItem.telephone,
          position: this.editedItem.position,
          unit: this.editedItem.unit,
          area: this.editedItem.area
        })

        location.reload()
        Loading.hide()
        this.$q.notify({
          color: 'secondary',
          message: 'Account updated'
        })
        this.edit_dialog = false
      } catch (error) {
        Loading.hide()
        this.$q.notify('Updating ' + error)
      }
    },
    delAccount (ref) {
      const deleteUser = firebase.functions().httpsCallable('onDelete')

      this.$q.dialog({
        title: 'Remove Confirm',
        message: 'The user will be deleted from the database. Are you sure you want to continue?',
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
        Loading.show()
        try {
          await deleteUser(ref)
          location.reload()
          Loading.hide()
          this.$q.notify({
            color: 'accent',
            message: 'Account deleted'
          })
        } catch (error) {
          Loading.hide()
          this.$q.notify('Deleting ' + error)
        }
      }
      )
    }
  }
}
</script>

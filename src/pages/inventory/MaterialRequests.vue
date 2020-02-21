<template>
  <q-layout view="hHh lpR fFf">
    <q-page-container>
        <q-page class="flex flex-center text-center">
          <div class="q-gutter-sm flex text-center">
            <div style="width: 100%; height: 50%;">
              <h2> Materials Requests </h2>
              <q-input borderless dense debounce="300" v-model="filter" placeholder="Search">
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>
              <q-table
              class="my-sticky-column-table"
              :data="data"
              :columns="columns"
              hide-bottom
              row-key="id"
              :filter="filter"
              selection="multiple"
              :selected.sync="selected"
            />
            <!-- <q-btn push rounded no-caps @click="login" class="q-mr-sm" label="Accept" color="secondary"/>
            <q-btn push rounded no-caps @click="login" class="q-mr-sm" label="Decline" color="secondary"/> -->
            <br/>
              <div class="q-gutter-sm flex text-left">
              <q-btn push rounded no-caps class="q-mr-sm" label="Accept" color="secondary"/>
              <q-btn push rounded no-caps class="q-mr-sm" label="Decline" color="secondary"/>
              </div>
            </div>
          </div>
        </q-page>
        <router-view/>
    </q-page-container>
  </q-layout>
</template>

<style lang="sass">

  td:first-child
    background-color: #e8a87c

  th:first-child,
  td:first-child
    position: sticky
    left: 0
    z-index: 1
</style>

<script>
export default {
  data () {
    return {
      selected: [],
      filter: '',
      columns: [
        {
          id: 'Job Order Number',
          required: true,
          label: 'Job Order Number',
          align: 'left',
          field: row => row.id,
          format: val => `${val}`,
          sortable: true
        },
        {
          name: 'requestor',
          align: 'center',
          label: 'Requestor',
          field: 'requestor',
          sortable: true
        },
        {
          name: 'date',
          align: 'center',
          label: 'Date Filed',
          field: 'date',
          sortable: true
        },
        {
          name: 'requested',
          align: 'center',
          label: 'Requested Materials',
          field: 'requested',
          sortable: true
        },
        {
          name: 'quantity',
          align: 'center',
          label: 'Quantity Requested',
          field: 'quantity',
          sortable: true
        },
        {
          name: 'stocks',
          align: 'center',
          label: 'Stocks',
          field: 'stocks',
          sortable: true
        }
      ],
      data: [
        {
          id: 1,
          requestor: 'Construction',
          date: '2018/12/01',
          requested: 'Nails',
          quantity: '1',
          stocks: '5'
        },
        {
          id: 2,
          requestor: 'Grounds',
          date: '2018/12/01',
          requested: 'Nails',
          quantity: '5',
          stocks: '20'
        }
      ]
    }
  }
}
</script>

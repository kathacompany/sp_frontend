const routes = [
  {
    path: '/',
    component: () => import('layouts/LoginLayout.vue'),
    children: [
      // { path: '', component: () => import('pages/LoginAs.vue') },
      // { path: 'AdministrativeLogin', component: () => import('pages/administrative/Login.vue') },
      // { path: 'InventoryLogin', component: () => import('pages/inventory/Login.vue') },
      // { path: 'ForemenLogin', component: () => import('pages/foremen/Login.vue') },
      // { path: 'WorkerLogin', component: () => import('pages/worker/Login.vue') },
      // { path: 'UserLogin', component: () => import('pages/user/Login.vue') },
      // { path: 'HeadLogin', component: () => import('pages/head/Login.vue') }
      { path: '', component: () => import('pages/LoginAs.vue') }
    ],
    meta: { requiresGuest: true }
  },
  {
    path: '/',
    component: () => import('layouts/AdministrativeLayout.vue'),
    children: [
      { path: 'AdministrativeHomepage', component: () => import('pages/administrative/Homepage.vue') },
      { path: 'AdministrativeAccount', component: () => import('pages/administrative/Account.vue') },
      { path: 'AdministrativeJobOrders', component: () => import('pages/administrative/JobOrders.vue') },
      { path: 'AdministrativeAnnouncements', component: () => import('pages/administrative/Announcements.vue') }
    ]
    // meta: { requiresAuth: true }
  },
  {
    path: '/',
    component: () => import('layouts/InventoryLayout.vue'),
    children: [
      { path: 'InventoryHomepage', component: () => import('pages/inventory/Homepage.vue') },
      { path: 'InventoryAccount', component: () => import('pages/inventory/Account.vue') },
      { path: 'Inventory', component: () => import('pages/inventory/Inventory.vue') },
      { path: 'MaterialRequests', component: () => import('pages/inventory/MaterialRequests.vue') }
    ],
    meta: { requiresAuth: true }
  },
  {
    path: '/',
    component: () => import('layouts/ForemanLayout.vue'),
    children: [
      { path: 'ForemanHomepage', component: () => import('pages/foreman/Homepage.vue') },
      { path: 'ForemanAccount', component: () => import('pages/Foreman/Account.vue') },
      { path: 'ForemanJobOrders', component: () => import('pages/Foreman/JobOrders.vue') },
      { path: 'ForemanScheduleJobs', component: () => import('pages/Foreman/ScheduleJobs.vue') },
      { path: 'ForemanEmployeeList', component: () => import('pages/Foreman/EmployeeList.vue') }
    ],
    meta: { requiresAuth: true }
  },
  {
    path: '/',
    component: () => import('layouts/WorkerLayout.vue'),
    children: [
      { path: 'WorkerHomepage', component: () => import('pages/worker/Homepage.vue') },
      { path: 'WorkerAccount', component: () => import('pages/worker/Account.vue') },
      { path: 'WorkerScheduleJobs', component: () => import('pages/worker/ScheduleJobs.vue') }
    ],
    meta: { requiresAuth: true }
  },
  {
    path: '/',
    component: () => import('layouts/UserLayout.vue'),
    children: [
      { path: 'UserHomepage', component: () => import('pages/user/Homepage.vue') },
      { path: 'UserAccount', component: () => import('pages/user/Account.vue') },
      { path: 'UserJobOrders', component: () => import('pages/user/JobOrders.vue') },
      { path: 'UserFileJobOrder', component: () => import('pages/user/FileJobOrder.vue') }
    ],
    meta: { requiresAuth: true }
  },
  {
    path: '/',
    component: () => import('layouts/HeadLayout.vue'),
    children: [
      { path: 'HeadHomepage', component: () => import('pages/head/Homepage.vue') },
      { path: 'HeadAccount', component: () => import('pages/head/Account.vue') },
      { path: 'HeadJobOrders', component: () => import('pages/head/JobOrders.vue') }
    ],
    meta: { requiresAuth: true }
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes


const routes = [
  {
    path: '/',
    component: () => import('layouts/LoginLayout.vue'),
    children: [
      { path: '', component: () => import('pages/LoginAs.vue') },
      { path: 'AdministrativeLogin', component: () => import('pages/administrative/Login.vue') },
      { path: 'InventoryLogin', component: () => import('pages/inventory/Login.vue') },
      { path: 'ForemenLogin', component: () => import('pages/foremen/Login.vue') },
      { path: 'WorkerLogin', component: () => import('pages/worker/Login.vue') },
      { path: 'UserLogin', component: () => import('pages/user/Login.vue') }
    ]
  },
  {
    path: '/',
    component: () => import('layouts/AdministrativeLayout.vue'),
    children: [
      { path: 'AdministrativeHomepage', component: () => import('pages/administrative/Homepage.vue') },
      { path: 'AdministrativeAccount', component: () => import('pages/administrative/Account.vue') },
      { path: 'AdministrativeJobOrders', component: () => import('pages/administrative/JobOrders.vue') },
      { path: 'AdministrativeEmployees', component: () => import('pages/administrative/EmployeeList.vue') },
      { path: 'AdministrativeAnnouncements', component: () => import('pages/administrative/Announcements.vue') }
    ]
  },
  {
    path: '/',
    component: () => import('layouts/InventoryLayout.vue'),
    children: [
      { path: 'InventoryHomepage', component: () => import('pages/inventory/Homepage.vue') },
      { path: 'InventoryAccount', component: () => import('pages/inventory/Account.vue') },
      { path: 'Inventory', component: () => import('pages/inventory/Inventory.vue') },
      { path: 'InventoryEmployeeList', component: () => import('pages/inventory/EmployeeList.vue') }
    ]
  },
  {
    path: '/',
    component: () => import('layouts/ForemenLayout.vue'),
    children: [
      { path: 'ForemenHomepage', component: () => import('pages/foremen/Homepage.vue') },
      { path: 'ForemenAccount', component: () => import('pages/foremen/Account.vue') },
      { path: 'ForemenJobOrders', component: () => import('pages/foremen/JobOrders.vue') },
      { path: 'ForemenScheduleJobs', component: () => import('pages/foremen/ScheduleJobs.vue') },
      { path: 'ForemenEmployeeList', component: () => import('pages/foremen/EmployeeList.vue') }
    ]
  },
  {
    path: '/',
    component: () => import('layouts/WorkerLayout.vue'),
    children: [
      { path: 'WorkerHomepage', component: () => import('pages/worker/Homepage.vue') },
      { path: 'WorkerAccount', component: () => import('pages/worker/Account.vue') },
      { path: 'WorkerScheduleJobs', component: () => import('pages/worker/ScheduleJobs.vue') }
    ]
  },
  {
    path: '/',
    component: () => import('layouts/UserLayout.vue'),
    children: [

      { path: 'UserHomepage', component: () => import('pages/user/Homepage.vue') },
      { path: 'UserAccount', component: () => import('pages/user/Account.vue') },
      { path: 'UserJobOrders', component: () => import('pages/user/JobOrders.vue') },
      { path: 'UserFileJobOrder', component: () => import('pages/user/FileJobOrder.vue') }
    ]
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

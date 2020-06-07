import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './routes'
// import * as firebase from 'firebase/app'
// import { firebaseAuth } from 'boot/firebase'

Vue.use(VueRouter)

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation
 */

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}
// const router = new VueRouter({ })
// router.beforeEach((to, from, next) => {
//   if (to.matched.some(routes => routes.meta.requiresGuest)) {
//     if (!firebaseAuth().currentUser) {
//       next(false)
//     } else {
//       next()
//     }
//   } else if (to.matched.some(routes => routes.meta.requiresAuth)) {
//     if (firebaseAuth().currentUser) {
//       next()
//     } else {
//       next()
//     }
//   } else {
//     next()
//   }
// })
// const router = new VueRouter({ })
// router.beforeEach((to, from, next) => {
//   if (to.matched.some(routes => routes.meta.requiresAuth)) {
//     // this route requires auth, check if logged in
//     // if not, redirect to login page
//     if (!firebaseAuth().user && to.path !== '/') {
//       next(false)
//     } else {
//       next('/')
//     }
//   } else {
//     next() // make sure to always call next()!
//   }
// })

export default function (/* { store, ssrContext } */) {
  const Router = new VueRouter({
    scrollBehavior: () => ({ x: 0, y: 0 }),
    routes,

    // Leave these as is and change from quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    mode: process.env.VUE_ROUTER_MODE,
    base: process.env.VUE_ROUTER_BASE
  })

  return Router
}

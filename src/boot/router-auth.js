import { LocalStorage } from 'quasar'
import { firebaseAuth } from 'boot/firebase'

export default ({ router }) => {
  router.beforeEach((to, from, next) => {
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
    const isAuthenticated = firebaseAuth.currentUser
    const user = JSON.parse(LocalStorage.getItem('user'))
    if (requiresAuth && !user && !isAuthenticated) {
      next('')
    } else if (!requiresAuth && user && isAuthenticated) {
      next(false)
    } else {
      next()
    }
  })
}

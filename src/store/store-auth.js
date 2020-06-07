import { LocalStorage } from 'quasar'
import { firebaseAuth } from 'boot/firebase'

const state = {
  loggedIn: false
}

const mutations = {
  setLoggedIn (state, value) {
    this.loggedIn = value
  }
}

const actions = {
  loginUser (context, payload) {
    firebaseAuth.signInWithEmailAndPassword(payload.email, payload.password)
      .then(response => {
        console.log('response: ', response)
      })
      .catch(err => {
        console.log('error message:', err.message)
      })
  },
  logoutUser () {
    console.log('logoutUser')
    firebaseAuth.signOut()
  },
  async handleAuthStateChange ({ commit }) {
    firebaseAuth.onAuthStateChanged(user => {
      if (user) {
        commit('setLoggedIn', true)
        LocalStorage.set('loggedIn', true)
        this.$router.push().catch(err => {
          console.log('error.message:', err)
        })
      } else {
        commit('setLoggedIn', false)
        LocalStorage.set('loggedIn', false)
        this.$router.replace('/').catch(err => {
          // console.log('error message:', err)
          if (err.name !== 'NavigationDuplicated') {
            throw err
          }
        })
      }
    })
  }
}

const getters = {

}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}

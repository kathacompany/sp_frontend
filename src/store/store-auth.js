import { LocalStorage } from 'quasar'
import { firebaseAuth } from 'boot/firebase'

const state = {
  loggedIn: null
}

const mutations = {
  setLoggedIn (state, value) {
    this.loggedIn = value
    this.value = state
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
  handleAuthStateChange ({ commit }) {
    firebaseAuth.onAuthStateChanged(user => {
      if (user) {
        commit('setLoggedIn', true)
        LocalStorage.set('loggedIn', true)
        // LocalStorage.set('user', firebaseAuth.currentUser)
        LocalStorage.set('user', JSON.stringify(user))
        this.$router.push('/').catch(err => {
          console.log('error.message:', err)
        })
      } else {
        commit('setLoggedIn', false)
        LocalStorage.set('loggedIn', false)
        LocalStorage.remove('user')
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
  user (state) {
    return state.user
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}

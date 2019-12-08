// import { LocalStorage, Loading } from 'quasar'
import { firebaseAuth } from 'boot/firebase'
import { showErrorMessage } from 'src/functions/function-show-error-message'

const state = {

}

const mutations = {

}

const actions = {
  loginUser (payload) {
    firebaseAuth.signInWithEmailAndPassword(payload.email, payload.password)
      .then(response => {
        console.log('response: ', response)
      })
      .catch(error => {
        showErrorMessage(error.message)
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

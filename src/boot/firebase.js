import * as firebase from 'firebase/app'

<<<<<<< HEAD
=======
// If you enabled Analytics in your project, add the Firebase SDK for Analytics
import 'firebase/analytics'

// Add the Firebase products that you want to use
>>>>>>> fb9dc9c4679c70435ddc3779583988adcf9c090e
import 'firebase/auth'

var firebaseConfig = {
  apiKey: 'AIzaSyA34MAQpn8VN1VvswT357d9pFI3MfPx-hA',
  authDomain: 'jopsis-cfca3.firebaseapp.com',
  databaseURL: 'https://jopsis-cfca3.firebaseio.com',
  projectId: 'jopsis-cfca3',
  storageBucket: 'jopsis-cfca3.appspot.com',
  messagingSenderId: '820579840616',
  appId: '1:820579840616:web:df6a8ee0713b125c6201dd',
  measurementId: 'G-JP3KQ1NCBE'
}

let firebaseApp = firebase.initializeApp(firebaseConfig)
let firebaseAuth = firebaseApp.auth()
<<<<<<< HEAD
=======
firebase.analytics()
>>>>>>> fb9dc9c4679c70435ddc3779583988adcf9c090e

export { firebaseAuth }

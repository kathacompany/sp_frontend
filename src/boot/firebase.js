import * as firebase from 'firebase/app'

// If you enabled Analytics in your project, add the Firebase SDK for Analytics
// Add the Firebase products that you want to use
import 'firebase/auth'
import 'firebase/database'
import 'firebase/firestore'

var firebaseConfig = {
  apiKey: 'AIzaSyAZZ_AyD6lK5rpEQuVSnF31vHSp9d2AxQg',
  authDomain: 'jopsis-941ba.firebaseapp.com',
  databaseURL: 'https://jopsis-941ba.firebaseio.com',
  projectId: 'jopsis-941ba',
  storageBucket: 'jopsis-941ba.appspot.com',
  messagingSenderId: '865053307385',
  appId: '1:865053307385:web:2a652b1565f16ced3d4d28',
  measurementId: 'G-QSLLBX8XPQ'
}

let firebaseApp = firebase.initializeApp(firebaseConfig)
let firebaseAuth = firebaseApp.auth()
let firebaseDb = firebaseApp.database()
let db = firebase.firestore()
// let materialsRef = firebaseApp.database.ref('materials')

export { firebaseAuth, firebaseDb, db }
// export { materialsRef }

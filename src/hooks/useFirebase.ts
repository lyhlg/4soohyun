import firebaseOriginal from 'firebase'
import { useEffect, useState } from 'react'

// If you enabled Analytics in your project, add the Firebase SDK for Analytics
import 'firebase/analytics'

// Add the Firebase products that you want to use
import 'firebase/auth'
import 'firebase/firestore'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const useFirebase = (): any => {
  console.log(process.env.DB_HOST)
  const firebaseConfig = {
    apiKey: 'AIzaSyCh7Neo54qyJjAAQ983emka4dk-1VKuICM',
    authDomain: 'soohyun-20368.firebaseapp.com',
    databaseURL: 'https://soohyun-20368-default-rtdb.firebaseio.com',
    projectId: 'soohyun-20368',
    storageBucket: 'soohyun-20368.appspot.com',
    messagingSenderId: '747254146273',
    appId: '1:747254146273:web:22961c6e2d5bff17e3c3a0',
    measurementId: 'G-0J7VCL91RR',
  }
  const [firebase, setFirebase] = useState({})
  useEffect(() => {
    // TODO: Replace the following with your app's Firebase project configuration
    // For Firebase JavaScript SDK v7.20.0 and later, `measurementId` is an optional field

    // Initialize Firebase
    firebaseOriginal.initializeApp(firebaseConfig)
    setFirebase(firebaseOriginal)
    // const database = firebase.database()
    // console.log(database)
  }, [])

  return { firebase }
}

export default useFirebase

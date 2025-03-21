// plugins/firebase.client.js

import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC6LMWCO8sAKLt1IGomlkHa486xC3WwbVk",
    authDomain: "easyspot-21f28.firebaseapp.com",
    projectId: "easyspot-21f28",
    storageBucket: "easyspot-21f28.firebasestorage.app",
    messagingSenderId: "740906932740",
    appId: "1:740906932740:web:7f7ca6d9848c730ee63351"
  };

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)

export default defineNuxtPlugin(() => {
  return {
    provide: {
      auth
    }
  }
})

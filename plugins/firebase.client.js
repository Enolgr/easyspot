// plugins/firebase.client.js

import { initializeApp } from 'firebase/app'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { useUserStore } from '@/stores/user'

const firebaseConfig = {
  apiKey: "AIzaSyC6LMWCO8sAKLt1IGomlkHa486xC3WwbVk",
  authDomain: "easyspot-21f28.firebaseapp.com",
  projectId: "easyspot-21f28",
  storageBucket: "easyspot-21f28.firebasestorage.app",
  messagingSenderId: "740906932740",
  appId: "1:740906932740:web:7f7ca6d9848c730ee63351"
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)

export default defineNuxtPlugin(() => {
  if (process.client) {
    const userStore = useUserStore()

    onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const { email, uid, displayName, photoURL } = firebaseUser

        // Sincronizar con base de datos
        try {
          await $fetch('/api/auth/sync-user', {
            method: 'POST',
            body: { email, uid, displayName }
          })
        } catch (err) {
          console.error('Error sincronizando con la base de datos:', err)
        }

        userStore.setUser({ uid, email, displayName, photoURL })
      } else {
        userStore.clearUser()
      }
    })
  }

  return {
    provide: {
      auth
    }
  }
})

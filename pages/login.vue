<script setup>
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { useUserStore } from '@/stores/user'

const email = ref('')
const password = ref('')

const userStore = useUserStore()
const { $auth } = useNuxtApp()
const router = useRouter()

const loginUser = async () => {
  try {
    const result = await signInWithEmailAndPassword($auth, email.value, password.value)
    
    // Actualiza la tienda de usuario con los datos obtenidos
    userStore.setUser({
      uid: result.user.uid,
      email: result.user.email,
      displayName: result.user.displayName,
      photoURL: result.user.photoURL
    })
    
    router.push('/')
  } catch (error) {
    console.error('Error al iniciar sesión:', error.message)
    alert(error.message)
  }
}

const googleSignIn = async () => {
  try {
    const provider = new GoogleAuthProvider()
    const result = await signInWithPopup($auth, provider)
    
    userStore.setUser({
      uid: result.user.uid,
      email: result.user.email,
      displayName: result.user.displayName,
      photoURL: result.user.photoURL
    })
    
    router.push('/')
  } catch (error) {
    console.error('Error al iniciar sesión con Google:', error.message)
    alert(error.message)
  }
}
</script>

<template>
  <main class="w-full h-screen flex flex-col items-center justify-center sm:px-4">
    <div class="w-full space-y-6 text-slate-600 sm:max-w-md">
      <div class="text-center">
        <h1 class="text-4xl font-bold text-slate-900">EasySpot</h1>
        <div class="mt-5 space-y-2">
          <p>
            ¿No tienes una cuenta?
            <RouterLink to="/register" class="font-medium text-slate-700 hover:text-slate-900 cursor-pointer">
              Regístrate
            </RouterLink>
          </p>
        </div>
      </div>
      
      <div class="bg-slate-100 shadow p-4 py-6 space-y-8 sm:p-6 sm:rounded-lg w-full">
        <div class="grid grid-cols-3 gap-x-3 w-full">
          <button
            @click="googleSignIn"
            class="col-span-3 w-full flex items-center justify-center py-2.5 border border-slate-300 rounded-lg hover:bg-slate-50 duration-150 active:bg-slate-100">
            <img src="https://raw.githubusercontent.com/sidiDev/remote-assets/7cd06bf1d8859c578c2efbfda2c68bd6bedc66d8/google-icon.svg"
                 alt="Google" class="w-5 h-5" />
          </button>
        </div>

        <div class="relative">
          <span class="block w-full h-px bg-slate-300"></span>
          <p class="inline-block w-fit text-sm bg-slate-100 px-2 absolute -top-2 inset-x-0 mx-auto">
            O continua con
          </p>
        </div>
        
        <!-- FORMULARIO DE LOGIN -->
        <form @submit.prevent="loginUser" class="space-y-5">
          <div>
            <label class="font-medium">Email</label>
            <input v-model="email" type="email" required
                   class="w-full mt-2 px-3 py-2 text-slate-500 bg-transparent outline-none border border-slate-300 focus:border-slate-600 shadow-sm rounded-lg" />
          </div>
          <div>
            <label class="font-medium">Contraseña</label>
            <input v-model="password" type="password" required
                   class="w-full mt-2 px-3 py-2 text-slate-500 bg-transparent outline-none border border-slate-300 focus:border-slate-600 shadow-sm rounded-lg" />
          </div>
          <button type="submit"
                  class="w-full px-4 py-2 text-white font-medium bg-slate-700 hover:bg-[#60769D] active:bg-slate-800 rounded-lg duration-150">
            Sign in
          </button>
        </form>
      </div>
      <div class="text-center">
        <a href="javascript:void(0)" class="hover:text-slate-700">¿Has olvidado la contraseña?</a>
      </div>
    </div>
  </main>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import { ref } from 'vue'
import { useUserStore } from '@/stores/user'
import { createUserWithEmailAndPassword, updateProfile, signInWithPopup, GoogleAuthProvider } from 'firebase/auth'

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')

const userStore = useUserStore()
const { $auth } = useNuxtApp()

const registerUser = async () => {
  if (password.value !== confirmPassword.value) {
    alert('Las contraseñas no coinciden')
    return
  }

  try {
    const result = await createUserWithEmailAndPassword($auth, email.value, password.value)

    await updateProfile(result.user, {
      displayName: name.value
    })

    userStore.setUser({
      uid: result.user.uid,
      email: result.user.email,
      displayName: name.value,
      photoURL: result.user.photoURL
    })

    navigateTo('/')
  } catch (error) {
    console.error('Error al registrar:', error.message)
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
    
    navigateTo('/')
  } catch (error) {
    console.error('Error al iniciar sesión con Google:', error.message)
    alert(error.message)
  }
}
</script>

<template>
  <div class="w-full min-h-screen flex flex-col items-center justify-center mt-5 mb-5 py-8 sm:px-4">
    <div class="w-full space-y-6 text-slate-600 sm:max-w-md">
      <div class="text-center">
        <h1 class="text-4xl font-bold text-slate-900">EasySpot</h1>
        <div class="mt-5 space-y-2">
          <p>
            ¿Ya tienes una cuenta?
            <RouterLink to="/login" class="font-medium text-slate-700 hover:text-slate-900 cursor-pointer">
              Inicia sesión
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

        <!-- FORMULARIO DE REGISTRO -->
        <form @submit.prevent="registerUser" class="space-y-5">
          <div>
            <label class="font-medium">Nombre</label>
            <input v-model="name" type="text" required
                   class="w-full mt-2 px-3 py-2 text-slate-500 bg-transparent outline-none border border-slate-300 focus:border-slate-600 shadow-sm rounded-lg" />
          </div>
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
          <div>
            <label class="font-medium">Confirmar Contraseña</label>
            <input v-model="confirmPassword" type="password" required
                   class="w-full mt-2 px-3 py-2 text-slate-500 bg-transparent outline-none border border-slate-300 focus:border-slate-600 shadow-sm rounded-lg" />
          </div>
          <button
            class="w-full px-4 py-2 text-white font-medium bg-slate-700 hover:bg-[#60769D] active:bg-slate-800 rounded-lg duration-150">
            Regístrate
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

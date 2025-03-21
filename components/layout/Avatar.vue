<script setup>
import { RouterLink } from 'vue-router'
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useUserStore } from '@/stores/user'

const isOpen = ref(false)

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

const closeDropdown = (e) => {
  if (!e.target.closest('.avatar-dropdown')) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', closeDropdown)
})

onUnmounted(() => {
  document.removeEventListener('click', closeDropdown)
})

const userStore = useUserStore()
const isLoggedIn = computed(() => userStore.isLoggedIn)
const currentUserName = computed(() => userStore.currentUser?.displayName || '')
const currentUserImage = computed(() => userStore.currentUser?.photoURL || '')

const logout = () => {
  userStore.logout()
}
</script>

<style scoped>
.avatar-dropdown {
  position: relative;
  display: inline-block;
}
</style>

<template>
  <div class="avatar-dropdown">
    <template v-if="isLoggedIn">
      <button 
        v-ripple 
        @click="toggleDropdown"
        class="relative overflow-hidden w-full border-0 bg-transparent flex items-center hover:bg-surface-100 dark:hover:bg-surface-800 rounded-none cursor-pointer transition-colors duration-200"
      >
        <!-- Si el usuario tiene imagen, se muestra; de lo contrario se usa un ícono -->
        <img 
          :src="currentUserImage" 
          v-if="currentUserImage"
          class="mr-2 w-10 h-10 rounded-full"
          alt="Avatar de usuario"
        />
        <i v-else class="pi pi-user mr-2 text-xl"></i>
        <span class="inline-flex flex-col items-start">
          <span class="font-regular">{{ currentUserName }}</span>
        </span>
      </button>

      <!-- Dropdown de opciones -->
      <transition 
        name="dropdown"
        enter-active-class="transition ease-out duration-200"
        enter-from-class="transform opacity-0 scale-95"
        enter-to-class="transform opacity-100 scale-100"
        leave-active-class="transition ease-in duration-150"
        leave-from-class="transform opacity-100 scale-100"
        leave-to-class="transform opacity-0 scale-95"
      >
        <div 
          v-show="isOpen" 
          class="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg py-1 z-10 origin-top-right"
        >
          <RouterLink 
            to="/profile" 
            class="block px-4 py-2 text-sm text-black hover:bg-gray-100"
          >
            Mi Perfil
          </RouterLink>
          <RouterLink 
            to="/tickets"
            class="block px-4 py-2 text-sm text-black hover:bg-gray-100"
          >
            Mis Entradas
          </RouterLink>
          <a 
            href="#"
            @click.prevent="logout"
            class="block px-4 py-2 text-sm text-black hover:bg-gray-100"
          >
            Cerrar Sesión
          </a>
        </div>
      </transition>
    </template>

    <template v-else>
      <RouterLink to="/login" class="flex items-center">
        <i class="pi pi-user text-2xl"></i>
        <span class="ml-2 font-regular">Iniciar sesión</span>
      </RouterLink>
    </template>
  </div>
</template>

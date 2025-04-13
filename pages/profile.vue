<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { signOut } from 'firebase/auth'
import QrcodeVue from 'qrcode.vue'
import Tag from 'primevue/tag'

definePageMeta({
  middleware: 'auth'
})

const isLoaded = ref(false)
const showImageOptions = ref(false)
const placeholder = 'https://www.gravatar.com/avatar/?d=mp&s=150'
const userStore = useUserStore()
const router = useRouter()
const { $auth } = useNuxtApp()

const userName = ref('Usuario EasySpot')
const profileImage = ref(placeholder)
const groupedEvents = ref({})
const showQRModal = ref(false)
const selectedQRCodes = ref([])
const selectedEventTitle = ref('')

watch(
  () => userStore.user,
  (newUser) => {
    if (newUser) {
      userName.value = newUser.displayName || 'Usuario EasySpot'
      profileImage.value = newUser.photoURL || placeholder
    } else {
      userName.value = 'Usuario EasySpot'
      profileImage.value = placeholder
    }
  },
  { immediate: true }
)

onMounted(async () => {
  setTimeout(() => {
    isLoaded.value = true
  }, 500)

  console.log('🔥 UID:', userStore.user?.firebaseUid)

  if (userStore.user?.firebaseUid) {
    try {
      const res = await $fetch('/api/events/my-events', {
        query: { firebaseUid: userStore.user.firebaseUid }
      })

      console.log('✅ API response:', res)

      if (!res.events || res.events.length === 0) {
        console.warn('⚠️ No se encontraron eventos')
      }

      const grouped = {}
      for (const ticket of res.events) {
        const eventId = ticket.event.id
        if (!grouped[eventId]) {
          grouped[eventId] = {
            event: ticket.event,
            qrs: []
          }
        }
        grouped[eventId].qrs.push({
          qr: ticket.qr,
          validate: ticket.validate,
          validatedAt: ticket.validatedAt
        })
      }
      groupedEvents.value = grouped
      console.log('🧾 Agrupados:', grouped)
    } catch (err) {
      console.error('❌ Error al cargar eventos:', err)
    }
  } else {
    console.warn('⛔ No hay UID disponible aún')
  }
})

const toggleImageOptions = () => {
  showImageOptions.value = !showImageOptions.value
}

const handleImageUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      profileImage.value = e.target.result
      showImageOptions.value = false
    }
    reader.readAsDataURL(file)
  }
}

const showQR = (qrs, title) => {
  selectedQRCodes.value = qrs
  selectedEventTitle.value = title
  showQRModal.value = true
}

const logout = async () => {
  await signOut($auth)
  userStore.clearUser()
  router.push('/login')
}
</script>

<template>
  <div class="min-h-screen overflow-y-auto gradient-bg relative">
    <div class="absolute inset-0 flex items-center justify-center w-[99vw]">
      <div class="gradients-container absolute inset-0" :class="{ 'loaded': isLoaded }">
        <div class="blob blob1 bg-gradient-to-br from-[#15469F] to-[#F1C80C]"></div>
        <div class="blob blob2 bg-gradient-to-br from-[#15469F] to-[#86378E]"></div>
        <div class="blob blob3 bg-gradient-to-br from-[#86378E] to-[#F1C80C]"></div>
      </div>
    </div>

    <div class="profile-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12 relative z-10">
      <div class="w-full max-w-3xl mx-auto">
        <div class="profile-card bg-white rounded-2xl overflow-hidden shadow-xl transition-transform duration-300 mb-8">
          <div class="p-8">
            <div class="flex flex-col md:flex-row items-center gap-8">
              <div class="relative group">
                <div class="w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-md bg-gray-200 flex items-center justify-center">
                  <img :src="profileImage" alt="Foto de perfil" class="w-full h-full object-cover" />
                </div>
                <button 
                  @click="toggleImageOptions" 
                  class="absolute bottom-0 right-0 bg-white text-gray-700 p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors">
                  <i class="pi pi-camera"></i>
                </button>
                <div v-if="showImageOptions" class="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg p-4 z-20 w-48">
                  <input type="file" accept="image/*" @change="handleImageUpload" class="block w-full text-sm text-black file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-black file:text-white hover:file:bg-black" />
                </div>
              </div>
              <div class="flex-1 text-center md:text-left">
                <h1 class="text-2xl font-bold text-black">¡Hola, {{ userName }}!</h1>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 border-t border-black">
            <router-link to="/" class="action-link">
              <div class="flex flex-col items-center justify-center p-6 hover:bg-gray-50 transition-colors">
                <i class="pi pi-ticket text-black text-xl mb-2"></i>
                <span class="font-medium text-black">Comprar entradas</span>
              </div>
            </router-link>
            <div class="action-link cursor-pointer" @click="logout">
              <div class="flex flex-col items-center justify-center p-6 hover:bg-gray-50 transition-colors">
                <i class="pi pi-sign-out text-black text-xl mb-2"></i>
                <span class="font-medium text-black">Cerrar sesión</span>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-2xl overflow-hidden shadow-xl transition-transform duration-300 ">
          <div class="p-6 border-b border-black">
            <h2 class="text-xl font-bold text-black">Próximos eventos</h2>
          </div>
          <div class="p-6 space-y-6">
            <div v-for="eventId in Object.keys(groupedEvents)" :key="eventId" class="flex items-start justify-between border-b border-black pb-4">
              <div class="flex items-center">
                <div class="bg-black text-white rounded-lg flex flex-col items-center justify-center w-12 h-14 mr-4">
                  <span class="text-xl font-bold">{{ new Date(groupedEvents[eventId].event.dateTime).getDate() }}</span>
                  <span class="text-xs font-semibold uppercase">{{ new Date(groupedEvents[eventId].event.dateTime).toLocaleString('es-ES', { month: 'short' }) }}</span>
                </div>
                <div>
                  <h3 class="font-medium text-black">{{ groupedEvents[eventId].event.title }}</h3>
                  <p class="text-sm text-black">{{ groupedEvents[eventId].event.venue?.name || 'Ubicación desconocida' }}</p>
                </div>
              </div>
              <button 
                @click="showQR(groupedEvents[eventId].qrs, groupedEvents[eventId].event.title)" 
                class="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center">
                <i class="pi pi-qrcode text-white mr-2"></i>
                Ver entradas
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>


    <Dialog v-model:visible="showQRModal" modal :header="selectedEventTitle" :style="{ width: '600px', backgroundColor: 'white', color: 'black' }">
      <div class="space-y-4">
        <div v-for="(entry, index) in selectedQRCodes" :key="index" class="bg-gray-100 rounded-xl p-4 flex justify-between items-center shadow-sm">
          <div>
            <h4 class="font-semibold text-gray-800">{{ selectedEventTitle }}</h4>
            <p class="text-sm text-gray-600">Entrada {{ index + 1 }} / {{ selectedQRCodes.length }}</p>
            <div class="mt-2 flex items-center space-x-2">
              <Tag 
                :style="entry.validate 
                  ? { backgroundColor: '#FFF4C1', color: '#665c00', fontWeight: 'bold' } 
                  : { backgroundColor: '#D4F8E8', color: '#084c22', fontWeight: 'bold' }">
                {{ entry.validate ? 'Validada' : 'Sin validar' }}
              </Tag>
              <span v-if="entry.validate" class="text-xs text-gray-600">{{ new Date(entry.validatedAt).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) }}</span>
            </div>
          </div>
          <QrcodeVue :value="entry.qr" :size="100" />
        </div>
      </div>
    </Dialog>


  </div>
</template>

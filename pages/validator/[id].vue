
<script setup>
import { QrcodeStream } from 'vue-qrcode-reader'
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { getAuth } from 'firebase/auth'
import Modal from '@/components/layout/Modal.vue'

definePageMeta({
  middleware: ['auth', 'promoter']
})

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

// Estados reactivos
const result = ref('')
const error = ref('')
const isLoading = ref(false)
const cameraEnabled = ref(false)
const isValidating = ref(true)
const isAuthorized = ref(false)
const authError = ref('')
const isValidatingTicket = ref(false)
const validationResult = ref(null)
const showResultModal = ref(false)


const eventInfo = ref({
  name: '',
  location: '',
  date: '',
  venue: ''
})


const validateEventOwnership = async () => {
  try {
 
    

    if (!route?.params?.id) {
      throw new Error('No se pudo obtener el ID del evento')
    }
    
    const eventId = route.params.id
    const auth = getAuth()
    

    if (!auth.currentUser) {
      throw new Error('Usuario no autenticado')
    }
    
    const token = await auth.currentUser.getIdToken()

  

    const response = await $fetch(`/api/dashboard/admin-events/${eventId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })


    isAuthorized.value = true
    eventInfo.value = {
      name: response.title || 'Evento sin nombre',
      location: response.venue || response.venueName || 'Ubicación no disponible',
      date: response.dateTime ? new Date(response.dateTime).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }) : 'Fecha no disponible',
      venue: response.venue || response.venueName || ''
    }

  } catch (err) {
    console.error('Error al validar evento:', err)
    if (err.status === 403 || err.status === 404) {
      authError.value = 'No tienes permisos para validar este evento'
    } else {
      authError.value = 'Error al verificar el evento'
    }
    isAuthorized.value = false
  } finally {
    isValidating.value = false
  }
}

onMounted(async () => {


  if (process.client && userStore.isReady) {
    await validateEventOwnership()
  } else if (process.client) {

    const unwatch = watch(() => userStore.isReady, async (ready) => {
      if (ready) {
        unwatch()
        await validateEventOwnership()
      }
    }, { immediate: true })
  }
})

async function onDecode(decoded) {
  
  result.value = decoded
  error.value = ''
  isValidatingTicket.value = true
  validationResult.value = null
  showResultModal.value = true
  
  try {
    const auth = getAuth()
    
    if (!auth.currentUser) {
      throw new Error('Usuario no autenticado')
    }
    
    const token = await auth.currentUser.getIdToken()
    
    
    
    // Verificar que tenemos el ID del evento
    if (!route?.params?.id) {
      throw new Error('No se pudo obtener el ID del evento')
    }
    
    const response = await $fetch('/api/validator/validate-ticket', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: {
        qrCode: decoded,
        eventId: route.params.id
      }
    })
    
    validationResult.value = response

    
  } catch (err) {

    validationResult.value = {
      success: false,
      status: 'error',
      message: 'Error al conectar con el servidor'
    }
  } finally {
    isValidatingTicket.value = false
  }
}

function onInit(promise) {
  isLoading.value = true
  
  promise
    .then(() => {
      cameraEnabled.value = true
      error.value = ''

    })
    .catch(err => {
      cameraEnabled.value = false
      
      if (err.name === 'NotAllowedError') {
        error.value = 'Acceso a la cámara denegado. Por favor, permite el acceso a la cámara en tu navegador.'
      } else if (err.name === 'NotFoundError') {
        error.value = 'No se encontró ninguna cámara en tu dispositivo.'
      } else if (err.name === 'NotSupportedError') {
        error.value = 'Tu navegador no es compatible con el escáner QR.'
      } else if (err.name === 'NotReadableError') {
        error.value = 'La cámara está siendo usada por otra aplicación.'
      } else if (err.name === 'OverconstrainedError') {
        error.value = 'Configuración de cámara no válida.'
      } else {
        error.value = 'Error desconocido al acceder a la cámara.'
      }
    })
    .finally(() => {
      isLoading.value = false
    })
}

function onDetect(detectedCodes) {
  
  if (detectedCodes.length > 0) {
    onDecode(detectedCodes[0].rawValue)
  }
}

function resetScan() {
  result.value = ''
  validationResult.value = null
  showResultModal.value = false
}

function closeResultModal() {
  showResultModal.value = false
  // Reiniciar para el siguiente escaneo
  setTimeout(() => {
    result.value = ''
    validationResult.value = null
  }, 300)
}

function goBack() {
  if (router && typeof router.push === 'function') {
    router.push('/panel')
  } else {
    // Fallback para navegación
    window.location.href = '/panel'
  }
}

function testManualValidation() {
  
  const testQR = prompt('Introduce un código QR para probar:')
  if (testQR) {
    onDecode(testQR)
  }
}
</script>


<template>
  <ClientOnly>
    <div class="min-h-screen bg-white">

      <div v-if="isValidating" class="min-h-screen flex items-center justify-center">
        <div class="text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-2 border-gray-300 border-t-black mx-auto mb-4"></div>
          <p class="text-gray-600">Verificando permisos...</p>
        </div>
      </div>


      <div v-else-if="!isAuthorized" class="min-h-screen flex items-center justify-center">
        <div class="text-center max-w-md px-6">
          <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg class="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
            </svg>
          </div>
          <h1 class="text-2xl font-bold text-gray-800 mb-2">Acceso denegado</h1>
          <p class="text-gray-600 mb-6">{{ authError }}</p>
          <button
            @click="goBack"
            class="bg-black text-white font-medium py-2 px-6 rounded hover:bg-gray-800 transition-colors"
          >
            Volver al panel
          </button>
        </div>
      </div>


      <template v-else>

        <div class="border-b border-gray-200">
          <div class="max-w-3xl mx-auto px-6 py-8 flex flex-col items-center justify-center">
              
            <div class="flex items-center justify-between mb-4">
              <button 
                @click="goBack"
                class="flex items-center space-x-2 text-gray-600 hover:text-black transition-colors group"
              >
                <div class="w-8 h-8 rounded-md border border-gray-200 flex items-center justify-center group-hover:border-gray-300 transition-colors">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                  </svg>
                </div>
                <span class="text-sm font-medium">Volver al panel</span>
              </button>
            </div>
            

            <div class="flex items-center space-x-3 mb-2">
              <div class="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"></path>
                </svg>
              </div>
              <h1 class="text-3xl font-bold text-black">{{ eventInfo.name }}</h1>
            </div>
            <div class="flex items-center text-gray-500 text-sm space-x-4 ml-1">
              <span>{{ eventInfo.location }}</span>
              <span>•</span>
              <span>{{ eventInfo.date }}</span>
            </div>
          </div>
        </div>


        <div v-if="!isValidating && isAuthorized" class="max-w-xl mx-auto px-6 py-8">

          <div v-if="isLoading" class="text-center py-12">
            <div class="inline-flex items-center justify-center">
              <div class="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-black"></div>
              <span class="ml-3 text-gray-600">Iniciando cámara...</span>
            </div>
          </div>

          <div v-else-if="error" class="text-center py-12">
            <div class="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-800 mb-2">Error de cámara</h3>
            <p class="text-gray-600 mb-6">{{ error }}</p>
            <button
              @click="() => onInit(Promise.resolve())"
              class="bg-black text-white font-medium py-2 px-6 rounded hover:bg-gray-800 transition-colors"
            >
              Reintentar
            </button>
          </div>

          <div v-else>
            <div class="mb-6">
              <h2 class="text-xl font-semibold text-gray-800 mb-2">Escanear código QR</h2>
              <p class="text-gray-600">Centra el código QR en el marco para escanear automáticamente</p>
            </div>
            
            <div class="relative">
              <div class="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
                <qrcode-stream
                  @decode="onDecode"
                  @init="onInit"
                  @detect="onDetect"
                  class="w-full aspect-square object-cover"
                  :track="false"
                  :formats="['qr_code', 'data_matrix', 'code_128', 'code_39']"
                  :camera="{ facingMode: 'environment' }"
                  :paused="isValidatingTicket"
                />
                

                <div class="absolute inset-0 flex items-center justify-center">
                  <div class="relative w-64 h-64">

                    <div class="absolute inset-0 border-2 border-white/70 rounded-lg"></div>

                    <div class="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-black"></div>
                    <div class="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-black"></div>
                    <div class="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-black"></div>
                    <div class="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-black"></div>

                    <div class="absolute inset-x-0 top-1/2 h-px bg-black/50 animate-scan"></div>
                  </div>
                </div>

                <div v-if="isValidatingTicket" class="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div class="bg-white rounded-lg p-4 text-center">
                    <div class="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-black mx-auto mb-2"></div>
                    <p class="text-sm text-gray-700">Validando...</p>
                  </div>
                </div>
              </div>

              <div class="mt-4 flex items-center justify-between">
                <div class="flex items-center">
                  <div class="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                  <span class="text-sm text-gray-600">Cámara activa</span>
                </div>
                <div class="text-sm text-gray-500">
                  {{ isValidatingTicket ? 'Validando...' : 'Esperando código QR' }}
                </div>
              </div>
            </div>
            
            <div class="mt-8 p-4 bg-gray-50 border border-gray-200 rounded-md">
              <div class="flex items-start">
                <div class="mr-2 mt-0.5">
                  <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div>
                  <p class="text-sm text-gray-700">
                    <strong>Consejos para el escaneo:</strong><br>
                    • Asegúrate de tener buena iluminación<br>
                    • Mantén el código QR estable dentro del marco<br>
                    • La cámara debe enfocar automáticamente
                  </p>
                </div>
              </div>
            </div>

            <div class="mt-4 text-center">
              <button 
                @click="testManualValidation"
                class="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded text-sm"
              >
                🧪 Probar validación manual
              </button>
            </div>
          </div>
        </div>

        <Modal :is-open="showResultModal" title="Resultado de Validación" @close="closeResultModal" class="max-w-lg">

          <div v-if="isValidatingTicket" class="p-6 text-center">
            <div class="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-black mx-auto mb-4"></div>
            <p class="text-gray-600">Validando ticket...</p>
          </div>

          <div v-else-if="validationResult" class="p-6">

            <div v-if="validationResult.success && validationResult.status === 'validated'" class="text-center">
              <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h2 class="text-xl font-semibold text-green-800 mb-2">✅ Ticket Validado</h2>
              <p class="text-green-700 mb-4">{{ validationResult.message }}</p>
              

              <div class="bg-green-50 border border-green-200 rounded-md p-4 mb-4 text-left">
                <h3 class="font-semibold text-green-800 mb-2">Información del ticket:</h3>
                <div class="space-y-1 text-sm text-green-700">
                  <p><strong>Evento:</strong> {{ validationResult.ticket.eventTitle }}</p>
                  <p><strong>Asistente:</strong> {{ validationResult.ticket.userDisplayName || validationResult.ticket.userEmail }}</p>
                  <p><strong>Venue:</strong> {{ validationResult.ticket.venue }}</p>
                  <p><strong>Validado:</strong> {{ new Date(validationResult.ticket.validatedAt).toLocaleString('es-ES') }}</p>
                </div>
              </div>
            </div>


            <div v-else-if="validationResult.status === 'already_validated'" class="text-center">
              <div class="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                </svg>
              </div>
              <h2 class="text-xl font-semibold text-yellow-800 mb-2">⚠️ Ya Validado</h2>
              <p class="text-yellow-700 mb-4">{{ validationResult.message }}</p>
              
              <div class="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-4 text-left">
                <h3 class="font-semibold text-yellow-800 mb-2">Información del ticket:</h3>
                <div class="space-y-1 text-sm text-yellow-700">
                  <p><strong>Evento:</strong> {{ validationResult.ticket.eventTitle }}</p>
                  <p><strong>Asistente:</strong> {{ validationResult.ticket.userDisplayName || validationResult.ticket.userEmail }}</p>
                  <p><strong>Venue:</strong> {{ validationResult.ticket.venue }}</p>
                  <p><strong>Validado anteriormente:</strong> {{ new Date(validationResult.validatedAt).toLocaleString('es-ES') }}</p>
                </div>
              </div>
            </div>

            <div v-else-if="validationResult.status === 'wrong_event'" class="text-center">
              <div class="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                </svg>
              </div>
              <h2 class="text-xl font-semibold text-orange-800 mb-2">❌ Evento Incorrecto</h2>
              <p class="text-orange-700 mb-4">{{ validationResult.message }}</p>
              
              <div class="bg-orange-50 border border-orange-200 rounded-md p-4 mb-4">
                <p class="text-sm text-orange-700">
                  <strong>Este ticket pertenece a:</strong> {{ validationResult.ticketEvent }}
                </p>
              </div>
            </div>

            <div v-else class="text-center">
              <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </div>
              <h2 class="text-xl font-semibold text-red-800 mb-2">❌ Ticket Inválido</h2>
              <p class="text-red-700 mb-4">{{ validationResult.message }}</p>
            </div>

            <div class="bg-gray-50 border border-gray-100 rounded-md p-4 mb-4">
              <p class="text-xs text-gray-500 mb-1">Código QR:</p>
              <p class="font-mono text-sm text-gray-800 break-all">{{ result }}</p>
            </div>
            
            <button
              @click="closeResultModal"
              class="w-full bg-black hover:bg-gray-800 text-white font-medium py-2 px-4 rounded transition-colors"
            >
              Escanear siguiente
            </button>
          </div>
        </Modal>
      </template>
    </div>

    <template #fallback>
      <div class="min-h-screen flex items-center justify-center">
        <div class="text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-2 border-gray-300 border-t-black mx-auto mb-4"></div>
          <p class="text-gray-600">Cargando escáner...</p>
        </div>
      </div>
    </template>
  </ClientOnly>
</template>

<style scoped>
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-scan {
  animation: scan 2s ease-in-out infinite;
}

@keyframes scan {
  0%, 100% {
    transform: translateY(-30px);
    opacity: 0;
  }
  50% {
    transform: translateY(30px);
    opacity: 1;
  }
}
</style>

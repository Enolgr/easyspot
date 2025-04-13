<script setup>
import { ref, computed } from 'vue';
import { loadStripe } from '@stripe/stripe-js';
import { useRuntimeConfig } from '#app';
import { useRouter, useRoute } from 'vue-router';
import { useUserStore } from '@/stores/user';

const route = useRoute();
const { id } = route.params;
const { data } = await useFetch(`/api/events/${id}`);
const ticketQuantity = ref(1);
const router = useRouter();
const userStore = useUserStore();

const goBack = () => router.push('/'); // o cualquier ruta que quieras

const formattedDateTime = computed(() => {
  if (!data.value?.data?.dateTime) return '';
  const date = new Date(data.value.data.dateTime);
  return new Intl.DateTimeFormat('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  }).format(date);
});

const formattedPrice = computed(() => {
  if (!data.value?.data?.price) return '';
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR'
  }).format(data.value.data.price);
});

const totalPrice = computed(() => {
  if (!data.value?.data?.price) return '';
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR'
  }).format(data.value.data.price * ticketQuantity.value);
});

const config = useRuntimeConfig();
const stripePublicKey = config.public.stripePublicKey;

let stripe = null;
loadStripe(stripePublicKey).then((s) => {
  stripe = s;
});

async function handleCheckout() {
  if (!userStore.isLoggedIn || !userStore.user) {
    router.push('/login')
    return
  }

  const { email, uid } = userStore.user

  if (!email || !uid) {
    console.error('Faltan email o uid del usuario')
    return
  }

  try {
    const response = await $fetch('/api/stripe-checkout', {
      method: 'POST',
      body: {
        eventId: id,
        quantity: ticketQuantity.value,
        userEmail: email,
        firebaseUid: uid
      }
    })

    const { sessionId } = response
    const { error } = await stripe.redirectToCheckout({ sessionId })
    if (error) {
      console.error('Error en el redireccionamiento:', error)
    }
  } catch (err) {
    console.error('Error al crear la sesión de pago:', err)
  }
}


</script>

<template>
  <div v-if="data?.data" class="event-detail">
    <!-- Póster del evento como fondo -->
    <div 
      class="relative w-full h-[50vh] bg-cover bg-center overflow-hidden"
      :style="{ backgroundImage: `url(${data.data.poster})` }"
    >
      <div class="absolute inset-0 bg-black/60 flex items-end">
        <div class="w-full p-6 text-white bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-between h-full">
          <button @click="goBack"
                  class="inline-flex items-center border px-3 py-1.5 rounded-md text-white hover:bg-black/50 w-fit ease-in-out">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="h-6 w-6">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16l-4-4m0 0l4-4m-4 4h18"/>
            </svg>
            <span class="ml-1 text-lg">Atrás</span>
          </button>
          <div>
            <h1 class="text-3xl font-bold">{{ data.data.title }}</h1>
            <div class="flex items-center mt-2">
              <i class="pi pi-map-marker mr-2 text-lg"></i>
              <span>{{ data.data.city }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Contenido del evento -->
    <div class="max-w-[1200px] mx-auto p-4 md:p-6 m-5">
      <div class="bg-white rounded-lg shadow-md p-4 md:p-6 -mt-6 relative z-10">
        <!-- Sección de compra de entradas -->
        <div class="mb-6 pb-6 border-b border-gray-200">
          <div class="flex flex-col md:flex-row items-center justify-between gap-4">
            <div class="w-full md:w-1/2">
              <div class="flex items-center">
                <i class="pi pi-ticket text-primary text-xl mr-3"></i>
                <div>
                  <h3 class="font-semibold text-gray-800">Selecciona entradas</h3>
                  <p class="text-gray-600 text-sm">
                    {{ formattedPrice }} por entrada · {{ data.data.availableTickets }} disponibles
                  </p>
                </div>
              </div>
              <div class="mt-3 flex items-center">
                <label for="ticketQuantity" class="mr-3 text-gray-700">Cantidad:</label>
                <select 
                  id="ticketQuantity" 
                  v-model="ticketQuantity"
                  class="p-2 border bg-white border-gray-300 rounded-md focus:ring-1 focus:ring-slate-500 focus:border-slate-500"
                >
                  <option v-for="n in 8" :key="n" :value="n">{{ n }}</option>
                </select>
                <span class="ml-4 font-medium">Total: {{ totalPrice }}</span>
              </div>
            </div>
            <div class="w-full md:w-auto">
              <button 
                @click="handleCheckout"
                class="w-full md:w-auto hover:bg-[#60769D] bg-slate-700 text-white font-bold py-3 px-8 rounded-md transition-colors"
              >
                Comprar Entradas
              </button>
            </div>
          </div>
        </div>

        <!-- Resto del contenido del evento -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div class="flex items-start">
            <i class="pi pi-calendar mr-3 text-primary text-xl mt-1"></i>
            <div>
              <h3 class="font-semibold text-gray-800">Fecha y hora</h3>
              <p class="text-gray-700">{{ formattedDateTime }}</p>
            </div>
          </div>
          <div class="flex items-start">
            <i class="pi pi-tag mr-3 text-primary text-xl mt-1"></i>
            <div>
              <h3 class="font-semibold text-gray-800">Precio</h3>
              <p class="text-gray-700">{{ formattedPrice }}</p>
            </div>
          </div>
          <div class="flex items-start">
            <i class="pi pi-users mr-3 text-primary text-xl mt-1"></i>
            <div>
              <h3 class="font-semibold text-gray-800">Capacidad</h3>
              <p class="text-gray-700">{{ data.data.venue.capacity }} personas</p>
            </div>
          </div>
        </div>
        
        <div class="mb-8">
          <h2 class="text-xl font-semibold text-gray-800 mb-3">Descripción del evento</h2>
          <p class="text-gray-700 leading-relaxed">{{ data.data.description }}</p>
        </div>
        
        <div class="border-t border-gray-200 pt-6">
          <h2 class="text-xl font-semibold text-gray-800 mb-4">Información del lugar</h2>
          <div class="bg-gray-50 rounded-lg p-4">
            <h3 class="font-bold text-lg text-gray-800">{{ data.data.venue.name }}</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div class="flex items-start">
                <i class="pi pi-map-marker mr-3 text-primary text-xl mt-1"></i>
                <div>
                  <h4 class="font-semibold text-gray-700">Ubicación</h4>
                  <p class="text-gray-600">{{ data.data.venue.address }}</p>
                  <p class="text-gray-600">{{ data.data.venue.city }}</p>
                </div>
              </div>
              <div class="flex items-start">
                <i class="pi pi-envelope mr-3 text-primary text-xl mt-1"></i>
                <div>
                  <h4 class="font-semibold text-gray-700">Contacto</h4>
                  <p class="text-gray-600">{{ data.data.venue.contactDetails }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.event-detail {
  background-color: #f5f5f5;
  min-height: 100vh;
}
</style>

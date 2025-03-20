<script setup>
import { ref, computed } from 'vue';

const route = useRoute();
const { id } = route.params;
const { data } = await useFetch(`/api/events/${id}`);
const ticketQuantity = ref(1);

// Format date and time
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

// Format price
const formattedPrice = computed(() => {
  if (!data.value?.data?.price) return '';
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR'
  }).format(data.value.data.price);
});

// Calculate total price
const totalPrice = computed(() => {
  if (!data.value?.data?.price) return '';
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR'
  }).format(data.value.data.price * ticketQuantity.value);
});
</script>

<template>
  <div v-if="data?.data" class="event-detail">
    <!-- Póster del evento como fondo -->
    <div 
      class="relative w-full h-[50vh] bg-cover bg-center overflow-hidden"
      :style="{ backgroundImage: `url(${data.data.poster})` }"
    >
      <div class="absolute inset-0 bg-black/60 flex items-end">
        <!-- Título sobre el póster -->
        <div class="w-full p-6 text-white bg-gradient-to-t from-black/80 to-transparent">
          <h1 class="text-3xl font-bold">{{ data.data.title }}</h1>
          <div class="flex items-center mt-2">
            <i class="pi pi-map-marker mr-2 text-lg"></i>
            <span>{{ data.data.city }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Contenido del evento -->
    <div class="max-w-[1200px] mx-auto p-4 md:p-6 m-5">
      <!-- Detalles del evento -->
      <div class="bg-white rounded-lg shadow-md p-4 md:p-6 -mt-6 relative z-10">
        
        <!-- Sección de compra de entradas  -->
        <div class="mb-6 pb-6 border-b border-gray-200">
          <div class="flex flex-col md:flex-row items-center justify-between gap-4">
            <div class="w-full md:w-1/2">
              <div class="flex items-center">
                <i class="pi pi-ticket text-primary text-xl mr-3"></i>
                <div>
                  <h3 class="font-semibold text-gray-800">Selecciona entradas</h3>
                  <p class="text-gray-600 text-sm">{{ formattedPrice }} por entrada · {{ data.data.availableTickets }} disponibles</p>
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
              <button class="w-full md:w-auto hover:bg-[#60769D] bg-slate-700 text-white font-bold py-3 px-8 rounded-md transition-colors">
                Comprar Entradas
              </button>
            </div>
          </div>
        </div>

        <!-- Main info section -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <!-- Fecha y hora -->
          <div class="flex items-start">
            <i class="pi pi-calendar mr-3 text-primary text-xl mt-1"></i>
            <div>
              <h3 class="font-semibold text-gray-800">Fecha y hora</h3>
              <p class="text-gray-700">{{ formattedDateTime }}</p>
            </div>
          </div>
          
          <!-- Precio -->
          <div class="flex items-start">
            <i class="pi pi-tag mr-3 text-primary text-xl mt-1"></i>
            <div>
              <h3 class="font-semibold text-gray-800">Precio</h3>
              <p class="text-gray-700">{{ formattedPrice }}</p>
            </div>
          </div>
          
          <!-- Tickets disponibles -->
          <div class="flex items-start">
            <i class="pi pi-users mr-3 text-primary text-xl mt-1"></i>
            <div>
              <h3 class="font-semibold text-gray-800">Capacidad</h3>
              <p class="text-gray-700">{{ data.data.venue.capacity }} personas</p>
            </div>
          </div>
        </div>
        
        <!-- Descripción -->
        <div class="mb-8">
          <h2 class="text-xl font-semibold text-gray-800 mb-3">Descripción del evento</h2>
          <p class="text-gray-700 leading-relaxed">{{ data.data.description }}</p>
        </div>
        
        <!-- Información del lugar -->
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
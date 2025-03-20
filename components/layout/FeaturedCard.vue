<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

defineProps({
  event: {
    type: Object,
    required: true
  }
})

// Función para formatear la fecha
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return {
    day: date.getDate(),
    month: date.toLocaleString('default', { month: 'short' }).toUpperCase()
  };
}

// Función para navegar a la página del evento
const goToEvent = (id) => {
  router.push(`/events/${id}`)
}
</script>

<template>
  <div 
    class="card w-72 bg-white rounded-2xl overflow-hidden cursor-pointer transition-transform duration-300 hover:scale-105 hover:-translate-y-1"
    @click="goToEvent(event.id)"
  >
    <div class="relative">
      <img 
        :src="event.poster" 
        :alt="event.title" 
        class="w-full h-56 object-cover"
      />
      <div class="absolute top-2 right-2 bg-white text-gray-900 rounded-lg flex flex-col items-center justify-center w-12 h-14 ">
        <span class="text-xl font-bold">{{ formatDate(event.dateTime).day }}</span>
        <span class="text-xs font-semibold">{{ formatDate(event.dateTime).month }}</span>
      </div>
    </div>
    
    <div class="p-4">
      <h3 class="text-lg font-bold mb-2 text-gray-800">{{ event.title }}</h3>
      
      <div class="flex items-center text-gray-600">
        <i class="pi pi-map-marker text-primary mr-2 text-lg"></i>
        <span>{{ event.venue.name }}, {{ event.city }}</span>
      </div>
    </div>
  </div>
</template>

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
    class="card w-full flex flex-row bg-white rounded-xl overflow-hidden cursor-pointer transition-transform duration-300 hover:scale-102 sm:hover:scale-105 sm:w-72 sm:flex-col sm:rounded-2xl border border-gray-200"
    @click="goToEvent(event.id)"
  >
    <div class="relative w-1/3 sm:w-full">
      <img 
        :src="event.poster" 
        :alt="event.title" 
        class="w-full h-full object-cover sm:h-56"
      />
      <div class="absolute top-1 right-1 bg-white text-gray-900 rounded-lg flex flex-col items-center justify-center w-8 h-10 sm:top-2 sm:right-2 sm:w-12 sm:h-14">
        <span class="text-sm font-bold sm:text-xl">{{ formatDate(event.dateTime).day }}</span>
        <span class="text-[10px] font-semibold sm:text-xs">{{ formatDate(event.dateTime).month }}</span>
      </div>
    </div>
    
    <div class="p-2 w-2/3 flex flex-col justify-center sm:w-full sm:p-4">
      <h3 class="text-sm font-bold mb-1 text-gray-800 line-clamp-2 sm:text-lg sm:mb-2">{{ event.title }}</h3>
      
      <div class="flex items-center text-gray-600 text-xs sm:text-base truncate">
        <i class="pi pi-map-marker text-primary mr-1 text-sm sm:mr-2 sm:text-lg"></i>
        <span class="truncate">{{ event.venue.name }}, {{ event.city }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  line-clamp: 2;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card {
  width: 100%;
  max-width: 288px; /* 72 * 4 = 288px para sm:w-72 */
  margin: 0 auto;
}
</style>
<script setup>
const { data: events, pending } = useFetch('/api/popular-events')

// Depuración de datos
watch(events, (newEvents) => {
}, { immediate: true })
</script>

<template>
  <div v-if="pending" class="flex justify-center items-center h-50">
    <span class="loader"></span>
  </div>

  <div v-else class="w-full max-w-[1200px] mx-auto mt-5 p-5">
    <h2 class="text-left text-3xl font-semibold text-gray-900 mb-6">
      Eventos Populares
    </h2>
    <div v-if="!events?.data || events.data.length === 0" class="text-center text-gray-500 py-8">
      No hay eventos populares disponibles
    </div>
    <div v-else class="flex flex-col md:flex-row gap-4 md:overflow-x-auto scrollbar-hide mt-5 p-5 w-full">
      <LayoutFeaturedCard 
        v-for="event in events.data.slice(0, 4)" 
        :key="event.id" 
        :event="event"
        class="w-full md:w-auto mb-4 md:mb-0"
      />
    </div>
  </div>
</template>

<style scoped>
/* Ocultar scrollbar */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* Loader */
.loader {
  width: 48px;
  height: 48px;
  display: inline-block;
  position: relative;
}
.loader::after,
.loader::before {
  content: '';  
  box-sizing: border-box;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 2px solid #FFF;
  position: absolute;
  left: 0;
  top: 0;
  animation: animloader 2s linear infinite;
}
.loader::after {
  animation-delay: 1s;
}

@keyframes animloader {
  0% {
    transform: scale(0);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 0;
  }
}
</style>
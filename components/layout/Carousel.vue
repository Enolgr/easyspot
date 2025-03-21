<script setup>
const { data: events, pending } = useFetch('/api/events')
</script>

<template>
  <div v-if="pending" class="flex justify-center items-center h-50">
    <span class="loader"></span>
  </div>

  <div v-else class="w-full max-w-[1200px] mx-auto mt-5 p-5">
    <h2 class="text-left text-3xl font-semibold text-gray-900 mb-6">
      Eventos Populares
    </h2>
    <div class="flex gap-4 overflow-x-auto scrollbar-hide mt-5 p-5 w-full">
      <LayoutFeaturedCard 
        v-for="event in (events?.data ? events.data.slice(0, 4) : [])" 
        :key="event.id" 
        :event="event"
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

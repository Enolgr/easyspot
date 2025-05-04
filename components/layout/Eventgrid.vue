<script setup>
import { ref, watch } from 'vue'

// Variable reactiva para la página actual
const currentPage = ref(1)

// Usamos una función reactiva en useFetch para que el URL se actualice según currentPage
const { data, pending, refresh } = useFetch(() => `/api/events?page=${currentPage.value}`)

// Cada vez que currentPage cambie, refrescamos la petición
watch(currentPage, () => {
  refresh()
})
</script>

<template>
  <div v-if="pending" class="flex justify-center items-center h-50">
    <i class="pi pi-spin pi-spinner text-slate-600 text-4xl"></i>
  </div>

  <div v-else class="w-full max-w-[1200px] mx-auto mt-5 p-5">
    <h2 class="text-left text-3xl font-semibold text-gray-900 mb-6">
      Todos los eventos
    </h2>
    <!-- Mostramos los eventos en una grilla adaptable -->
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <LayoutFeaturedCard 
        v-for="event in data?.data || []" 
        :key="event.id" 
        :event="event"
      />
    </div>

    <!-- Controles de paginación -->
    <div v-if="data?.pagination" class="flex justify-center mt-6">
      <button 
        @click="currentPage--" 
        :disabled="currentPage <= 1"
        class="px-4 py-2 mr-2 bg-gray-300 rounded disabled:opacity-50">
        Prev
      </button>
      <span class="px-4 py-2">
        {{ data.pagination.page }} / {{ data.pagination.pages }}
      </span>
      <button 
        @click="currentPage++"
        :disabled="currentPage >= data.pagination.pages"
        class="px-4 py-2 ml-2 bg-gray-300 rounded disabled:opacity-50">
        Next
      </button>
    </div>
  </div>
</template>

<style scoped>
/* Ocultar scrollbar si fuera necesario */
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

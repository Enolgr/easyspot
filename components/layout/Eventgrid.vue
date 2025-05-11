<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useFetch } from '#app'

const events = ref([])
const page = ref(1)
const loading = ref(false)
const hasMore = ref(true)
const error = ref(null)

const fetchEvents = async (pageNum) => {
  if (loading.value) return
  
  loading.value = true
  error.value = null
  
  try {
    console.log('Intentando cargar página:', pageNum)
    const { data, error: fetchError } = await useFetch(`/api/events?page=${pageNum}`, {
      key: `events-page-${pageNum}`,
      server: false
    })
    
    console.log('Respuesta de la API:', data.value)
    
    if (fetchError.value) {
      console.error('Error en la petición:', fetchError.value)
      throw new Error(fetchError.value.message || 'Error en la petición')
    }

    if (!data.value) {
      console.error('No se recibieron datos de la API')
      throw new Error('No se recibieron datos de la API')
    }

    const newEvents = data.value.data || []
    const totalPages = data.value.pagination?.pages || 0

    console.log('Eventos recibidos:', newEvents.length)
    console.log('Total de páginas:', totalPages)

    if (pageNum === 1) {
      events.value = newEvents
    } else {
      events.value = [...events.value, ...newEvents]
    }

    hasMore.value = pageNum < totalPages
    return newEvents.length > 0
  } catch (err) {
    console.error('Error detallado:', err)
    error.value = err.message || 'Error al cargar los eventos'
    hasMore.value = false
    return false
  } finally {
    loading.value = false
  }
}

const handleScroll = async () => {
  if (loading.value || !hasMore.value) return

  const scrollHeight = document.documentElement.scrollHeight
  const scrollTop = window.scrollY || document.documentElement.scrollTop
  const clientHeight = document.documentElement.clientHeight

  if (scrollHeight - scrollTop - clientHeight < 100) {
    page.value++
    await fetchEvents(page.value)
  }
}

onMounted(async () => {
  await fetchEvents(1)
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <div class="w-full max-w-[1200px] mx-auto mt-5 p-5">
    <h2 class="text-left text-3xl font-semibold text-gray-900 mb-6">
      Todos los eventos
    </h2>

    <div v-if="error" class="text-center text-red-500 py-4 bg-red-50 rounded-lg">
      <p class="font-medium">{{ error }}</p>
      <button 
        @click="fetchEvents(1)" 
        class="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
      >
        Reintentar
      </button>
    </div>

    <div v-if="loading && events.length === 0" class="flex justify-center items-center py-12">
      <i class="pi pi-spin pi-spinner text-3xl text-gray-500"></i>
    </div>

    <div v-else>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <LayoutFeaturedCard 
          v-for="event in events" 
          :key="event.id" 
          :event="event"
        />
      </div>

      <div v-if="loading && events.length > 0" class="flex justify-center mt-6">
        <i class="pi pi-spin pi-spinner text-3xl text-gray-500"></i>
      </div>

      <div v-if="!hasMore && events.length > 0" class="text-center text-gray-400 text-sm mt-6">
        No hay más eventos para mostrar
      </div>
    </div>
  </div>
</template>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>

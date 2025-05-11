<script setup>
import { ref, onMounted, watch } from 'vue'
import { useFetch, useAsyncData } from '#app'

const showModal = ref(false)
const selectedCategory = ref('')
const events = ref([])
const isLoading = ref(false)
const isLoadingCategories = ref(true)
const categories = ref([])
const error = ref(null)

// Usar useAsyncData para manejar mejor la hidratación
const { data: categoriesData, pending, error: fetchError, refresh } = await useAsyncData(
  'categories',
  async () => {
    try {
      const response = await $fetch('/api/categories')
      return response
    } catch (err) {
      console.error('Error al cargar categorías:', err)
      throw err
    }
  }
)

// Actualizar el estado cuando los datos cambien
watch(categoriesData, (newData) => {
  if (newData) {
    categories.value = newData
  }
}, { immediate: true })

// Manejar errores
watch(fetchError, (newError) => {
  if (newError) {
    console.error('Error al cargar categorías:', newError)
    error.value = 'Error al cargar las categorías'
  }
}, { immediate: true })

// Manejar estado de carga
watch(pending, (isPending) => {
  isLoadingCategories.value = isPending
}, { immediate: true })

// Refrescar datos cuando el componente se monte
onMounted(() => {
  refresh()
})

const handleCategoryClick = async (categoryId) => {
  selectedCategory.value = categoryId
  isLoading.value = true
  error.value = null

  try {
    console.log('Cargando eventos para categoría:', categoryId)
    const { data: eventsData, error: eventsError } = await useAsyncData(
      `events-${categoryId}`,
      async () => {
        try {
          const response = await $fetch(`/api/events/category/${categoryId}`)
          return response
        } catch (err) {
          console.error('Error al cargar eventos:', err)
          throw err
        }
      }
    )
    
    if (eventsError.value) {
      error.value = 'Error al cargar los eventos'
      return
    }

    if (eventsData.value) {
      events.value = eventsData.value
    } else {
      events.value = []
    }
    showModal.value = true
  } catch (err) {
    error.value = 'Error al cargar los eventos'
    events.value = []
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="w-full max-w-[1200px] mx-auto mt-3 sm:mt-5 p-3 sm:p-5">
    <h2 class="text-left text-2xl sm:text-3xl font-semibold text-gray-900 mb-3 sm:mb-6">
      Categorías Populares
    </h2>



    <!-- Mensaje de error -->
    <div v-if="error" class="text-red-500 text-center py-4">
      {{ error }}
    </div>

    <!-- Loading de categorías -->
    <div v-else-if="isLoadingCategories" class="flex justify-center items-center py-12">
      <i class="pi pi-spin pi-spinner text-3xl text-gray-500"></i>
    </div>

    <!-- Mostrar categorías -->
    <div v-else>
      <div v-if="!categories || categories.length === 0" class="text-center text-gray-500 py-8">
        No hay categorías disponibles
      </div>
      
      <div v-else>
        <div class="grid grid-cols-2 gap-3 sm:hidden">
          <a v-for="category in categories" 
             :key="category.id"
             href="#"
             @click.prevent="handleCategoryClick(category.id)"
             class="p-3 bg-white border border-gray-200 rounded-lg shadow-sm flex items-center justify-center hover:bg-gray-100 active:bg-gray-200 transition-colors duration-200 h-14">
            <p class="text-base font-semibold tracking-wide text-gray-900">{{ category.name }}</p>
          </a>
        </div>

        <div class="hidden sm:flex justify-center">
          <div class="flex gap-6 overflow-x-auto scrollbar-hide">
            <a v-for="category in categories" 
               :key="category.id"
               href="#"
               @click.prevent="handleCategoryClick(category.id)"
               class="min-w-[150px] h-auto p-3 bg-white border border-gray-200 rounded-lg shadow-sm flex items-center justify-center hover:bg-gray-100 transition-colors duration-200">
              <p class="text-lg font-semibold tracking-wide text-gray-900">{{ category.name }}</p>
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <LayoutModal 
      :is-open="showModal" 
      :title="`Lo más popular en ${categories.find(c => c.id === selectedCategory)?.name || ''}`" 
      @close="showModal = false"
      class="z-50"
    >
      <div class="p-4 max-h-[70vh] overflow-y-auto">
        <div v-if="isLoading" class="flex justify-center items-center py-8">
          <i class="pi pi-spin pi-spinner text-3xl text-gray-500"></i>
        </div>

        <div v-else-if="error" class="text-red-500 text-center py-4">
          {{ error }}
        </div>

        <div v-else-if="!events || events.length === 0" class="text-center text-gray-500 py-8">
          No hay eventos disponibles en esta categoría
        </div>

        <div v-else class="space-y-3">
          <NuxtLink 
            v-for="event in events" 
            :key="event.id" 
            :to="`/events/${event.id}`"
            class="block bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div class="flex justify-between items-start">
              <div>
                <h3 class="font-semibold text-lg mb-1">{{ event.title }}</h3>
                <p class="text-gray-600 text-sm">{{ event.venue?.name }}</p>
              </div>
              <p class="text-gray-600 text-sm whitespace-nowrap ml-4">
                {{ new Date(event.dateTime).toLocaleDateString('es-ES') }}
              </p>
            </div>
          </NuxtLink>
        </div>
      </div>
    </LayoutModal>
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

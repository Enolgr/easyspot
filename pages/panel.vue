<script setup>

definePageMeta({
  middleware: ['auth', 'promoter']
})

import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import Modal from '@/components/layout/Modal.vue'
import { getAuth } from 'firebase/auth'

const userStore = useUserStore()

const canRender = computed(() => {
  return userStore.isReady && userStore.isLoggedIn && userStore.user?.role === 'Promoter'
})

const activeSection = ref('dashboard')
const sidebarCollapsed = ref(false)
const selectedEvent = ref(null)
const isCreatingEvent = ref(false)
const isLoading = ref(true)
const searchQuery = ref('')
const formError = ref('')
const formSuccess = ref('')
const showPastEvents = ref(false)
const showDeleteModal = ref(false)
const eventToDelete = ref(null)

const stats = ref({
  totalEvents: 0,
  upcomingEvents: 0,
  totalTicketsSold: 0,
  totalRevenue: 0
})

const events = ref([])
const recentEvents = ref([])
const topEvents = ref([])
const salesData = ref([])

topEvents.value = events.value.map(e => ({
  id: e.id,
  title: e.title,
  ticketsSold: e.ticketsSold,
  percentageSold: Math.round((e.ticketsSold / e.totalTickets) * 100)
}))

const eventForm = ref({
  id: null,
  title: '',
  description: '',
  date: '',
  time: '',
  venue: '',
  newVenue: '',
  venueAddress: '',
  venueCapacity: '',
  city: '',
  price: '',
  totalTickets: '',
  category: '',
  poster: null
})

const venues = ref([])
const categories = ref([])

onMounted(async () => {
  await loadData()
  await loadCategories()
})

const loadCategories = async () => {
  try {
    const { data } = await useFetch('/api/categories')
    categories.value = data.value || []
  } catch (error) {
    console.error('Error al cargar categorías:', error)
    categories.value = []
  }
}

const loadData = async () => {
  isLoading.value = true
  try {
    const auth = getAuth()
    const token = await auth.currentUser.getIdToken()

    const { data: venueData } = await useFetch('/api/dashboard/venues', {
      headers: { Authorization: `Bearer ${token}` }
    })
    venues.value = venueData.value || []

    const { data, error } = await useFetch('/api/dashboard/admin-events', {
      headers: { Authorization: `Bearer ${token}` }
    })

    if (error.value) throw new Error(error.value.message)

    events.value = Array.isArray(data.value) ? data.value : []
    recentEvents.value = events.value.slice(0, 4)

    // Preparar datos para la gráfica solo con eventos próximos
    const now = new Date()
    topEvents.value = events.value
      .filter(e => new Date(e.dateTime) > now)
      .map(e => ({
        id: e.id,
        title: e.title,
        ticketsSold: e.ticketsSold || 0,
        percentageSold: Math.round(((e.ticketsSold || 0) / e.totalTickets) * 100)
      }))

    stats.value = {
      totalEvents: events.value.length,
      upcomingEvents: 0,
      totalTicketsSold: events.value.reduce((acc, e) => acc + e.ticketsSold, 0),
      totalRevenue: events.value.reduce((acc, e) => acc + e.revenue, 0)
    }
  } catch (error) {
    console.error('Error al cargar datos:', error)
    events.value = []
  } finally {
    isLoading.value = false
  }
}

const saveEvent = async () => {
  formError.value = ''
  formSuccess.value = ''
  try {
    // 🚨 Primero, validar que la fecha no sea pasada
    const selectedDateTime = new Date(`${eventForm.value.date}T${eventForm.value.time}`)
    const now = new Date()

    if (selectedDateTime < now) {
      formError.value = 'No puedes crear un evento con fecha pasada.'
      return
    }

    // 🚀 Si pasa la validación, continuamos
    const auth = getAuth()
    const token = await auth.currentUser.getIdToken()

    const formData = new FormData()
    formData.append('title', eventForm.value.title)
    formData.append('description', eventForm.value.description)
    formData.append('date', eventForm.value.date)
    formData.append('time', eventForm.value.time)
    formData.append('city', eventForm.value.city)
    formData.append('price', eventForm.value.price)
    formData.append('totalTickets', eventForm.value.totalTickets)
    formData.append('categoryId', eventForm.value.category || '')

    if (eventForm.value.venue) {
      formData.append('venueId', eventForm.value.venue)
    } else if (eventForm.value.newVenue) {
      formData.append('venueName', eventForm.value.newVenue)
      formData.append('venueCity', eventForm.value.city)
      formData.append('venueCapacity', eventForm.value.venueCapacity || '10000')
      formData.append('venueAddress', eventForm.value.venueAddress || '')
    }

    if (eventForm.value.poster) {
      formData.append('poster', eventForm.value.poster, eventForm.value.poster.name)
    }

    const res = await fetch('/api/dashboard/admin-events', {
      method: 'POST',
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    if (!res.ok) {
      const err = await res.text()
      throw new Error(err || 'Error al crear el evento')
    }

    await loadData()
    formSuccess.value = 'Evento creado correctamente'
    activeSection.value = 'events'
    isCreatingEvent.value = false
  } catch (error) {
    console.error('Error al guardar evento:', error)
    formError.value = error.message || 'Error al guardar el evento'
  }
}

const createEvent = () => {
  eventForm.value = {
    id: null,
    title: '',
    description: '',
    date: '',
    time: '',
    venue: '',
    newVenue: '',
    venueAddress: '',
    venueCapacity: '',
    city: '',
    price: '',
    totalTickets: '',
    category: '',
    poster: null
  }
  isCreatingEvent.value = true
  activeSection.value = 'eventForm'
}

const editEvent = (event) => {
  eventForm.value = { ...event, venue: event.venueId || '', newVenue: '', venueAddress: '', venueCapacity: '', poster: null }
  isCreatingEvent.value = false
  activeSection.value = 'eventForm'
}

const viewEventDetails = (event) => {
  selectedEvent.value = event
  activeSection.value = 'eventDetails'
}

const deleteEvent = async (eventId) => {
  eventToDelete.value = eventId
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  try {
    const auth = getAuth()
    const token = await auth.currentUser.getIdToken()

    const res = await fetch(`/api/dashboard/${eventToDelete.value}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    if (!res.ok) {
      const err = await res.text()
      throw new Error(err || 'Error al eliminar el evento')
    }

    await loadData()
    showDeleteModal.value = false
    eventToDelete.value = null
  } catch (error) {
    console.error('Error al eliminar evento:', error)
    formError.value = error.message || 'Error al eliminar el evento'
  }
}

const formatDate = (dateTimeString) => {
  const date = new Date(dateTimeString)
  return date.toLocaleString('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).replace(',', '')
}

const formatCurrency = (value) => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR'
  }).format(value)
}

const filteredEvents = computed(() => {
  let result = [...events.value].reverse()
  
  // Filtrar por búsqueda
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(event => 
      event.title.toLowerCase().includes(query) || 
      event.venue?.toLowerCase().includes(query) ||
      event.city.toLowerCase().includes(query)
    )
  }

  // Filtrar por estado (finalizados/próximos)
  const now = new Date()
  result = result.filter(event => {
    const isPast = new Date(event.dateTime) < now
    event.isPast = isPast // Asignar el estado isPast a cada evento
    return showPastEvents.value ? isPast : !isPast
  })

  return result
})

</script>



<template>
  <div class="min-h-screen bg-gray-50" v-if="canRender">
    <div class="flex flex-col">
      <header class="bg-white shadow px-4 sm:px-6 py-4">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 class="text-xl font-bold">Panel de Promotor</h1>
          <div class="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" v-model="showPastEvents" class="sr-only peer">
              <div
                class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-slate-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-slate-600">
              </div>
              <span class="ml-3 text-sm font-medium text-gray-700">Ver finalizados</span>
            </label>
            <NuxtLink to="/"
              class="w-full sm:w-auto bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-md flex items-center justify-center gap-2">
              <i class="pi pi-arrow-left"></i>
              Volver a la tienda
            </NuxtLink>
            <button @click="createEvent"
              class="w-full sm:w-auto bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-md">
              Crear Evento
            </button>
          </div>
        </div>
      </header>

      <main class="p-6 space-y-8">
        <section class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="bg-white p-6 rounded-md shadow">
            <h3 class="text-lg font-semibold mb-4">Ventas de Entradas</h3>
            <div class="h-48 flex items-center justify-center text-gray-400">
              <LayoutGraphic :sales-data="topEvents" />
            </div>
          </div>

          <div class="bg-white p-6 rounded-md shadow flex flex-col items-center justify-center">
            <h3 class="text-lg font-semibold mb-2">Total Ingresos</h3>
            <p class="text-3xl font-bold text-slate-700">{{ formatCurrency(stats.totalRevenue) }}</p>
          </div>
        </section>

        <section>
          <h2 class="text-lg font-semibold mb-4">Tus eventos</h2>

          <div v-if="isLoading" class="text-center py-10">
            <i class="pi pi-spin pi-spinner text-3xl text-gray-500"></i>
          </div>

          <div v-else-if="filteredEvents.length === 0" class="text-gray-500">
            No tienes eventos creados.
          </div>

          <div class="overflow-x-auto">
            <table class="min-w-full bg-white shadow border rounded-md">
              <thead class="bg-gray-100 text-left text-sm font-medium">
                <tr>
                  <th class="px-4 py-3 whitespace-nowrap">Título</th>
                  <th class="px-4 py-3 whitespace-nowrap">Ciudad</th>
                  <th class="px-4 py-3 whitespace-nowrap">Estado</th>
                  <th class="px-4 py-3 whitespace-nowrap">Fecha</th>
                  <th class="px-4 py-3 whitespace-nowrap">Entradas</th>
                  <th class="px-4 py-3 whitespace-nowrap">Ingresos</th>
                  <th class="px-4 py-3 whitespace-nowrap text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="event in filteredEvents" :key="event.id" class="border-t text-sm">
                  <td class="px-4 py-2 whitespace-nowrap">{{ event.title }}</td>
                  <td class="px-4 py-2 whitespace-nowrap">{{ event.city }}</td>
                  <td class="px-4 py-2 whitespace-nowrap">
                    <span :class="event.isPast ? 'text-purple-400' : 'text-green-600'">
                      {{ event.isPast ? 'Finalizado' : 'Próximo' }}
                    </span>
                  </td>
                  <td class="px-4 py-2 whitespace-nowrap">{{ formatDate(event.dateTime) }}</td>
                  <td class="px-4 py-2 whitespace-nowrap">{{ event.ticketsSold }} / {{ event.totalTickets }}</td>
                  <td class="px-4 py-2 whitespace-nowrap">{{ formatCurrency(event.revenue) }}</td>
                  <td class="px-4 py-2 whitespace-nowrap text-right">
                    <button @click="deleteEvent(event.id)" class="text-red-600 hover:underline">Eliminar</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <Modal :is-open="isCreatingEvent" title="Crear Evento" @close="isCreatingEvent = false" class="max-w-4xl">
          <form @submit.prevent="saveEvent" class="space-y-6">
            <div v-if="formError" class="text-red-600 bg-red-100 p-3 rounded-md mb-4">
              {{ formError }}
            </div>
            <div v-if="formSuccess" class="text-green-700 bg-green-100 p-3 rounded-md mb-4">
              {{ formSuccess }}
            </div>

            <!-- Información básica -->
            <div class="space-y-4">
              <h3 class="text-lg font-medium text-gray-800 border-b pb-2">Información básica</h3>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Título del evento</label>
                <input type="text" v-model="eventForm.title" placeholder="Título" required class="input h-12" />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <textarea v-model="eventForm.description" placeholder="Descripción" required
                  class="input h-32 py-3"></textarea>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                <select v-model="eventForm.category" class="input h-12">
                  <option value="">Selecciona categoría</option>
                  <option v-for="category in categories" :key="category.id" :value="category.id">
                    {{ category.name }}
                  </option>
                </select>
              </div>
            </div>

            <!-- Fecha y ubicación -->
            <div class="space-y-4">
              <h3 class="text-lg font-medium text-gray-800 border-b pb-2">Fecha y ubicación</h3>

              <div class="flex flex-col md:flex-row gap-4">
                <div class="flex-1">
                  <label class="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
                  <div class="relative">
                    <i class="pi pi-calendar absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                    <input type="date" v-model="eventForm.date" required class="input h-12 pr-10" />
                  </div>
                </div>

                <div class="flex-1">
                  <label class="block text-sm font-medium text-gray-700 mb-1">Hora</label>
                  <div class="relative">
                    <i class="pi pi-clock absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                    <input type="time" v-model="eventForm.time" required class="input h-12 pr-10" />
                  </div>
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Ciudad</label>
                <input type="text" v-model="eventForm.city" placeholder="Ciudad" required class="input h-12" />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Recinto</label>
                <select v-model="eventForm.venue" class="input h-12">
                  <option value="">Selecciona recinto</option>
                  <option v-for="venue in venues" :key="venue.id" :value="venue.id">
                    {{ venue.name }} - {{ venue.city }}
                  </option>
                </select>
              </div>
            </div>

            <!-- Nuevo Recinto (condicional) -->
            <div v-if="!eventForm.venue" class="space-y-4 p-5 bg-gray-50 rounded-lg border border-gray-200">
              <h3 class="text-base font-medium text-gray-700">Nuevo Recinto</h3>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Nombre del recinto</label>
                <input type="text" v-model="eventForm.newVenue" placeholder="Nombre del recinto" class="input h-12" />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                <input type="text" v-model="eventForm.venueAddress" placeholder="Dirección" class="input h-12" />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Capacidad</label>
                <input type="number" v-model="eventForm.venueCapacity" placeholder="Capacidad" class="input h-12" />
              </div>
            </div>

            <!-- Entradas y precios -->
            <div class="space-y-4">
              <h3 class="text-lg font-medium text-gray-800 border-b pb-2">Entradas y precios</h3>

              <div class="flex flex-col md:flex-row gap-4">
                <div class="flex-1">
                  <label class="block text-sm font-medium text-gray-700 mb-1">Precio (€)</label>
                  <input type="number" v-model="eventForm.price" placeholder="Precio (€)" required class="input h-12" />
                </div>

                <div class="flex-1">
                  <label class="block text-sm font-medium text-gray-700 mb-1">Total entradas</label>
                  <input type="number" v-model="eventForm.totalTickets" placeholder="Total entradas" required
                    class="input h-12" />
                </div>
              </div>
            </div>

            <!-- Imagen del evento -->
            <div class="space-y-4">
              <h3 class="text-lg font-medium text-gray-800 border-b pb-2">Imagen del evento</h3>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Poster del evento</label>
                <input type="file" @change="e => eventForm.poster = e.target.files[0]" accept="image/*"
                  class="input py-3" />
              </div>
            </div>

            <!-- Botones de acción -->
            <div class="flex justify-end gap-3 mt-8 pt-4 border-t">
              <button type="button" @click="isCreatingEvent = false" class="btn-secondary py-3 px-6">Cancelar</button>
              <button type="submit" class="btn-primary py-3 px-6">Guardar</button>
            </div>
          </form>
        </Modal>
        <Modal :is-open="showDeleteModal" title="Confirmar eliminación" @close="showDeleteModal = false">
          <div class="p-4">
            <p class="text-gray-700 mb-4">¿Estás seguro de que deseas eliminar este evento? Esta acción no se puede
              deshacer.</p>
            <div class="flex justify-end gap-2">
              <button @click="showDeleteModal = false" class="btn-secondary">Cancelar</button>
              <button @click="confirmDelete" class="btn-primary bg-red-600 hover:bg-red-700">Eliminar</button>
            </div>
          </div>
        </Modal>

      </main>
    </div>
  </div>
</template>

<style scoped>
.input {
  @apply w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-500;
}
.btn-primary {
  @apply bg-slate-700 text-white px-4 py-2 rounded-md hover:bg-slate-600;
}
.btn-secondary {
  @apply bg-white text-slate-700 px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-50;
}
</style>
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

const eventForm = ref({
  id: null,
  title: '',
  description: '',
  date: '',
  time: '',
  venue: '',
  newVenue: '',
  venueCapacity: '',
  city: '',
  price: '',
  totalTickets: '',
  category: '',
  poster: null
})

const venues = ref([])

const categories = ref([
  { id: 'music', name: 'Música' },
  { id: 'festival', name: 'Festival' },
  { id: 'concert', name: 'Concierto' },
  { id: 'theater', name: 'Teatro' },
  { id: 'comedy', name: 'Comedia' }
])

onMounted(async () => {
  await loadData()
})

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
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    if (error.value) throw new Error(error.value.message)

    events.value = Array.isArray(data.value) ? data.value : []
    recentEvents.value = events.value.slice(0, 4)

    topEvents.value = events.value.map(e => ({
      id: e.id,
      title: e.title,
      ticketsSold: e.ticketsSold,
      percentageSold: Math.round((e.ticketsSold / e.totalTickets) * 100)
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
  try {
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
    formData.append('category', eventForm.value.category || '')

    if (eventForm.value.venue) {
      formData.append('venueId', eventForm.value.venue)
    } else if (eventForm.value.newVenue) {
      formData.append('venueName', eventForm.value.newVenue)
      formData.append('venueCity', eventForm.value.city)
      formData.append('venueCapacity', eventForm.value.venueCapacity || '10000')
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
    alert('Evento creado correctamente')
    activeSection.value = 'events'
    isCreatingEvent.value = false
  } catch (error) {
    console.error('Error al guardar evento:', error)
    alert(error.message || 'Error al guardar el evento')
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
  eventForm.value = { ...event, venue: event.venueId || '', newVenue: '', venueCapacity: '', poster: null }
  isCreatingEvent.value = false
  activeSection.value = 'eventForm'
}

const viewEventDetails = (event) => {
  selectedEvent.value = event
  activeSection.value = 'eventDetails'
}

const deleteEvent = (eventId) => {
  if (confirm('¿Estás seguro de que deseas eliminar este evento?')) {
    events.value = events.value.filter(event => event.id !== eventId)
    alert('Evento eliminado correctamente')
  }
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const formatCurrency = (value) => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR'
  }).format(value)
}

const filteredEvents = computed(() => {
  let result = [...events.value]
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(event => 
      event.title.toLowerCase().includes(query) || 
      event.venue?.toLowerCase().includes(query) ||
      event.city.toLowerCase().includes(query)
    )
  }
  return result
})

const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value
}
</script>



<template>
  <div class="min-h-screen bg-gray-50" v-if="canRender">
    <div class="flex flex-col">
      <header class="bg-white shadow px-6 py-4 flex items-center justify-between">
        <h1 class="text-xl font-bold">Panel de Promotor</h1>
        <button @click="createEvent" class="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-md">
          Crear Evento
        </button>
      </header>

      <main class="p-6 space-y-8">
        <section>
          <h2 class="text-lg font-semibold mb-4">Tus eventos</h2>

          <div v-if="isLoading" class="text-center py-10">
            <i class="pi pi-spin pi-spinner text-3xl text-gray-500"></i>
          </div>

          <div v-else-if="filteredEvents.length === 0" class="text-gray-500">
            No tienes eventos creados.
          </div>

          <table v-else class="min-w-full bg-white shadow border rounded-md overflow-hidden">
            <thead class="bg-gray-100 text-left text-sm font-medium">
              <tr>
                <th class="px-4 py-3">Título</th>
                <th class="px-4 py-3">Ciudad</th>
                <th class="px-4 py-3">Fecha</th>
                <th class="px-4 py-3">Entradas</th>
                <th class="px-4 py-3">Ingresos</th>
                <th class="px-4 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="event in filteredEvents" :key="event.id" class="border-t text-sm">
                <td class="px-4 py-2">{{ event.title }}</td>
                <td class="px-4 py-2">{{ event.city }}</td>
                <td class="px-4 py-2">{{ formatDate(event.date) }}</td>
                <td class="px-4 py-2">{{ event.ticketsSold }} / {{ event.totalTickets }}</td>
                <td class="px-4 py-2">{{ formatCurrency(event.revenue) }}</td>
                <td class="px-4 py-2 text-right space-x-2">
                  <button @click="editEvent(event)" class="text-blue-600 hover:underline">Editar</button>
                  <button @click="deleteEvent(event.id)" class="text-red-600 hover:underline">Eliminar</button>
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        <Modal :is-open="isCreatingEvent" title="Crear Evento" @close="isCreatingEvent = false">
          <form @submit.prevent="saveEvent" class="space-y-4">
            <input type="text" v-model="eventForm.title" placeholder="Título" required class="input" />
            <textarea v-model="eventForm.description" placeholder="Descripción" required class="input"></textarea>
            <div class="grid grid-cols-2 gap-4">
              <input type="date" v-model="eventForm.date" required class="input" />
              <input type="time" v-model="eventForm.time" required class="input" />
            </div>
            <input type="text" v-model="eventForm.city" placeholder="Ciudad" required class="input" />
            <select v-model="eventForm.venue" class="input">
              <option value="">Selecciona recinto</option>
              <option v-for="venue in venues" :key="venue.id" :value="venue.id">
                {{ venue.name }} - {{ venue.city }}
              </option>
            </select>
            <div v-if="!eventForm.venue" class="space-y-2">
              <input type="text" v-model="eventForm.newVenue" placeholder="Nuevo recinto" class="input" />
              <input type="number" v-model="eventForm.venueCapacity" placeholder="Capacidad del recinto" class="input" />
            </div>
            <div class="grid grid-cols-2 gap-4">
              <input type="number" v-model="eventForm.price" placeholder="Precio (€)" required class="input" />
              <input type="number" v-model="eventForm.totalTickets" placeholder="Total entradas" required class="input" />
            </div>
            <select v-model="eventForm.category" class="input">
              <option value="">Selecciona categoría</option>
              <option v-for="category in categories" :key="category.id" :value="category.id">
                {{ category.name }}
              </option>
            </select>
            <input type="file" @change="e => eventForm.poster = e.target.files[0]" accept="image/*" class="input" />
            <div class="flex justify-end gap-2">
              <button type="button" @click="isCreatingEvent = false" class="btn-secondary">Cancelar</button>
              <button type="submit" class="btn-primary">Guardar</button>
            </div>
          </form>
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
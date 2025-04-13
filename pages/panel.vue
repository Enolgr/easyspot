<script setup>

definePageMeta({
  middleware: ['auth', 'promoter']
})

import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'

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
const statusFilter = ref('all')

const stats = ref({
  totalEvents: 24,
  upcomingEvents: 8,
  totalTicketsSold: 3842,
  totalRevenue: 127650
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
  city: '',
  price: '',
  totalTickets: '',
  category: '',
  status: 'upcoming'
})

const venues = ref([
  { id: 1, name: 'Estadio Metropolitano', city: 'Madrid', capacity: 68000 },
  { id: 2, name: 'Palacio de Deportes', city: 'Barcelona', capacity: 15000 },
  { id: 3, name: 'Teatro Principal', city: 'Valencia', capacity: 1200 },
  { id: 4, name: 'Recinto Ferial', city: 'Sevilla', capacity: 25000 },
  { id: 5, name: 'Plaza de Toros', city: 'Málaga', capacity: 9000 }
])

const categories = ref([
  { id: 'music', name: 'Música' },
  { id: 'festival', name: 'Festival' },
  { id: 'concert', name: 'Concierto' },
  { id: 'theater', name: 'Teatro' },
  { id: 'comedy', name: 'Comedia' }
])

const salesByDay = ref([
  { date: '2023-05-01', sales: 120 },
  { date: '2023-05-02', sales: 85 },
  { date: '2023-05-03', sales: 94 },
  { date: '2023-05-04', sales: 112 },
  { date: '2023-05-05', sales: 180 },
  { date: '2023-05-06', sales: 160 },
  { date: '2023-05-07', sales: 140 },
  { date: '2023-05-08', sales: 95 },
  { date: '2023-05-09', sales: 78 },
  { date: '2023-05-10', sales: 86 },
  { date: '2023-05-11', sales: 100 }
])

const ticketTypes = ref([
  { type: 'General', count: 850, percentage: 68 },
  { type: 'VIP', count: 250, percentage: 20 },
  { type: 'Palco', count: 150, percentage: 12 }
])

const menuItems = [
  { name: 'Dashboard', icon: 'pi-home', section: 'dashboard' },
  { name: 'Eventos', icon: 'pi-calendar', section: 'events' }
]

onMounted(async () => {
  await loadData()
})

const loadData = async () => {
  isLoading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 800))
    events.value = [
      {
        id: 1,
        title: 'Festival de Verano',
        description: 'Conciertos al aire libre con múltiples artistas.',
        date: '2023-07-15',
        time: '19:00',
        venue: 'Estadio Metropolitano',
        city: 'Madrid',
        price: 35,
        totalTickets: 10000,
        ticketsSold: 8200,
        revenue: 287000,
        category: 'festival',
        status: 'upcoming'
      },
      {
        id: 2,
        title: 'Noche de Comedia',
        description: 'Los mejores cómicos del país reunidos en una sola noche.',
        date: '2023-06-10',
        time: '21:00',
        venue: 'Teatro Principal',
        city: 'Valencia',
        price: 18,
        totalTickets: 1000,
        ticketsSold: 750,
        revenue: 13500,
        category: 'comedy',
        status: 'upcoming'
      }
    ]
    recentEvents.value = events.value.slice(0, 4)
    topEvents.value = events.value.map(e => ({
      id: e.id,
      title: e.title,
      ticketsSold: e.ticketsSold,
      percentageSold: Math.round((e.ticketsSold / e.totalTickets) * 100)
    }))
    salesData.value = [
      { month: 'Ene', sales: 12000 },
      { month: 'Feb', sales: 15000 },
      { month: 'Mar', sales: 18000 },
      { month: 'Abr', sales: 20000 },
      { month: 'May', sales: 25000 }
    ]
    isLoading.value = false
  } catch (error) {
    console.error('Error al cargar datos:', error)
    isLoading.value = false
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
    city: '',
    price: '',
    totalTickets: '',
    category: '',
    status: 'upcoming'
  }
  isCreatingEvent.value = true
  activeSection.value = 'eventForm'
}

const editEvent = (event) => {
  eventForm.value = { ...event }
  isCreatingEvent.value = false
  activeSection.value = 'eventForm'
}

const viewEventDetails = (event) => {
  selectedEvent.value = event
  activeSection.value = 'eventDetails'
}

const saveEvent = () => {
  alert(isCreatingEvent.value ? 'Evento creado correctamente' : 'Evento actualizado correctamente')
  activeSection.value = 'events'
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

const getStatusClass = (status) => {
  if (status === 'upcoming') return 'bg-green-100 text-green-800'
  if (status === 'completed') return 'bg-gray-100 text-gray-800'
  if (status === 'cancelled') return 'bg-red-100 text-red-800'
  return 'bg-gray-100 text-gray-800'
}

const getStatusText = (status) => {
  if (status === 'upcoming') return 'Próximo'
  if (status === 'completed') return 'Completado'
  if (status === 'cancelled') return 'Cancelado'
  return status
}

const filteredEvents = computed(() => {
  let result = [...events.value]
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(event => 
      event.title.toLowerCase().includes(query) || 
      event.venue.toLowerCase().includes(query) ||
      event.city.toLowerCase().includes(query)
    )
  }
  if (statusFilter.value !== 'all') {
    result = result.filter(event => event.status === statusFilter.value)
  }
  return result
})

const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value
}
</script>
<template>
  <div class="min-h-screen bg-gray-50" v-if="canRender">
    <!-- Main content -->
    <div class="flex flex-col overflow-hidden">
      <header class="bg-white border-b border-gray-200 shadow-sm">
        <div class="flex items-center justify-between px-6 py-3">
          <h1 class="text-xl font-semibold text-slate-800">
            {{ 
              activeSection === 'dashboard' ? 'Dashboard' : 
              activeSection === 'events' ? 'Gestión de Eventos' :
              'Panel de Administración'
            }}
          </h1>
        </div>
      </header>

      <main class="flex-1 overflow-y-auto p-6">
        <div class="mb-6">
          <NuxtLink to="/" class="text-slate-600 hover:text-slate-900 flex items-center text-sm">
            <i class="pi pi-arrow-left mr-2"></i>
            Volver al inicio
          </NuxtLink>
        </div>
        <div v-if="isLoading" class="flex justify-center items-center h-64">
          <i class="pi pi-spin pi-spinner text-slate-600 text-4xl"></i>
        </div>

        <div v-else class="space-y-10">
          <!-- Dashboard content -->
          <section>
            <h2 class="text-2xl font-bold text-slate-800 mb-6">Dashboard</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <p class="text-sm text-gray-500 mb-1">Total Eventos</p>
                <h3 class="text-2xl font-bold text-slate-800">{{ stats.totalEvents }}</h3>
              </div>
              <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <p class="text-sm text-gray-500 mb-1">Eventos Próximos</p>
                <h3 class="text-2xl font-bold text-slate-800">{{ stats.upcomingEvents }}</h3>
              </div>
              <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <p class="text-sm text-gray-500 mb-1">Entradas Vendidas</p>
                <h3 class="text-2xl font-bold text-slate-800">{{ stats.totalTicketsSold }}</h3>
              </div>
              <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <p class="text-sm text-gray-500 mb-1">Ingresos Totales</p>
                <h3 class="text-2xl font-bold text-slate-800">{{ formatCurrency(stats.totalRevenue) }}</h3>
              </div>
            </div>
          </section>

          <!-- Events content -->
          <section>
            <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div>
                <h2 class="text-2xl font-bold text-slate-800">Gestión de Eventos</h2>
              </div>
              <div class="flex flex-col md:flex-row md:items-center gap-4">
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="Buscar eventos..."
                  class="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 bg-white text-gray-900"
                />
                <select
                  v-model="statusFilter"
                  class="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 bg-white text-gray-900"
                >
                  <option value="all">Todos los estados</option>
                  <option value="upcoming">Próximos</option>
                  <option value="completed">Completados</option>
                  <option value="cancelled">Cancelados</option>
                </select>
                <button
                  @click="createEvent"
                  class="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-md flex items-center"
                >
                  <i class="pi pi-plus mr-2"></i>
                  Crear Evento
                </button>
              </div>
            </div>

            <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-gray-50">
                    <tr>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Evento</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ubicación</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ventas</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Beneficio</th>
                      <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                    <tr v-for="event in filteredEvents" :key="event.id" class="hover:bg-gray-50">
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="font-medium text-slate-800">{{ event.title }}</div>
                        <div class="text-sm text-gray-500">{{ formatCurrency(event.price) }} / entrada</div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-gray-600">{{ formatDate(event.date) }}</td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-gray-800">{{ event.venue }}</div>
                        <div class="text-sm text-gray-500">{{ event.city }}</div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <span :class="[getStatusClass(event.status), 'px-2 py-1 text-xs rounded-full']">
                          {{ getStatusText(event.status) }}
                        </span>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm font-medium text-slate-800">
                          {{ event.ticketsSold }}/{{ event.totalTickets }}
                        </div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-slate-800">
                        {{ formatCurrency(event.revenue) }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button @click="viewEventDetails(event)" class="text-slate-600 hover:text-slate-900 mr-3">
                          <i class="pi pi-eye"></i>
                        </button>
                        <button @click="editEvent(event)" class="text-slate-600 hover:text-slate-900 mr-3">
                          <i class="pi pi-pencil"></i>
                        </button>
                        <button @click="deleteEvent(event.id)" class="text-red-600 hover:text-red-900">
                          <i class="pi pi-trash"></i>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  </div>
</template>

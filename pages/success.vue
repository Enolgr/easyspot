<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const sessionId = route.query.session_id;
const order = ref(null);
const errorMessage = ref('');
const loading = ref(true);

const formatCurrency = (value) => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR'
  }).format(value);
};

onMounted(async () => {
  if (sessionId) {
    try {
      const response = await $fetch('/api/order-by-session', {
        query: { session_id: sessionId }
      });
      order.value = response.order;
    } catch (error) {
      errorMessage.value = error.data?.message || 'No se encontró la orden';
    }
  } else {
    errorMessage.value = 'Session ID no proporcionado.';
  }

  loading.value = false;
});
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center p-4">
    <div class="w-full max-w-3xl shadow-md border border-gray-200 rounded-lg overflow-hidden">
      <!-- Header -->
      <div class="bg-slate-700 p-6 flex flex-col items-center justify-center">
        <i class="pi pi-check-circle text-6xl mb-2 text-white"></i>
        <h1 class="text-3xl font-bold text-white">¡Compra Exitosa!</h1>
      </div>

      <!-- Content -->
      <div class="p-6 bg-white">
        <div v-if="loading" class="flex flex-col items-center justify-center py-8">
          <i class="pi pi-spin pi-spinner text-slate-600 text-4xl mb-4"></i>
          <p class="text-gray-600">Cargando información de tu compra...</p>
        </div>

        <div v-else-if="errorMessage" class="my-8">
          <div class="bg-red-50 border-l-4 border-red-600 p-4 rounded-r-md">
            <div class="flex items-center">
              <i class="pi pi-exclamation-triangle mr-2 text-red-600"></i>
              <span>{{ errorMessage }}</span>
            </div>
          </div>
        </div>

        <div v-else-if="order" class="space-y-6">
          <div class="bg-gray-50 border-l-4 border-slate-600 p-4 rounded-r-md">
            <div class="flex items-center">
              <i class="pi pi-user mr-2 text-slate-600"></i>
              <span>Gracias por tu compra, <strong>{{ order.user.displayName || order.user.email }}</strong>.</span>
            </div>
          </div>

          <div class="bg-gray-50 p-4 rounded-md border border-gray-200">
            <div class="flex items-center justify-between mb-2">
              <span class="text-gray-700 flex items-center">
                <i class="pi pi-euro mr-2 text-slate-600"></i>
                <span>Total pagado:</span>
              </span>
              <span class="text-2xl font-bold text-slate-700">{{ formatCurrency(order.totalAmount) }}</span>
            </div>
            <p class="text-gray-600 flex items-center">
              <i class="pi pi-envelope mr-2 text-slate-600"></i>
              <span>Revisa tu correo para ver tu entrada.</span>
            </p>
          </div>

          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-200"></div>
            </div>
            <div class="relative flex justify-center">
              <span class="px-3 bg-white text-gray-500 text-sm">Tus Tickets</span>
            </div>
          </div>

          <div v-if="order.tickets && order.tickets.length > 0" class="space-y-3">
            <div v-for="ticket in order.tickets" :key="ticket.id" 
                class="border border-gray-200 rounded-md p-4 hover:bg-gray-50 transition-colors duration-200">
              <div class="flex items-center space-x-2">
                <i class="pi pi-ticket text-slate-600"></i>
                <span class="font-medium">Ticket ID: {{ ticket.id }}</span>
              </div>
              <div class="text-sm text-gray-500">Código: <code>{{ ticket.qr }}</code></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="flex justify-center p-4 bg-gray-50 border-t border-gray-200">
        <button 
          class="flex items-center px-4 py-2 bg-slate-700 text-white rounded-md hover:bg-slate-600 transition-colors duration-200"
          @click="navigateTo('/')"
        >
          <i class="pi pi-arrow-left mr-2"></i>
          <span>Volver a la tienda</span>
        </button>
      </div>
    </div>
  </div>
</template>

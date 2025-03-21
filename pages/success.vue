<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const sessionId = route.query.session_id;
const order = ref(null);
const errorMessage = ref('');

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
  }
});
</script>

<template>
  <div class="success-page">
    <h1>¡Compra Exitosa!</h1>
    <div v-if="order">
      <p>Gracias por tu compra, {{ order.user.displayName || order.user.email }}.</p>
      <p>El total pagado fue: €{{ order.totalAmount }}</p>
      <p>Revisa tu correo para ver tu entrada.</p>
      <!-- Puedes mostrar más información, por ejemplo, detalles de cada ticket -->
      <div v-for="ticket in order.tickets" :key="ticket.id">
        <p>Ticket ID: {{ ticket.id }}</p>
      </div>
    </div>
    <div v-else>
      <p v-if="errorMessage">{{ errorMessage }}</p>
      <p v-else>Cargando información...</p>
    </div>
  </div>
</template>

<style scoped>
.success-page {
  padding: 2rem;
  text-align: center;
}
</style>

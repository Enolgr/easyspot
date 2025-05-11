<script setup>
import { onMounted, ref, watch } from 'vue'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

const props = defineProps({
  salesData: {
    type: Array,
    required: true
  }
})

const canvasRef = ref(null)
let chart = null

const initChart = () => {
  if (!canvasRef.value) return

  const ctx = canvasRef.value.getContext('2d')
  
  // Destruir el gráfico anterior si existe
  if (chart) {
    chart.destroy()
  }

  chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: props.salesData.map(item => item.title),
      datasets: [{
        label: 'Entradas Vendidas',
        data: props.salesData.map(item => item.ticketsSold),
        backgroundColor: 'rgba(71, 85, 105, 0.8)', // slate-600
        borderRadius: 8,
        barThickness: 30,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            color: '#64748b' // slate-500
          }
        },
        x: {
          ticks: {
            color: '#64748b',
            maxRotation: 0,
            minRotation: 0,
            autoSkip: true,
            maxTicksLimit: 5
          }
        }
      }
    }
  })
}

// Observar cambios en los datos
watch(() => props.salesData, () => {
  initChart()
}, { deep: true })

onMounted(() => {
  initChart()
})
</script>

<template>
  <div class="w-full h-full relative">
    <div v-if="!salesData || salesData.length === 0" class="absolute inset-0 flex items-center justify-center text-gray-400">
      No hay datos disponibles
    </div>
    <canvas ref="canvasRef" class="w-full h-full"></canvas>
  </div>
</template>

<style scoped>
canvas {
  max-height: 200px;
}
</style>

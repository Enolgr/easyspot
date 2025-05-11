<template>
  <div v-if="isOpen" class="fixed inset-0 z-50">
    <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
      <!-- Fondo -->
      <div class="fixed inset-0 transition-opacity" aria-hidden="true">
        <div class="absolute inset-0 bg-black opacity-70" @click="$emit('close')"></div>
      </div>

      <!-- Contenido del modal -->
      <div class="fixed inset-0 flex items-center justify-center p-4">
        <div class="relative bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all w-full max-w-lg flex flex-col max-h-[90vh]">
          <!-- Header fijo -->
          <div class="bg-white px-6 pt-6 pb-4 sm:p-6 sm:pb-4 flex-shrink-0">
            <div class="sm:flex sm:items-start">
              <div class="mt-3 text-center sm:mt-0 sm:text-left w-full">
                <div class="flex justify-between items-center mb-4">
                  <h3 class="text-xl leading-6 font-medium text-gray-900">
                    {{ title }}
                  </h3>
                  <button v-if="showClose" @click="$emit('close')" class="text-gray-500">
                    <i class="pi pi-times text-xl"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Contenido con scroll -->
          <div class="overflow-y-auto px-6 sm:px-8 flex-grow" style="max-height: calc(90vh - 130px);">
            <div class="mt-2">
              <slot></slot>
            </div>
          </div>
          
          <!-- Footer fijo -->
          <div class="bg-gray-50 px-6 py-4 sm:px-8 sm:flex sm:flex-row-reverse flex-shrink-0">
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { watch, onUnmounted } from 'vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  showClose: {
    type: Boolean,
    default: true
  }
})

defineEmits(['close'])

// Controlar el scroll del body cuando el modal está abierto
watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})

// Asegurar que el scroll se restaure cuando el componente se desmonte
onUnmounted(() => {
  document.body.style.overflow = ''
})
</script>

<style scoped>
/* Colores base */
.bg-black {
  background-color: #000000 !important;
}
.bg-gray-50 {
  background-color: #F9FAFB !important;
}
.bg-white {
  background-color: #FFFFFF !important;
}
.text-gray-900 {
  color: #111827 !important;
}

/* Estilos para el scroll */
.overflow-y-auto {
  scrollbar-width: thin;
  scrollbar-color: #CBD5E0 transparent;
}

.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: #CBD5E0;
  border-radius: 3px;
}

/* Forzar modo claro en inputs */
:deep(input) {
  background-color: #FFFFFF !important;
  color: #111827 !important;
  border-color: #E5E7EB !important;
  padding: 0.75rem 1rem !important;
  font-size: 1rem !important;
  line-height: 1.5 !important;
  margin-bottom: 1rem !important;
}

:deep(textarea) {
  background-color: #FFFFFF !important;
  color: #111827 !important;
  border-color: #E5E7EB !important;
  padding: 0.75rem 1rem !important;
  font-size: 1rem !important;
  line-height: 1.5 !important;
  margin-bottom: 1rem !important;
}

:deep(select) {
  background-color: #FFFFFF !important;
  color: #111827 !important;
  border-color: #E5E7EB !important;
  padding: 0.75rem 1rem !important;
  height: 3rem !important;
  font-size: 1rem !important;
  line-height: 1.5 !important;
  margin-bottom: 1rem !important;
}

/* Forzar modo claro en los botones */
:deep(button) {
  background-color: #FFFFFF !important;
  color: #374151 !important;
  padding: 0.75rem 1.5rem !important;
  font-size: 1rem !important;
}

:deep(button.bg-gray-600) {
  background-color: #4B5563 !important;
  color: #FFFFFF !important;
}




/* Estilos para los formularios dentro del modal */
:deep(.space-y-4) {
  margin-top: 1.5rem !important;
  margin-bottom: 1.5rem !important;
}

:deep(.grid) {
  gap: 1.5rem !important;
}

:deep(label) {
  display: block !important;
  margin-bottom: 0.5rem !important;
  font-weight: 500 !important;
}

:deep(.input) {
  height: auto !important;
  min-height: 3rem !important;
}

:deep(.col-span-3) {
  margin-bottom: 0.5rem !important;
}
</style>
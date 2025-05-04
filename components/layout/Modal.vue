<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
      <!-- Fondo -->
      <div class="fixed inset-0 transition-opacity" aria-hidden="true">
        <div class="absolute inset-0 bg-gray-500 opacity-75" @click="$emit('close')"></div>
      </div>

      <!-- Contenido del modal -->
      <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div class="sm:flex sm:items-start">
            <div class="mt-3 text-center sm:mt-0 sm:text-left w-full">
              <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
                {{ title }}
              </h3>
              <div class="mt-2">
                <slot></slot>
              </div>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    required: true
  }
})

defineEmits(['close'])
</script>

<style scoped>
/* Colores base */
.bg-gray-500 {
  background-color: #6B7280 !important;
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

/* Forzar modo claro en inputs */
:deep(input) {
  background-color: #FFFFFF !important;
  color: #111827 !important;
  border-color: #E5E7EB !important;
}

:deep(textarea) {
  background-color: #FFFFFF !important;
  color: #111827 !important;
  border-color: #E5E7EB !important;
}

:deep(select) {
  background-color: #FFFFFF !important;
  color: #111827 !important;
  border-color: #E5E7EB !important;
}

/* Forzar modo claro en los botones */
:deep(button) {
  background-color: #FFFFFF !important;
  color: #374151 !important;
}

:deep(button.bg-gray-600) {
  background-color: #4B5563 !important;
  color: #FFFFFF !important;
}

:deep(button:hover) {
  background-color: #F3F4F6 !important;
}

:deep(button.bg-gray-600:hover) {
  background-color: #374151 !important;
}
</style>

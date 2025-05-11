<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const searchValue = ref('')
const suggestions = ref([])
const isOpen = ref(false)

watch(searchValue, async (newVal) => {
  if (newVal.length >= 2) {
    const { data } = await useFetch(`/api/search?query=${encodeURIComponent(newVal)}`)
    suggestions.value = data.value?.results || []
    isOpen.value = true
  } else {
    suggestions.value = []
    isOpen.value = false
  }
})

const selectSuggestion = (event) => {
  router.push(`/events/${event.id}`)
  isOpen.value = false
}

const onEnter = () => {
  if (suggestions.value.length > 0) {
    selectSuggestion(suggestions.value[0])
  }
}
</script>

<template>
  <div class="relative w-full">
    <div class="searchbar flex px-2 w-full bg-slate-100 border border-gray-200 rounded-t-xl transition-all"
         :class="{ 'rounded-xl': !(isOpen && suggestions.length) }">
      <button type="button" class="p-2">
        <i class="pi pi-search text-gray-800 text-lg"></i>
      </button>
      <input
        type="text"
        v-model="searchValue"
        @keydown.enter.prevent="onEnter"
        class="w-full flex bg-transparent pl-1 py-2 text-black outline-0 text-sm"
        placeholder="Buscar eventos o ciudades..."
        @focus="isOpen = true"
      />
    </div>

    <div v-if="isOpen && suggestions.length" 
         class="dropdown-menu w-full bg-slate-100 border-x border-b border-gray-200 rounded-b-xl shadow-md z-20">
      <div v-if="suggestions.length" class="flex flex-col">
        <button 
          v-for="event in suggestions" 
          :key="event.id"
          @click="selectSuggestion(event)"
          class="text-left px-3 py-2 hover:bg-slate-200 transition-colors text-sm flex items-center"
        >
          <span class="truncate">{{ event.title }} — {{ event.city }}</span>
        </button>
      </div>

      <div v-if="isOpen && !suggestions.length" class="dropdown-menu w-full bg-slate-100 border-x border-b border-gray-200 rounded-b-xl shadow-md z-20">
        <div class="p-3 text-center text-gray-400 text-sm">
          No se encontraron resultados
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.transition-all {
  transition: all 0.3s ease;
}

.searchbar {
  z-index: 30;
  position: relative;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  margin-top: -1px;
  border-top: none;
}
</style>
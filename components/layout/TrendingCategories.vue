<template>
    <div class="w-full max-w-[1200px] mx-auto mt-3 sm:mt-5 p-3 sm:p-5">
      <h2 class="text-left text-2xl sm:text-3xl font-semibold text-gray-900 mb-3 sm:mb-6">
        Categorías Populares
      </h2>
  
      <!-- Mobile Grid Layout -->
      <div class="grid grid-cols-2 gap-3 sm:hidden">
        <a href="#"
          class="p-3 bg-white border border-gray-200 rounded-lg shadow-sm flex items-center justify-center hover:bg-gray-100 active:bg-gray-200 transition-colors duration-200 h-14">
          <p class="text-base font-semibold tracking-wide text-gray-900">Conciertos</p>
        </a>
        <a href="#"
          class="p-3 bg-white border border-gray-200 rounded-lg shadow-sm flex items-center justify-center hover:bg-gray-100 active:bg-gray-200 transition-colors duration-200 h-14">
          <p class="text-base font-semibold tracking-wide text-gray-900">Festivales</p>
        </a>
        <a href="#"
          class="p-3 bg-white border border-gray-200 rounded-lg shadow-sm flex items-center justify-center hover:bg-gray-100 active:bg-gray-200 transition-colors duration-200 h-14">
          <p class="text-base font-semibold tracking-wide text-gray-900">Charlas</p>
        </a>
        <a href="#"
          class="p-3 bg-white border border-gray-200 rounded-lg shadow-sm flex items-center justify-center hover:bg-gray-100 active:bg-gray-200 transition-colors duration-200 h-14">
          <p class="text-base font-semibold tracking-wide text-gray-900">Exposiciones</p>
        </a>
      </div>
  
      <!-- Desktop Horizontal Scroll -->
      <div class="hidden sm:flex justify-center">
        <div class="flex gap-6 overflow-x-auto scrollbar-hide">
          <a href="#"
            class="min-w-[150px] h-auto p-3 bg-white border border-gray-200 rounded-lg shadow-sm flex items-center justify-center hover:bg-gray-100 transition-colors duration-200">
            <p class="text-lg font-semibold tracking-wide text-gray-900">Conciertos</p>
          </a>
          <a href="#"
            class="min-w-[150px] h-auto p-3 bg-white border border-gray-200 rounded-lg shadow-sm flex items-center justify-center hover:bg-gray-100 transition-colors duration-200">
            <p class="text-lg font-semibold tracking-wide text-gray-900">Festivales</p>
          </a>
          <a href="#"
            class="min-w-[150px] h-auto p-3 bg-white border border-gray-200 rounded-lg shadow-sm flex items-center justify-center hover:bg-gray-100 transition-colors duration-200">
            <p class="text-lg font-semibold tracking-wide text-gray-900">Charlas</p>
          </a>
          <a href="#"
            class="min-w-[150px] h-auto p-3 bg-white border border-gray-200 rounded-lg shadow-sm flex items-center justify-center hover:bg-gray-100 transition-colors duration-200">
            <p class="text-lg font-semibold tracking-wide text-gray-900">Exposiciones</p>
          </a>
        </div>
      </div>
    </div>
  </template>
  
  <style scoped>
  /* Ocultar scrollbar */
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  </style>
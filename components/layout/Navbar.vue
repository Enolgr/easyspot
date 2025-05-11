<template>
    <div class='p-3 sm:p-5 w-full flex justify-center'>
      <!-- Mobile Header -->
      <div class="w-full flex flex-col sm:hidden">
        <!-- Top Row: Logo and Avatar -->
        <div class="flex items-center justify-between mb-2">
          <div class="title">
            <h1 class="text-2xl font-bold text-gray-900">EasySpot</h1>
          </div>
          <LayoutAvatar />
        </div>
        
        <!-- Search Bar - Full Width on Mobile -->
        <div class="searchbar flex rounded-full bg-slate-100 px-2 w-full">
          <button type="submit" class="relative p-2 rounded-full">
            <i class="pi pi-search text-gray-800 text-lg"></i>
          </button>
          <input 
            type="text" 
            class="w-full flex bg-transparent pl-1 py-2 text-black outline-0 text-sm" 
            placeholder="Buscar eventos, artistas..." 
          />
        </div>
      </div>
      
      
      <div class="hidden sm:flex w-full max-w-[1200px] items-center justify-between">
        <div class="title">
          <h1 class="text-4xl font-bold text-gray-900">EasySpot</h1>
        </div>
        
        <div class="searchbar flex rounded-full bg-slate-100 px-2 w-full max-w-[600px]">
          <button type="submit" class="relative p-2 rounded-full">
            <i class="pi pi-search text-gray-800 text-2xl"></i>
          </button>
          <input 
            type="text" 
            class="w-full flex bg-transparent pl-2 text-black outline-0" 
            placeholder="Busca eventos, ciudades, conciertos o artistas" 
          />
        </div>
  
        <LayoutAvatar />
      </div>
    </div>
  </template>
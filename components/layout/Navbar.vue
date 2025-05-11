<template>
  <div class="p-3 sm:p-5 w-full flex justify-center">
    
    <!-- Mobile Header -->
    <div class="w-full flex flex-col sm:hidden">
      <div class="flex items-center justify-between mb-2">
        <div class="title">
          <h1 class="text-2xl font-bold text-gray-900">EasySpot</h1>
        </div>
        <LayoutAvatar />
      </div>

      <LayoutSearchBar />
    </div>

    <!-- Desktop Header -->
    <div class="hidden sm:flex w-full max-w-[1200px] items-center justify-between">
      <div class="title">
        <h1 class="text-4xl font-bold text-gray-900">EasySpot</h1>
      </div>

      <div class="w-full max-w-[600px]">
        <LayoutSearchBar />
      </div>

      <LayoutAvatar />
    </div>

  </div>
</template>

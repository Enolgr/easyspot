<script setup>
definePageMeta({
  layout: 'default'
})
</script>

<template>
  <main>
    <div class="fixed top-0 left-0 w-full backdrop-blur-sm z-50 before:absolute before:bottom-0 before:left-0 before:w-full before:h-8 before:bg-gradient-to-b before:from-transparent">
      <LayoutNavbar />
    </div>
    <LayoutHero/> 
    <LayoutTrendingCategories/>
    <ClientOnly>
      <LayoutEventgrid/>
    </ClientOnly>
    <LayoutFooter/>
  </main>
</template>
  
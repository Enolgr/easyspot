<template>
    <div>
      <NuxtPage />
    </div>
  </template>
  
  <script setup>
useHead({
  link: [
    {
      rel: 'preload',
      href: '/fonts/Geist.woff2',
      as: 'font',
      type: 'font/woff2',
      crossorigin: 'anonymous'
    }
  ]
})

  </script>
  
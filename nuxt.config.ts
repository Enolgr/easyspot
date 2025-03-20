import Aura from '@primeuix/themes/aura';

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  css: [
    '~/assets/css/main.css',
    'primeicons/primeicons.css'  // <-- Agregado aquí
  ],
  modules: [
    '@primevue/nuxt-module',
    '@nuxtjs/tailwindcss'
  ],
  primevue: {
    options: {
      theme: {
        preset: Aura
      }
    }
  }
});

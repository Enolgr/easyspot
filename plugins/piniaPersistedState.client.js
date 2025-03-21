// plugins/piniaPersistedState.client.js
import { defineNuxtPlugin } from '#app'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

export default defineNuxtPlugin((nuxtApp) => {
  const pinia = nuxtApp.$pinia
  if (pinia) {
    pinia.use(piniaPluginPersistedstate)
  }
})

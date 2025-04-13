export default defineNuxtRouteMiddleware(async () => {
  if (!process.client) return

  const userStore = useUserStore()

  while (!userStore.isReady) {
    await new Promise(resolve => setTimeout(resolve, 50))
  }

  if (!userStore.isLoggedIn) {
    console.warn('[Auth Middleware] Usuario no autenticado')
    return navigateTo('/login')
  }
})

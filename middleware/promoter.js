export default defineNuxtRouteMiddleware(async () => {
    if (!import.meta.client) return
  
    const userStore = useUserStore()
  
    // Esperar hasta que userStore esté listo
    while (!userStore.isReady) {
      await new Promise(resolve => setTimeout(resolve, 50))
    }
  
    if (!userStore.isLoggedIn) {
      console.warn('[Middleware] Usuario no logueado, redirigiendo a login')
      return navigateTo('/login')
    }
  
    if (userStore.user.role !== 'Promoter') {
      console.warn('[Middleware] Acceso denegado, redirigiendo a home')
      return navigateTo('/')
    }
  })
  
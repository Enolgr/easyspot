export const useUserStore = defineStore('user', {
  state: () => ({
    currentUser: null
  }),
  actions: {
    async setUser(user) {
      // Actualiza el estado en el store
      this.currentUser = user

      // Llama al endpoint de Nuxt para guardar el usuario en la base de datos
      try {
        const response = await $fetch('/api/users', {
          method: 'POST',
          body: user
        })
        console.log('Usuario guardado:', response)
      } catch (error) {
        console.error('Error al guardar el usuario:', error)
      }
    },
    logout() {
      this.currentUser = null
    }
  },
  getters: {
    isLoggedIn: (state) => !!state.currentUser
  },
  persist: true  // Persiste el estado en el navegador
})

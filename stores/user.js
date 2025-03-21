export const useUserStore = defineStore('user', {
  state: () => ({
    currentUser: null
  }),
  actions: {
    setUser(user) {
      this.currentUser = user
    },
    logout() {
      this.currentUser = null
    }
  },
  getters: {
    isLoggedIn: (state) => !!state.currentUser
  },
  persist: true  // Habilita la persistencia del estado
})

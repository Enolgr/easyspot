export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    isReady: false
  }),
  actions: {
    setUser(userData) {
      this.user = userData
      this.isReady = true
    },
    clearUser() {
      this.user = null
      this.isReady = true
    }
  },
  getters: {
    isLoggedIn: (state) => !!state.user
  },
  persist: true
})

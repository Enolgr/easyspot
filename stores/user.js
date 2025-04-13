// stores/user.js

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    isReady: false
  }),
  actions: {
    setUser(userData) {
      if (!userData.role) {
        console.warn('⚠️ El usuario no tiene rol definido, esto puede romper el middleware.')
      }

      console.log('✅ Guardando usuario en store:', userData)
      this.user = userData
      this.isReady = true
    },
    clearUser() {
      this.user = null
      this.isReady = true
    }
  },
  getters: {
    isLoggedIn: (state) => !!state.user,
    isPromoter: (state) => state.user?.role === 'Promoter'
  },
  persist: true
})

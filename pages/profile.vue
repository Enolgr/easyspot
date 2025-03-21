<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';

definePageMeta({
  middleware: 'auth'
})

const isLoaded = ref(false);
const showImageOptions = ref(false);
const placeholder = '/placeholder.svg?height=150&width=150';

const userStore = useUserStore();
const router = useRouter();

// Variables reactivas para el nombre y la imagen de perfil
const userName = ref('Usuario EasySpot');
const profileImage = ref(placeholder);

// Observa la propiedad currentUser del store para actualizar el nombre y la imagen
watch(
  () => userStore.currentUser,
  (newUser) => {
    if (newUser) {
      userName.value = newUser.displayName || 'Usuario EasySpot';
      profileImage.value = newUser.photoURL || placeholder;
    } else {
      userName.value = 'Usuario EasySpot';
      profileImage.value = placeholder;
    }
  },
  { immediate: true }
);

onMounted(() => {
  setTimeout(() => {
    isLoaded.value = true;
  }, 500);
});

const toggleImageOptions = () => {
  showImageOptions.value = !showImageOptions.value;
};

const handleImageUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      profileImage.value = e.target.result;
      showImageOptions.value = false;
    };
    reader.readAsDataURL(file);
  }
};

const showQR = (eventId) => {
  console.log('Mostrando QR para el evento:', eventId);
};

// Función para cerrar sesión: limpia el usuario del store y redirige al home
const logout = () => {
  userStore.logout();
  router.push('/');
};
</script>

<template>
  <div class="gradient-bg absolute inset-0 flex items-center justify-center w-[99vw]">
    <div class="gradients-container absolute inset-0" :class="{ 'loaded': isLoaded }">
      <div class="blob blob1 bg-gradient-to-br from-[#15469F] to-[#F1C80C]"></div>
      <div class="blob blob2 bg-gradient-to-br from-[#15469F] to-[#86378E]"></div>
      <div class="blob blob3 bg-gradient-to-br from-[#86378E] to-[#F1C80C]"></div>
    </div>
  </div>

  <div class="profile-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-screen flex items-center justify-center relative z-10">
    <div class="w-full max-w-3xl">
      <div class="profile-card bg-white rounded-2xl overflow-hidden shadow-xl transition-transform duration-300 hover:scale-[1.02]">
        <div class="p-8">
          <div class="flex flex-col md:flex-row items-center gap-8">
            <div class="relative group">
              <div class="w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-md bg-gray-200 flex items-center justify-center">
                <!-- Se muestra la imagen de perfil actualizada o el placeholder -->
                <img :src="profileImage" alt="Foto de perfil" class="w-full h-full object-cover" />
              </div>

              <button 
                @click="toggleImageOptions" 
                class="absolute bottom-0 right-0 bg-white text-gray-700 p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>

              <div v-if="showImageOptions" class="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg p-4 z-20 w-48">
                <input type="file" accept="image/*" @change="handleImageUpload" class="block w-full text-sm text-black
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-black file:text-white
                  hover:file:bg-black"
                />
              </div>
            </div>

            <div class="flex-1 text-center md:text-left">
              <!-- Se muestra el nombre real del usuario -->
              <h1 class="text-2xl font-bold text-black">{{ userName }}</h1>
              <p class="text-black mt-1">Miembro desde 2023</p>
            </div>
          </div>
        </div>

        <!-- Acciones del perfil -->
        <div class="grid grid-cols-1 md:grid-cols-2 border-t border-black">
          <!-- Comprar entradas -->
          <router-link to="/" class="action-link">
            <div class="flex flex-col items-center justify-center p-6 hover:bg-gray-50 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-black mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span class="font-medium text-black">Comprar entradas</span>
            </div>
          </router-link>

          <!-- Cerrar sesión -->
          <div class="action-link cursor-pointer" @click="logout">
            <div class="flex flex-col items-center justify-center p-6 hover:bg-gray-50 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-black mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span class="font-medium text-black">Cerrar sesión</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Próximos eventos -->
      <div class="mt-8 bg-white rounded-2xl overflow-hidden shadow-xl transition-transform duration-300 hover:scale-[1.02]">
        <div class="p-6 border-b border-black">
          <h2 class="text-xl font-bold text-black">Próximos eventos</h2>
        </div>

        <div class="p-6">
          <div class="flex items-center justify-between py-3 border-b border-black">
            <div class="flex items-center">
              <div class="bg-black text-white rounded-lg flex flex-col items-center justify-center w-12 h-14 mr-4">
                <span class="text-xl font-bold">15</span>
                <span class="text-xs font-semibold">MAR</span>
              </div>
              <div>
                <h3 class="font-medium text-black">Festival de Música</h3>
                <p class="text-sm text-black">Teatro Municipal, Madrid</p>
              </div>
            </div>
            <button 
              @click="showQR('event1')" 
              class="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1z" />
              </svg>
              Ver QR
            </button>
          </div>

          <div class="flex items-center justify-between py-3">
            <div class="flex items-center">
              <div class="bg-black text-white rounded-lg flex flex-col items-center justify-center w-12 h-14 mr-4">
                <span class="text-xl font-bold">22</span>
                <span class="text-xs font-semibold">ABR</span>
              </div>
              <div>
                <h3 class="font-medium text-black">Concierto Rock</h3>
                <p class="text-sm text-black">Estadio Central, Barcelona</p>
              </div>
            </div>
            <button 
              @click="showQR('event2')" 
              class="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
              </svg>
              Ver QR
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
html, body {
  margin: 0;
  padding: 0;
  overflow: hidden;
  background: #000;
}

.gradients-container {
  filter: blur(20px);
  opacity: 0;
  transition: opacity 2s ease-in-out;
  z-index: -1;
}

.gradients-container.loaded {
  opacity: 1;
}

.blob {
  position: absolute;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  opacity: 0.7;
  mix-blend-mode: screen;
  visibility: hidden;
}

.loaded .blob {
  visibility: visible;
}

.blob1 {
  left: 10%;
  top: 15%;
  animation: blobMove1 6s infinite alternate ease-in-out;
}

.blob2 {
  left: 65%;
  top: 20%;
  animation: blobMove2 7s infinite alternate ease-in-out;
}

.blob3 {
  left: 35%;
  top: 70%;
  animation: blobMove3 6.5s infinite alternate ease-in-out;
}

@keyframes blobMove1 {
  0% {
    transform: translate(0, 0) scale(1);
    border-radius: 50%;
  }
  100% {
    transform: translate(100px, 150px) scale(1.3);
    border-radius: 40% 60% 50% 50%;
  }
}

@keyframes blobMove2 {
  0% {
    transform: translate(0, 0) scale(1.2);
    border-radius: 55% 45% 55% 45%;
  }
  100% {
    transform: translate(-100px, -120px) scale(0.8);
    border-radius: 45% 55% 40% 60%;
  }
}

@keyframes blobMove3 {
  0% {
    transform: translate(0, 0) scale(0.9);
    border-radius: 40% 60% 60% 40%;
  }
  100% {
    transform: translate(120px, -80px) scale(1.4);
    border-radius: 60% 40% 30% 70%;
  }
}

.action-link {
  text-decoration: none;
  color: inherit;
}

.action-link:hover {
  text-decoration: none;
}
</style>
  
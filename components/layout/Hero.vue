<script setup>
import { ref, onMounted } from 'vue';

const isLoaded = ref(false);

onMounted(() => {
  // Retraso para asegurar que todo se cargue y posicione correctamente
  setTimeout(() => {
    isLoaded.value = true;
  }, 500);
});
</script>

<template>
  <!-- Fondo de blobs -->
  <div class="gradient-bg absolute inset-0 flex items-center justify-center w-[100%] pointer-events-none">
    <div class="gradients-container absolute inset-0 overflow-hidden" :class="{ 'loaded': isLoaded }">
      <div class="blob blob1 bg-gradient-to-br from-[#15469F] to-[#F1C80C]"></div>
      <div class="blob blob2 bg-gradient-to-br from-[#15469F] to-[#86378E]"></div>
      <div class="blob blob3 bg-gradient-to-br from-[#86378E] to-[#F1C80C]"></div>
    </div>
  </div>
  

  <div class="hero max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 h-auto pt-28 flex flex-col items-center justify-center">
    <div class="cta text-center">
      <h1 class="text-5xl font-bold text-gray-900">Bienvenido a EasySpot!</h1>
      <h2 class="text-2xl font-light text-gray-900 mt-2">Desbloquea un mundo de eventos</h2>
    </div>
    <div class="carousel">

<LayoutCarousel/>

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
  z-index: -1; /* Asegura que esté detrás del contenido */
  pointer-events: none; /* Permite que los clics pasen a través */
}

.gradients-container.loaded {
  opacity: 1;
}

.blob {
  position: absolute;
  width: 500px;
  height: 500px;
  border-radius: 50%;
  opacity: 0.4;
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
    transform: translate(50px, 150px) scale(1.3);
    border-radius: 40% 60% 50% 50%;
  }
}

@keyframes blobMove2 {
  0% {
    transform: translate(0, 0) scale(1.2);
    border-radius: 55% 45% 55% 45%;
  }
  100% {
    transform: translate(-50px, -120px) scale(0.8);
    border-radius: 45% 55% 40% 60%;
  }
}

@keyframes blobMove3 {
  0% {
    transform: translate(0, 0) scale(0.9);
    border-radius: 40% 60% 60% 40%;
  }
  100% {
    transform: translate(50px, -80px) scale(1.4);
    border-radius: 60% 40% 30% 70%;
  }
}
</style>
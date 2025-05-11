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
  <div class="gradient-bg relative h-screen w-full">
    <div class="gradients-container absolute inset-0" :class="{ 'loaded': isLoaded }">
      <div class="blob blob1 bg-gradient-to-br from-[#15469F] to-[#F1C80C]"></div>
      <div class="blob blob2 bg-gradient-to-br from-[#15469F] to-[#86378E]"></div>
      <div class="blob blob3 bg-gradient-to-br from-[#86378E] to-[#F1C80C]"></div>
    </div>
  </div>
</template>

<style scoped>
:root {
  overflow-x: hidden;
}

html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  background: #000;
}

.gradient-bg {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  max-width: 100vw;
}

.gradients-container {
  filter: blur(20px);
  opacity: 0;
  transition: opacity 2s ease-in-out;
  width: 100%;
  height: 100%;
  position: relative;
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
</style>
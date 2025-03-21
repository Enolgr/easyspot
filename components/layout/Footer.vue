<template>
    <footer class="bg-black text-white">
      <div class="max-w-[1200px] w-screen mx-auto px-6 py-16">
        <!-- Main Footer Content -->
        <div class="grid grid-cols-1 md:grid-cols-12 gap-12">
          <!-- Company Info -->
          <div class="md:col-span-4 w-full">
            <h3 class="text-xl font-medium mb-6">EasySpot</h3>
            <p class="text-gray-400 mb-6 text-sm leading-relaxed">
              Un proyecto de TFG hecho con ❤️ Enol González.
            </p>
            <div class="flex space-x-5">
              <a href="#" class="text-gray-400 hover:text-white transition-colors duration-200">
                <i class="pi pi-facebook text-lg"></i>
                <span class="sr-only">Facebook</span>
              </a>
              <a href="#" class="text-gray-400 hover:text-white transition-colors duration-200">
                <i class="pi pi-twitter text-lg"></i>
                <span class="sr-only">Twitter</span>
              </a>
              <a href="#" class="text-gray-400 hover:text-white transition-colors duration-200">
                <i class="pi pi-instagram text-lg"></i>
                <span class="sr-only">Instagram</span>
              </a>
              <a href="#" class="text-gray-400 hover:text-white transition-colors duration-200">
                <i class="pi pi-linkedin text-lg"></i>
                <span class="sr-only">LinkedIn</span>
              </a>
            </div>
          </div>
  
          <!-- Links Sections -->
          <div class="md:col-span-4">
            <h3 class="text-sm font-medium uppercase tracking-wider text-gray-400 mb-5">Eventos</h3>
            <ul class="space-y-3">
              <li>
                <a href="#" class="text-gray-300 hover:text-white transition-colors duration-200 text-sm">Conciertos</a>
              </li>
              <li>
                <a href="#" class="text-gray-300 hover:text-white transition-colors duration-200 text-sm">Conferencias</a>
              </li>
              <li>
                <a href="#" class="text-gray-300 hover:text-white transition-colors duration-200 text-sm">Talleres</a>
              </li>
              <li>
                <a href="#" class="text-gray-300 hover:text-white transition-colors duration-200 text-sm">Exposiciones</a>
              </li>
              <li>
                <a href="#" class="text-gray-300 hover:text-white transition-colors duration-200 text-sm">Deportes</a>
              </li>
              <li>
                <a href="#" class="text-gray-300 hover:text-white transition-colors duration-200 text-sm">Festivales</a>
              </li>
            </ul>
          </div>
  
          <div class="md:col-span-4">
            <h3 class="text-sm font-medium uppercase tracking-wider text-gray-400 mb-5">Compañía</h3>
            <ul class="space-y-3">
              <li>
                <a href="#" class="text-gray-300 hover:text-white transition-colors duration-200 text-sm">Sobre Nosotros</a>
              </li>
              <li>
                <a href="#" class="text-gray-300 hover:text-white transition-colors duration-200 text-sm">Organizar</a>
              </li>
              <li>
                <a href="#" class="text-gray-300 hover:text-white transition-colors duration-200 text-sm">Precios</a>
              </li>
              <li>
                <a href="#" class="text-gray-300 hover:text-white transition-colors duration-200 text-sm">FAQ</a>
              </li>
              <li>
                <a href="#" class="text-gray-300 hover:text-white transition-colors duration-200 text-sm">Contacto</a>
              </li>
              <li>
                <a href="#" class="text-gray-300 hover:text-white transition-colors duration-200 text-sm">Blog</a>
              </li>
            </ul>
          </div>
        </div>
  
        <!-- Bottom Footer -->
        <div class="border-t border-gray-800 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p class="text-gray-500 text-sm">
            &copy; {{ new Date().getFullYear() }} EasySpot. Todos los derechos reservados.
          </p>
          <div class="flex space-x-6 mt-4 md:mt-0">
            <a href="#" class="text-gray-500 hover:text-white text-sm transition-colors duration-200">
              Privacidad
            </a>
            <a href="#" class="text-gray-500 hover:text-white text-sm transition-colors duration-200">
              Términos
            </a>
            <a href="#" class="text-gray-500 hover:text-white text-sm transition-colors duration-200">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const email = ref('');
  
  const subscribeToNewsletter = () => {
    console.log('Suscribiendo email:', email.value);
    email.value = '';
  };
  </script>
  
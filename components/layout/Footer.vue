<template>
  <footer class="bg-black text-white">
    <div class="max-w-[1200px] w-screen mx-auto px-6 py-16">
      <div class="grid grid-cols-1 md:grid-cols-12 gap-12">
        <div class="md:col-span-4 w-full">
          <h3 class="text-xl font-medium mb-6">EasySpot</h3>
          <p class="text-gray-400 mb-6 text-sm leading-relaxed">
            Un proyecto de TFG hecho con ❤️ Enol González.
          </p>
          <div class="flex space-x-5">
            <a href="#" class="text-gray-400 hover:text-white"><i class="pi pi-facebook"></i></a>
            <a href="#" class="text-gray-400 hover:text-white"><i class="pi pi-twitter"></i></a>
            <a href="#" class="text-gray-400 hover:text-white"><i class="pi pi-instagram"></i></a>
            <a href="#" class="text-gray-400 hover:text-white"><i class="pi pi-linkedin"></i></a>
          </div>
        </div>
     <!-- 
        <div class="md:col-span-4">
          <h3 class="text-sm font-medium uppercase tracking-wider text-gray-400 mb-5">Eventos</h3>
          <ul class="space-y-3">
            <li><NuxtLink to="/conciertos" class="text-gray-300 hover:text-white text-sm">Conciertos</NuxtLink></li>
            <li><NuxtLink to="/conferencias" class="text-gray-300 hover:text-white text-sm">Conferencias</NuxtLink></li>
            <li><NuxtLink to="/talleres" class="text-gray-300 hover:text-white text-sm">Talleres</NuxtLink></li>
            <li><NuxtLink to="/exposiciones" class="text-gray-300 hover:text-white text-sm">Exposiciones</NuxtLink></li>
            <li><NuxtLink to="/deportes" class="text-gray-300 hover:text-white text-sm">Deportes</NuxtLink></li>
            <li><NuxtLink to="/festivales" class="text-gray-300 hover:text-white text-sm">Festivales</NuxtLink></li>
          </ul>
        </div> -->

        <!--
   <div class="md:col-span-4">
          <h3 class="text-sm font-medium uppercase tracking-wider text-gray-400 mb-5">Compañía</h3>
          <ul class="space-y-3">
            <li><NuxtLink to="/sobre-nosotros" class="text-gray-300 hover:text-white text-sm">Sobre Nosotros</NuxtLink></li>
            <li><NuxtLink to="/organizar" class="text-gray-300 hover:text-white text-sm">Organizar</NuxtLink></li>
            <li><NuxtLink to="/precios" class="text-gray-300 hover:text-white text-sm">Precios</NuxtLink></li>
            <li><NuxtLink to="/faq" class="text-gray-300 hover:text-white text-sm">FAQ</NuxtLink></li>
            <li><NuxtLink to="/contacto" class="text-gray-300 hover:text-white text-sm">Contacto</NuxtLink></li>
            <li><NuxtLink to="/blog" class="text-gray-300 hover:text-white text-sm">Blog</NuxtLink></li>
          </ul>
        </div>
      </div> --> 

      <!--
      <div class="border-t border-gray-800 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center">
        <p class="text-gray-500 text-sm">&copy; {{ new Date().getFullYear() }} EasySpot. Todos los derechos reservados.</p>
        <div class="flex space-x-6 mt-4 md:mt-0">
          <NuxtLink to="/privacidad" class="text-gray-500 hover:text-white text-sm">Privacidad</NuxtLink>
          <NuxtLink to="/terminos" class="text-gray-500 hover:text-white text-sm">Términos</NuxtLink>
          <NuxtLink to="/cookies" class="text-gray-500 hover:text-white text-sm">Cookies</NuxtLink>
        </div>-->
      </div> 
   </div> 
  </footer>
</template>

<script setup>
import { NuxtLink } from '#components'
</script>

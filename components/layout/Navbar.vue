<template>
    <div class='flex items-center justify-evenly p-5'>
        <div class="title">
            <h1 class="text-4xl font-bold text-gray-900 ">EasySpot</h1>
        </div>
        <div class="searchbar flex rounded-full bg-slate-100 px-2 w-full max-w-[600px]">
            <button type="submit" class="relative p-2 rounded-full">
                <i class="pi pi-search text-gray-800 text-2xl"></i>
            </button>
            <input type="text" class="w-full flex bg-transparent pl-2 text-black outline-0" placeholder="Busca eventos, conciertos o artistas" />
        </div>
        <div class="avatar">
            <button v-ripple class="relative overflow-hidden w-full border-0 bg-transparent flex items-start  hover:bg-surface-100 dark:hover:bg-surface-800 rounded-none cursor-pointer transition-colors duration-200">
            <Avatar image="https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png" class="mr-2" shape="circle" />
            <span class="inline-flex flex-col items-start">
                <span class="font-regular">Amy Elsner</span>
            </span>
        </button>
        </div>
    </div>
</template>
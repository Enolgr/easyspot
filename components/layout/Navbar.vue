<template>
    <div class=' p-5 w-full flex justify-center'>
        <div class="max-w-[1200px] min-w-[1160px] flex items-center justify-between">
        <div class="title">
            <h1 class="text-4xl font-bold text-gray-900 ">EasySpot</h1>
        </div>
        <div class="searchbar flex rounded-full bg-slate-100 px-2 w-full max-w-[600px]">
            <button type="submit" class="relative p-2 rounded-full">
                <i class="pi pi-search text-gray-800 text-2xl"></i>
            </button>
            <input type="text" class="w-full flex bg-transparent pl-2 text-black outline-0" placeholder="Busca eventos, ciudades, conciertos o artistas" />
        </div>

        <LayoutAvatar/>

    </div>
    </div>
</template>
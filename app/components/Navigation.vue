<template>
  <nav class="bg-white shadow">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16 items-center">
        <!-- Logo/Home Link -->
        <NuxtLink to="/" class="flex items-center">
            <img src="../public/logo.svg" alt="OMR Logo" class="h-8 w-[140px] mr-2">
        </NuxtLink>
        
        <!-- About Link -->
        <NuxtLink 
          to="/about"
          class="text-gray-600 hover:text-purple transition-colors"
          active-class="border-b-2 border-yellow"
        >
          About
        </NuxtLink>
      </div>
    </div>
  </nav>
</template> 
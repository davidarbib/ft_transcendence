<template>
  
<nav class="bg-white shadow">
    <div class="container px-6 py-3 mx-auto">
        <div class="md:flex justify-between items-center">
            <!-- left section -->
            <div class="flex justify-between items-center">
                <a href="#" class="text-gray-800 text-xl font-bold hover:text-gray-700 md:text-2xl">Brand</a>
                <div class="md:hidden">
                    <button id="nav-button" type="button" class="text-gray-500 hover:text-gray-600 focus:text-gray-600 focus:outline-none">
                        <svg viewBox="0 0 24 24" class="h-6 w-6 fill-current">
                            <path d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z"></path>
                        </svg>  
                    </button>
                </div>
            </div>
            <!-- right section -->
            <div id="nav-menu" class="flex flex-col mt-3 hidden md:flex-row md:mt-0 md:block">
                <a href="#" class="text-gray-800 text-sm hover:font-medium md:mx-4">Home</a>
                <a href="#" class="text-gray-800 text-sm hover:font-medium md:mx-4">Contact</a>
                <a href="#" class="text-gray-800 text-sm hover:font-medium md:mx-4">About Us</a>
            </div>
        </div>
    </div>
</nav>
</template>
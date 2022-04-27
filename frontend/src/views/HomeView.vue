<script setup lang="ts">
import LockClosedIcon from "@heroicons/vue/solid";
import Title from "@/components/Title.vue";
</script>

<template>
  <div class="sound-icon">
    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
      <path stroke-linecap="round" stroke-linejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
    </svg>
  </div>
  <div id="signin-section">
    <div class="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8">
        <Title/>
        <form class="mt-8 space-y-6" action="#" method="POST">
          <input type="hidden" name="remember" value="true" />
          <div class="rounded-md shadow-sm -space-y-px">
            <div>
              <label for="email-address" class="sr-only">Email address</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autocomplete="email"
                required=true
                class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>
            <div>
              <label for="password" class="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autocomplete="current-password"
                required=true
                class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>

          <div class="auth-buttons">
            <router-link to="/main">
            <button
              type="submit"
              class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign in
            </button>
            </router-link>

            <router-link to="/register">
            <button
              class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Register
            </button>
            </router-link>

            <button id="ConnectWith42"
              class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Connect with 42
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
  <audio controls id="myVideo" autoplay loop muted hidden>
  <source src="@/assets/homepage_music.mp3" type="audio/mpeg">
  Your browser does not support the audio element.
  </audio>

</template>

<style lang="scss">
@use "../assets/variables.scss" as v;

 .sound-icon {
   position: absolute;
   top: 1rem;
   right: 2rem;
   font-size: 10rem;
 }

#signin-section {
  form {
    margin-top: -3rem;
  }
}

.auth-buttons {
  display: flex;
  flex-flow: column nowrap;

  button {
    margin-bottom: 1rem;
    background-color: v.$dark-blue;
    transition: 0.5s;
    &:hover {
      background-color: v.$darker-blue;
    }
  }

  #ConnectWith42 {
    background-color: black;
  }
}
</style>

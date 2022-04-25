<script>
import { LockClosedIcon } from "@heroicons/vue/solid";

export default {
  components: {
    LockClosedIcon,
  },
};
</script>

<template>
  <div id="signin-section">
    <div>
      <h1 class="title">
        <span class="metal clip raise">Retro</span>
        <span class="metal clip raise">Effect</span>
      </h1>
      <h2 class="subtitle">With CSS</h2>
    </div>
    <div
      class="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
    >
      <div class="max-w-md w-full space-y-8">
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
                required=""
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
                required=""
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
</template>

<style lang="scss">
@use "../assets/variables.scss" as v;

#signin-section {
  margin-top: 50vh;
  transform: translateY(-50%);
}

h1 {
  font-family: Kallisto-bold, sans-serif;
  text-transform: uppercase;
  background: -webkit-linear-gradient(
    0.25turn,
    v.$primary,
    v.$dark-blue,
    v.$primary
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
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

.metal {
  background: linear-gradient(
    hsl(239, 50%, 30%) 15%,
    hsl(239, 50%, 40%) 25%,
    hsl(200, 60%, 50%) 35%,
    hsl(100, 70%, 80%) 45%,
    hsl(60, 100%, 98%) 50%,
    hsl(240, 0%, 0%) 52%,
    hsl(240, 10%, 10%) 60%,
    hsl(240, 50%, 30%) 70%,
    hsl(220, 70%, 60%) 80%,
    hsl(212, 92%, 76%) 85%
  );

  color: transparent;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-stroke: 2px hsl(200, 65%, 80%);
}

.raise {
  filter: drop-shadow(1px 3px 0px hsl(242, 54%, 10%))
    drop-shadow(1px 3px 0px hsl(242, 54%, 15%))
    drop-shadow(1px 3px 0px hsl(242, 54%, 20%))
    drop-shadow(1px 3px 0px hsl(242, 54%, 25%))
    drop-shadow(1px 3px 0px hsl(242, 54%, 30%))
    drop-shadow(0px 0px 10px rgba(16, 16, 16, 0.4));
}

.subtitle {
  transform: rotateZ(-10deg);
  color: hsl(318, 100%, 51%); /* pink */
  text-shadow: -2px -3px hsl(53, 100%, 81%) /* yellow */,
    5px 5px hsl(240, 90%, 61%); /* blue */
}
</style>

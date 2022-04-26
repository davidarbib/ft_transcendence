<template>
  <div class="error">
    <div class="title">
      <p>4</p>
      <figure class="circle"></figure>
      <p>4</p>
    </div>
    <router-link to="/main">
      <button class="group relative justify-center py-2 px-4 border border-transparent text-2xl font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2">Go back home</button>
    </router-link>
  </div>
</template>

<style lang="scss">
@use "../assets/variables.scss" as v;
@import '@/assets/base.scss';

@font-face {
  font-family: 'Kallisto-bold';
  src: url('@/assets/fonts/Kallisto_bold.otf');
}

.error {
  width: 80%;
  text-align: center;
  margin: auto;

  button {
  margin-bottom: 1rem;
  background-color: v.$dark-blue;
  padding: 1rem 10rem 1rem 10rem;
  transition: 0.5s;
  &:hover {
    background-color: v.$darker-blue;
    }
  }
}

.title {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 80%;
  margin: auto;
  font-family: sans-serif;
  font-size: 17rem;
  color: rgb(221, 128, 87);
  font-family: 'Kallisto-bold', sans-serif;
  p {
    margin-right: 4rem;
    margin-left: 4rem;
    margin-top: 3rem;
  }
}

.circle {
 display: block;
 background: linear-gradient(v.$secondary-light, v.$primary-light);
 border-radius: 50%;
 height: 20vh;
 width: 20vh;
 margin: 0;
}

</style>

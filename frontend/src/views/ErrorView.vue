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

.error {
  margin-top: 7rem;
  text-align: center;
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;

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
  font-size: 17rem;
  color: rgb(221, 128, 87);
  font-family: 'Fredoka One', sans-serif;
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
 height: 12rem;
 width: 12rem;
 margin-top: 2rem;
}

</style>

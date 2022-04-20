<script setup lang="ts">
</script>

<template>
  <section class="main-content">
    <div class="ball-shape">
      <h1>Pong 2.0</h1>
      <p><a href="#">1 Joueur</a></p>
      <p><a href="#">2 Joueurs</a></p>
    </div>
  </section>
</template>

<style lang="scss">

  @use './assets/variables.scss' as v;

  @font-face {
    font-family: 'Kallisto-bold';
    src: url('./assets/fonts/Kallisto/Kallisto_bold.otf');
  }

  @font-face {
    font-family: 'Kallisto-regular';
    src: url('./assets/fonts/Kallisto/Kallisto_medium.otf');
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  } 

  body {
    background: linear-gradient(v.$dark-blue, v.$primary) fixed;
    text-align: center;
  }

  .main-content {

    background: linear-gradient(v.$secondary-light, v.$secondary);

    h1 {
      font-family: Kallisto-bold, sans-serif;
      font-style: normal;
      font-weight: 800;
      color: v.$secondary;
      font-size: v.$primary-title;
    }

    p a {
      font-family: Kallisto-regular, sans-serif;
      font-weight: bold;
      color: v.$primary;
      font-size: v.$secondary-title;
      text-decoration: none;
    }
  }

</style>

<script setup lang="ts">

</script>

<template>
  <section class="main-content">
    <div class="ball-shape">
      <h1>Pong 2.0</h1>
      <p><a href="#">Register</a></p>
      <p><a href="#">Login</a></p>
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
    
    width: 1000px;
    height: 1000px;
    margin: auto;
    margin-top: 50vh;
    transform: translateY(-50%);

    h1 {
      font-family: Kallisto-bold, sans-serif;
      font-style: normal;
      font-weight: 800;
      color: v.$secondary;
      font-size: v.$primary-title;
      padding-top: 12rem;
    }

    p {
      padding-bottom: 3rem;
    }

    p:nth-of-type(1) {
      margin-top: 13.5rem;
    }

    p:nth-of-type(2)
    {
      margin-top: 3rem;
      padding-bottom: 5rem;
    }

    p a {
      font-family: Kallisto-regular, sans-serif;
      font-weight: bold;
      color: v.$primary;
      font-size: v.$secondary-title;
      text-decoration: none;
      transition: 0.3s;
      &:hover {
        font-size: 2.1rem;
        opacity: 0.8;
        text-shadow: 0 0.3rem 0.5rem v.$primary-light;
      }
    }
  }

    .ball-shape {
      background-image: url('./assets/sphere.png');
      width: 1000px;
      height: 1000px;
      animation: up-down 2s ease-in-out infinite alternate-reverse both;
      
    }

        @keyframes up-down {
      0% {
        transform: translateY(2%);
      }

      100% {
        transform: translateY(-2%);
      }
    }

</style>

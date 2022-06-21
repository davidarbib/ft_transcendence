<script setup lang="ts"></script>

<template>
  <div class="title-section">
    <h1 class="title">
      <span class="metal raise clip">PONG</span>
    </h1>
    <h2 class="subtitle">vice</h2>
  </div>
</template>

<style lang="scss" scoped>
@use "../assets/variables.scss" as v;
@import url("https://fonts.googleapis.com/css2?family=Caveat&family=Fredoka+One&display=swap");
.title-section {
  text-align: center;
  padding: 0;
  margin: 0;
}

.title {
  font-size: 7rem;
  font-family: "Fredoka One", sans-serif;
  font-weight: 500;
  text-transform: uppercase;
  padding: 0;
  margin: 0;
}

.subtitle {
  font-family: Caveat, cursive;
  text-transform: capitalize;
  font-size: 5rem;
  position: relative;
  top: -5.5rem;
  right: -6.5rem;
  font-weight: 600;
  padding: 0;
  margin: 0;
  transform: rotateZ(-10deg);
  color: hsl(318, 100%, 51%);
  text-shadow: -2px -3px hsl(53, 100%, 81%), 5px 5px hsl(240, 90%, 61%);
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

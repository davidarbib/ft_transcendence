<script setup lang="ts">
import { ref, watch } from "vue";
import { apiStore } from "@/stores/api";
import axios from "axios";

let code = ref("");
let codeInvalid = ref("hidden");
const api = apiStore();

watch(code, (newCode) => {
  if (newCode.length === 6) {
    axios.defaults.withCredentials = true;
    axios
      .post(`${api.url}/2fa/authenticate`, {
        code: code.value,
      })
      .then((response) => {
        console.log(response.data);
        codeInvalid.value = "hidden";
      })
      .catch((error) => {
        console.log(error);
        codeInvalid.value = "";
      });
  }
});
</script>

<template>
  <div class="container-2fa">
    <div class="auth-code">
      <input
        class="px-32 py-12 rounded-md"
        type="text"
        placeholder="Enter your code here"
        v-model="code"
      />
      <p class="text-center my-9 text-6xl text-rose-800" :class="codeInvalid">
        Code invalid
      </p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.container-2fa {
  display: grid;
  place-items: center;
  min-height: 100vh;
}

input {
  font-size: 4rem;
  letter-spacing: 1rem;
  text-align: center;
  &:focus {
    outline: none;
  }
}
</style>

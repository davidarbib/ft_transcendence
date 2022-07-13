<script setup lang="ts">
import { ref, onMounted } from "vue";
import axios from "axios";
import { useUserStore } from "@/stores/auth";

const props = defineProps({login : String})
const counter = ref(props.login)
const userStore = useUserStore();
const historic = ref([])
onMounted(() => {
  console.log(props.login);
axios.defaults.withCredentials = true;
  axios
    .get(`http://localhost:8090/users/${props.login}/test/historic/`)
    .then((response) => {
      historic.value = response.data;
    })
    .catch(() => {
      console.log("Error");
    });
});
</script>
<template>
  <div class="overflow-scroll h-[92vh]">
    <div
      class="text-white flex flex-row flex-nowrap justify-around items-center rounded my-2 bg-black bg-opacity-10 font-medium hover:bg-opacity-30 transition duration-300"
      v-for="match in historic"
      :key="match"
    >
      <div class="match-result">
        <h2 v-if="match.winner" class="text-green-600 leading-4"> Victory </h2>
        <h2 v-else class="text-red-600 leading-4"> Defeat </h2>
      </div>
      <div class="text-lg tracking-wider">
        {{match.vs}}
        <p>{{match.score1}}/ {{match.score2}}</p>
      </div>
      <div>
        <h3>Custom</h3>
        <p>{{ }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "../assets/variables.scss" as v;

.match-card {
  color: rgba(255, 255, 255, 0.706);
}
</style>

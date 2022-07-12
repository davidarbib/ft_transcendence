<script setup lang="ts">
import historic from "@/assets/data_hist.json";
import { ref, onMounted } from "vue";
import axios from "axios";
import { useUserStore } from "@/stores/auth";

const props = defineProps({login : String})
const counter = ref(props.login)
const userStore = useUserStore();
onMounted(() => {
axios.defaults.withCredentials = true;
  axios
    .get(`http://localhost:8090/users/${props.login}/test/historic/`)
    .then((response) => {
      console.log(response.data);
      userStore.user = response.data;
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
      :key="match.id"
    >
      <div class="match-result">
        <h2 class="text-green-600 leading-4">Victory</h2>
      </div>
      <div class="text-lg tracking-wider">
        <p>10/8</p>
      </div>
      <div>
        <h3>Custom</h3>
        <p>{{ match.date_time }}</p>
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

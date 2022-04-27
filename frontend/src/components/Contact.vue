<script setup lang="ts">
    import {ref} from "vue"
    import json from "@/assets/dataTest.json"
    console.log(json);
    const online = ref(false)
</script>

<template>
    <div class="container w-3/12 h-screen">
        <input placeholder="search" class="w-full">
        <div v-for="user in json" :key="user.id" class="name">
            {{user.last_name}}
            <div class="online"> </div>
            <div class="offline"> </div>
            <div class="ingame"> </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.container {
    border: 0.1rem crimson solid;
    overflow: scroll;
}
.name {
    border: 0.1rem blue solid;
}
.online {
    background-color: aqua;
}
</style>
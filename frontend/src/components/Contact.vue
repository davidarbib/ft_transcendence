<script setup lang="ts">
    import json from "@/assets/dataTest.json"

    json.sort(user => {
        return user.status ? -1 : 1
    })
    console.log(json);
</script>

<template>
    <div class="container w-3/12 h-screen">
        <input placeholder="search" class="w-full">
        <div v-for="user in json" :key="user.id" class="name" :class="{ online: user.status === true, offline: user.status === false}">
            {{user.pseudo}}
        </div>
    </div>
</template>

<style scoped lang="scss">
.container {
    border: 0.1rem crimson solid;
    overflow: scroll;
    .online {
        background-color: green;
    }
    .offline {
        background-color: gray;
    }
    .inGame {
        background-color: yellow;
    }
}
.name {
    border: 0.1rem blue solid;
}
</style>
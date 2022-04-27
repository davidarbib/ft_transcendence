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
        <button v-for="user in json" :key="user.id" class="name w-full" :class="{ online: user.status === true, offline: user.status === false}">
            {{user.pseudo}}
        </button>
    </div>
</template>

<style scoped lang="scss">
.container {
    border: 0.1rem crimson solid;
    overflow: scroll;
.name{
    &:hover{

    }
}
    .online {
        background-color: green;
            &:hover{
                background-color: greenyellow;
    }
    }
    .offline {
        background-color: gray;
    }
    .inGame {
        background-color: yellow;
    }
}
.name {
}
</style>
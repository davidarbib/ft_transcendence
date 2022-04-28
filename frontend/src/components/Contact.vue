<script setup lang="ts">
    import json from "@/assets/dataTest.json"
    import { ref, computed } from 'vue'

    json.sort(user => {
        return user.status ? -1 : 1
    })

    const searched = ref('');
    const userFriends = computed(() => json.filter(friend => friend.pseudo.toLowerCase().includes(searched.value.toLowerCase())));
</script>

<template>
    <div class="container w-3/12 h-auto">
        <input placeholder="search" class="w-full" v-model="searched">
        <button v-for="user in userFriends" :key="user.id" class="name w-full" :class="{ online: user.status === true, offline: user.status === false}">
            {{user.pseudo}}
        </button>
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
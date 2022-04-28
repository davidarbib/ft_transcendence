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
        <div v-for="user in userFriends" :key="user.id" class="name w-full" :class="{ online: user.status === true, offline: user.status === false}">
        <div class="status-composant">
            <img class="h-8 w-8 rounded-full" src="@/assets/sphere.png" alt="">
            <i class="fa-solid fa-circle" :class="{ online: user.status === true, offline: user.status === false}"></i>
        </div>
            <h3>{{user.pseudo}}</h3>
        </div>
    </div>
</template>

<style scoped lang="scss">
.container {
    overflow: scroll;
    .status-composant {
        display: flex;
        justify-content: flex-start;

        .fa-circle {
            position: relative;
            top: 1rem;
            right: 0.5rem;
        }
    }
    .online {
        color: green;
    }
    .offline {
        color: gray;
    }
    .inGame {
        color: yellow;
    }
}
.name {
    border: 2px solid blue;
}
</style>
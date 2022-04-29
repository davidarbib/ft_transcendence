<script setup lang="ts">
    import json from "@/assets/dataTest.json"
    import { ref, computed } from 'vue'

    json.sort(user => {
        return user.status ? -1 : 1
    })

    const searched = ref('');
    const friendMenu = ref(false);
    const friendSelected = ref(-1);
    const userFriends = computed(() => json.filter(friend => friend.pseudo.toLowerCase().includes(searched.value.toLowerCase())));

    function toggleFriendMenu(id: number) {
        friendSelected.value = id;
        friendMenu.value = !friendMenu.value;
    }
</script>

<template>
    <div class="container w-1/5 mx-2 mt-10 h-auto">
        <input placeholder="search" class="w-full rounded px-2 py-1" v-model="searched">
        <div v-for="user in userFriends" :key="user.id"
        class="name my-2 w-full bg-black bg-opacity-10 rounded hover:bg-white hover:bg-opacity-10"
        :class="{ online: user.status === true, offline: user.status === false}"
        @click="toggleFriendMenu(user.id)">
            <div class="mx-3 status-composant">
                <img class="h-8 w-8 rounded-full" src="@/assets/sphere.png" alt="">
                <i class="fa-solid fa-circle" :class="{ online: user.status === true, offline: user.status === false}"></i>
                <h3> <span class="friend-pseudo"> {{user.pseudo}} </span> <br/> <span class="status-text">online</span></h3>
            </div>
            <div v-if="friendMenu && friendSelected === user.id" class="friend-menu px-8 bg-black bg-opacity-10 rounded">
              <ul>
                <li>chat</li>
                <li>profil de {{ user.pseudo }}</li>
                <li>invite</li>
                <li>block</li>
                <li>spectate</li>
              </ul>
            </div>
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
            font-size: 0.8rem;
            position: relative;
            top: 1rem;
            right: 0.5rem;
        }
    }
    .online {
        color: rgb(15, 164, 70);
    }
    .offline {
        color: gray;
    }
    .inGame {
        color: yellow;
    }
}
.name {
    display: flex;
    flex-flow: row nowrap;
    justify-content: baseline;
    align-items: center;
    transition: 0.3s;

    -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Safari */
    -khtml-user-select: none; /* Konqueror HTML */
    -moz-user-select: none; /* Old versions of Firefox */
    -ms-user-select: none; /* Internet Explorer/Edge */
    user-select: none; /* Non-prefixed version, currently */
    &:hover {
        cursor: pointer;
    }

    .friend-pseudo {
        color: rgb(160, 165, 141);
        position: relative;
        top: 0.5rem;
    }
    .status-text {
        font-size: 0.8rem;
    }
    .friend-menu {
        position: absolute;
        top: 10rem;
        right: 17rem;
    }
}

</style>
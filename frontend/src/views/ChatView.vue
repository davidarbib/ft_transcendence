<script setup lang="ts">
import NavbarItem from "@/components/NavbarItem.vue";
import Channel from "@/components/Channel.vue";
import messages from "@/assets/msg_body_test.json";
</script>

<template>
  <div class="chat-section">
    <div class="navbar-item">
      <NavbarItem />
    </div>
    <div class="channel-list">
      <Channel />
    </div>
    <div class="messages text-gray-300">
      <div
        class="message bg-black bg-opacity-20 w-3/4 mx-2 rounded p-2"
        v-for="message in messages"
      >
        <p class="underline-offset-auto">
          <span class="sender text-[#e63380] font-bold">
            {{ message.sender }}
          </span>
          <span class="text-xs text-gray-400"> 11/11/2022 at 19h05 </span>
        </p>
        <p>{{ message.content }}</p>
      </div>
    </div>
    <div class="message-input">
      <input
        type="text"
        class="h-3/4 w-3/4 px-2 focus:outline-none border rounded border-gray-300"
      />
      <p class="px-3"><i class="fa-solid fa-paper-plane"></i></p>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "../assets/variables.scss" as v;
.chat-section {
  height: 100vh;
  display: grid;
  grid-template-columns: 20% 80%;
  grid-template-rows: 10% 80% 10%;
  grid-column-gap: 0px;
  grid-row-gap: 0px;

  .navbar-item {
    grid-area: 1 / 1 / 2 / 3;
  }

  .channel-list {
    grid-area: 2 / 1 / 4 / 2;
  }

  .messages {
    grid-area: 2 / 2 / 3 / 3;
    overflow: scroll;

    .message {
      margin-top: 1rem;
    }
  }

  .message-input {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    margin-left: 0.5rem;
    font-size: 1.5rem;
    grid-area: 3 / 2 / 4 / 3;
    p {
      cursor: pointer;
      color: v.$dark-blue;
      font-size: 2.5rem;
    }
  }
}
</style>

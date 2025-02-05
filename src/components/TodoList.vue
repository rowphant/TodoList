<script setup lang="ts">
import TodoListItem from "./TodoList.Item.vue";
</script>
<template>
  <div class="mx-auto max-w-3xl p-8 text-white/70">
    <div class="flex flex-col gap-2">
      <!-- Task form -->
      <div class="bg-base-300 rounded-md">
        <form class="flex justify-center items-center gap-2 p-2">
          <!-- <label class="label">
            <span class="label-text">Task description</span>
          </label> -->
          <input
            type="text"
            placeholder="Task description"
            class="grow input input-bordered"
          />
          <button type="submit" class="btn btn-accent">Submit</button>
        </form>
      </div>
      <!-- Task list -->
      <ul class="bg-base-300 rounded-md flex flex-col">
        <!-- Task item -->
        <li>
          <TodoListItem />
        </li>
      </ul>
    </div>
  </div>
</template>
<style scoped></style>

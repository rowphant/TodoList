<script setup lang="ts"></script>
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
          <div class="flex gap-4 p-2">
            <!-- Task Content -->
            <div class="grow flex items-center gap-4 p-2">
              <div>Creation Date</div>
              <div class="grow">Description</div>
              <div>Status</div>
            </div>
            <!-- Task Actions -->
            <div class="flex items-center gap-4 p-2">
              <button class="btn">Mark as completed</button>
              <button class="btn">Edit</button>
              <button class="btn">Delete</button>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
<style scoped></style>

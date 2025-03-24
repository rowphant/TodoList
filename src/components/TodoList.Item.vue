<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import type { Task } from './types';

const props = defineProps<{
  task: Task;
  markAsUrgent: (task: Task) => void;
  editTask: (task: Task) => void;
  changeStatus: (task: Task, newStatus: string) => void;
  changeCategory: (task: Task, newCategory: string) => void;
  deleteTask: (task: Task) => void;
  saveTask: (task: Task, newDescription: string) => void;
  categories: string[];
}>();

const secondsToUrgency = 60;
const intervalId = ref<number | undefined>(undefined);
const intervalIndex = ref(0);
const description = ref(props.task.description);
const category = ref(props.task.category);

const urgencyHandler = () => {
  if (props.task.createdAt + secondsToUrgency * 1000 < Date.now()) {
    props.markAsUrgent(props.task);
  }
};

const getCountdown = () => {
  if (props.task.createdAt + secondsToUrgency * 1000 > Date.now()) {
    return Math.round(
      (props.task.createdAt + secondsToUrgency * 1000 - Date.now()) / 1000
    );
  } else {
    return 0;
  }
};

const countdown = ref(getCountdown());

onMounted(() => {
  urgencyHandler();

  intervalId.value = window.setInterval(() => {
    intervalIndex.value++;
    const newCountdown = getCountdown();
    countdown.value = newCountdown;

    urgencyHandler();
  }, 1000);
});

onUnmounted(() => {
  if (intervalId.value) {
    window.clearInterval(intervalId.value);
  }
});

const changeStatusHandler = (task: Task, status: string) => {
  task.isUrgent && window.clearInterval(intervalId.value);
  props.changeStatus(task, status);
};

const submitHandler = () => {
  console.log(props.task, description.value, category.value);
  props.saveTask(props.task, description.value);
};
</script>

<template>
  <div
    class="flex gap-4 p-2 border rounded-lg"
    :class="{
      'border-success': task.status === 'completed',
      'border-error': task.isUrgent && task.status === 'outstanding',
      'border-warning': !task.isUrgent && task.status === 'outstanding',
    }"
  >
    <!-- Task Content -->
    <div class="grow flex items-center gap-4 p-2">
      <div>{{ new Date(task.createdAt).toLocaleString() }}</div>
      <div class="grow">
        <form
          @submit.prevent="task.isEditable && submitHandler()"
          class="flex items-center gap-2"
        >
          <!-- Description -->
          <input
            v-model="description"
            type="text"
            class="input input-bordered"
            :class="{
              'input-accent': task.isEditable,
              'focus:outline-none': !task.isEditable,
            }"
            :readonly="!task.isEditable"
          />
          <!-- Category -->
          <select
            v-model="category"
            as="select"
            class="select w-full max-w-xs"
            :disabled="!task.isEditable"
          >
            <option
              v-for="category in props.categories"
              :value="category"
              :disabled="category === props.task.category"
              :selected="category === props.task.category"
            >
              {{ category }}
            </option>
          </select>

          <div>{{ task.status }}</div>
          <button v-if="task.isEditable" type="submit" class="btn btn-outline">
            Save
          </button>
        </form>
        <!-- Task Urgency -->
        <div v-if="task.status === 'outstanding'">
          <div v-if="task.isUrgent" class="text-error">
            Urgent!
          </div>
          <div v-else>
            {{ countdown }} {{ countdown >= 1 ? "seconds" : "second" }} until
            urgency
          </div>
        </div>
      </div>
    </div>
    <!-- Task Actions -->
    <div class="flex items-center gap-4 p-2">
      <!-- Mark as completed -->
      <button
        v-if="task.status === 'outstanding'"
        class="btn btn-square btn-neutral"
        @click="changeStatusHandler(task, 'completed')"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          class="w-5 h-5"
        >
          <path
            fillRule="evenodd"
            d="M19.916 4.626a.75.75 0 0 1 .208 1.04l-9 13.5a.75.75 0 0 1-1.154.114l-6-6a.75.75 0 0 1 1.06-1.06l5.353 5.353 8.493-12.74a.75.75 0 0 1 1.04-.207Z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      <!-- Mark as outstanding -->
      <button
        v-if="task.status === 'completed'"
        class="btn btn-square btn-neutral"
        @click="changeStatusHandler(task, 'outstanding')"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          class="w-5 h-5"
        >
          <path
            fillRule="evenodd"
            d="M9.53 2.47a.75.75 0 0 1 0 1.06L4.81 8.25H15a6.75 6.75 0 0 1 0 13.5h-3a.75.75 0 0 1 0-1.5h3a5.25 5.25 0 1 0 0-10.5H4.81l4.72 4.72a.75.75 0 1 1-1.06 1.06l-6-6a.75.75 0 0 1 0-1.06l6-6a.75.75 0 0 1 1.06 0Z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      <!-- Edit -->
      <button
        class="btn btn-square btn-neutral"
        :disabled="task.status === 'completed'"
        @click="editTask(task)"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="{1.5}"
          stroke="currentColor"
          class="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
          />
        </svg>
      </button>

      <!-- Delete -->
      <button class="btn btn-square btn-neutral" @click="deleteTask(task)">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="{1.5}"
          stroke="currentColor"
          class="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

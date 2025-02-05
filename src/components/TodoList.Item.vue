<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from "vue";

interface Task {
  description: string;
  status: string;
  createdAt: number;
  isEditable: boolean;
  isUrgent: boolean;
}

const props = defineProps<{
  task: Task;
  markAsUrgent: (task: Task) => void;
  editTask: (task: Task) => void;
  changeStatus: (task: Task, newStatus: string) => void;
  deleteTask: (task: Task) => void;
  saveTask: (task: Task, newDescription: string) => void;
}>();

const secondsToUrgency = 10;
const intervalId = ref<number | null>(null);
const intervalIndex = ref(0);

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

const changeStatusHandler = (task, status) => {
  task.isUrgent && window.clearInterval(intervalId.value);
  props.changeStatus(task, status);
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
          @submit.prevent="
            task.isEditable && saveTask(task, $event.target[0].value)
          "
          class="flex items-center gap-2"
        >
          <input
            type="text"
            :value="task.description"
            class="input input-bordered"
            :class="{
              'input-accent': task.isEditable,
              'focus:outline-none': !task.isEditable,
            }"
            :readonly="!task.isEditable"
          />
          <button v-if="task.isEditable" type="submit" class="btn btn-outline">
            Save
          </button>
        </form>
        <!-- Task Urgency -->
        <div v-if="task.status === 'outstanding'">
          <div :key="tasks" v-if="task.isUrgent" class="text-error">
            Urgent!
          </div>
          <div v-else>
            {{ countdown }} {{ countdown >= 1 ? "seconds" : "second" }} until
            urgency
          </div>
        </div>
      </div>
      <div>{{ task.status }}</div>
    </div>
    <!-- Task Actions -->
    <div class="flex items-center gap-4 p-2">
      <button
        v-if="task.status === 'outstanding'"
        class="btn"
        @click="changeStatusHandler(task, 'completed')"
      >
        Mark as completed
      </button>
      <button
        v-if="task.status === 'completed'"
        class="btn"
        @click="changeStatusHandler(task, 'outstanding')"
      >
        Mark as outstanding
      </button>
      <button
        class="btn"
        :disabled="task.status === 'completed'"
        @click="editTask(task)"
      >
        Edit
      </button>
      <button class="btn" @click="deleteTask(task)">Delete</button>
    </div>
  </div>
</template>

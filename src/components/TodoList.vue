<script setup lang="ts">
import { ref, onMounted } from "vue";
import ListItem from "./TodoList.Item.vue";

interface Task {
  description: string;
  status: string;
  createdAt: number;
  isEditable: boolean;
  isUrgent: boolean;
}

const tasks = ref<Task[]>([]);

onMounted(() => {
  const storedTasks = localStorage.getItem("tasks");
  if (storedTasks) {
    tasks.value = JSON.parse(storedTasks);
  }
});

const addTask = (description: string) => {
  const newTask: Task = {
    description,
    status: "outstanding",
    createdAt: Date.now(),
    isEditable: false,
    isUrgent: false,
  };
  tasks.value.push(newTask);
  tasks.value.sort((a, b) => b.createdAt - a.createdAt);
  localStorage.setItem("tasks", JSON.stringify(tasks.value));
};

const markAsUrgent = (task: Task) => {
  task.isUrgent = true;
  localStorage.setItem("tasks", JSON.stringify(tasks.value));
};

const changeStatus = (task: Task, newStatus: string) => {
  task.status = newStatus;
  localStorage.setItem("tasks", JSON.stringify(tasks.value));
};

const editTask = (task: Task) => {
  tasks.value.forEach((t) => (t.isEditable = false));
  task.isEditable = !task.isEditable;
};

const deleteTask = (task: Task) => {
  tasks.value = tasks.value.filter((t) => t.createdAt !== task.createdAt);
  localStorage.setItem("tasks", JSON.stringify(tasks.value));
};

const saveTask = (task: Task, newDescription: string) => {
  task.description = newDescription;
  task.isEditable = false;
  localStorage.setItem("tasks", JSON.stringify(tasks.value));
};
</script>

<template>
  <div class="mx-auto max-w-6xl p-8 text-white/70">
    <div class="flex flex-col gap-4">
      <!-- Task form -->
      <div class="bg-base-300 rounded-md">
        <form
          @submit.prevent="addTask($event.target[0].value)"
          class="flex justify-center items-center gap-2 p-8"
        >
          <input
            type="text"
            placeholder="Task description"
            class="grow input input-lg input-bordered"
          />
          <button type="submit" class="btn btn-lg btn-accent">Submit</button>
        </form>
      </div>
      <!-- Task list -->
      <ul class="bg-base-300 rounded-md flex flex-col gap-2">
        <!-- Task item -->
        <li v-for="task in tasks" :key="task">
          <ListItem
            :task="task"
            :markAsUrgent="markAsUrgent"
            :editTask="editTask"
            :changeStatus="changeStatus"
            :deleteTask="deleteTask"
            :saveTask="saveTask"
          />
        </li>
      </ul>
      <div
        class="flex items-center gap-4 border-t-4 border-base-content/20 pt-4"
      >
        <div class="text-sm bg-base-300 p-2 rounded-md">
          Outstanding:
          {{ tasks?.filter((t) => t.status === "outstanding").length }}
        </div>
        <div class="text-sm bg-base-300 p-2 rounded-md">
          Completed: {{ tasks?.filter((t) => t.status === "completed").length }}
        </div>
        <div class="text-sm bg-base-300 p-2 rounded-md">
          Urgent: {{ tasks?.filter((t) => t.isUrgent).length }}
        </div>
      </div>
    </div>
  </div>
</template>

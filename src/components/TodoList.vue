<script setup lang="ts">
import { ref, onMounted } from "vue";
import ListItem from "./TodoList.Item.vue";
import type { Task } from "./types";

const tasks = ref<Task[]>([]);
const categories = ["Holiday", "Work", "House work"];
const selectedCategory = ref("");
const filteredCategory = ref("Show all");
const filteredResults = ref(tasks);
const descriptionInput = ref<HTMLInputElement | null>(null);

const tasksFromStorage = () => {
  const storedTasks = localStorage.getItem("tasks");
  if (storedTasks) {
    return JSON.parse(storedTasks);
  }
  return;
};

onMounted(() => {
  tasks.value = tasksFromStorage();
});

const addTask = (description: string) => {
  const newTask: Task = {
    description,
    category: selectedCategory.value,
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
};

const changeStatus = (task: Task, newStatus: string) => {
  task.status = newStatus;
  localStorage.setItem("tasks", JSON.stringify(tasks.value));
};

const changeCategory = (task: Task, newCatgeory: string) => {
  task.category = newCatgeory;
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

const saveTask = (task: Task, newDescription: string, newCategory?: string) => {
  console.log("saveTask: ", newDescription, newCategory);
  task.description = newDescription;
  task.category = newCategory || "";
  task.isEditable = false;
  localStorage.setItem("tasks", JSON.stringify(tasks.value));
};

const filterCategoryHandler = () => {
  console.log("filterCategoryHandler");
  filteredResults.value = tasksFromStorage()?.filter(
    (t: Task) => t.category === filteredCategory.value
  );
};

const filterCategoryResetHandler = () => {
  filteredResults.value = tasksFromStorage();
  filteredCategory.value = "Show all";
};
</script>

<template>
  <div class="mx-auto max-w-6xl p-8 text-white/70">
    <div class="flex flex-col gap-4">
      <!-- Task form -->
      <div class="bg-base-300 rounded-md">
        <form
          @submit.prevent="descriptionInput && addTask(descriptionInput.value)"
          class="flex justify-center items-center gap-2 p-8"
        >
          <input
            type="text"
            placeholder="Task description"
            class="grow input input-bordered"
            ref="descriptionInput"
          />
          <select
            v-model="selectedCategory"
            as="select"
            class="select w-full max-w-xs"
          >
            <option disabled selected value="">Category</option>
            <option v-for="category in categories" :value="category">
              {{ category }}
            </option>
          </select>
          <button type="submit" class="btn btn-accent">Submit</button>
        </form>
      </div>
      <div class="bg-base-300 rounded-md px-8 py-4 flex gap-4 items-center">
        Filter by category:
        <select
          v-model="filteredCategory"
          as="select"
          class="select w-full max-w-xs"
          v-on:change="filterCategoryHandler"
        >
          <option disabled selected value="Show all">Show all</option>
          <option v-for="category in categories" :value="category">
            {{ category }}
          </option>
        </select>
        <button
          class="btn btn-neutral"
          v-on:click="filterCategoryResetHandler"
        >
          Reset filter
        </button>
      </div>
      <!-- Task list -->
      <ul class="bg-base-300 rounded-md flex flex-col gap-2">
        <li
          v-if="filteredResults?.length === 0"
          class="p-4 text-center opacity-50"
        >
          No tasks found.
        </li>
        <!-- Task item -->
        <li v-for="task in filteredResults" :key="task.description">
          <ListItem
            :task="task"
            :categories="categories"
            :markAsUrgent="markAsUrgent"
            :editTask="editTask"
            :changeStatus="changeStatus"
            :changeCategory="changeCategory"
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

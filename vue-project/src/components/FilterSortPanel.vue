<template>
  <div id="filters" class="mb-3 text-white">
    <div id="manufacturers" class="relative flex h-18 flex-grow-0">
      <div v-for="filter in manufacturers" :id="filter.name" class="m-0.5 flex w-15 items-center justify-center transition-all duration-150" :class="{ 'rounded-sm bg-[#6cf]': filter.active }" @click="toggleFilter(filter)">
        <img :src="`/data/images/${filter.name}_logo.webp`" :alt="filter.name" draggable="false" />
      </div>
    </div>
    <div id="weapons" class="relative flex flex-grow-0">
      <div v-for="filter in weapons" :id="filter.name" class="m-0.5 flex items-center justify-center transition-all duration-150" :class="{ 'rounded-sm bg-[#6cf]': filter.active }" @click="toggleFilter(filter)">
        <img :src="`/data/images/Icn_weapon_${filter.name.toLowerCase()}.webp`" :alt="filter.name" draggable="false" class="w-12" />
      </div>
    </div>
    <div id="classes" class="relative flex flex-grow-0">
      <div v-for="filter in classes" :id="filter.name" class="m-0.5 flex items-center justify-center transition-all duration-150" :class="{ 'rounded-sm bg-[#6cf]': filter.active }" @click="toggleFilter(filter)">
        <img :src="`/data/images/icn_class_${filter.name.toLowerCase()}.webp`" :alt="filter.name" draggable="false" class="w-12" />
      </div>
    </div>
    <div id="bursts" class="relative flex flex-grow-0">
      <div v-for="filter in bursts" :id="filter.name" class="m-0.5 flex items-center justify-center transition-all duration-150" :class="{ 'rounded-sm bg-[#6cf]': filter.active }" @click="toggleFilter(filter)">
        <img :src="`/data/images/icn_burst_${filter.name}.webp`" :alt="filter.name" draggable="false" class="w-12" />
      </div>
    </div>
    <div id="elements" class="relative flex flex-grow-0">
      <div v-for="filter in elements" id="Fire" class="m-0.5 flex items-center justify-center transition-all duration-150" :class="{ 'rounded-sm bg-[#6cf]': filter.active }" @click="toggleFilter(filter)">
        <img :src="`/data/images/Code${CODE_REPLACER[filter.name]}_hexagon.webp`" :alt="filter.name" draggable="false" class="w-12" />
      </div>
    </div>
    <div id="orders" class="relative flex flex-grow-0">
      <button
        v-for="sorter in Sorters"
        :id="'by_' + sorter.name"
        class="flex h-8 w-14 items-center justify-center rounded-sm text-center transition-all duration-150"
        :class="{ 'bg-[#6cf]': sorter.stat === 'asc', 'bg-red-600': sorter.stat === 'desc' }"
        @click="toggleSorter(sorter)"
      >
        {{ sorter.text }}<span>{{ SortType[sorter.stat] }}</span>
      </button>
      <div id="current_count" class="ml-auto flex w-14 items-center justify-center"><span id="cc_number"></span></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CODE_REPLACER } from "@/utils/constants";
import { ref, type Ref } from "vue";
enum SortType {
  none = "-",
  asc = "↑",
  desc = "↓",
}
type Filter = { name: string; active: boolean };
type Sorter = { name: string; text: string; stat: "asc" | "desc" | "none" };

const manufacturers: Ref<Filter[]> = ref([
  { name: "Elysion", active: false },
  { name: "Missilis", active: false },
  { name: "Tetra", active: false },
  { name: "Pilgrim", active: false },
  { name: "Abnormal", active: false },
]);

const weapons: Ref<Filter[]> = ref([
  { name: "AR", active: false },
  { name: "MG", active: false },
  { name: "RL", active: false },
  { name: "SG", active: false },
  { name: "SMG", active: false },
  { name: "SR", active: false },
]);

const classes: Ref<Filter[]> = ref([
  { name: "Supporter", active: false },
  { name: "Defender", active: false },
  { name: "Attacker", active: false },
]);

const bursts: Ref<Filter[]> = ref([
  { name: "1", active: false },
  { name: "2", active: false },
  { name: "3", active: false },
]);

const elements: Ref<Filter[]> = ref([
  { name: "Fire", active: false },
  { name: "Water", active: false },
  { name: "Electric", active: false },
  { name: "Iron", active: false },
  { name: "Wind", active: false },
]);

const Sorters: Ref<Sorter[]> = ref([
  { name: "id", text: "ID", stat: "asc" },
  { name: "charging", text: "充速", stat: "none" },
  { name: "weapon", text: "武器", stat: "none" },
  { name: "color", text: "颜色", stat: "none" },
]);

const emit = defineEmits(["update:conditions"]);

// 封装获取当前筛选条件的函数（避免重复代码）
function getCurrentFilters() {
  return {
    manufacturers: manufacturers.value.filter(f => f.active).map(f => f.name),
    weapons: weapons.value.filter(f => f.active).map(f => f.name),
    classes: classes.value.filter(f => f.active).map(f => f.name),
    bursts: bursts.value.filter(f => f.active).map(f => f.name),
    elements: elements.value.filter(f => f.active).map(f => f.name),
  };
}

// 获取当前激活的排序器
function getActiveSorter() {
  return Sorters.value.find(sorter => sorter.stat !== "none");
}

// 筛选器切换处理
function toggleFilter(filter: Filter) {
  filter.active = !filter.active;
  
  console.log(getCurrentFilters());
  // 同时提交筛选条件和当前排序状态
  emit("update:conditions", {
    filters: getCurrentFilters(),
    sorters: getActiveSorter()
  });
}

// 排序器切换处理
function toggleSorter(clickedSorter: Sorter) {
  // 重置其他排序器
  Sorters.value.forEach(sorter => {
    if (sorter !== clickedSorter) sorter.stat = "none";
  });

  // 轮转当前排序器状态 (None → Asc → Desc → None...)
  clickedSorter.stat = clickedSorter.stat === "asc" ? "desc" : "asc";

  // 如果所有排序器都未激活，默认激活 ID 排序
  if (!Sorters.value.some(sorter => sorter.stat !== "none")) {
    Sorters.value.find(sorter => sorter.name === "id")!.stat = "asc";
  }

  // 同时提交当前筛选条件和排序状态
  emit("update:conditions", {
    filters: getCurrentFilters(),
    sorters: getActiveSorter()
  });
}
</script>

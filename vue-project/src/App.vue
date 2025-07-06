<template>
  <!-- 动态渲染所有队伍 -->
  <template v-for="(team, teamId) in teams" :key="teamId">
    <NikkeCardContainer class="h-48" :teamId="teamId" v-model="team.nikkes" />
  </template>
  <FilterSordPanel @update:conditions="updateDisplayNikkes" :count="showNikkeIDs.length" />
  <NikkeCardContainer v-model="nikkes" :visibleNikkes="showNikkeIDs" />
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, type Ref } from "vue";
import NikkeCardContainer from "./components/NikkeCardContainer.vue";
import FilterSordPanel from "./components/FilterSortPanel.vue";
import type { Nikke, NikkeBase, NikkeExtended } from "./types/nikke";
import { ATTACK_INTERVAL } from "./utils/constants";
import { hex2hsl, ChargingCalculate } from "./utils/utils";

// const team1 = ref<Nikke[]>([]);
// const team2 = ref<Nikke[]>([]);
// 使用动态队伍数据结构
const teams = reactive<Record<string, { nikkes: Nikke[] }>>({
  team1: { nikkes: [] },
  team2: { nikkes: [] },
  // 添加新队伍只需新增键值对：
  // team3: { nikkes: [] }
});
const nikkes: Nikke[] = [];
const showNikkeIDs = ref<string[]>([]);

onMounted(async () => {
  const [rawRes, addRes] = await Promise.all([fetch("data/nikkes.json"), fetch("data/nikkes_add.json")]);

  const raw_nikkes: Array<NikkeBase> = await rawRes.json();
  const raw_nikkes_add: Array<NikkeExtended> = await addRes.json();

  // 创建ID映射表
  const addMap = new Map(raw_nikkes_add.map((item) => [item.ID, item]));

  // 高效合并
  nikkes.push(
    ...raw_nikkes.map((nikke) => ({
      ...nikke,
      ...(addMap.get(nikke.ID) || {}),
    })),
  );
  nikkes.forEach((nikke) => {
    nikke.Charge = Math.floor(ChargingCalculate(nikke, 2.4) * 100) / 100;
  });
  showNikkeIDs.value = nikkes.map((nikke) => nikke.ID);
});

function updateDisplayNikkes(conditions: { filters: any; sorters: any }) {
  const { filters, sorters } = conditions;
  // ===== 1. 筛选阶段 =====
  const filteredNikkes = [...nikkes].filter(
    (nikke) =>
      (filters.manufacturers.length === 0 || filters.manufacturers.includes(nikke.Manufacturer)) &&
      (filters.weapons.length === 0 || filters.weapons.includes(nikke.Weapon)) &&
      (filters.classes.length === 0 || filters.classes.includes(nikke.Class)) &&
      (filters.bursts.length === 0 || filters.bursts.includes(nikke.Burst) || nikke.Burst === "p") &&
      (filters.elements.length === 0 || filters.elements.includes(nikke.Element)),
  );

  // ===== 2. 排序阶段 =====
  // 创建ID映射表（仅使用筛选后的数据）
  const filteredMap = Object.fromEntries(filteredNikkes.map((n) => [n.ID, n]));

  // 获取待排序的ID数组
  const sortedIDs = filteredNikkes.map((n) => n.ID);

  // 如果有排序条件则执行排序
  if (sorters) {
    sortedIDs.sort((idA, idB) => {
      const nikkeA = filteredMap[idA];
      const nikkeB = filteredMap[idB];

      // 原排序逻辑（略作优化）
      switch (sorters.name) {
        case "id":
          return sorters.stat === "asc" ? parseInt(nikkeA.ID) - parseInt(nikkeB.ID) : parseInt(nikkeB.ID) - parseInt(nikkeA.ID);

        case "charging":
          return sorters.stat === "asc" ? (nikkeA?.Charge ?? 0) - (nikkeB?.Charge ?? 0) : (nikkeB?.Charge ?? 0) - (nikkeA?.Charge ?? 0);

        case "weapon":
          const weaponCompare = nikkeA.Weapon.localeCompare(nikkeB.Weapon);
          return weaponCompare !== 0 ? (sorters.stat === "asc" ? weaponCompare : -weaponCompare) : sorters.stat === "asc" ? (nikkeA?.Charge ?? 0) - (nikkeB?.Charge ?? 0) : (nikkeB?.Charge ?? 0) - (nikkeA?.Charge ?? 0);

        case "color":
          // 实现颜色排序逻辑
          const isGrayish = (hsl: [number, number, number]) => {
            const [h, s, l] = hsl;
            return (s < 0.15 && l > 0.8) || s < 0.1 || l > 0.9 || l < 0.1;
          };

          const ah = hex2hsl(nikkeA?.Color ?? "");
          const bh = hex2hsl(nikkeB?.Color ?? "");

          const aIsGrayish = isGrayish(ah);
          const bIsGrayish = isGrayish(bh);

          if (aIsGrayish && !bIsGrayish) return 1;
          if (!aIsGrayish && bIsGrayish) return -1;

          if (aIsGrayish && bIsGrayish) {
            return sorters.stat === "asc" ? ah[2] - bh[2] : bh[2] - ah[2];
          }

          return sorters.stat === "asc" ? ah[0] - bh[0] || ah[2] - bh[2] : bh[0] - ah[0] || bh[2] - ah[2];

        default:
          return 0;
      }
    });
  }

  // ===== 3. 更新最终结果 =====
  showNikkeIDs.value = sortedIDs;
}
</script>

<style scoped></style>

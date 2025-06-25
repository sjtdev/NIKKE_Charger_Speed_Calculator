<template>
  <div class="max-w-full">
    <div>
      <!-- 使用 draggable 包裹 -->
      <draggable :list="sortedNikkes" :group="dragGroup" @change="handleChange" :component-data="getComponentData()" :clone="teamId ? undefined : cloneNikke" :move="checkMove" item-key="ID" class="flex min-h-33 flex-wrap"
        ><!-- @change="handleChange" -->
        <template #item="{ element }" v-show="shouldShow(element)">
          <NikkeCard :nikke="element" :team="!!teamId" @remove="removeNikke" v-show="shouldShow(element)" />
        </template>
      </draggable>
    </div>
    <ChargingBar v-if="teamId" id="charging-bar" :burst1Timing="burst1Timing" :empty="nikkes.length===0"/>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import draggable from "vuedraggable";
import type { Nikke } from "@/types/nikke";
import NikkeCard from "./NikkeCard.vue";
import ChargingBar from "./ChargingBar.vue";
import { BurstCalculator } from "@/utils/utils";

const props = defineProps({
  teamId: { type: String, required: false },
  visibleNikkes: { type: Array<string>, default: [] },
});

const nikkes = defineModel<Nikke[]>('modelValue', { default: () => [] });
// 创建 ID 到 Nikke 对象的映射表
const nikkeMap = computed(() => {
  const map = new Map();
  nikkes.value?.forEach((n) => map.set(n.ID, n));
  return map;
});
// 优化后的 sortedNikkes
const sortedNikkes = computed(
  () => (props.teamId ? nikkes.value : props.visibleNikkes.map((id) => nikkeMap.value.get(id)).filter(Boolean)), // 过滤掉未找到的项
);

const burst1Timing = computed(() => BurstCalculator(sortedNikkes.value));

// 动态设置拖拽组参数
const dragGroup = computed(() => (props.teamId ? { name: "nikkeGroup" } : { name: "nikkeGroup", pull: "clone", put: false }));

// 克隆函数（源容器专用）
const cloneNikke = (original: Nikke) => ({
  ...original,
  id: Date.now(), // 生成唯一ID避免引用冲突
});

// 移动校验（目标容器专用）
const checkMove = ({ draggedContext, relatedContext }: any) => {
  const draggedNikke = draggedContext.element;
  // console.log(relatedContext.list,props.teamId,relatedContext.component.componentData.teamId,relatedContext.component);
  // 检查是否已存在相同ID的项目
  return (!relatedContext.list.some((n: Nikke) => n.ID === draggedNikke.ID) && relatedContext.list.length < 5) || props.teamId === relatedContext.component.componentData.teamId;
};

// 拖拽变化处理
const handleChange = (event: any) => {
  if (event.added) {
    console.log("Added item:", event.added.element);
    console.log(burst1Timing.value);
  }
};

function removeNikke(nikkeID: string) {
  nikkes.value = nikkes.value?.filter((n) => n.ID !== nikkeID);
}

function getComponentData() {
  return { teamId: props.teamId };
}

function shouldShow(nikke: Nikke) {
  return props.teamId || (props.visibleNikkes?.includes(nikke.ID) ?? true);
}
</script>

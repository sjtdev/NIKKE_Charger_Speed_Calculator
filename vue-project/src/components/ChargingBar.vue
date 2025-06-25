<template>
  <div class="relative mb-10 h-3 w-full">
    <template v-for="(segment, i) in segments" :key="i">
      <div
        class="absolute top-0 bottom-0"
        :class="segment.color"
        :style="{
          left: `${segment.start}%`,
          width: `${segment.width}%`,
        }"
      ></div>
      <div class="absolute z-1 flex h-3 w-16 -translate-x-full items-center justify-end text-[10px] font-bold text-black" :style="{ left: `${segment.end * 10}%` }">{{ segment.text }}</div>
    </template>
    <div v-if="burst1Timing < 10" v-for="(line, index) in lines" class="absolute z-2 flex translate-x-[-50%] flex-col flex-wrap items-center transition-all duration-150" :style="`left:${(burst1Timing + index * BURST_INTERVAL) * 10}%;`">
      <div id="line" class="h-4 w-0.5" :style="`background-color:${line.color};`"></div>
      <div :style="`color:${line.color};`">{{ line.text }}</div>
      <div :style="`color:${line.color};`">{{ (burst1Timing + index * BURST_INTERVAL).toFixed(2) }}</div>
    </div>
    <div v-if="empty" class="absolute top-2 text-white">拖动妮姬卡片到此处显示爆裂时间预测。</div>
    <div v-if="burst1Timing >= 10 && !empty" class="absolute top-2 text-white">爆裂1大于10秒。</div>
  </div>
</template>

<script setup lang="ts">
const segments = [
  { start: 0, end: 2.4, color: "bg-red-500", text: "2RL(~2.4s)" },
  { start: 2.4, end: 3.6, color: "bg-yellow-500", text: "3RL(~3.6s)" },
  { start: 3.6, end: 4.8, color: "bg-green-500", text: "4RL(~4.8s)" },
  { start: 4.8, end: 10, color: "bg-gray-500", text: "5RL+(4.8s+)" },
].map((s) => ({
  ...s,
  width: (s.end - s.start) * 10, // 转换为百分比宽度
  start: s.start * 10, // 转换为百分比位置
}));

const BURST_INTERVAL = 0.535;

const props = defineProps({
  burst1Timing: {
    type: Number,
    default: 10,
  },
  empty: { type: Boolean, required: true },
});

const lines = [
  { color: "green", text: "爆裂1" },
  { color: "yellow", text: "爆裂2" },
  { color: "red", text: "爆裂3" },
];
</script>

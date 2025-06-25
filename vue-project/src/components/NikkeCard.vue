<template>
  <div class="group relative box-border overflow-hidden border-2 border-transparent bg-black transition-all duration-100 ease-out hover:z-50 hover:border-[#6cf] hover:shadow-md">
    <!-- 头像 -->
    <img class="h-32 w-32 transition-all duration-100 ease-out group-hover:scale-110" :src="`data/images/si_c${nikke.ID}_00_s.webp`" alt="" />
    <div class="absolute top-0 right-0 flex flex-col items-center justify-center">
      <!-- 代码图标 -->
      <img class="h-auto w-8" :src="`data/images/Code${CODE_REPLACER[nikke.Element]}_hexagon.webp`" />
      <div class="w-full bg-gray-500/50 text-center [text-shadow:_0_0_2px_#000,_0_0_2px_#000,_0_0_2px_#000,_0_0_2px_#000]" :class="chargeColor">{{ nikke.Charge }}</div>
    </div>
    <div class="absolute top-0 left-0 flex flex-col">
      <!-- 爆裂阶段图标 -->
      <div class="relative flex h-8 w-8 items-center bg-gray-500/25">
        <img class="h-auto max-h-full w-full object-contain" :src="`data/images/icn_burst_${nikke.Burst}.webp`" />
      </div>
      <!-- 武器类型图标 -->
      <div class="relative flex h-8 w-8 items-center bg-gray-500/25">
        <img class="h-auto max-h-full w-full object-contain" :src="`data/images/Icn_weapon_${nikke.Weapon.toLowerCase()}.webp`" />
      </div>
      <!-- 类型图标 -->
      <div class="relative flex h-8 w-8 items-center bg-gray-500/25">
        <img class="h-auto max-h-full w-full object-contain" :src="`data/images/icn_class_${nikke.Class.toLowerCase()}.webp`" />
      </div>
    </div>
    <div :style="`background:linear-gradient(to top, ${nikke.Color}, rgba(0, 0, 0, 0))`" class="absolute bottom-0 left-0 w-full">
      <div class="ml-2 w-28 overflow-hidden">
        <p ref="nameText" class="text-l text-center whitespace-nowrap text-white" :class="{ 'animate-marquee': shouldAnimate }">
          {{ name }}
        </p>
      </div>
    </div>
    <Popover v-if="!team">
      <PopoverTrigger class="absolute right-0 bottom-5 h-8 w-8 rounded-full bg-gray-500/50 text-2xl text-white transition duration-150 ease-out hover:bg-transparent hover:text-gray-500">⛭</PopoverTrigger>
      <PopoverContent>
        <Card><CardHeader> <span class="text-red-500">此功能尚未完成开发，<br>数值设置将不会生效</span></CardHeader>
          <CardHeader>
            <CardTitle>{{ name }} 角色设置</CardTitle>
            <CardDescription>此处设置的属性将映射到全局</CardDescription>
          </CardHeader>
          <CardContent>
            <NumberField
              id="charge_speed"
              :default-value="0"
              :step="0.0001"
              :format-options="{
                style: 'percent',
                minimumFractionDigits: 2,
              }"
            >
              <Label>蓄力速度：</Label>
              <NumberFieldContent>
                <NumberFieldDecrement />
                <NumberFieldInput />
                <NumberFieldIncrement />
              </NumberFieldContent>
            </NumberField>
          </CardContent>
          <CardContent>
            <NumberField id="charge_cube_lv" :default-value="0" :min="0" :max="3" :step="1" :format-options="{}">
              <Label>充能魔方Lv：</Label>
              <NumberFieldContent>
                <NumberFieldDecrement />
                <NumberFieldInput />
                <NumberFieldIncrement />
              </NumberFieldContent>
            </NumberField>
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
    <Popover v-if="team" v-model:open="popoverOpen">
      <PopoverTrigger class="absolute right-0 bottom-5 h-8 w-8 rounded-full bg-gray-500/50 text-2xl text-white transition duration-150 ease-out hover:bg-transparent hover:text-gray-500">🗙</PopoverTrigger>
      <PopoverContent>
        <div class="mb-3 text-center">
          <p class="font-bold">{{ name }}</p>
        </div>
        <div class="flex justify-center space-x-4">
          <button @click="popoverOpen = false" class="rounded bg-gray-200 px-4 py-2 hover:bg-gray-300">取消</button>
          <button @click="confirmRemove" class="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600">确认移除</button>
        </div>
      </PopoverContent>
    </Popover>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, type PropType } from "vue";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { NumberField, NumberFieldContent, NumberFieldDecrement, NumberFieldIncrement, NumberFieldInput } from "@/components/ui/number-field";
import { CODE_REPLACER, ATTACK_INTERVAL } from "@/utils/constants.ts";
import type { Nikke } from "@/types/nikke";

const props = defineProps({
  team: { type: Boolean, default: false },
  nikke: { type: Object as PropType<Nikke>, required: true },
});
const name = props.nikke.Name_cn || props.nikke.Name;
console.log(name);

const popoverOpen = ref(false); // 控制Popover显示状态

const nameText: any = ref(null);
const shouldAnimate = ref(false);

onMounted(() => {
  checkTextOverflow();
});

function checkTextOverflow() {
  if (nameText.value) {
    shouldAnimate.value = nameText.value.scrollWidth > nameText.value.offsetWidth;
  }
}

const emit = defineEmits(["remove"]);
function confirmRemove() {
  emit("remove", props.nikke.ID); // 发送要删除的nikke ID
  popoverOpen.value = false; // 关闭弹窗
}

// 充能相关计算
const chargeColor = computed(() => {
  const nikke = props.nikke;
  const charge = 'Charge' in nikke ? nikke.Charge : undefined;
  
  if (charge === undefined) {
    return "text-stone-300"; // 默认颜色
  }
  
  if (charge > 27) {
    return "text-orange-600";
  } else if (charge > 11) {
    return "text-amber-500";
  } else if (charge > 4) {
    return "text-yellow-300";
  } else {
    return "text-stone-300";
  }
});
</script>
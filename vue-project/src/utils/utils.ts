import type { Nikke } from "@/types/nikke";
import { ATTACK_INTERVAL } from "./constants";

// 添加 hex2hsl 工具函数
export function hex2hsl(hex: string): [number, number, number] {
  hex = hex ? hex.replace(/^#?/, "#") : "#000000";
  let r = parseInt(hex.slice(1, 3), 16) / 255;
  let g = parseInt(hex.slice(3, 5), 16) / 255;
  let b = parseInt(hex.slice(5, 7), 16) / 255;

  let max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h,
    s,
    l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    let d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h! /= 6;
  }

  return [Math.round(h! * 360 * 100) / 100, Math.round(s * 100) / 100, Math.round(l * 100) / 100];
}

export function ChargingCalculate(nikke: Nikke, time: number) {
  const interval = nikke.AttactInterval ?? ATTACK_INTERVAL[nikke.Weapon];
  // let attack_count = nikke.FirstInterval ? (time > nikke.FirstInterval ? Math.floor((time - nikke.FirstInterval) / interval) + 1 : Math.floor(time / nikke.FirstInterval)) : Math.floor(time / interval);
  const attack_count = Math.floor((time - (nikke.FirstInterval || 0)) / interval) + (nikke.FirstInterval && time > nikke.FirstInterval ? 1 : 0);
  return (parseFloat(nikke.Burst_Generation) + (nikke.ChargeAdditive ?? 0)) * attack_count * (nikke.ChargeMultiple ?? (nikke.Weapon == "RL" ? 4 : nikke.Weapon == "SG" ? 10 : 1));
}
export function BurstCalculator(selected_nikke: Nikke[] = []) {
  let burst_time1 = 10;

  for (let i = 0; i < 10; i += 0.1) {
    let temp_count = 0;
    for (let nikke of selected_nikke) {
      let interval = nikke.AttactInterval ?? ATTACK_INTERVAL[nikke.Weapon];
      temp_count += ChargingCalculate(nikke, i);
    }
    if (temp_count > 100) {
      burst_time1 = Math.floor(i * 100) / 100;
      break;
    }
  }
  return burst_time1;
}
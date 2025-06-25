// 基础属性（来自nikkes.json）
export interface NikkeBase {
  ID: string;
  Name: string;
  Manufacturer: "Elysion" | "Tetra" | "Missilis" | "Pilgrim" | "Abnormal";
  Squad: string;
  Weapon: "AR" | "SG" | "RL" | "SMG" | "MG" | "SR";
  Class: "Attacker" | "Defender" | "Supporter";
  Element: "Fire" | "Water" | "Electric" | "Iron" | "Wind";
  Burst: "1" | "2" | "3" | "p"; // p表示特殊蓄力类型
  Burst_Generation: string; // 百分比字符串如 "0.2%"
}

// 扩展属性（来自nikkes_add.json）
export interface NikkeExtended {
  ID: string;
  Name_cn?: string;
  Color?: string; // HEX颜色代码
  Charge?: number;
  ChargePlus?: boolean; // 是否拥有额外充能特性
  ChargeMultiple?: number; // 充能倍率
  ChargeAdditive?: number; // 附加充能值
  AttactInterval?: number; // 攻击间隔（注意原字段拼写为Attact）
  FirstInterval?: number; // 首次攻击间隔
}

// 完整角色类型
export type Nikke = NikkeBase & NikkeExtended;

// 其他实用类型
// export type ElementType = Nikke["Element"];
// export type BurstType = Nikke["Burst"];
// export type ManufacturerType = Nikke["Manufacturer"];
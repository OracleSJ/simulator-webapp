import type { LucideIcon } from "lucide-react";

export type StrategyKey = "ma" | "bb" | "rsi" | "adx" | "kalman1st" | "kalman2nd" | "kalman3rd";
export type KalmanType = "persistent" | "window" | "decay";
export type FieldType = "text" | "number" | "select" | "array" | "toggle" | "conditional" | "grid";

export interface FieldConfig {
  key: string;
  label: string;
  type: FieldType;
  options?: Array<{ value: string | number; label: string }>;
  description?: string;
  condition?: (config: any) => boolean;
  arrayType?: "string" | "number";
  placeholder?: string;
  step?: number;
  min?: number;
  max?: number;
  gridColumns?: number;
  fields?: FieldConfig[]; // conditional이나 grid 타입용
}

export interface SectionConfig {
  title: string;
  icon: LucideIcon;
  fields: FieldConfig[];
}

export interface StrategySchema {
  parameters: SectionConfig;
  logics: SectionConfig;
}

export interface StrategyOption {
  value: StrategyKey;
  label: string;
  description: string;
}

export interface CommonConfig {
  priceCheckingTimeframe: string;
  chartTimeframe: string;
  trendFilterEnabled: boolean;
  watcherHistoryHours: number;
}

export interface FullStrategyConfig {
  strategy: {
    strategyKey: StrategyKey;
    parameters: Record<string, any>;
    logics: Record<string, any>;
  };
  settings: CommonConfig;
}



// 개별 전략 타입 정의
export interface MAConfig {
  parameters: {
    timeframes: string[];
    periods: number[];
  };
  logics: {
    tpPct: number;
    slPct: number;
    maxBarsTimeframe: string;
    maxBars: number;
  };
}

export interface BBConfig {
  parameters: {
    timeframes: string[];
    std: number;
    window: number;
  };
  logics: {
    tpPct: number;
    slPct: number;
    maxBarsTimeframe: string;
    maxBars: number;
  };
}

export interface RSIConfig {
  parameters: {
    timeframe: string;
    period: number;
  };
  logics: {
    tpPct: number;
    slPct: number;
    maxBarsTimeframe: string;
    maxBars: number;
  };
}

export interface ADXConfig {
  parameters: {
    timeframe: string;
    period: number;
  };
  logics: {
    tpPct: number;
    slPct: number;
    maxBarsTimeframe: string;
    maxBars: number;
  };
}

export interface KalmanConfig {
  parameters: {
    timeframe: string;
    kalmanType: KalmanType;
    window?: number;
    Q: number;
    R: number;
    predictionHorizon?: number;
    partialUpdate?: boolean;
    partialUpdateDtAdjust?: boolean;
    decay_x?: number;
    decay_P?: number;
    decay_Q?: number;
  };
  logics: {
    tpPct: number;
    slPct: number;
    maxBarsTimeframe: string;
    maxBars: number;
    entryDiff?: number;
  };
}

export type StrategyConfig = MAConfig | BBConfig | RSIConfig | ADXConfig | KalmanConfig;

import { create } from "zustand";
import type { ProgressStep } from "~/types/timedata";

// ==================== 설정 단계 ====================

interface ProgressState {
  currentStep: ProgressStep;
  nextStep: () => void;
}

export const progressStore = create<ProgressState>()((set) => ({
  currentStep: 1,
  nextStep: () => set((state) => ({ currentStep: (state.currentStep + 1) as ProgressStep })),
}));

// ==================== 시간 데이터 설정 ====================

interface TimeDataState {
  market: string;
  symbol: string;
  timeframe: string;
  startDate: string;
  endDate: string;
}

interface TimeDataAction {
  setConfig: <K extends keyof TimeDataState>(field: K, value: TimeDataState[K]) => void;
}

type TimeDataConfig = TimeDataState & TimeDataAction;

export const configStore = create<TimeDataConfig>()((set) => ({
  market: "crypto",
  symbol: "BTC/USDT",
  timeframe: "1m",
  startDate: "",
  endDate: "",
  setConfig: (field, value) => set({ [field]: value }),
}));

// ==================== 전략 설정 ====================

// 전략별 파라미터 설정
export type StrategyKey = "ma" | "bb" | "rsi" | "adx" | "kalman1st";

interface CommonConfig<> {
  priceCheckingTimeframe: string;
  chartTimeframe: string;
  trendFilterEnabled: boolean;
  watcherHistoryHours: number;
}

interface StrategyState<> {
  key: StrategyKey;
  parameters: Record<string, unknown>;
  logics: Record<string, unknown>;
  common: CommonConfig;
}

interface StrategyAction {
  setKey: (key: StrategyKey) => void;
  setParameter: (field: string, value: unknown) => void;
  setLogic: (field: string, value: unknown) => void;
  setCommonConfig: <K extends keyof CommonConfig>(field: K, value: CommonConfig[K]) => void;
}

type StrategyConfig = StrategyState & StrategyAction;

export const strategyStore = create<StrategyConfig>()((set) => ({
  key: "ma",
  parameters: { timeframes: ["15m"], periods: [3, 5, 20] },
  logics: { tpPct: 0.01, slPct: 0.01, maxBarsTimeframe: "15m", maxBars: 6 },
  common: {
    priceCheckingTimeframe: "1m",
    chartTimeframe: "15m",
    trendFilterEnabled: false,
    watcherHistoryHours: 48,
  },
  setKey: (key) => set({ key }),
  setParameter: (field, value) =>
    set((state) => ({
      parameters: {
        ...state.parameters,
        [field]: value,
      },
    })),
  setLogic: (field, value) =>
    set((state) => ({
      logics: {
        ...state.logics,
        [field]: value,
      },
    })),
  setCommonConfig: (field, value) =>
    set((state) => ({
      common: {
        ...state.common,
        [field]: value,
      },
    })),
}));

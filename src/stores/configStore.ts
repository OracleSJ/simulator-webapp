import { create } from "zustand";

// 입력 단계
type ProgressStep = 1 | 2 | 3;

interface ProgressState {
  currentStep: ProgressStep;
  nextStep: () => void;
}

export const progressStore = create<ProgressState>()((set) => ({
  currentStep: 1,
  nextStep: () => set((state) => ({ currentStep: (state.currentStep + 1) as ProgressStep })),
}));

// 데이터 설정 관련
interface DataSettingState {
  market: string;
  symbol: string;
  timeframe: string;
  startDate: string;
  endDate: string;
}

interface DataSettingAction {
  setDataConfig: <K extends keyof DataSettingState>(field: K, value: DataSettingState[K]) => void;
}

type DataSettingStore = DataSettingState & DataSettingAction;

export const configStore = create<DataSettingStore>()((set) => ({
  market: "crypto",
  symbol: "BTC/USDT",
  timeframe: "1m",
  startDate: "",
  endDate: "",
  setDataConfig: (field, value) => set({ [field]: value }),
}));

// 전략 설정 관련
interface StretegyState {
  value: string;
}

interface StretegyAction {
  method: () => void;
}

type StretegyStore = StretegyState & StretegyAction;

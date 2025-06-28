export type StrategyKey = "ma" | "bb" | "rsi" | "adx" | "kalman1st";

// 개별 전략 타입 정의
export interface MAStrategy {
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

export interface BBStrategy {
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

export interface RSIStrategy {
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

export interface ADXStrategy {
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

export interface KalmanStrategy {
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

interface StrategyParameter {
  timeframe: string;
  period: number;
}

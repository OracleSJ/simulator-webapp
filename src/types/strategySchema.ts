// config/strategySchemas.ts

import type { StrategyKey, StrategySchema, StrategyOption } from "~/types/strategies";

// 공통 옵션들
export const TIMEFRAME_OPTIONS = [
  { value: "1m", label: "1분봉" },
  { value: "5m", label: "5분봉" },
  { value: "15m", label: "15분봉" },
  { value: "1h", label: "1시간봉" },
  { value: "4h", label: "4시간봉" },
  { value: "1d", label: "1일봉" },
];

export const KALMAN_TYPE_OPTIONS = [
  { value: "persistent", label: "누적형 (Persistent)" },
  { value: "window", label: "윈도우형 (Window)" },
  { value: "decay", label: "감쇠형 (Decay)" },
];

// 전략 옵션
export const STRATEGY_OPTIONS: StrategyOption[] = [
  { value: "ma", label: "Moving Average (MA)", description: "이동평균 기반 전략" },
  { value: "bb", label: "Bollinger Bands (BB)", description: "볼린저 밴드 기반 전략" },
  { value: "rsi", label: "RSI", description: "RSI 지표 기반 전략" },
  { value: "adx", label: "ADX/DI+/DI-", description: "ADX 지표 기반 전략" },
  { value: "kalman1st", label: "1차 칼만 필터", description: "1차 칼만 필터 기반 전략" },
  { value: "kalman2nd", label: "2차 칼만 필터", description: "2차 칼만 필터 기반 전략" },
  { value: "kalman3rd", label: "3차 칼만 필터", description: "3차 칼만 필터 기반 전략" },
];

// 공통 로직 필드 (모든 전략에서 재사용)
const COMMON_LOGIC_FIELDS = [
  {
    key: "",
    label: "",
    type: "grid" as const,
    gridColumns: 2,
    fields: [
      {
        key: "tpPct",
        label: "TP_PCT (Take Profit %)",
        type: "number" as const,
        step: 0.001,
      },
      {
        key: "slPct",
        label: "SL_PCT (Stop Loss %)",
        type: "number" as const,
        step: 0.001,
      },
    ],
  },
  {
    key: "",
    label: "",
    type: "grid" as const,
    gridColumns: 2,
    fields: [
      {
        key: "maxBarsTimeframe",
        label: "MAX_BARS_TIMEFRAME",
        type: "select" as const,
        options: TIMEFRAME_OPTIONS,
      },
      {
        key: "maxBars",
        label: "MAX_BARS (최대 보유 기간)",
        type: "number" as const,
        description: "예: 6 = 최대 보유 6개의 해당 타임프레임",
      },
    ],
  },
];

// 전략별 스키마 정의
export const STRATEGY_SCHEMAS: Record<StrategyKey, StrategySchema> = {
  ma: {
    parameters: {
      title: "파라미터 설정",
      icon: "📊",
      fields: [
        {
          key: "timeframes",
          label: "타임프레임 리스트",
          type: "array",
          arrayType: "string",
          placeholder: "15m",
          description: "예: [15m, 1h, 3h] 일 경우 각 타임프레임에 대해 아래 period들의 MA 생성",
        },
        {
          key: "periods",
          label: "MA 기간 리스트",
          type: "array",
          arrayType: "number",
          placeholder: "20",
          description: "예: [3, 5, 20, 120]",
        },
      ],
    },
    logics: {
      title: "전략 로직 설정",
      icon: "🎯",
      fields: COMMON_LOGIC_FIELDS,
    },
  },

  bb: {
    parameters: {
      title: "파라미터 설정",
      icon: "📊",
      fields: [
        {
          key: "timeframes",
          label: "타임프레임 리스트",
          type: "array",
          arrayType: "string",
          placeholder: "15m",
          description: "예: [15m, 1h, 3h] 일 경우 각 타임프레임에 대해 BB 생성",
        },
        {
          key: "",
          label: "",
          type: "grid",
          gridColumns: 2,
          fields: [
            {
              key: "std",
              label: "표준편차 (std)",
              type: "number",
              step: 0.1,
            },
            {
              key: "window",
              label: "윈도우",
              type: "number",
            },
          ],
        },
      ],
    },
    logics: {
      title: "전략 로직 설정",
      icon: "🎯",
      fields: COMMON_LOGIC_FIELDS,
    },
  },

  rsi: {
    parameters: {
      title: "파라미터 설정",
      icon: "⚡",
      fields: [
        {
          key: "",
          label: "",
          type: "grid",
          gridColumns: 2,
          fields: [
            {
              key: "timeframe",
              label: "타임프레임",
              type: "select",
              options: TIMEFRAME_OPTIONS,
            },
            {
              key: "period",
              label: "RSI 기간",
              type: "number",
            },
          ],
        },
      ],
    },
    logics: {
      title: "전략 로직 설정",
      icon: "🎯",
      fields: COMMON_LOGIC_FIELDS,
    },
  },

  adx: {
    parameters: {
      title: "파라미터 설정",
      icon: "📈",
      fields: [
        {
          key: "",
          label: "",
          type: "grid",
          gridColumns: 2,
          fields: [
            {
              key: "timeframe",
              label: "타임프레임",
              type: "select",
              options: TIMEFRAME_OPTIONS,
            },
            {
              key: "period",
              label: "ADX 기간",
              type: "number",
            },
          ],
        },
      ],
    },
    logics: {
      title: "전략 로직 설정",
      icon: "🎯",
      fields: COMMON_LOGIC_FIELDS,
    },
  },

  kalman1st: {
    parameters: {
      title: "파라미터 설정",
      icon: "⚡",
      fields: [
        {
          key: "",
          label: "",
          type: "grid",
          gridColumns: 2,
          fields: [
            {
              key: "timeframe",
              label: "타임프레임",
              type: "select",
              options: TIMEFRAME_OPTIONS,
            },
            {
              key: "kalmanType",
              label: "칼만 타입",
              type: "select",
              options: KALMAN_TYPE_OPTIONS,
            },
          ],
        },
        {
          key: "window",
          label: "칼만 윈도우",
          type: "number",
          condition: (config) => config.parameters?.kalmanType === "window",
        },
        {
          key: "",
          label: "",
          type: "grid",
          gridColumns: 2,
          fields: [
            {
              key: "Q",
              label: "Q (프로세스 노이즈)",
              type: "number",
              step: 0.001,
            },
            {
              key: "R",
              label: "R (측정 노이즈)",
              type: "number",
              step: 0.001,
            },
          ],
        },
        {
          key: "",
          label: "감쇠 계수 (1.0이면 감쇠 없음)",
          type: "conditional",
          condition: (config) => config.parameters?.kalmanType === "decay",
          fields: [
            {
              key: "",
              label: "",
              type: "grid",
              gridColumns: 3,
              fields: [
                {
                  key: "decay_x",
                  label: "kalman_decay_x",
                  type: "number",
                  step: 0.01,
                  description: "상태 벡터 x 감쇠율",
                },
                {
                  key: "decay_P",
                  label: "kalman_decay_P",
                  type: "number",
                  step: 0.01,
                  description: "공분산 P 감쇠율",
                },
                {
                  key: "decay_Q",
                  label: "kalman_decay_Q",
                  type: "number",
                  step: 0.01,
                  description: "Q 감쇠율 (=1이면 변화 없음)",
                },
              ],
            },
          ],
        },
      ],
    },
    logics: {
      title: "전략 로직 설정",
      icon: "🎯",
      fields: COMMON_LOGIC_FIELDS,
    },
  },

  kalman2nd: {
    parameters: {
      title: "파라미터 설정",
      icon: "⚡",
      fields: [
        {
          key: "",
          label: "",
          type: "grid",
          gridColumns: 2,
          fields: [
            {
              key: "timeframe",
              label: "타임프레임",
              type: "select",
              options: TIMEFRAME_OPTIONS,
            },
            {
              key: "kalmanType",
              label: "칼만 타입",
              type: "select",
              options: KALMAN_TYPE_OPTIONS,
            },
          ],
        },
        {
          key: "window",
          label: "칼만 윈도우",
          type: "number",
          condition: (config) => config.parameters?.kalmanType === "window",
        },
        {
          key: "",
          label: "",
          type: "grid",
          gridColumns: 2,
          fields: [
            {
              key: "Q",
              label: "Q (프로세스 노이즈)",
              type: "number",
              step: 0.001,
            },
            {
              key: "R",
              label: "R (측정 노이즈)",
              type: "number",
              step: 0.001,
            },
          ],
        },
        {
          key: "predictionHorizon",
          label: "예측 거리 (Prediction Horizon)",
          type: "number",
          description: "타임프레임 bar 단위. 예: 타임프레임 15m, 예측거리 4 = 15분 × 4 = 1시간",
        },
        {
          key: "",
          label: "",
          type: "grid",
          gridColumns: 2,
          fields: [
            {
              key: "partialUpdate",
              label: "Partial Update (실시간 갱신)",
              type: "toggle",
            },
            {
              key: "partialUpdateDtAdjust",
              label: "Partial Update Δt 조정",
              type: "toggle",
            },
          ],
        },
        {
          key: "",
          label: "감쇠 계수 (1.0이면 감쇠 없음)",
          type: "conditional",
          condition: (config) => config.parameters?.kalmanType === "decay",
          fields: [
            {
              key: "",
              label: "",
              type: "grid",
              gridColumns: 3,
              fields: [
                {
                  key: "decay_x",
                  label: "kalman_decay_x",
                  type: "number",
                  step: 0.01,
                  description: "상태 벡터 x 감쇠율",
                },
                {
                  key: "decay_P",
                  label: "kalman_decay_P",
                  type: "number",
                  step: 0.01,
                  description: "공분산 P 감쇠율",
                },
                {
                  key: "decay_Q",
                  label: "kalman_decay_Q",
                  type: "number",
                  step: 0.01,
                  description: "Q 감쇠율 (=1이면 변화 없음)",
                },
              ],
            },
          ],
        },
      ],
    },
    logics: {
      title: "전략 로직 설정",
      icon: "🎯",
      fields: [
        ...COMMON_LOGIC_FIELDS,
        {
          key: "entryDiff",
          label: "entry_diff (진입 임계 비율)",
          type: "number",
          step: 0.001,
          description: "예: 0.005 = 0.5% (2차/3차 칼만 전략에서 사용)",
        },
      ],
    },
  },

  kalman3rd: {
    parameters: {
      title: "파라미터 설정",
      icon: "⚡",
      fields: [
        {
          key: "",
          label: "",
          type: "grid",
          gridColumns: 2,
          fields: [
            {
              key: "timeframe",
              label: "타임프레임",
              type: "select",
              options: TIMEFRAME_OPTIONS,
            },
            {
              key: "kalmanType",
              label: "칼만 타입",
              type: "select",
              options: KALMAN_TYPE_OPTIONS,
            },
          ],
        },
        {
          key: "window",
          label: "칼만 윈도우",
          type: "number",
          condition: (config) => config.parameters?.kalmanType === "window",
        },
        {
          key: "",
          label: "",
          type: "grid",
          gridColumns: 2,
          fields: [
            {
              key: "Q",
              label: "Q (프로세스 노이즈)",
              type: "number",
              step: 0.001,
            },
            {
              key: "R",
              label: "R (측정 노이즈)",
              type: "number",
              step: 0.001,
            },
          ],
        },
        {
          key: "predictionHorizon",
          label: "예측 거리 (Prediction Horizon)",
          type: "number",
          description: "타임프레임 bar 단위. 예: 타임프레임 15m, 예측거리 4 = 15분 × 4 = 1시간",
        },
        {
          key: "",
          label: "",
          type: "grid",
          gridColumns: 2,
          fields: [
            {
              key: "partialUpdate",
              label: "Partial Update (실시간 갱신)",
              type: "toggle",
            },
            {
              key: "partialUpdateDtAdjust",
              label: "Partial Update Δt 조정",
              type: "toggle",
            },
          ],
        },
        {
          key: "",
          label: "감쇠 계수 (1.0이면 감쇠 없음)",
          type: "conditional",
          condition: (config) => config.parameters?.kalmanType === "decay",
          fields: [
            {
              key: "",
              label: "",
              type: "grid",
              gridColumns: 3,
              fields: [
                {
                  key: "decay_x",
                  label: "kalman_decay_x",
                  type: "number",
                  step: 0.01,
                  description: "상태 벡터 x 감쇠율",
                },
                {
                  key: "decay_P",
                  label: "kalman_decay_P",
                  type: "number",
                  step: 0.01,
                  description: "공분산 P 감쇠율",
                },
                {
                  key: "decay_Q",
                  label: "kalman_decay_Q",
                  type: "number",
                  step: 0.01,
                  description: "Q 감쇠율 (=1이면 변화 없음)",
                },
              ],
            },
          ],
        },
      ],
    },
    logics: {
      title: "전략 로직 설정",
      icon: "🎯",
      fields: [
        ...COMMON_LOGIC_FIELDS,
        {
          key: "entryDiff",
          label: "entry_diff (진입 임계 비율)",
          type: "number",
          step: 0.001,
          description: "예: 0.005 = 0.5% (2차/3차 칼만 전략에서 사용)",
        },
      ],
    },
  },
};

// 기본값 생성 함수
export const getDefaultConfigByStrategy = (strategyKey: StrategyKey) => {
  const defaults: Record<StrategyKey, any> = {
    ma: {
      parameters: { timeframes: ["15m"], periods: [3, 5, 20] },
      logics: { tpPct: 0.01, slPct: 0.01, maxBarsTimeframe: "15m", maxBars: 6 },
    },
    bb: {
      parameters: { timeframes: ["15m"], std: 2.0, window: 20 },
      logics: { tpPct: 0.01, slPct: 0.01, maxBarsTimeframe: "15m", maxBars: 6 },
    },
    rsi: {
      parameters: { timeframe: "15m", period: 14 },
      logics: { tpPct: 0.01, slPct: 0.01, maxBarsTimeframe: "15m", maxBars: 6 },
    },
    adx: {
      parameters: { timeframe: "15m", period: 14 },
      logics: { tpPct: 0.01, slPct: 0.01, maxBarsTimeframe: "15m", maxBars: 6 },
    },
    kalman1st: {
      parameters: { timeframe: "15m", kalmanType: "persistent", Q: 0.01, R: 3.0 },
      logics: { tpPct: 0.01, slPct: 0.01, maxBarsTimeframe: "15m", maxBars: 6 },
    },
    kalman2nd: {
      parameters: {
        timeframe: "15m",
        kalmanType: "window",
        window: 20,
        Q: 0.01,
        R: 0.005,
        predictionHorizon: 4,
        partialUpdate: false,
        partialUpdateDtAdjust: true,
        decay_x: 0.98,
        decay_P: 0.95,
        decay_Q: 1.0,
      },
      logics: { tpPct: 0.01, slPct: 0.01, maxBarsTimeframe: "15m", maxBars: 6, entryDiff: 0.005 },
    },
    kalman3rd: {
      parameters: {
        timeframe: "15m",
        kalmanType: "persistent",
        Q: 0.001,
        R: 0.005,
        predictionHorizon: 4,
        partialUpdate: false,
        partialUpdateDtAdjust: true,
        decay_x: 0.98,
        decay_P: 0.95,
        decay_Q: 1.0,
      },
      logics: { tpPct: 0.01, slPct: 0.01, maxBarsTimeframe: "15m", maxBars: 6, entryDiff: 0.005 },
    },
  };

  return defaults[strategyKey];
};

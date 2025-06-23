// StrategyFormSection.tsx
import React, { useState } from "react";
import {
  Settings,
  TrendingUp,
  Clock,
  BarChart3,
  Activity,
  Zap,
  Target,
  Filter,
  Plus,
  Minus,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";

// 타입 정의
type StrategyKey = "ma" | "bb" | "rsi" | "adx" | "kalman1st" | "kalman2nd" | "kalman3rd";
type KalmanType = "persistent" | "window" | "decay";

interface BaseStrategyConfig {
  strategyKey: StrategyKey;
}

interface StrategyLogic {
  tpPct: number;
  slPct: number;
  maxBarsTimeframe: string;
  maxBars: number;
  entryDiff?: number; // 2차/3차 칼만용
}

interface MAConfig extends BaseStrategyConfig {
  strategyKey: "ma";
  parameters: {
    timeframes: string[];
    periods: number[];
  };
  logics: StrategyLogic;
}

interface BBConfig extends BaseStrategyConfig {
  strategyKey: "bb";
  parameters: {
    timeframes: string[];
    std: number;
    window: number;
  };
  logics: StrategyLogic;
}

interface RSIConfig extends BaseStrategyConfig {
  strategyKey: "rsi";
  parameters: {
    timeframe: string;
    period: number;
  };
  logics: StrategyLogic;
}

interface ADXConfig extends BaseStrategyConfig {
  strategyKey: "adx";
  parameters: {
    timeframe: string;
    period: number;
  };
  logics: StrategyLogic;
}

interface KalmanConfig extends BaseStrategyConfig {
  strategyKey: "kalman1st" | "kalman2nd" | "kalman3rd";
  parameters: {
    timeframe: string;
    kalmanType: KalmanType;
    window?: number;
    Q: number;
    R: number;
    // 2차, 3차용 고급 설정
    predictionHorizon?: number;
    partialUpdate?: boolean;
    partialUpdateDtAdjust?: boolean;
    // 감쇠 모드용
    decay_x?: number;
    decay_P?: number;
    decay_Q?: number;
  };
  logics: StrategyLogic;
}

type StrategyConfig = MAConfig | BBConfig | RSIConfig | ADXConfig | KalmanConfig;

interface CommonConfig {
  // 공통 설정
  common: {
    priceCheckingTimeframe: string;
    chartTimeframe: string;
    trendFilterEnabled: boolean;
    watcherHistoryHours: number;
  };
}

// 전체 설정 타입
interface FullConfig {
  strategy: StrategyConfig;
  settings: CommonConfig;
}

// 전략 옵션
const STRATEGY_OPTIONS = [
  { value: "ma" as StrategyKey, label: "Moving Average (MA)", description: "이동평균 기반 전략" },
  {
    value: "bb" as StrategyKey,
    label: "Bollinger Bands (BB)",
    description: "볼린저 밴드 기반 전략",
  },
  { value: "rsi" as StrategyKey, label: "RSI", description: "RSI 지표 기반 전략" },
  { value: "adx" as StrategyKey, label: "ADX/DI+/DI-", description: "ADX 지표 기반 전략" },
  {
    value: "kalman1st" as StrategyKey,
    label: "1차 칼만 필터",
    description: "1차 칼만 필터 기반 전략",
  },
  {
    value: "kalman2nd" as StrategyKey,
    label: "2차 칼만 필터",
    description: "2차 칼만 필터 기반 전략",
  },
  {
    value: "kalman3rd" as StrategyKey,
    label: "3차 칼만 필터",
    description: "3차 칼만 필터 기반 전략",
  },
];

const TIMEFRAME_OPTIONS = [
  { value: "1m", label: "1분봉" },
  { value: "5m", label: "5분봉" },
  { value: "15m", label: "15분봉" },
  { value: "1h", label: "1시간봉" },
  { value: "4h", label: "4시간봉" },
  { value: "1d", label: "1일봉" },
];

const KALMAN_TYPE_OPTIONS = [
  { value: "persistent" as KalmanType, label: "누적형 (Persistent)" },
  { value: "window" as KalmanType, label: "윈도우형 (Window)" },
  { value: "decay" as KalmanType, label: "감쇠형 (Decay)" },
];

// 초기값 생성 함수
const getInitialStrategyLogic = (): StrategyLogic => ({
  tpPct: 0.01,
  slPct: 0.01,
  maxBarsTimeframe: "15m",
  maxBars: 6,
  entryDiff: 0.005,
});

const getInitialStrategyConfig = (strategyKey: StrategyKey): StrategyConfig => {
  const base = {
    strategyKey,
  };

  switch (strategyKey) {
    case "ma":
      return {
        ...base,
        strategyKey: "ma",
        parameters: {
          timeframes: ["15m"],
          periods: [3, 5, 20],
        },
        logics: getInitialStrategyLogic(),
      };
    case "bb":
      return {
        ...base,
        strategyKey: "bb",
        parameters: {
          timeframes: ["15m"],
          std: 2.0,
          window: 20,
        },
        logics: getInitialStrategyLogic(),
      };
    case "rsi":
      return {
        ...base,
        strategyKey: "rsi",
        parameters: {
          timeframe: "15m",
          period: 14,
        },
        logics: getInitialStrategyLogic(),
      };
    case "adx":
      return {
        ...base,
        strategyKey: "adx",
        parameters: {
          timeframe: "15m",
          period: 14,
        },
        logics: getInitialStrategyLogic(),
      };
    case "kalman1st":
      return {
        ...base,
        strategyKey: "kalman1st",
        parameters: {
          timeframe: "15m",
          kalmanType: "persistent",
          Q: 0.01,
          R: 3.0,
        },
        logics: getInitialStrategyLogic(),
      };
    case "kalman2nd":
      return {
        ...base,
        strategyKey: "kalman2nd",
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
        logics: getInitialStrategyLogic(),
      };
    case "kalman3rd":
      return {
        ...base,
        strategyKey: "kalman3rd",
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
        logics: getInitialStrategyLogic(),
      };
    default:
      throw new Error(`Unknown strategy key: ${strategyKey}`);
  }
};

const getInitialCommonConfig = (): CommonConfig => ({
  common: {
    priceCheckingTimeframe: "1m",
    chartTimeframe: "15m",
    trendFilterEnabled: false,
    watcherHistoryHours: 48,
  },
});

// 토글 스위치 컴포넌트
interface ToggleSwitchProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  label: string;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ enabled, onChange, label }) => (
  <div className="flex items-center gap-2">
    <button onClick={() => onChange(!enabled)} className="flex items-center gap-1 text-sm">
      {enabled ? (
        <ToggleRight className="w-5 h-5 text-green-400" />
      ) : (
        <ToggleLeft className="w-5 h-5 text-gray-400" />
      )}
      <span className={enabled ? "text-green-400" : "text-gray-400"}>{label}</span>
    </button>
  </div>
);

// 배열 입력 컴포넌트
interface ArrayInputProps {
  values: (string | number)[];
  onChange: (values: (string | number)[]) => void;
  placeholder: string;
  type: "string" | "number";
}

const ArrayInput: React.FC<ArrayInputProps> = ({ values, onChange, placeholder, type }) => {
  const addValue = () => {
    onChange([...values, type === "number" ? 0 : ""]);
  };

  const removeValue = (index: number) => {
    onChange(values.filter((_, i) => i !== index));
  };

  const updateValue = (index: number, value: string | number) => {
    const newValues = [...values];
    newValues[index] = type === "number" ? Number(value) : value;
    onChange(newValues);
  };

  return (
    <div className="space-y-2">
      {values.map((value, index) => (
        <div key={index} className="flex items-center gap-2">
          <input
            type={type === "number" ? "number" : "text"}
            value={value}
            onChange={(e) => updateValue(index, e.target.value)}
            placeholder={placeholder}
            className="flex-1 px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
          <button
            onClick={() => removeValue(index)}
            className="p-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all">
            <Minus className="w-4 h-4" />
          </button>
        </div>
      ))}
      <button
        onClick={addValue}
        className="flex items-center gap-2 px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-all w-full justify-center">
        <Plus className="w-4 h-4" />
        추가
      </button>
    </div>
  );
};

// MA 전략 설정 컴포넌트
const MAStrategyForm: React.FC<{
  config: MAConfig;
  onChange: (config: MAConfig) => void;
}> = ({ config, onChange }) => {
  const updateParameters = (updates: Partial<MAConfig["parameters"]>) => {
    onChange({
      ...config,
      parameters: { ...config.parameters, ...updates },
    });
  };

  const updateLogics = (updates: Partial<StrategyLogic>) => {
    onChange({
      ...config,
      logics: { ...config.logics, ...updates },
    });
  };

  return (
    <div className="space-y-6">
      {/* 파라미터 설정 */}
      <div className="space-y-4">
        <h4 className="flex items-center gap-2 text-sm font-medium text-gray-200">
          <BarChart3 className="w-4 h-4" />
          파라미터 설정
        </h4>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-200">
              타임프레임 리스트
            </label>
            <ArrayInput
              values={config.parameters.timeframes}
              onChange={(timeframes) => updateParameters({ timeframes: timeframes as string[] })}
              placeholder="15m"
              type="string"
            />
            <p className="text-xs text-gray-400">
              예: [15m, 1h, 3h] 일 경우 각 타임프레임에 대해 아래 period들의 MA 생성
            </p>
          </div>
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-200">
              MA 기간 리스트
            </label>
            <ArrayInput
              values={config.parameters.periods}
              onChange={(periods) => updateParameters({ periods: periods as number[] })}
              placeholder="20"
              type="number"
            />
            <p className="text-xs text-gray-400">예: [3, 5, 20, 120]</p>
          </div>
        </div>
      </div>

      {/* 전략 로직 설정 */}
      <div className="space-y-4">
        <h4 className="flex items-center gap-2 text-sm font-medium text-gray-200">
          <Target className="w-4 h-4" />
          전략 로직 설정
        </h4>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-200">
                TP_PCT (Take Profit %)
              </label>
              <input
                type="number"
                step="0.001"
                value={config.logics.tpPct}
                onChange={(e) => updateLogics({ tpPct: Number(e.target.value) })}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-200">
                SL_PCT (Stop Loss %)
              </label>
              <input
                type="number"
                step="0.001"
                value={config.logics.slPct}
                onChange={(e) => updateLogics({ slPct: Number(e.target.value) })}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-200">
                MAX_BARS_TIMEFRAME
              </label>
              <select
                value={config.logics.maxBarsTimeframe}
                onChange={(e) => updateLogics({ maxBarsTimeframe: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none">
                {TIMEFRAME_OPTIONS.map((tf) => (
                  <option key={tf.value} value={tf.value} className="bg-slate-800">
                    {tf.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-200">
                MAX_BARS (최대 보유 기간)
              </label>
              <input
                type="number"
                value={config.logics.maxBars}
                onChange={(e) => updateLogics({ maxBars: Number(e.target.value) })}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              <p className="text-xs text-gray-400">
                예: 6 = 최대 보유 6개의 {config.logics.maxBarsTimeframe}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// BB 전략 설정 컴포넌트
const BBStrategyForm: React.FC<{
  config: BBConfig;
  onChange: (config: BBConfig) => void;
}> = ({ config, onChange }) => {
  const updateParameters = (updates: Partial<BBConfig["parameters"]>) => {
    onChange({
      ...config,
      parameters: { ...config.parameters, ...updates },
    });
  };

  const updateLogics = (updates: Partial<StrategyLogic>) => {
    onChange({
      ...config,
      logics: { ...config.logics, ...updates },
    });
  };

  return (
    <div className="space-y-6">
      {/* 파라미터 설정 */}
      <div className="space-y-4">
        <h4 className="flex items-center gap-2 text-sm font-medium text-gray-200">
          <BarChart3 className="w-4 h-4" />
          파라미터 설정
        </h4>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-200">
              타임프레임 리스트
            </label>
            <ArrayInput
              values={config.parameters.timeframes}
              onChange={(timeframes) => updateParameters({ timeframes: timeframes as string[] })}
              placeholder="15m"
              type="string"
            />
            <p className="text-xs text-gray-400">
              예: [15m, 1h, 3h] 일 경우 각 타임프레임에 대해 BB 생성
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-200">
                표준편차 (std)
              </label>
              <input
                type="number"
                step="0.1"
                value={config.parameters.std}
                onChange={(e) => updateParameters({ std: Number(e.target.value) })}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-200">
                윈도우
              </label>
              <input
                type="number"
                value={config.parameters.window}
                onChange={(e) => updateParameters({ window: Number(e.target.value) })}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 전략 로직 설정 */}
      <div className="space-y-4">
        <h4 className="flex items-center gap-2 text-sm font-medium text-gray-200">
          <Target className="w-4 h-4" />
          전략 로직 설정
        </h4>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-200">
                TP_PCT (Take Profit %)
              </label>
              <input
                type="number"
                step="0.001"
                value={config.logics.tpPct}
                onChange={(e) => updateLogics({ tpPct: Number(e.target.value) })}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-200">
                SL_PCT (Stop Loss %)
              </label>
              <input
                type="number"
                step="0.001"
                value={config.logics.slPct}
                onChange={(e) => updateLogics({ slPct: Number(e.target.value) })}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-200">
                MAX_BARS_TIMEFRAME
              </label>
              <select
                value={config.logics.maxBarsTimeframe}
                onChange={(e) => updateLogics({ maxBarsTimeframe: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none">
                {TIMEFRAME_OPTIONS.map((tf) => (
                  <option key={tf.value} value={tf.value} className="bg-slate-800">
                    {tf.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-200">
                MAX_BARS (최대 보유 기간)
              </label>
              <input
                type="number"
                value={config.logics.maxBars}
                onChange={(e) => updateLogics({ maxBars: Number(e.target.value) })}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              <p className="text-xs text-gray-400">
                예: 6 = 최대 보유 6개의 {config.logics.maxBarsTimeframe}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// RSI 전략 설정 컴포넌트
const RSIStrategyForm: React.FC<{
  config: RSIConfig;
  onChange: (config: RSIConfig) => void;
}> = ({ config, onChange }) => {
  const updateParameters = (updates: Partial<RSIConfig["parameters"]>) => {
    onChange({
      ...config,
      parameters: { ...config.parameters, ...updates },
    });
  };

  const updateLogics = (updates: Partial<StrategyLogic>) => {
    onChange({
      ...config,
      logics: { ...config.logics, ...updates },
    });
  };

  return (
    <div className="space-y-6">
      {/* 파라미터 설정 */}
      <div className="space-y-4">
        <h4 className="flex items-center gap-2 text-sm font-medium text-gray-200">
          <Activity className="w-4 h-4" />
          파라미터 설정
        </h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-200">
              타임프레임
            </label>
            <select
              value={config.parameters.timeframe}
              onChange={(e) => updateParameters({ timeframe: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none">
              {TIMEFRAME_OPTIONS.map((tf) => (
                <option key={tf.value} value={tf.value} className="bg-slate-800">
                  {tf.label}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-200">
              RSI 기간
            </label>
            <input
              type="number"
              value={config.parameters.period}
              onChange={(e) => updateParameters({ period: Number(e.target.value) })}
              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
        </div>
      </div>

      {/* 전략 로직 설정 */}
      <div className="space-y-4">
        <h4 className="flex items-center gap-2 text-sm font-medium text-gray-200">
          <Target className="w-4 h-4" />
          전략 로직 설정
        </h4>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-200">
                TP_PCT (Take Profit %)
              </label>
              <input
                type="number"
                step="0.001"
                value={config.logics.tpPct}
                onChange={(e) => updateLogics({ tpPct: Number(e.target.value) })}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-200">
                SL_PCT (Stop Loss %)
              </label>
              <input
                type="number"
                step="0.001"
                value={config.logics.slPct}
                onChange={(e) => updateLogics({ slPct: Number(e.target.value) })}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-200">
                MAX_BARS_TIMEFRAME
              </label>
              <select
                value={config.logics.maxBarsTimeframe}
                onChange={(e) => updateLogics({ maxBarsTimeframe: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none">
                {TIMEFRAME_OPTIONS.map((tf) => (
                  <option key={tf.value} value={tf.value} className="bg-slate-800">
                    {tf.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-200">
                MAX_BARS (최대 보유 기간)
              </label>
              <input
                type="number"
                value={config.logics.maxBars}
                onChange={(e) => updateLogics({ maxBars: Number(e.target.value) })}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              <p className="text-xs text-gray-400">
                예: 6 = 최대 보유 6개의 {config.logics.maxBarsTimeframe}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ADX 전략 설정 컴포넌트
const ADXStrategyForm: React.FC<{
  config: ADXConfig;
  onChange: (config: ADXConfig) => void;
}> = ({ config, onChange }) => {
  const updateParameters = (updates: Partial<ADXConfig["parameters"]>) => {
    onChange({
      ...config,
      parameters: { ...config.parameters, ...updates },
    });
  };

  const updateLogics = (updates: Partial<StrategyLogic>) => {
    onChange({
      ...config,
      logics: { ...config.logics, ...updates },
    });
  };

  return (
    <div className="space-y-6">
      {/* 파라미터 설정 */}
      <div className="space-y-4">
        <h4 className="flex items-center gap-2 text-sm font-medium text-gray-200">
          <TrendingUp className="w-4 h-4" />
          파라미터 설정
        </h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-200">
              타임프레임
            </label>
            <select
              value={config.parameters.timeframe}
              onChange={(e) => updateParameters({ timeframe: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none">
              {TIMEFRAME_OPTIONS.map((tf) => (
                <option key={tf.value} value={tf.value} className="bg-slate-800">
                  {tf.label}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-200">
              ADX 기간
            </label>
            <input
              type="number"
              value={config.parameters.period}
              onChange={(e) => updateParameters({ period: Number(e.target.value) })}
              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
        </div>
      </div>

      {/* 전략 로직 설정 */}
      <div className="space-y-4">
        <h4 className="flex items-center gap-2 text-sm font-medium text-gray-200">
          <Target className="w-4 h-4" />
          전략 로직 설정
        </h4>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-200">
                TP_PCT (Take Profit %)
              </label>
              <input
                type="number"
                step="0.001"
                value={config.logics.tpPct}
                onChange={(e) => updateLogics({ tpPct: Number(e.target.value) })}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-200">
                SL_PCT (Stop Loss %)
              </label>
              <input
                type="number"
                step="0.001"
                value={config.logics.slPct}
                onChange={(e) => updateLogics({ slPct: Number(e.target.value) })}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-200">
                MAX_BARS_TIMEFRAME
              </label>
              <select
                value={config.logics.maxBarsTimeframe}
                onChange={(e) => updateLogics({ maxBarsTimeframe: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none">
                {TIMEFRAME_OPTIONS.map((tf) => (
                  <option key={tf.value} value={tf.value} className="bg-slate-800">
                    {tf.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-200">
                MAX_BARS (최대 보유 기간)
              </label>
              <input
                type="number"
                value={config.logics.maxBars}
                onChange={(e) => updateLogics({ maxBars: Number(e.target.value) })}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              <p className="text-xs text-gray-400">
                예: 6 = 최대 보유 6개의 {config.logics.maxBarsTimeframe}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 칼만 필터 전략 설정 컴포넌트
const KalmanStrategyForm: React.FC<{
  config: KalmanConfig;
  onChange: (config: KalmanConfig) => void;
}> = ({ config, onChange }) => {
  const isAdvanced = config.strategyKey === "kalman2nd" || config.strategyKey === "kalman3rd";
  const needsEntryDiff = config.strategyKey === "kalman2nd" || config.strategyKey === "kalman3rd";

  const updateParameters = (updates: Partial<KalmanConfig["parameters"]>) => {
    onChange({
      ...config,
      parameters: { ...config.parameters, ...updates },
    });
  };

  const updateLogics = (updates: Partial<StrategyLogic>) => {
    onChange({
      ...config,
      logics: { ...config.logics, ...updates },
    });
  };

  return (
    <div className="space-y-6">
      {/* 파라미터 설정 */}
      <div className="space-y-4">
        <h4 className="flex items-center gap-2 text-sm font-medium text-gray-200">
          <Zap className="w-4 h-4" />
          파라미터 설정
        </h4>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-200">
                타임프레임
              </label>
              <select
                value={config.parameters.timeframe}
                onChange={(e) => updateParameters({ timeframe: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none">
                {TIMEFRAME_OPTIONS.map((tf) => (
                  <option key={tf.value} value={tf.value} className="bg-slate-800">
                    {tf.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-200">
                칼만 타입
              </label>
              <select
                value={config.parameters.kalmanType}
                onChange={(e) => updateParameters({ kalmanType: e.target.value as KalmanType })}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none">
                {KALMAN_TYPE_OPTIONS.map((type) => (
                  <option key={type.value} value={type.value} className="bg-slate-800">
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {config.parameters.kalmanType === "window" && (
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-200">
                칼만 윈도우
              </label>
              <input
                type="number"
                value={config.parameters.window || 20}
                onChange={(e) => updateParameters({ window: Number(e.target.value) })}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-200">
                Q (프로세스 노이즈)
              </label>
              <input
                type="number"
                step="0.001"
                value={config.parameters.Q}
                onChange={(e) => updateParameters({ Q: Number(e.target.value) })}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-200">
                R (측정 노이즈)
              </label>
              <input
                type="number"
                step="0.001"
                value={config.parameters.R}
                onChange={(e) => updateParameters({ R: Number(e.target.value) })}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* 고급 설정 (2차, 3차 칼만) */}
          {isAdvanced && (
            <>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-200">
                  예측 거리 (Prediction Horizon)
                </label>
                <input
                  type="number"
                  value={config.parameters.predictionHorizon || 4}
                  onChange={(e) => updateParameters({ predictionHorizon: Number(e.target.value) })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                <p className="text-xs text-gray-400">
                  타임프레임 bar 단위. 예: 타임프레임 15m, 예측거리 4 = 15분 × 4 = 1시간
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <ToggleSwitch
                  enabled={config.parameters.partialUpdate || false}
                  onChange={(partialUpdate) => updateParameters({ partialUpdate })}
                  label="Partial Update (실시간 갱신)"
                />
                <ToggleSwitch
                  enabled={config.parameters.partialUpdateDtAdjust || false}
                  onChange={(partialUpdateDtAdjust) => updateParameters({ partialUpdateDtAdjust })}
                  label="Partial Update Δt 조정"
                />
              </div>
            </>
          )}

          {/* 감쇠 모드 설정 */}
          {config.parameters.kalmanType === "decay" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <h5 className="flex items-center gap-2 text-sm font-medium text-gray-200">
                  감쇠 계수 (1.0이면 감쇠 없음)
                </h5>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-200">
                    kalman_decay_x
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={config.parameters.decay_x || 0.98}
                    onChange={(e) => updateParameters({ decay_x: Number(e.target.value) })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                  <p className="text-xs text-gray-400">상태 벡터 x 감쇠율</p>
                </div>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-200">
                    kalman_decay_P
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={config.parameters.decay_P || 0.95}
                    onChange={(e) => updateParameters({ decay_P: Number(e.target.value) })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                  <p className="text-xs text-gray-400">공분산 P 감쇠율</p>
                </div>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-200">
                    kalman_decay_Q
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={config.parameters.decay_Q || 1.0}
                    onChange={(e) => updateParameters({ decay_Q: Number(e.target.value) })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                  <p className="text-xs text-gray-400">Q 감쇠율 (=1이면 변화 없음)</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 전략 로직 설정 */}
      <div className="space-y-4">
        <h4 className="flex items-center gap-2 text-sm font-medium text-gray-200">
          <Target className="w-4 h-4" />
          전략 로직 설정
        </h4>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-200">
                TP_PCT (Take Profit %)
              </label>
              <input
                type="number"
                step="0.001"
                value={config.logics.tpPct}
                onChange={(e) => updateLogics({ tpPct: Number(e.target.value) })}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-200">
                SL_PCT (Stop Loss %)
              </label>
              <input
                type="number"
                step="0.001"
                value={config.logics.slPct}
                onChange={(e) => updateLogics({ slPct: Number(e.target.value) })}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-200">
                MAX_BARS_TIMEFRAME
              </label>
              <select
                value={config.logics.maxBarsTimeframe}
                onChange={(e) => updateLogics({ maxBarsTimeframe: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none">
                {TIMEFRAME_OPTIONS.map((tf) => (
                  <option key={tf.value} value={tf.value} className="bg-slate-800">
                    {tf.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-200">
                MAX_BARS (최대 보유 기간)
              </label>
              <input
                type="number"
                value={config.logics.maxBars}
                onChange={(e) => updateLogics({ maxBars: Number(e.target.value) })}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              <p className="text-xs text-gray-400">
                예: 6 = 최대 보유 6개의 {config.logics.maxBarsTimeframe}
              </p>
            </div>
          </div>

          {needsEntryDiff && (
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-200">
                entry_diff (진입 임계 비율)
              </label>
              <input
                type="number"
                step="0.001"
                value={config.logics.entryDiff || 0.005}
                onChange={(e) => updateLogics({ entryDiff: Number(e.target.value) })}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              <p className="text-xs text-gray-400">예: 0.005 = 0.5% (2차/3차 칼만 전략에서 사용)</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// 메인 컴포넌트
export const StrategyFormSection: React.FC = () => {
  const [strategyKey, setStrategyKey] = useState<StrategyKey>("ma");
  const [strategyConfig, setStrategyConfig] = useState<StrategyConfig>(
    getInitialStrategyConfig("ma")
  );
  const [commonConfig, setCommonConfig] = useState<CommonConfig>(getInitialCommonConfig());

  // 전략 키 변경 시 해당 전략의 초기값으로 리셋
  const handleStrategyKeyChange = (newKey: StrategyKey) => {
    setStrategyKey(newKey);
    const newConfig = getInitialStrategyConfig(newKey);
    setStrategyConfig(newConfig);
  };

  // 공통 설정 업데이트
  const updateCommon = (updates: Partial<CommonConfig["common"]>) => {
    setCommonConfig((prev) => ({
      ...prev,
      common: { ...prev.common, ...updates },
    }));
  };

  const handleSubmit = () => {
    const fullConfig: FullConfig = {
      strategy: strategyConfig,
      settings: commonConfig,
    };
    console.log("전략 설정 완료:", fullConfig);
    // 여기서 다음 단계로 진행하거나 부모 컴포넌트에 데이터 전달
  };

  return (
    <section className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6 shadow-2xl">
      <header className="flex items-center gap-3 mb-6">
        <Settings className="w-6 h-6 text-purple-400" />
        <h2 className="text-2xl font-semibold text-white">전략 설정</h2>
      </header>

      <div className="space-y-6">
        {/* 대상 전략 키 선택 */}
        <section className="space-y-4">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-200">
              <Settings className="w-4 h-4" />
              대상 전략 키
            </label>
            <select
              value={strategyKey}
              onChange={(e) => handleStrategyKeyChange(e.target.value as StrategyKey)}
              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all appearance-none">
              {STRATEGY_OPTIONS.map((strategy) => (
                <option key={strategy.value} value={strategy.value} className="bg-slate-800">
                  {strategy.label}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-400 mt-1">
              {STRATEGY_OPTIONS.find((s) => s.value === strategyKey)?.description}
            </p>
          </div>
        </section>

        {/* 선택된 전략별 설정 폼 */}
        <section className="space-y-4">
          <div className="space-y-2">
            <h3 className="flex items-center gap-2 text-sm font-medium text-gray-200">
              <BarChart3 className="w-4 h-4" />
              사용 지표 파라미터 설정 (
              {STRATEGY_OPTIONS.find((s) => s.value === strategyKey)?.label})
            </h3>
          </div>

          <div className="p-4 bg-white/5 rounded-lg border border-white/20">
            {strategyKey === "ma" && (
              <MAStrategyForm config={strategyConfig as MAConfig} onChange={setStrategyConfig} />
            )}

            {strategyKey === "bb" && (
              <BBStrategyForm config={strategyConfig as BBConfig} onChange={setStrategyConfig} />
            )}

            {strategyKey === "rsi" && (
              <RSIStrategyForm config={strategyConfig as RSIConfig} onChange={setStrategyConfig} />
            )}

            {strategyKey === "adx" && (
              <ADXStrategyForm config={strategyConfig as ADXConfig} onChange={setStrategyConfig} />
            )}

            {(strategyKey === "kalman1st" ||
              strategyKey === "kalman2nd" ||
              strategyKey === "kalman3rd") && (
              <KalmanStrategyForm
                config={strategyConfig as KalmanConfig}
                onChange={setStrategyConfig}
              />
            )}
          </div>
        </section>

        {/* 공통 설정 */}
        <section className="space-y-4">
          <div className="space-y-2">
            <h4 className="flex items-center gap-2 text-sm font-medium text-gray-200">
              <Settings className="w-4 h-4" />
              공통 설정
            </h4>
          </div>

          <div className="p-4 bg-white/5 rounded-lg border border-white/20 space-y-4">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-200">
                <Clock className="w-4 h-4" />
                가격 체크 타임프레임 (신호 check 시 사용할 가격 주기)
              </label>
              <select
                value={commonConfig.common.priceCheckingTimeframe}
                onChange={(e) => updateCommon({ priceCheckingTimeframe: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none">
                {TIMEFRAME_OPTIONS.map((tf) => (
                  <option key={tf.value} value={tf.value} className="bg-slate-800">
                    {tf.label}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-400">
                기본값: 1분봉. 예: 15m = 15분 주기로 체크 = 1분봉 15개마다 체크
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-200">
                  <BarChart3 className="w-4 h-4" />
                  결과 표시 시 사용할 차트 타임프레임
                </label>
                <select
                  value={commonConfig.common.chartTimeframe}
                  onChange={(e) => updateCommon({ chartTimeframe: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none">
                  {TIMEFRAME_OPTIONS.map((tf) => (
                    <option key={tf.value} value={tf.value} className="bg-slate-800">
                      {tf.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-200">
                  <Activity className="w-4 h-4" />
                  WATCHER_HISTORY_HOURS
                </label>
                <input
                  type="number"
                  value={commonConfig.common.watcherHistoryHours}
                  onChange={(e) => updateCommon({ watcherHistoryHours: Number(e.target.value) })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                <p className="text-xs text-gray-400">
                  기본값: 48. Sliding window 유지 시간 (추세 기간 계산용)
                </p>
              </div>
            </div>

            <div>
              <ToggleSwitch
                enabled={commonConfig.common.trendFilterEnabled}
                onChange={(trendFilterEnabled) => updateCommon({ trendFilterEnabled })}
                label="추세 필터 적용"
              />
            </div>
          </div>
        </section>
      </div>

      {/* 제출 버튼 */}
      <div className="flex justify-end mt-6">
        <button
          onClick={handleSubmit}
          className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105">
          다음 단계: 시뮬레이션 실행
        </button>
      </div>
    </section>
  );
};

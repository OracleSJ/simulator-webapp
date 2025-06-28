import React from "react";
import { BarChart3, Clock, Compass, Flag, Settings, Zap, CheckCircle, Circle } from "lucide-react";
import SubmitButton from "./SubmitButton";
import { progressStore, strategyStore } from "~/stores/configStore";
import type { StrategyKey } from "~/types/strategy";
import {
  MAStrategyForm,
  BBStrategyForm,
  RSIStrategyForm,
  ADXStrategyForm,
  Kalman1stStrategyForm,
} from "./strategy-forms";

const STRATEGY_OPTIONS = [
  { value: "ma", label: "Moving Average (MA)", description: "이동평균 기반 전략" },
  { value: "bb", label: "Bollinger Bands (BB)", description: "볼린저 밴드 기반 전략" },
  { value: "rsi", label: "RSI", description: "RSI 지표 기반 전략" },
  { value: "adx", label: "ADX/DI+/DI-", description: "ADX 지표 기반 전략" },
  { value: "kalman1st", label: "1차 칼만 필터", description: "1차 칼만 필터 기반 전략" },
  { value: "kalman2nd", label: "2차 칼만 필터", description: "2차 칼만 필터 기반 전략" },
  { value: "kalman3rd", label: "3차 칼만 필터", description: "3차 칼만 필터 기반 전략" },
];

const TIMEFRAME_OPTIONS = [
  { value: "1m", label: "1분봉" },
  { value: "5m", label: "5분봉" },
  { value: "15m", label: "15분봉" },
  { value: "1h", label: "1시간봉" },
  { value: "4h", label: "4시간봉" },
  { value: "1d", label: "1일봉" },
];

// ===== 메인 전략 설정 페이지 컴포넌트 =====
export const StrategyFormSection: React.FC = () => {
  const { key, parameters, logics, common, setKey, setCommonConfig } = strategyStore();
  const { currentStep, nextStep } = progressStore();

  // 전략별 컴포넌트 렌더링
  const renderStrategyForm = () => {
    switch (key) {
      case "ma":
        return <MAStrategyForm />;
      case "bb":
        return <BBStrategyForm />;
      case "rsi":
        return <RSIStrategyForm />;
      case "adx":
        return <ADXStrategyForm />;
      case "kalman1st":
        return <Kalman1stStrategyForm />;
      default:
        return null;
    }
  };

  const handleNext = () => {
    console.log("전략 설정 완료:", {
      key,
      common,
      parameters,
      logics,
    });
    nextStep();
  };

  const currentStrategyOption = STRATEGY_OPTIONS.find((s) => s.value === key);

  return (
    <section className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6 shadow-2xl">
      {/* ===== 헤더 ===== */}
      <header className="flex items-center gap-3 mb-6">
        <Flag size={24} className="text-blue-400" />
        <h2 className="text-2xl font-semibold text-white">전략 설정</h2>
      </header>

      <div className="space-y-6">
        {/* ===== 전략 선택 섹션 ===== */}
        <section className="space-y-4">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-200">
              <Compass size={16} />
              대상 전략 키
            </label>
            <select
              value={key}
              onChange={(e) => setKey(e.target.value as StrategyKey)}
              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all appearance-none">
              {STRATEGY_OPTIONS.map((strategy) => (
                <option key={strategy.value} value={strategy.value} className="bg-slate-800">
                  {strategy.label}
                </option>
              ))}
            </select>
            {currentStrategyOption?.description && (
              <p className="text-xs text-gray-400 mt-1">{currentStrategyOption.description}</p>
            )}
          </div>
        </section>

        {/* ===== 전략별 설정 폼 ===== */}
        <section className="space-y-4">
          <div className="space-y-2">
            <h3 className="flex items-center gap-2 text-sm font-medium text-gray-200">
              <BarChart3 size={16} />
              전략 설정 ({currentStrategyOption?.label})
            </h3>
          </div>
          {renderStrategyForm()}
        </section>

        {/* ===== 공통 설정 섹션 ===== */}
        <section className="space-y-4">
          <div className="space-y-2">
            <h4 className="flex items-center gap-2 text-sm font-medium text-gray-200">
              <Settings size={16} />
              공통 설정
            </h4>
          </div>

          <div className="p-4 bg-white/5 rounded-lg border border-white/20 space-y-4">
            {/* 가격 체크 타임프레임 */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-200">
                <Clock size={16} />
                가격 체크 타임프레임 (신호 check 시 사용할 가격 주기)
              </label>
              <select
                value={common.priceCheckingTimeframe}
                onChange={(e) => setCommonConfig("priceCheckingTimeframe", e.target.value)}
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

            {/* 차트 타임프레임 & WATCHER_HISTORY_HOURS */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-200">
                  <BarChart3 size={16} />
                  결과 표시 시 사용할 차트 타임프레임
                </label>
                <select
                  value={common.chartTimeframe}
                  onChange={(e) => setCommonConfig("chartTimeframe", e.target.value)}
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
                  <Zap size={16} />
                  WATCHER_HISTORY_HOURS
                </label>
                <input
                  type="number"
                  value={common.watcherHistoryHours}
                  onChange={(e) => setCommonConfig("watcherHistoryHours", Number(e.target.value))}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                <p className="text-xs text-gray-400">
                  기본값: 48. Sliding window 유지 시간 (추세 기간 계산용)
                </p>
              </div>
            </div>

            {/* 추세 필터 토글 */}
            <div>
              <button
                onClick={() => setCommonConfig("trendFilterEnabled", !common.trendFilterEnabled)}
                className="flex items-center gap-2 text-sm">
                {common.trendFilterEnabled ? (
                  <CheckCircle className="w-5 h-5 text-green-400" />
                ) : (
                  <Circle className="w-5 h-5 text-gray-400" />
                )}
                <span className={common.trendFilterEnabled ? "text-green-400" : "text-gray-400"}>
                  추세 필터 적용
                </span>
              </button>
            </div>
          </div>
        </section>

        {/* ===== 제출 버튼 ===== */}
        <div className="flex justify-end">
          <SubmitButton onSubmit={handleNext} disabled={currentStep !== 2}>
            다음 단계: 시뮬레이션 실행
          </SubmitButton>
        </div>
      </div>
    </section>
  );
};

export default StrategyFormSection;

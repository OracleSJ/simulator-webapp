import React, { useState } from "react";
import { DynamicSection, ToggleSwitch } from "~/components/DynamicForm";
import {
  STRATEGY_SCHEMAS,
  STRATEGY_OPTIONS,
  TIMEFRAME_OPTIONS,
  getDefaultConfigByStrategy,
} from "~/types/strategySchemas";
import type { StrategyKey, CommonConfig, FullStrategyConfig } from "~/types/strategyConfigs";
import { BarChart3, Clock, Compass, Flag, Settings, Zap } from "lucide-react";
import SubmitButton from "./SubmitButton";
import { progressStore } from "~/stores/configStore";

// ===== 메인 전략 설정 페이지 컴포넌트 =====

export const StrategyFormSection: React.FC = () => {
  // ===== 상태 관리 =====
  const [strategyKey, setStrategyKey] = useState<StrategyKey>("ma");
  const [config, setConfig] = useState(getDefaultConfigByStrategy("ma"));
  const [commonConfig, setCommonConfig] = useState<CommonConfig>({
    priceCheckingTimeframe: "1m",
    chartTimeframe: "15m",
    trendFilterEnabled: false,
    watcherHistoryHours: 48,
  });

  const { currentStep, nextStep } = progressStore();

  // ===== 이벤트 핸들러들 =====

  /**
   * 전략 키 변경 시 해당 전략의 초기값으로 리셋
   */
  const handleStrategyKeyChange = (newKey: StrategyKey) => {
    setStrategyKey(newKey);
    setConfig(getDefaultConfigByStrategy(newKey));
  };

  /**
   * 섹션별 설정 업데이트 (parameters, logics)
   */
  const handleSectionChange = (sectionKey: string, updates: any) => {
    setConfig((prev) => ({
      ...prev,
      [sectionKey]: updates,
    }));
  };

  /**
   * 공통 설정 업데이트
   */
  const updateCommonConfig = (updates: Partial<CommonConfig>) => {
    setCommonConfig((prev) => ({ ...prev, ...updates }));
  };

  /**
   * 폼 제출 처리
   */
  const handleNext = () => {
    const fullConfig: FullStrategyConfig = {
      strategy: {
        strategyKey,
        ...config,
      },
      settings: commonConfig,
    };
    console.log("전략 설정 완료:", fullConfig);

    nextStep();
  };

  // ===== 렌더링 =====

  const currentSchema = STRATEGY_SCHEMAS[strategyKey];
  const currentStrategyOption = STRATEGY_OPTIONS.find((s) => s.value === strategyKey);

  return (
    <section className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6 shadow-2xl">
      {/* ===== 헤더 ===== */}
      <header className="flex items-center gap-3 mb-6">
        <Flag size={24} className="text-blue-400" />
        <h2 className="text-2xl font-semibold text-white">전략 설정</h2>
      </header>

      <div className="space-y-6">
        {/* ===== 전략 선택 섹션 ===== */}
        <StrategySelectionSection
          strategyKey={strategyKey}
          onStrategyChange={handleStrategyKeyChange}
          strategyDescription={currentStrategyOption?.description}
        />

        {/* ===== 동적 전략 설정 폼 ===== */}
        <DynamicStrategyConfigSection
          schema={currentSchema}
          config={config}
          onChange={handleSectionChange}
          strategyLabel={currentStrategyOption?.label}
        />

        {/* ===== 공통 설정 섹션 ===== */}
        <CommonConfigSection config={commonConfig} onChange={updateCommonConfig} />

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

// ===== 하위 컴포넌트들 =====

/**
 * 전략 선택 섹션
 */
const StrategySelectionSection: React.FC<{
  strategyKey: StrategyKey;
  onStrategyChange: (key: StrategyKey) => void;
  strategyDescription?: string;
}> = ({ strategyKey, onStrategyChange, strategyDescription }) => (
  <section className="space-y-4">
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-sm font-medium text-gray-200">
        <Compass size={16} />
        대상 전략 키
      </label>
      <select
        value={strategyKey}
        onChange={(e) => onStrategyChange(e.target.value as StrategyKey)}
        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all appearance-none">
        {STRATEGY_OPTIONS.map((strategy) => (
          <option key={strategy.value} value={strategy.value} className="bg-slate-800">
            {strategy.label}
          </option>
        ))}
      </select>
      {strategyDescription && <p className="text-xs text-gray-400 mt-1">{strategyDescription}</p>}
    </div>
  </section>
);

/**
 * 동적 전략 설정 섹션
 */
const DynamicStrategyConfigSection: React.FC<{
  schema: any;
  config: any;
  onChange: (sectionKey: string, updates: any) => void;
  strategyLabel?: string;
}> = ({ schema, config, onChange, strategyLabel }) => (
  <section className="space-y-4">
    <div className="space-y-2">
      <h3 className="flex items-center gap-2 text-sm font-medium text-gray-200">
        <BarChart3 size={16} />
        사용 지표 파라미터 설정 ({strategyLabel})
      </h3>
    </div>

    <div className="p-4 bg-white/5 rounded-lg border border-white/20 space-y-6">
      {/* 파라미터 섹션 */}
      <DynamicSection
        section={schema.parameters}
        sectionKey="parameters"
        config={config}
        onChange={onChange}
      />

      {/* 로직 섹션 */}
      <DynamicSection
        section={schema.logics}
        sectionKey="logics"
        config={config}
        onChange={onChange}
      />
    </div>
  </section>
);

/**
 * 공통 설정 섹션
 */
const CommonConfigSection: React.FC<{
  config: CommonConfig;
  onChange: (updates: Partial<CommonConfig>) => void;
}> = ({ config, onChange }) => (
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
          value={config.priceCheckingTimeframe}
          onChange={(e) => onChange({ priceCheckingTimeframe: e.target.value })}
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
            value={config.chartTimeframe}
            onChange={(e) => onChange({ chartTimeframe: e.target.value })}
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
            value={config.watcherHistoryHours}
            onChange={(e) => onChange({ watcherHistoryHours: Number(e.target.value) })}
            className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
          <p className="text-xs text-gray-400">
            기본값: 48. Sliding window 유지 시간 (추세 기간 계산용)
          </p>
        </div>
      </div>

      {/* 추세 필터 토글 */}
      <div>
        <ToggleSwitch
          enabled={config.trendFilterEnabled}
          onChange={(trendFilterEnabled) => onChange({ trendFilterEnabled })}
          label="추세 필터 적용"
        />
      </div>
    </div>
  </section>
);

export default StrategyFormSection;

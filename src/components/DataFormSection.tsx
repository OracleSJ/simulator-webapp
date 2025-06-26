import { Calendar, Database, TrendingUp, Clock } from "lucide-react";
import { configStore, progressStore } from "~/stores/configStore";
import type { Option } from "~/types/data";
import SubmitButton from "./SubmitButton";

export const DataFormSection = () => {
  // config 입력값 전역 상태 관리
  const { market, symbol, timeframe, startDate, endDate, setDataConfig } = configStore();
  const { currentStep, nextStep } = progressStore();

  // select 정적 데이터 목록
  const markets: Option[] = [
    { value: "crypto", label: "Crypto" },
    { value: "forex", label: "Forex" },
    { value: "stock", label: "Stock" },
  ];

  const timeframes: Option[] = [
    { value: "1m", label: "1분봉" },
    { value: "5m", label: "5분봉" },
    { value: "15m", label: "15분봉" },
    { value: "1h", label: "1시간봉" },
    { value: "1d", label: "1일봉" },
    { value: "1w", label: "1주봉" },
    { value: "1M", label: "1월봉" },
  ];

  // 다음 단계 네비게이션
  const handleNext = () => {
    console.log("데이터 설정 완료:", { market, symbol, timeframe, startDate, endDate });
    nextStep();
  };

  // 폼 유효성 검사 - 시작일과 종료일이 모두 설정되어야 합니다
  const isValidData = startDate && endDate;

  return (
    <section className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6 shadow-2xl">
      {/* 폼 헤더 - 섹션의 목적을 명확히 표시 */}
      <header className="flex items-center gap-3 mb-6">
        <Database size={24} className=" text-blue-400" />
        <h2 className="text-2xl font-semibold text-white">데이터 설정</h2>
      </header>

      {/* 폼 필드들 - 논리적 그룹화로 사용자 경험 향상 */}
      <div className="space-y-4">
        {/* 첫 번째 행: 시장과 종목을 나란히 배치하여 관련성 표현 */}
        <section className="grid grid-cols-2 gap-4">
          {/* 시장 선택 드롭다운 */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-200">
              <TrendingUp className="w-4 h-4" />
              시장
            </label>
            <select
              value={market}
              onChange={(e) => setDataConfig("market", e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none">
              {markets.map((mk) => (
                <option key={mk.value} value={mk.value} className="bg-slate-800">
                  {mk.label}
                </option>
              ))}
            </select>
          </div>

          {/* 종목 선택 - 조건부 렌더링으로 사용자 경험 개선 */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-200">
              <TrendingUp className="w-4 h-4" />
              종목 (Symbol)
            </label>
            <input
              type="text"
              value={symbol}
              onChange={(e) => setDataConfig("symbol", e.target.value)}
              placeholder="예: BTC/USDT"
              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
        </section>

        {/* 두 번째 행: 타임프레임 설정 */}
        <section className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-200">
            <Clock className="w-4 h-4" />
            타임프레임
            <span className="text-xs text-gray-400">(기본값: 1분봉)</span>
          </label>
          <select
            value={timeframe}
            onChange={(e) => setDataConfig("timeframe", e.target.value)}
            className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none">
            {timeframes.map((tf) => (
              <option key={tf.value} value={tf.value} className="bg-slate-800">
                {tf.label}
              </option>
            ))}
          </select>
        </section>

        {/* 세 번째 행: 날짜 범위 선택 - 시간 기반 필터링을 위한 중요한 설정 */}
        <section className="grid grid-cols-2 gap-4">
          {/* 시작 날짜 입력 */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-200">
              <Calendar className="w-4 h-4" />
              시작 날짜
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setDataConfig("startDate", e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all [color-scheme:dark]"
            />
          </div>

          {/* 종료 날짜 입력 */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-200">
              <Calendar className="w-4 h-4" />
              종료 날짜
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setDataConfig("endDate", e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all [color-scheme:dark]"
            />
          </div>
        </section>
      </div>

      {/* 액션 버튼 - 사용자의 다음 행동을 유도하는 중요한 UI 요소 */}
      <div className="flex justify-end mt-6">
        <SubmitButton onSubmit={handleNext} disabled={!isValidData || currentStep !== 1}>
          다음 단계: 전략 설정
        </SubmitButton>
      </div>
    </section>
  );
};

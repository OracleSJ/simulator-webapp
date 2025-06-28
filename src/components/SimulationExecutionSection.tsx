import { useState } from "react";
import { Rocket, Server, AlertTriangle, Loader2 } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { configStore, progressStore, strategyStore } from "~/stores/configStore";
import SubmitButton from "./SubmitButton";

// 설정 내용을 보기 좋게 표시하기 위한 헬퍼 컴포넌트
const ConfigDetail = ({ label, value }: { label: string; value: string | undefined }) => (
  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-2">
    <span className="text-sm font-medium text-gray-300 flex-shrink-0">{label}:</span>
    <span className="text-sm text-white font-mono bg-white/5 px-2 py-1 rounded w-full text-left break-all">
      {/* 값이 없는 경우 'Not set'으로 표시합니다. */}
      {value || "Not set"}
    </span>
  </div>
);

export const SimulationExecutionSection = () => {
  // TanStack Router의 navigate 함수를 사용하여 페이지를 전환합니다.
  const navigate = useNavigate({ from: "/configs" });
  const { currentStep, nextStep } = progressStore();
  const { market, symbol, timeframe, startDate, endDate } = configStore();
  const { key, parameters, logics, common } = strategyStore();

  // API 요청 상태(로딩, 오류)를 관리합니다.
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStartSimulation = async () => {
    nextStep();
    setIsLoading(true);
    setError(null);

    // 1. 모든 설정을 하나의 JSON 객체로 통합합니다.
    const finalConfig = {
      data: { market, symbol, timeframe, startDate, endDate },
      strategy: { key, parameters, logics, common },
    };

    try {
      // 2. fetch를 사용하여 백엔드에 POST 요청을 보냅니다.
      //    (API 엔드포인트는 예시이며, 실제로는 동작하지 않습니다.)
      console.log("Sending configuration to backend:", JSON.stringify(finalConfig, null, 2));

      const response = await fetch("https://api.example.com/simulations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(finalConfig),
      });

      // 데모를 위해 인위적인 딜레이를 추가합니다.
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // 네트워크 요청이 실패하면 에러를 발생시킵니다.
      if (!response.ok) {
        throw new Error(`백엔드 요청 실패: ${response.status} ${response.statusText}`);
      }

      // 성공적으로 응답을 받으면 콘솔에 출력합니다.
      const result = await response.json();
      console.log("Backend response:", result);

      // 3. 요청 성공 시, 결과 페이지로 이동합니다.
      navigate({ to: "/simulation/results" });
    } catch (err) {
      // 에러 처리
      console.error("Simulation start failed:", err);
      const errorMessage = err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.";
      setError(
        `시뮬레이션 시작 중 오류 발생. (API는 예시이며 실제 동작하지 않습니다) 상세: ${errorMessage}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6 shadow-2xl">
      <header className="flex items-center gap-3 mb-6">
        <Rocket size={24} className="text-blue-400" />
        <h2 className="text-2xl font-semibold text-white">시뮬레이션 실행</h2>
      </header>

      <div className="space-y-6">
        {/* 설정 요약 정보 */}
        <div className="p-4 bg-white/5 rounded-lg border border-white/20 space-y-4">
          <h3 className="text-lg font-medium text-white mb-3 border-b border-white/10 pb-2">
            최종 설정 요약
          </h3>
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-200">데이터 설정</h4>
            <ConfigDetail label="Market" value={market} />
            <ConfigDetail label="Symbol" value={symbol} />
            <ConfigDetail label="Data Timeframe" value={timeframe} />
            <ConfigDetail label="Start Date" value={startDate} />
            <ConfigDetail label="End Date" value={endDate} />
          </div>
          <div className="border-t border-white/20 my-4"></div>
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-200">전략 설정</h4>
            <ConfigDetail label="Strategy Key" value={key} />
            <ConfigDetail label="Parameters" value={JSON.stringify(parameters)} />
            <ConfigDetail label="Logics" value={JSON.stringify(logics)} />
            <ConfigDetail label="Common Config" value={JSON.stringify(common)} />
          </div>
        </div>

        {/* 오류 메시지 표시 영역 */}
        {error && (
          <div className="flex items-start gap-3 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-300">
            <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* 실행 버튼 */}
        <div className="flex justify-end mt-6">
          <SubmitButton onSubmit={handleStartSimulation} disabled={currentStep !== 3 || isLoading}>
            {isLoading ? (
              <div className="flex items-center justify-center">
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                <span className="pb-0.5">처리 중...</span>{" "}
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <Server className="mr-2 h-5 w-5" />
                <span className="pb-0.5">시뮬레이션 시작</span>{" "}
              </div>
            )}
          </SubmitButton>
        </div>
      </div>
    </section>
  );
};

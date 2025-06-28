import { Hourglass } from "lucide-react";

// 시뮬레이션 진행 중에 표시될 페이지 컴포넌트입니다.
function SimulationResultsPage() {
  return (
    <div className="flex flex-col items-center justify-center text-center text-white p-8 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl max-w-2xl mx-auto">
      <Hourglass className="w-16 h-16 text-blue-400 animate-spin mb-6" />
      <h2 className="text-3xl font-bold mb-2">시뮬레이션 진행 중...</h2>
      <p className="text-gray-300">설정이 백엔드로 성공적으로 전송되었습니다.</p>
      <p className="text-gray-400 mt-1">결과가 준비되면 이 페이지에 표시됩니다.</p>
    </div>
  );
}

// TanStack Router를 사용하여 새로운 라우트를 정의합니다.
export const Route = createFileRoute({
  component: SimulationResultsPage,
});

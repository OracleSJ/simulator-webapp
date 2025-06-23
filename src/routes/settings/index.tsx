import { DataFormSection } from "~/components/DataFormSection";
import { StrategyFormSection } from "~/components/StrategyFormSection";

// 메인 컴포넌트 정의
const SettingPage = () => {
  return (
    <div className="flex flex-col gap-10">
      <DataFormSection />
      <StrategyFormSection />
    </div>
  );
};

// TanStack Router의 핵심 - 파일 기반 라우트 생성
// 이 함수가 이 파일을 실제 라우트로 변환시킵니다
export const Route = createFileRoute({
  component: SettingPage,
});

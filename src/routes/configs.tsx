import { DataFormSection } from "~/components/DataFormSection";
import { StepProgress } from "~/components/StepProgress";
import { StrategyFormSection } from "~/components/StrategyFormSection";
import { progressStore } from "~/stores/configStore";

// 메인 컴포넌트 정의
const SettingPage = () => {
  const { currentStep } = progressStore();

  return (
    <div>
      <section>
        <StepProgress currentStep={currentStep} />
      </section>
      <section className="max-w-2xl mx-auto">
        <div className="flex flex-col gap-10">
          {currentStep === 2 ? <StrategyFormSection /> : undefined}
          <DataFormSection />
        </div>
      </section>
    </div>
  );
};

// TanStack Router의 핵심 - 파일 기반 라우트 생성
// 이 함수가 이 파일을 실제 라우트로 변환시킵니다
export const Route = createFileRoute({
  component: SettingPage,
});

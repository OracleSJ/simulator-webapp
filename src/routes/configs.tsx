import { DataFormSection } from "~/components/DataFormSection";
import { SimulationExecutionSection } from "~/components/SimulationExecutionSection";
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
          {/* 각 단계에 맞는 컴포넌트를 조건부로 렌더링합니다. */}
          {currentStep >= 1 && <DataFormSection />}
          {currentStep >= 2 && <StrategyFormSection />}
          {currentStep >= 3 && <SimulationExecutionSection />}
        </div>
      </section>
    </div>
  );
};

// TanStack Router를 사용하여 라우트를 정의합니다.
export const Route = createFileRoute({
  component: SettingPage,
});

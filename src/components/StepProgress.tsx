import type { CurrentStep, StepInfo } from "~/types/timedata";

interface StepProgressProps {
  currentStep: CurrentStep;
}

export function StepProgress({ currentStep }: StepProgressProps) {
  const steps: StepInfo[] = [
    {
      number: 1,
      title: "데이터 설정",
      isActive: currentStep === 1,
      isCompleted: currentStep > 1,
    },
    {
      number: 2,
      title: "전략 설정",
      isActive: currentStep === 2,
      isCompleted: currentStep > 2,
    },
    {
      number: 3,
      title: "시뮬레이션 실행",
      isActive: currentStep === 3,
      isCompleted: false, // 마지막 단계는 완료 상태가 없음
    },
  ];

  const getStepStyles = (step: StepInfo) => {
    if (step.isCompleted) {
      return {
        circle:
          "w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white text-base font-medium",
        text: "ml-3 text-green-400 font-medium text-lg",
      };
    } else if (step.isActive) {
      return {
        circle:
          "w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white text-base font-medium",
        text: "ml-3 text-white font-medium text-lg",
      };
    } else {
      return {
        circle:
          "w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center text-gray-400 text-base font-medium",
        text: "ml-3 text-gray-400 text-lg",
      };
    }
  };

  const getConnectorStyles = (index: number) => {
    const nextStep = steps[index + 1];
    if (!nextStep) return "w-16 h-0.5 bg-gray-600"; // 마지막 연결선

    if (nextStep.isActive || nextStep.isCompleted) {
      return "w-16 h-0.5 bg-blue-500";
    }
    return "w-16 h-0.5 bg-gray-600";
  };

  return (
    <div className="mb-8 flex justify-center">
      <div className="flex items-center space-x-6">
        {steps.map((step, index) => {
          const styles = getStepStyles(step);

          return (
            <div key={step.number} className="flex items-center">
              {/* 단계 원과 텍스트 */}
              <div className="flex items-center">
                <div className={styles.circle}>
                  {step.isCompleted ? (
                    // 완료된 단계에는 체크마크 표시
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    step.number
                  )}
                </div>
                <span className={styles.text}>{step.title}</span>
              </div>

              {/* 다음 단계로의 연결선 (마지막 단계가 아닌 경우) */}
              {index < steps.length - 1 && (
                <div className={`${getConnectorStyles(index)} ml-6`}></div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// src/routes/settings/route.tsx
import { Outlet } from "@tanstack/react-router";
import { StepProgress } from "~/components/StepProgress";
import { progressStore } from "~/stores/configStore";

export const Route = createFileRoute({
  component: SettingsLayout,
});

function SettingsLayout() {
  const { currentStep } = progressStore();

  return (
    <div>
      <section>
        <StepProgress currentStep={currentStep} />
      </section>
      <section className="max-w-2xl mx-auto">
        <Outlet />
      </section>
    </div>
  );
}

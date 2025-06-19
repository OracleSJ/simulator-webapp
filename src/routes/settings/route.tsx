// src/routes/settings/route.tsx
import { Outlet } from "@tanstack/react-router";
import { StepProgress } from "~/components/StepProgress";

export const Route = createFileRoute({
  component: SettingsLayout,
});

function SettingsLayout() {
  return (
    <div>
      <section>
        <StepProgress />
      </section>
      <section className="max-w-2xl mx-auto">
        <Outlet />
      </section>
    </div>
  );
}

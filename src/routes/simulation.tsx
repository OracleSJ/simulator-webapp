// src/routes/simulation.tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/simulation')({
  component: Simulation,
})

function Simulation() {
  return (
    <div className="p-2">
      <h3>시뮬레이션 설정</h3>
      <p>여기에서 트레이딩 전략을 설정하고 시뮬레이션을 실행할 수 있습니다.</p>
    </div>
  )
}
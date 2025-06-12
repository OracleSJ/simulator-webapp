// src/routes/index.tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  return (
    <div className="p-2">
      <h3>트레이딩 시뮬레이터에 오신 것을 환영합니다!</h3>
      <p>왼쪽 메뉴에서 원하는 기능을 선택하세요.</p>
    </div>
  )
}
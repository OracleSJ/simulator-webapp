// src/routes/__root.tsx
import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'

export const Route = createRootRoute({
  component: () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      {/* 애플리케이션 헤더 - 사용자에게 현재 위치와 목적을 명확히 전달 */}
      <header className="mb-10">
        <h1 className="text-center text-3xl font-bold text-white mb-2">
          트레이딩 시뮬레이터
        </h1>
      </header>
      <main >
        <Outlet />
      </main>
      <footer>
      </footer>
      <TanStackRouterDevtools />
    </div>
  ),
})
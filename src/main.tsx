import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// import App from './App.tsx'
import { routeTree } from './routeTree.gen'
import { RouterProvider, createRouter } from '@tanstack/react-router'

// 라우터 인스턴스 생성
const router = createRouter({ routeTree })

// 타입 안전성을 위한 타입 등록 (선택)
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

// 루트 DOM에 렌더링
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)

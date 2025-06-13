/** @type {import('tailwindcss').Config} */
export default {
  // 어떤 파일들에서 Tailwind 클래스를 찾을지 지정
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    // 기본 테마를 확장하거나 커스터마이징
    extend: {},
  },
  plugins: [],
}
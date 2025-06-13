// src/routes/index.tsx
import { useState } from 'react';
import { Calendar, Database, TrendingUp, Clock } from 'lucide-react';

// 타입 정의 - TanStack Router와 함께 사용할 때는 더욱 중요합니다
interface DataConfig {
  market: string;
  symbol: string;
  timeframe: string;
  startDate: string;
  endDate: string;
}

// 메인 컴포넌트 정의
function DataConfiguration() {
  // 상태 관리 - React의 기본 useState 훅 사용
  const [dataConfig, setDataConfig] = useState<DataConfig>({
    market: 'crypto',
    symbol: 'BTC/USDT',
    timeframe: '1m',
    startDate: '',
    endDate: ''
  });
  
  const [currentStep, setCurrentStep] = useState(1);

  // 정적 데이터 정의 - 실제 프로젝트에서는 외부 API나 설정 파일에서 가져올 수 있습니다
  const markets = [
    { value: 'crypto', label: 'Crypto' },
    { value: 'forex', label: 'Forex' },
    { value: 'stock', label: 'Stock' }
  ];

  const timeframes = [
    { value: '1m', label: '1분봉' },
    { value: '5m', label: '5분봉' },
    { value: '15m', label: '15분봉' },
    { value: '30m', label: '30분봉' },
    { value: '1h', label: '1시간봉' },
    { value: '4h', label: '4시간봉' },
    { value: '1d', label: '1일봉' },
    { value: '1w', label: '1주봉' },
    { value: '1M', label: '1월봉' }
  ];

  const cryptoSymbols = [
    'BTC/USDT', 'ETH/USDT', 'BNB/USDT', 'ADA/USDT', 'XRP/USDT',
    'DOT/USDT', 'UNI/USDT', 'LTC/USDT', 'LINK/USDT', 'BCH/USDT'
  ];

  // 이벤트 핸들러 - 타입 안전성을 위해 keyof를 사용합니다
  const handleConfigChange = (field: keyof DataConfig, value: string) => {
    setDataConfig(prevConfig => ({
      ...prevConfig,
      [field]: value
    }));
  };

  // 다음 단계로의 네비게이션 - 실제로는 TanStack Router의 navigate를 사용할 것입니다
  const handleNext = () => {
    console.log('데이터 설정 완료:', dataConfig);
    
    // 실제 구현에서는 아래와 같이 navigate를 사용할 수 있습니다:
    // const navigate = useNavigate()
    // navigate({ to: '/simulation', state: { dataConfig } })
    
    // 현재는 다음 단계 표시를 위한 로컬 상태 업데이트
    setCurrentStep(2);
    alert('다음 단계로 진행합니다. 실제로는 /simulation 라우트로 이동됩니다.');
  };

  // 폼 유효성 검사 - 시작일과 종료일이 모두 설정되어야 합니다
  const isValidConfig = dataConfig.startDate && dataConfig.endDate;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* 애플리케이션 헤더 - 사용자에게 현재 위치와 목적을 명확히 전달 */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-white mb-2">
            트레이딩 시뮬레이터
          </h1>
          <p className="text-gray-300 text-lg">
            Price Data 폴더에서 불러올 데이터를 설정하세요
          </p>
        </div>

        {/* 진행 단계 표시 - 사용자 경험을 위한 시각적 피드백 */}
        <div className="mb-8 flex justify-center">
          <div className="flex items-center space-x-6">
            {/* 1단계: 데이터 설정 (현재 활성화) */}
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white text-base font-medium">
                1
              </div>
              <span className="ml-3 text-white font-medium text-lg">데이터 설정</span>
            </div>
            
            {/* 진행 상태를 나타내는 연결선 */}
            <div className="w-16 h-0.5 bg-gray-600"></div>
            
            {/* 2단계: 전략 설정 (비활성화 상태) */}
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center text-gray-400 text-base font-medium">
                2
              </div>
              <span className="ml-3 text-gray-400 text-lg">전략 설정</span>
            </div>
            
            <div className="w-16 h-0.5 bg-gray-600"></div>
            
            {/* 3단계: 시뮬레이션 실행 (비활성화 상태) */}
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center text-gray-400 text-base font-medium">
                3
              </div>
              <span className="ml-3 text-gray-400 text-lg">시뮬레이션 실행</span>
            </div>
          </div>
        </div>

        {/* 메인 컨텐츠 영역 - 반응형 그리드 레이아웃 사용 */}
        <div className="grid grid-cols-3 gap-8">
          {/* 좌측 2컬럼: 데이터 설정 폼 */}
          <div className="col-span-2">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6 shadow-2xl">
              {/* 폼 헤더 - 섹션의 목적을 명확히 표시 */}
              <div className="flex items-center gap-3 mb-6">
                <Database className="w-6 h-6 text-blue-400" />
                <h2 className="text-2xl font-semibold text-white">데이터 설정</h2>
              </div>

              {/* 폼 필드들 - 논리적 그룹화로 사용자 경험 향상 */}
              <div className="space-y-4">
                {/* 첫 번째 행: 시장과 종목을 나란히 배치하여 관련성 표현 */}
                <div className="grid grid-cols-2 gap-4">
                  {/* 시장 선택 드롭다운 */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-200">
                      <TrendingUp className="w-4 h-4" />
                      시장
                    </label>
                    <select
                      value={dataConfig.market}
                      onChange={(e) => handleConfigChange('market', e.target.value)}
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    >
                      {markets.map(market => (
                        <option key={market.value} value={market.value} className="bg-slate-800">
                          {market.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* 종목 선택 - 조건부 렌더링으로 사용자 경험 개선 */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-200">
                      <TrendingUp className="w-4 h-4" />
                      종목 (Symbol)
                    </label>
                    {dataConfig.market === 'crypto' ? (
                      // 암호화폐 시장의 경우 미리 정의된 심볼 목록 제공
                      (<select
                        value={dataConfig.symbol}
                        onChange={(e) => handleConfigChange('symbol', e.target.value)}
                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      >
                        {cryptoSymbols.map(symbol => (
                          <option key={symbol} value={symbol} className="bg-slate-800">
                            {symbol}
                          </option>
                        ))}
                      </select>)
                    ) : (
                      // 다른 시장의 경우 자유 입력 허용
                      (<input
                        type="text"
                        value={dataConfig.symbol}
                        onChange={(e) => handleConfigChange('symbol', e.target.value)}
                        placeholder="예: BTC/USDT"
                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />)
                    )}
                  </div>
                </div>

                {/* 두 번째 행: 타임프레임 설정 */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-200">
                    <Clock className="w-4 h-4" />
                    사용 데이터 timeframe
                    <span className="text-xs text-gray-400">(기본값: 1분봉)</span>
                  </label>
                  <select
                    value={dataConfig.timeframe}
                    onChange={(e) => handleConfigChange('timeframe', e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    {timeframes.map(tf => (
                      <option key={tf.value} value={tf.value} className="bg-slate-800">
                        {tf.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 세 번째 행: 날짜 범위 선택 - 시간 기반 필터링을 위한 중요한 설정 */}
                <div className="grid grid-cols-2 gap-4">
                  {/* 시작 날짜 입력 */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-200">
                      <Calendar className="w-4 h-4" />
                      시작 날짜
                    </label>
                    <input
                      type="date"
                      value={dataConfig.startDate}
                      onChange={(e) => handleConfigChange('startDate', e.target.value)}
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all [color-scheme:dark]"
                    />
                  </div>

                  {/* 종료 날짜 입력 */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-200">
                      <Calendar className="w-4 h-4" />
                      종료 날짜
                    </label>
                    <input
                      type="date"
                      value={dataConfig.endDate}
                      onChange={(e) => handleConfigChange('endDate', e.target.value)}
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all [color-scheme:dark]"
                    />
                  </div>
                </div>
              </div>

              {/* 액션 버튼 - 사용자의 다음 행동을 유도하는 중요한 UI 요소 */}
              <div className="flex justify-end mt-6">
                <button
                  onClick={handleNext}
                  disabled={!isValidConfig}
                  className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105"
                >
                  다음 단계: 전략 설정
                </button>
              </div>
            </div>
          </div>

          {/* 우측 1컬럼: 설정 요약 패널 - 실시간 피드백 제공 */}
          <div className="col-span-1">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6 shadow-2xl h-fit">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Database className="w-5 h-5 text-green-400" />
                설정 요약
              </h3>
              
              <div className="space-y-4">
                {/* 각 설정값을 개별 카드로 표시하여 가독성 향상 */}
                <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                  <div className="text-xs text-gray-400 uppercase tracking-wide">시장</div>
                  <div className="text-white font-semibold text-lg">{dataConfig.market}</div>
                </div>
                
                <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                  <div className="text-xs text-gray-400 uppercase tracking-wide">종목</div>
                  <div className="text-white font-semibold text-lg">{dataConfig.symbol}</div>
                </div>
                
                <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                  <div className="text-xs text-gray-400 uppercase tracking-wide">타임프레임</div>
                  <div className="text-white font-semibold text-lg">{dataConfig.timeframe}</div>
                </div>
                
                <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                  <div className="text-xs text-gray-400 uppercase tracking-wide">기간</div>
                  <div className="text-white font-semibold">
                    {dataConfig.startDate ? (
                      <div className="space-y-1">
                        <div className="text-sm">시작: {dataConfig.startDate}</div>
                        <div className="text-sm">종료: {dataConfig.endDate || '미설정'}</div>
                      </div>
                    ) : (
                      <div className="text-gray-400">미설정</div>
                    )}
                  </div>
                </div>
              </div>

              {/* 설정 완료 상태 표시 - 시각적 피드백으로 사용자 가이드 */}
              <div className="mt-6 pt-4 border-t border-white/10">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${isValidConfig ? 'bg-green-400' : 'bg-yellow-400'}`}></div>
                  <span className="text-sm text-gray-300">
                    {isValidConfig ? '설정 완료' : '설정 진행 중'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// TanStack Router의 핵심 - 파일 기반 라우트 생성
// 이 함수가 이 파일을 실제 라우트로 변환시킵니다
export const Route = createFileRoute({
  component: DataConfiguration,
  // 에러 경계 - 이 라우트에서 발생하는 에러를 처리합니다
  errorComponent: ({ error }) => (
    <div className="min-h-screen bg-red-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">오류가 발생했습니다</h1>
        <p className="text-red-500">{error.message}</p>
      </div>
    </div>
  )
});
// strategy-forms.tsx
import React from "react";
import { Plus, X } from "lucide-react";
import { strategyStore, type StrategyKey } from "~/stores/configStore";

// MA (Moving Average) 전략 폼
export const MAStrategyForm: React.FC = () => {
  const { parameters, logics, setParameter, setLogic } = strategyStore();
  const timeframes = (parameters.timeframes as string[]) || [];
  const periods = (parameters.periods as number[]) || [];

  const addTimeframe = () => {
    setParameter("timeframes", [...timeframes, ""]);
  };

  const removeTimeframe = (index: number) => {
    setParameter(
      "timeframes",
      timeframes.filter((_, i) => i !== index)
    );
  };

  const updateTimeframe = (index: number, value: string) => {
    const newTimeframes = [...timeframes];
    newTimeframes[index] = value;
    setParameter("timeframes", newTimeframes);
  };

  const addPeriod = () => {
    setParameter("periods", [...periods, 0]);
  };

  const removePeriod = (index: number) => {
    setParameter(
      "periods",
      periods.filter((_, i) => i !== index)
    );
  };

  const updatePeriod = (index: number, value: number) => {
    const newPeriods = [...periods];
    newPeriods[index] = value;
    setParameter("periods", newPeriods);
  };

  return (
    <div className="space-y-6">
      {/* 파라미터 섹션 */}
      <div className="p-4 bg-white/5 rounded-lg border border-white/20 space-y-4">
        <h4 className="text-sm font-medium text-gray-200">파라미터 설정</h4>

        {/* 타임프레임 리스트 */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-200">타임프레임 리스트</label>
          {timeframes.map((tf, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="text"
                value={tf}
                onChange={(e) => updateTimeframe(index, e.target.value)}
                placeholder="15m"
                className="flex-1 px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={() => removeTimeframe(index)}
                className="p-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg">
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
          <button
            onClick={addTimeframe}
            className="flex items-center gap-2 px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 w-full justify-center">
            <Plus className="w-4 h-4" />
            추가
          </button>
          <p className="text-xs text-gray-400">
            예: [15m, 1h, 3h] 일 경우 각 타임프레임에 대해 아래 period들의 MA 생성
          </p>
        </div>

        {/* MA 기간 리스트 */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-200">MA 기간 리스트</label>
          {periods.map((period, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="number"
                value={period}
                onChange={(e) => updatePeriod(index, Number(e.target.value))}
                placeholder="20"
                className="flex-1 px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={() => removePeriod(index)}
                className="p-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg">
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
          <button
            onClick={addPeriod}
            className="flex items-center gap-2 px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 w-full justify-center">
            <Plus className="w-4 h-4" />
            추가
          </button>
          <p className="text-xs text-gray-400">예: [3, 5, 20, 120]</p>
        </div>
      </div>

      {/* 로직 섹션 */}
      <div className="p-4 bg-white/5 rounded-lg border border-white/20 space-y-4">
        <h4 className="text-sm font-medium text-gray-200">전략 로직 설정</h4>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-200">TP_PCT (Take Profit %)</label>
            <input
              type="number"
              value={(logics.tpPct as number) || 0}
              onChange={(e) => setLogic("tpPct", Number(e.target.value))}
              step={0.001}
              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-200">SL_PCT (Stop Loss %)</label>
            <input
              type="number"
              value={(logics.slPct as number) || 0}
              onChange={(e) => setLogic("slPct", Number(e.target.value))}
              step={0.001}
              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-200">MAX_BARS_TIMEFRAME</label>
            <select
              value={(logics.maxBarsTimeframe as string) || "15m"}
              onChange={(e) => setLogic("maxBarsTimeframe", e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none">
              <option value="1m" className="bg-slate-800">
                1분봉
              </option>
              <option value="5m" className="bg-slate-800">
                5분봉
              </option>
              <option value="15m" className="bg-slate-800">
                15분봉
              </option>
              <option value="1h" className="bg-slate-800">
                1시간봉
              </option>
              <option value="4h" className="bg-slate-800">
                4시간봉
              </option>
              <option value="1d" className="bg-slate-800">
                1일봉
              </option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-200">MAX_BARS (최대 보유 기간)</label>
            <input
              type="number"
              value={(logics.maxBars as number) || 0}
              onChange={(e) => setLogic("maxBars", Number(e.target.value))}
              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-400">예: 6 = 최대 보유 6개의 해당 타임프레임</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// BB (Bollinger Bands) 전략 폼
export const BBStrategyForm: React.FC = () => {
  const { parameters, logics, setParameter, setLogic } = strategyStore();
  const timeframes = (parameters.timeframes as string[]) || [];

  const addTimeframe = () => {
    setParameter("timeframes", [...timeframes, ""]);
  };

  const removeTimeframe = (index: number) => {
    setParameter(
      "timeframes",
      timeframes.filter((_, i) => i !== index)
    );
  };

  const updateTimeframe = (index: number, value: string) => {
    const newTimeframes = [...timeframes];
    newTimeframes[index] = value;
    setParameter("timeframes", newTimeframes);
  };

  return (
    <div className="space-y-6">
      {/* 파라미터 섹션 */}
      <div className="p-4 bg-white/5 rounded-lg border border-white/20 space-y-4">
        <h4 className="text-sm font-medium text-gray-200">파라미터 설정</h4>

        {/* 타임프레임 리스트 */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-200">타임프레임 리스트</label>
          {timeframes.map((tf, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="text"
                value={tf}
                onChange={(e) => updateTimeframe(index, e.target.value)}
                placeholder="15m"
                className="flex-1 px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={() => removeTimeframe(index)}
                className="p-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg">
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
          <button
            onClick={addTimeframe}
            className="flex items-center gap-2 px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 w-full justify-center">
            <Plus className="w-4 h-4" />
            추가
          </button>
          <p className="text-xs text-gray-400">
            예: [15m, 1h, 3h] 일 경우 각 타임프레임에 대해 BB 생성
          </p>
        </div>

        {/* BB 파라미터 */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-200">표준편차 (std)</label>
            <input
              type="number"
              value={(parameters.std as number) || 0}
              onChange={(e) => setParameter("std", Number(e.target.value))}
              step={0.1}
              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-200">윈도우</label>
            <input
              type="number"
              value={(parameters.window as number) || 0}
              onChange={(e) => setParameter("window", Number(e.target.value))}
              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* 로직 섹션 */}
      <div className="p-4 bg-white/5 rounded-lg border border-white/20 space-y-4">
        <h4 className="text-sm font-medium text-gray-200">전략 로직 설정</h4>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-200">TP_PCT (Take Profit %)</label>
            <input
              type="number"
              value={(logics.tpPct as number) || 0}
              onChange={(e) => setLogic("tpPct", Number(e.target.value))}
              step={0.001}
              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-200">SL_PCT (Stop Loss %)</label>
            <input
              type="number"
              value={(logics.slPct as number) || 0}
              onChange={(e) => setLogic("slPct", Number(e.target.value))}
              step={0.001}
              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-200">MAX_BARS_TIMEFRAME</label>
            <select
              value={(logics.maxBarsTimeframe as string) || "15m"}
              onChange={(e) => setLogic("maxBarsTimeframe", e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none">
              <option value="1m" className="bg-slate-800">
                1분봉
              </option>
              <option value="5m" className="bg-slate-800">
                5분봉
              </option>
              <option value="15m" className="bg-slate-800">
                15분봉
              </option>
              <option value="1h" className="bg-slate-800">
                1시간봉
              </option>
              <option value="4h" className="bg-slate-800">
                4시간봉
              </option>
              <option value="1d" className="bg-slate-800">
                1일봉
              </option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-200">MAX_BARS (최대 보유 기간)</label>
            <input
              type="number"
              value={(logics.maxBars as number) || 0}
              onChange={(e) => setLogic("maxBars", Number(e.target.value))}
              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-400">예: 6 = 최대 보유 6개의 해당 타임프레임</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// RSI (Relative Strength Index) 전략 폼
export const RSIStrategyForm: React.FC = () => {
  const { parameters, logics, setParameter, setLogic } = strategyStore();

  return (
    <div className="space-y-6">
      {/* 파라미터 섹션 */}
      <div className="p-4 bg-white/5 rounded-lg border border-white/20 space-y-4">
        <h4 className="text-sm font-medium text-gray-200">파라미터 설정</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-200">타임프레임</label>
            <select
              value={(parameters.timeframe as string) || "15m"}
              onChange={(e) => setParameter("timeframe", e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none">
              <option value="1m" className="bg-slate-800">
                1분봉
              </option>
              <option value="5m" className="bg-slate-800">
                5분봉
              </option>
              <option value="15m" className="bg-slate-800">
                15분봉
              </option>
              <option value="1h" className="bg-slate-800">
                1시간봉
              </option>
              <option value="4h" className="bg-slate-800">
                4시간봉
              </option>
              <option value="1d" className="bg-slate-800">
                1일봉
              </option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-200">RSI 기간</label>
            <input
              type="number"
              value={(parameters.period as number) || 14}
              onChange={(e) => setParameter("period", Number(e.target.value))}
              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* 로직 섹션 */}
      <div className="p-4 bg-white/5 rounded-lg border border-white/20 space-y-4">
        <h4 className="text-sm font-medium text-gray-200">전략 로직 설정</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-200">TP_PCT (Take Profit %)</label>
            <input
              type="number"
              value={(logics.tpPct as number) || 0}
              onChange={(e) => setLogic("tpPct", Number(e.target.value))}
              step={0.001}
              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-200">SL_PCT (Stop Loss %)</label>
            <input
              type="number"
              value={(logics.slPct as number) || 0}
              onChange={(e) => setLogic("slPct", Number(e.target.value))}
              step={0.001}
              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-200">MAX_BARS_TIMEFRAME</label>
            <select
              value={(logics.maxBarsTimeframe as string) || "15m"}
              onChange={(e) => setLogic("maxBarsTimeframe", e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none">
              <option value="1m" className="bg-slate-800">
                1분봉
              </option>
              <option value="5m" className="bg-slate-800">
                5분봉
              </option>
              <option value="15m" className="bg-slate-800">
                15분봉
              </option>
              <option value="1h" className="bg-slate-800">
                1시간봉
              </option>
              <option value="4h" className="bg-slate-800">
                4시간봉
              </option>
              <option value="1d" className="bg-slate-800">
                1일봉
              </option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-200">MAX_BARS (최대 보유 기간)</label>
            <input
              type="number"
              value={(logics.maxBars as number) || 0}
              onChange={(e) => setLogic("maxBars", Number(e.target.value))}
              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-400">예: 6 = 최대 보유 6개의 해당 타임프레임</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ADX (Average Directional Index) 전략 폼
export const ADXStrategyForm: React.FC = () => {
  const { parameters, logics, setParameter, setLogic } = strategyStore();

  return (
    <div className="space-y-6">
      {/* 파라미터 섹션 */}
      <div className="p-4 bg-white/5 rounded-lg border border-white/20 space-y-4">
        <h4 className="text-sm font-medium text-gray-200">파라미터 설정</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-200">타임프레임</label>
            <select
              value={(parameters.timeframe as string) || "15m"}
              onChange={(e) => setParameter("timeframe", e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none">
              <option value="1m" className="bg-slate-800">
                1분봉
              </option>
              <option value="5m" className="bg-slate-800">
                5분봉
              </option>
              <option value="15m" className="bg-slate-800">
                15분봉
              </option>
              <option value="1h" className="bg-slate-800">
                1시간봉
              </option>
              <option value="4h" className="bg-slate-800">
                4시간봉
              </option>
              <option value="1d" className="bg-slate-800">
                1일봉
              </option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-200">ADX 기간</label>
            <input
              type="number"
              value={(parameters.period as number) || 14}
              onChange={(e) => setParameter("period", Number(e.target.value))}
              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* 로직 섹션 - RSI와 동일 */}
      <div className="p-4 bg-white/5 rounded-lg border border-white/20 space-y-4">
        <h4 className="text-sm font-medium text-gray-200">전략 로직 설정</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-200">TP_PCT (Take Profit %)</label>
            <input
              type="number"
              value={(logics.tpPct as number) || 0}
              onChange={(e) => setLogic("tpPct", Number(e.target.value))}
              step={0.001}
              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-200">SL_PCT (Stop Loss %)</label>
            <input
              type="number"
              value={(logics.slPct as number) || 0}
              onChange={(e) => setLogic("slPct", Number(e.target.value))}
              step={0.001}
              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-200">MAX_BARS_TIMEFRAME</label>
            <select
              value={(logics.maxBarsTimeframe as string) || "15m"}
              onChange={(e) => setLogic("maxBarsTimeframe", e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none">
              <option value="1m" className="bg-slate-800">
                1분봉
              </option>
              <option value="5m" className="bg-slate-800">
                5분봉
              </option>
              <option value="15m" className="bg-slate-800">
                15분봉
              </option>
              <option value="1h" className="bg-slate-800">
                1시간봉
              </option>
              <option value="4h" className="bg-slate-800">
                4시간봉
              </option>
              <option value="1d" className="bg-slate-800">
                1일봉
              </option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-200">MAX_BARS (최대 보유 기간)</label>
            <input
              type="number"
              value={(logics.maxBars as number) || 0}
              onChange={(e) => setLogic("maxBars", Number(e.target.value))}
              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-400">예: 6 = 최대 보유 6개의 해당 타임프레임</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Kalman 1st Order 전략 폼
export const Kalman1stStrategyForm: React.FC = () => {
  const { parameters, logics, setParameter, setLogic } = strategyStore();

  return (
    <div className="space-y-6">
      {/* 파라미터 섹션 */}
      <div className="p-4 bg-white/5 rounded-lg border border-white/20 space-y-4">
        <h4 className="text-sm font-medium text-gray-200">파라미터 설정</h4>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-200">타임프레임</label>
            <select
              value={(parameters.timeframe as string) || "15m"}
              onChange={(e) => setParameter("timeframe", e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none">
              <option value="1m" className="bg-slate-800">
                1분봉
              </option>
              <option value="5m" className="bg-slate-800">
                5분봉
              </option>
              <option value="15m" className="bg-slate-800">
                15분봉
              </option>
              <option value="1h" className="bg-slate-800">
                1시간봉
              </option>
              <option value="4h" className="bg-slate-800">
                4시간봉
              </option>
              <option value="1d" className="bg-slate-800">
                1일봉
              </option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-200">칼만 타입</label>
            <select
              value={(parameters.kalmanType as string) || "persistent"}
              onChange={(e) => setParameter("kalmanType", e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none">
              <option value="persistent" className="bg-slate-800">
                누적형 (Persistent)
              </option>
              <option value="window" className="bg-slate-800">
                윈도우형 (Window)
              </option>
              <option value="decay" className="bg-slate-800">
                감쇠형 (Decay)
              </option>
            </select>
          </div>
        </div>

        {parameters.kalmanType === "window" && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-200">칼만 윈도우</label>
            <input
              type="number"
              value={(parameters.window as number) || 0}
              onChange={(e) => setParameter("window", Number(e.target.value))}
              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-200">Q (프로세스 노이즈)</label>
            <input
              type="number"
              value={(parameters.Q as number) || 0}
              onChange={(e) => setParameter("Q", Number(e.target.value))}
              step={0.0001}
              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-200">R (측정 노이즈)</label>
            <input
              type="number"
              value={(parameters.R as number) || 0}
              onChange={(e) => setParameter("R", Number(e.target.value))}
              step={0.001}
              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {parameters.kalmanType === "decay" && (
          <div className="space-y-2">
            <h5 className="text-sm font-medium text-gray-200">감쇠 계수 (1.0이면 감쇠 없음)</h5>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-300">kalman_decay_x</label>
                <input
                  type="number"
                  value={(parameters.decay_x as number) || 1.0}
                  onChange={(e) => setParameter("decay_x", Number(e.target.value))}
                  step={0.01}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-300">kalman_decay_P</label>
                <input
                  type="number"
                  value={(parameters.decay_P as number) || 1.0}
                  onChange={(e) => setParameter("decay_P", Number(e.target.value))}
                  step={0.01}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-300">kalman_decay_Q</label>
                <input
                  type="number"
                  value={(parameters.decay_Q as number) || 1.0}
                  onChange={(e) => setParameter("decay_Q", Number(e.target.value))}
                  step={0.01}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 로직 섹션 */}
      <div className="p-4 bg-white/5 rounded-lg border border-white/20 space-y-4">
        <h4 className="text-sm font-medium text-gray-200">전략 로직 설정</h4>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-200">TP_PCT (Take Profit %)</label>
            <input
              type="number"
              value={(logics.tpPct as number) || 0}
              onChange={(e) => setLogic("tpPct", Number(e.target.value))}
              step={0.001}
              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-200">SL_PCT (Stop Loss %)</label>
            <input
              type="number"
              value={(logics.slPct as number) || 0}
              onChange={(e) => setLogic("slPct", Number(e.target.value))}
              step={0.001}
              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-200">MAX_BARS_TIMEFRAME</label>
            <select
              value={(logics.maxBarsTimeframe as string) || "15m"}
              onChange={(e) => setLogic("maxBarsTimeframe", e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none">
              <option value="1m" className="bg-slate-800">
                1분봉
              </option>
              <option value="5m" className="bg-slate-800">
                5분봉
              </option>
              <option value="15m" className="bg-slate-800">
                15분봉
              </option>
              <option value="1h" className="bg-slate-800">
                1시간봉
              </option>
              <option value="4h" className="bg-slate-800">
                4시간봉
              </option>
              <option value="1d" className="bg-slate-800">
                1일봉
              </option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-200">MAX_BARS (최대 보유 기간)</label>
            <input
              type="number"
              value={(logics.maxBars as number) || 0}
              onChange={(e) => setLogic("maxBars", Number(e.target.value))}
              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-400">예: 6 = 최대 보유 6개의 해당 타임프레임</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// App 컴포넌트 추가
const App = () => {
  const { key, setKey } = strategyStore();

  const renderForm = () => {
    switch (key) {
      case "ma":
        return <MAStrategyForm />;
      case "bb":
        return <BBStrategyForm />;
      case "rsi":
        return <RSIStrategyForm />;
      case "adx":
        return <ADXStrategyForm />;
      case "kalman1st":
        return <Kalman1stStrategyForm />;
      default:
        return <p>전략을 선택해주세요.</p>;
    }
  };

  return (
    <div className="p-4 bg-gray-900 text-white min-h-screen">
      <h1 className="text-2xl font-bold mb-4">전략 설정</h1>
      <div className="mb-4">
        <select
          value={key}
          onChange={(e) => setKey(e.target.value as StrategyKey)}
          className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none">
          <option value="ma">Moving Average</option>
          <option value="bb">Bollinger Bands</option>
          <option value="rsi">RSI</option>
          <option value="adx">ADX</option>
          <option value="kalman1st">Kalman Filter 1st Order</option>
        </select>
      </div>
      {renderForm()}
    </div>
  );
};

export default App;

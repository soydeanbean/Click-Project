import { REBIRTH_REQUIREMENT } from "../logic/gameState";

export default function RebirthPanel({ clickPoints, rebirthGain, canRebirth, onRebirth }) {
  const progress = Math.min(100, (clickPoints / REBIRTH_REQUIREMENT) * 100);
  const reached  = canRebirth;

  return (
    <div className="bg-[#1a0a2e] border border-purple-800 rounded-2xl p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h2 className="text-white font-black text-xl">⭕ Rebirth</h2>
          <p className="text-gray-400 text-xs mt-0.5">
            Reset Click Points and Upgrades to earn Rebirth Points — a permanent currency for powerful upgrades.
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500 uppercase tracking-widest">Requirement</p>
          <p className="text-yellow-300 font-bold text-sm">{REBIRTH_REQUIREMENT.toLocaleString()} Click Points</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-[#2a1a3e] rounded-full h-3 overflow-hidden">
        <div
          className={`h-3 rounded-full transition-all duration-300 ${reached ? "bg-purple-400 shadow-[0_0_10px_rgba(192,132,252,0.7)]" : "bg-purple-700"}`}
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-[11px] text-gray-500 -mt-2">
        {Math.floor(clickPoints).toLocaleString()} / {REBIRTH_REQUIREMENT.toLocaleString()}
      </p>

      {/* Gain preview */}
      <div className="flex items-center gap-3">
        {reached ? (
          <>
            <span className="text-2xl">🎁</span>
            <div>
              <p className="text-xs text-gray-400">You will receive</p>
              <p className="text-purple-300 font-black text-lg">+{rebirthGain} Rebirth Points</p>
            </div>
          </>
        ) : (
          <>
            <span className="text-2xl opacity-40">🔒</span>
            <div>
              <p className="text-xs text-gray-500">Reach the requirement to see your reward</p>
              <p className="text-gray-600 text-sm font-semibold">
                Need {Math.max(0, REBIRTH_REQUIREMENT - Math.floor(clickPoints)).toLocaleString()} more
              </p>
            </div>
          </>
        )}
      </div>

      {/* Rebirth button */}
      <button
        onClick={onRebirth}
        disabled={!reached}
        className={`w-full py-3 rounded-xl font-black text-base transition-all duration-200
          ${reached
            ? "bg-purple-600 text-white hover:bg-purple-500 hover:scale-[1.02] active:scale-95 shadow-[0_0_20px_rgba(168,85,247,0.4)] cursor-pointer"
            : "bg-[#2a1a3e] text-gray-600 cursor-not-allowed opacity-50"
          }`}
      >
        {reached ? "✨ Rebirth Now" : "🔒 Rebirth Locked"}
      </button>
    </div>
  );
}
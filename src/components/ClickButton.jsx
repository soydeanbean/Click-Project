import { useCallback } from "react";

function formatCooldown(ms) {
  if (ms <= 0) return null;
  return (ms / 1000).toFixed(1) + "s";
}

export default function ClickButton({ clickGain, cooldownMs, cooldownRemaining, onClick }) {
  const pct = cooldownMs > 0 ? (cooldownRemaining / cooldownMs) * 100 : 0;
  const onCooldown = cooldownRemaining > 0;
  const label = formatCooldown(cooldownRemaining);

  return (
    <div className="flex flex-col items-center gap-2 w-full max-w-xs">
      <button
        onClick={onClick}
        disabled={onCooldown}
        className={`relative w-full py-5 rounded-2xl font-bold text-white text-base
          border-2 overflow-hidden transition-all duration-150 shadow-lg select-none
          ${onCooldown
            ? "border-orange-500 bg-[#3a2800] cursor-not-allowed"
            : "border-teal-400 bg-[#1a3a3a] hover:bg-[#1f4f4f] hover:scale-[1.03] active:scale-95 cursor-pointer"
          }`}
        style={{ minWidth: 200 }}
      >
        {/* Cooldown fill bar */}
        {onCooldown && (
          <span
            className="absolute inset-0 bg-orange-500/20 transition-all duration-75"
            style={{ width: `${pct}%` }}
          />
        )}
        <span className="relative z-10">
          {onCooldown
            ? `⏳ ${label}`
            : `Click  +${clickGain.toFixed(2)}`}
        </span>
      </button>
      <p className="text-xs text-gray-500">
        Cooldown: {(cooldownMs / 1000).toFixed(2)}s
      </p>
    </div>
  );
}
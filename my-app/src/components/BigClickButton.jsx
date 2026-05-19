function formatMs(ms) {
  if (ms <= 0) return null;
  const s = Math.ceil(ms / 1000);
  if (s >= 60) return `${Math.floor(s / 60)}m ${s % 60}s`;
  return `${s}s`;
}

export default function BigClickButton({ unlocked, cooldownMs, cooldownFull, onClick, flash }) {
  const onCooldown = cooldownMs > 0;
  const pct = cooldownFull > 0 ? (cooldownMs / cooldownFull) * 100 : 0;

  if (!unlocked) return null;

  return (
    <div className="flex flex-col items-center gap-2 mt-2">
      <p className="text-xs text-gray-500 uppercase tracking-widest">Big Click</p>
      <button
        onClick={onClick}
        disabled={onCooldown}
        className={`relative w-48 py-4 rounded-2xl font-black text-base border-2 overflow-hidden
          transition-all duration-200 select-none shadow-xl
          ${flash
            ? "scale-110 border-yellow-300 bg-yellow-900/30 text-yellow-200"
            : onCooldown
              ? "border-gray-600 bg-[#1a1a1a] text-gray-500 cursor-not-allowed"
              : "border-yellow-400 bg-[#2a1f00] text-yellow-200 hover:bg-[#3a2a00] hover:scale-105 cursor-pointer shadow-[0_0_20px_rgba(250,204,21,0.3)]"
          }`}
      >
        {onCooldown && (
          <span
            className="absolute left-0 top-0 bottom-0 bg-gray-700/40 transition-all duration-75"
            style={{ width: `${pct}%` }}
          />
        )}
        <span className="relative z-10">
          {onCooldown ? `⏳ ${formatMs(cooldownMs)}` : "💥 50×"}
        </span>
      </button>
    </div>
  );
}
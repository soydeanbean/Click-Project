export default function CurrencyPanel({ clickPoints, rebirthPoints, rebirthSeconds }) {
  const mins = Math.floor(rebirthSeconds / 60);
  const secs = Math.floor(rebirthSeconds % 60);
  const timeStr = `${mins}m ${secs}s`;

  return (
    <div className="bg-[#1a1a1a] text-white rounded-xl p-4 flex flex-col gap-3 h-full border border-[#333]">
      <div>
        <p className="text-xs text-gray-400 uppercase tracking-widest mb-0.5">Click Points</p>
        <p className="text-2xl font-black text-yellow-300">{Math.floor(clickPoints * 100) / 100}</p>
      </div>
      <div>
        <p className="text-xs text-gray-400 uppercase tracking-widest mb-0.5">Rebirth Points</p>
        <p className="text-2xl font-black text-purple-400">{rebirthPoints}</p>
      </div>
      <div className="mt-auto">
        <p className="text-xs text-gray-500 uppercase tracking-widest mb-0.5">Time in Rebirth</p>
        <p className="text-sm font-mono text-gray-300">{timeStr}</p>
      </div>
    </div>
  );
}
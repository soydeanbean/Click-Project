import { calcPrice } from "../constants/upgradeDefs";

export default function UpgradeCard({ def, bought, currency, max, onBuy, flash }) {
  const price     = calcPrice(def.baseCost, def.scaleFactor, bought);
  const canAfford = currency >= price;
  const maxed     = bought >= max;

  return (
    <button
      onClick={onBuy}
      disabled={!canAfford || maxed}
      className={`flex flex-col gap-1 p-3 rounded-xl border-2 text-left transition-all duration-150 select-none
        ${flash
          ? "scale-105 border-green-400 bg-green-900/30"
          : maxed
            ? "border-yellow-500 bg-yellow-500/10 opacity-60 cursor-not-allowed"
            : canAfford
              ? "border-[#698383] bg-[#1e2e2e] hover:bg-[#243636] hover:border-teal-400 cursor-pointer hover:scale-[1.02]"
              : "border-[#333] bg-[#181818] opacity-40 cursor-not-allowed"
        }`}
    >
      <div className="flex items-center gap-2">
        <span className="text-xl">{def.icon}</span>
        <h3 className="text-white font-semibold text-xs leading-tight">{def.name}</h3>
      </div>
      <p className="text-gray-400 text-[10px] leading-snug line-clamp-2">{def.desc}</p>
      <div className="flex justify-between items-center mt-1 gap-1 flex-wrap">
        <span className="text-yellow-300 text-[10px] font-semibold">
          {maxed ? "MAXED" : `Cost: ${price.toLocaleString()}`}
        </span>
        <span className="text-gray-400 text-[10px]">
          {bought}/{max}
        </span>
      </div>
    </button>
  );
}
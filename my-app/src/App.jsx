import Navbar from "./components/Navbar";
import CurrencyPanel from "./components/CurrencyPanel";
import ClickButton from "./components/ClickButton";
import BigClickButton from "./components/BigClickButton";
import UpgradeCard from "./components/UpgradeCard";
import RebirthPanel from "./components/RebirthPanel";
import RebirthParticles from "./components/RebirthParticles";
import { useGame } from "./hooks/useGame";
import { CLICK_UPGRADE_DEFS, REBIRTH_UPGRADE_DEFS } from "./constants/upgradeDefs";
import { getUpgradeMax } from "./logic/boosts";

export default function App() {
  const {
    game,
    clickGain,
    clickCooldown,
    clickCooldownMs,
    bigClickCooldown,
    bigClickCooldownFull,
    bigClickUnlocked,
    bigClickFlash,
    rebirthAnim,
    upgradeFlash,
    rebirthGain,
    canRebirth,
    rebirthSeconds,
    handleClick,
    handleBigClick,
    buyClickUpgrade,
    buyRebirthUpgrade,
    handleRebirth,
  } = useGame();

  return (
    <div className="min-h-screen bg-[#111] text-white font-[Roboto,sans-serif]">
      <RebirthParticles active={rebirthAnim} />
      <Navbar />

      <main className="p-4 flex flex-col gap-6 max-w-[1400px] mx-auto">

        {/* ── Row 1: Intro ─────────────────────────────────────────────────── */}
        <section>
          <h1 className="text-4xl font-black text-white">Home</h1>
          <p className="text-sm text-gray-400 mt-1">Welcome to the Number Project!</p>
        </section>

        {/* ── Row 2: Currency + Click area ─────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-[220px_1fr] gap-4">

          {/* Currency sidebar */}
          <CurrencyPanel
            clickPoints={game.Currencies.ClickPoints}
            rebirthPoints={game.Currencies.RebirthPoints}
            rebirthSeconds={rebirthSeconds}
          />

          {/* Click center */}
          <div className="flex flex-col items-center justify-center gap-4 bg-[#161616] rounded-xl border border-[#222] py-8">
            <ClickButton
              clickGain={clickGain}
              cooldownMs={clickCooldownMs}
              cooldownRemaining={clickCooldown}
              onClick={handleClick}
            />
            <BigClickButton
              unlocked={bigClickUnlocked}
              cooldownMs={bigClickCooldown}
              cooldownFull={bigClickCooldownFull}
              onClick={handleBigClick}
              flash={bigClickFlash}
            />
            {game.ClickUpgrades.ClickUpgrade7 > 0 && (
              <p className="text-[11px] text-gray-600">
                🤖 Auto Clicker active
              </p>
            )}
          </div>
        </div>

        {/* ── Row 3: Click Upgrades ─────────────────────────────────────────── */}
        <section>
          <h2 className="text-lg font-bold text-gray-200 mb-3 flex items-center gap-2">
            ⚡ Click Upgrades
            <span className="text-xs text-gray-500 font-normal">— costs Click Points</span>
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {CLICK_UPGRADE_DEFS.map((def) => {
              const max = getUpgradeMax(def.key, game.RebirthUpgrades, CLICK_UPGRADE_DEFS);
              return (
                <UpgradeCard
                  key={def.key}
                  def={def}
                  bought={game.ClickUpgrades[def.key]}
                  currency={game.Currencies.ClickPoints}
                  max={max}
                  flash={upgradeFlash === def.key}
                  onBuy={() => buyClickUpgrade(def.key, def.baseCost, def.scaleFactor)}
                />
              );
            })}
          </div>
        </section>

        {/* ── Row 4: Rebirth panel ─────────────────────────────────────────── */}
        <RebirthPanel
          clickPoints={game.Currencies.ClickPoints}
          rebirthGain={rebirthGain}
          canRebirth={canRebirth}
          onRebirth={handleRebirth}
        />

        {/* ── Row 5: Rebirth Upgrades (full width minus currency) ───────────── */}
        <section>
          <h2 className="text-lg font-bold text-gray-200 mb-3 flex items-center gap-2">
            🌠 Rebirth Upgrades
            <span className="text-xs text-gray-500 font-normal">— costs Rebirth Points</span>
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {REBIRTH_UPGRADE_DEFS.map((def) => (
              <UpgradeCard
                key={def.key}
                def={def}
                bought={game.RebirthUpgrades[def.key]}
                currency={game.Currencies.RebirthPoints}
                max={def.defaultMax}
                flash={upgradeFlash === def.key}
                onBuy={() => buyRebirthUpgrade(def.key, def.baseCost, def.scaleFactor)}
              />
            ))}
          </div>
        </section>

      </main>
    </div>
  );
}
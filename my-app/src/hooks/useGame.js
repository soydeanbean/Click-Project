import { useState, useEffect, useRef, useCallback } from "react";
import { loadGame, saveGame } from "../logic/saveLoad";
import {
  calcClickGain,
  calcRebirthGain,
  calcClickCooldown,
  calcAutoCooldown,
  calcBigClickCooldown,
  getUpgradeMax,
} from "../logic/boosts";
import { calcPrice, CLICK_UPGRADE_DEFS, REBIRTH_UPGRADE_DEFS } from "../constants/upgradeDefs";
import { REBIRTH_REQUIREMENT } from "../logic/gameState";

const AUTOSAVE_MS = 5000;

export function useGame() {
  const [game, setGame]             = useState(loadGame);
  const [clickCooldown, setClickCooldown] = useState(0);   // ms remaining
  const [bigClickCooldown, setBigClickCooldown] = useState(0);
  const [rebirthAnim, setRebirthAnim] = useState(false);
  const [upgradeFlash, setUpgradeFlash] = useState(null);   // key of recently bought upgrade
  const [bigClickFlash, setBigClickFlash] = useState(false);

  const autosaveRef   = useRef(false);
  const cooldownRef   = useRef(null);
  const autoClickRef  = useRef(null);
  const bigCoolRef    = useRef(null);
  const rebirthTimeRef = useRef(null); // tracks seconds in current rebirth

  // ── Autosave ────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (autosaveRef.current) return;
    autosaveRef.current = true;
    const id = setInterval(() => {
      setGame((g) => { saveGame(g); return g; });
    }, AUTOSAVE_MS);
    return () => clearInterval(id);
  }, []);

  // ── Rebirth seconds ticker ──────────────────────────────────────────────────
  useEffect(() => {
    rebirthTimeRef.current = setInterval(() => {
      // We just need the elapsed seconds; derive from Stats.rebirthStartTime at calc time
    }, 1000);
    return () => clearInterval(rebirthTimeRef.current);
  }, []);

  // ── Click cooldown ticker ───────────────────────────────────────────────────
  useEffect(() => {
    if (clickCooldown <= 0) return;
    const start = Date.now();
    const initial = clickCooldown;
    cooldownRef.current = setInterval(() => {
      const elapsed = Date.now() - start;
      const remaining = Math.max(0, initial - elapsed);
      setClickCooldown(remaining);
      if (remaining === 0) clearInterval(cooldownRef.current);
    }, 50);
    return () => clearInterval(cooldownRef.current);
  }, [clickCooldown > 0 ? Math.ceil(clickCooldown / 100) : 0]); // only restart when cooldown starts

  // ── Big click cooldown ticker ───────────────────────────────────────────────
  useEffect(() => {
    if (bigClickCooldown <= 0) return;
    const start = Date.now();
    const initial = bigClickCooldown;
    bigCoolRef.current = setInterval(() => {
      const elapsed = Date.now() - start;
      const remaining = Math.max(0, initial - elapsed);
      setBigClickCooldown(remaining);
      if (remaining === 0) clearInterval(bigCoolRef.current);
    }, 50);
    return () => clearInterval(bigCoolRef.current);
  }, [bigClickCooldown > 0 ? Math.ceil(bigClickCooldown / 1000) : 0]);

  // ── Auto clicker ────────────────────────────────────────────────────────────
  useEffect(() => {
    clearInterval(autoClickRef.current);
    const cd = calcAutoCooldown(game.ClickUpgrades);
    if (!cd) return;
    autoClickRef.current = setInterval(() => {
      setGame((g) => {
        const seconds = (Date.now() - g.Stats.rebirthStartTime) / 1000;
        const gain = calcClickGain(g.ClickUpgrades, g.RebirthUpgrades, g.Currencies.ClickPoints, seconds);
        return {
          ...g,
          Currencies: { ...g.Currencies, ClickPoints: g.Currencies.ClickPoints + gain },
        };
      });
    }, cd);
    return () => clearInterval(autoClickRef.current);
  }, [
    game.ClickUpgrades.ClickUpgrade7,
    game.ClickUpgrades.ClickUpgrade10,
  ]);

  // ── Derived values ──────────────────────────────────────────────────────────
  const rebirthSeconds = (Date.now() - game.Stats.rebirthStartTime) / 1000;
  const clickGain      = calcClickGain(game.ClickUpgrades, game.RebirthUpgrades, game.Currencies.ClickPoints, rebirthSeconds);
  const clickCooldownMs = calcClickCooldown(game.ClickUpgrades);
  const rebirthGain    = calcRebirthGain(game.Currencies.ClickPoints, game.RebirthUpgrades, game.ClickUpgrades);
  const canRebirth     = game.Currencies.ClickPoints >= REBIRTH_REQUIREMENT;
  const bigClickUnlocked = game.RebirthUpgrades.RebirthUpgrade4 >= 1;
  const bigClickCooldownFull = calcBigClickCooldown(game.RebirthUpgrades);

  // ── Actions ─────────────────────────────────────────────────────────────────
  const handleClick = useCallback(() => {
    if (clickCooldown > 0) return;
    setGame((g) => {
      const secs = (Date.now() - g.Stats.rebirthStartTime) / 1000;
      const gain = calcClickGain(g.ClickUpgrades, g.RebirthUpgrades, g.Currencies.ClickPoints, secs);
      return {
        ...g,
        Currencies: { ...g.Currencies, ClickPoints: g.Currencies.ClickPoints + gain },
      };
    });
    setClickCooldown(clickCooldownMs);
  }, [clickCooldown, clickCooldownMs]);

  const handleBigClick = useCallback(() => {
    if (bigClickCooldown > 0 || !bigClickUnlocked) return;
    setGame((g) => {
      const secs = (Date.now() - g.Stats.rebirthStartTime) / 1000;
      const gain = calcClickGain(g.ClickUpgrades, g.RebirthUpgrades, g.Currencies.ClickPoints, secs) * 50;
      return {
        ...g,
        Currencies: { ...g.Currencies, ClickPoints: g.Currencies.ClickPoints + gain },
      };
    });
    setBigClickCooldown(bigClickCooldownFull);
    setBigClickFlash(true);
    setTimeout(() => setBigClickFlash(false), 600);
  }, [bigClickCooldown, bigClickUnlocked, bigClickCooldownFull]);

  const buyClickUpgrade = useCallback((key, baseCost, scaleFactor) => {
    setGame((g) => {
      const bought = g.ClickUpgrades[key];
      const max = getUpgradeMax(key, g.RebirthUpgrades, CLICK_UPGRADE_DEFS);
      if (bought >= max) return g;
      const price = calcPrice(baseCost, scaleFactor, bought);
      if (g.Currencies.ClickPoints < price) return g;
      setUpgradeFlash(key);
      setTimeout(() => setUpgradeFlash(null), 400);
      return {
        ...g,
        Currencies: { ...g.Currencies, ClickPoints: g.Currencies.ClickPoints - price },
        ClickUpgrades: { ...g.ClickUpgrades, [key]: bought + 1 },
      };
    });
  }, []);

  const buyRebirthUpgrade = useCallback((key, baseCost, scaleFactor) => {
    setGame((g) => {
      const bought = g.RebirthUpgrades[key];
      const def = REBIRTH_UPGRADE_DEFS.find((d) => d.key === key);
      if (!def || bought >= def.defaultMax) return g;
      const price = calcPrice(baseCost, scaleFactor, bought);
      if (g.Currencies.RebirthPoints < price) return g;
      setUpgradeFlash(key);
      setTimeout(() => setUpgradeFlash(null), 400);
      return {
        ...g,
        Currencies: { ...g.Currencies, RebirthPoints: g.Currencies.RebirthPoints - price },
        RebirthUpgrades: { ...g.RebirthUpgrades, [key]: bought + 1 },
      };
    });
  }, []);

  const handleRebirth = useCallback(() => {
    if (!canRebirth) return;
    setRebirthAnim(true);
    setTimeout(() => setRebirthAnim(false), 2000);
    setGame((g) => {
      const gain = calcRebirthGain(g.Currencies.ClickPoints, g.RebirthUpgrades, g.ClickUpgrades);
      return {
        ...g,
        Currencies: {
          ...g.Currencies,
          ClickPoints: 0,
          RebirthPoints: g.Currencies.RebirthPoints + gain,
        },
        ClickUpgrades: Object.fromEntries(
          Object.keys(g.ClickUpgrades).map((k) => [k, 0])
        ),
        Stats: {
          ...g.Stats,
          totalRebirths: g.Stats.totalRebirths + 1,
          rebirthStartTime: Date.now(),
        },
      };
    });
    setClickCooldown(0);
  }, [canRebirth]);

  return {
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
  };
}
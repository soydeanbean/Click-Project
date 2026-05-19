import {
  BASE_CLICK_COOLDOWN,
  BASE_AUTO_COOLDOWN,
  BIG_CLICK_COOLDOWN,
} from "./gameState";

// ─── Click Gain ───────────────────────────────────────────────────────────────
export function calcClickGain(cu, ru, clickPoints, rebirthSeconds) {
  // Base
  let base = 1
    + cu.ClickUpgrade1 * 0.25
    + cu.ClickUpgrade6 * 1
    + cu.ClickUpgrade9 * 0.1
    + ru.RebirthUpgrade1 * 1;

  // Flat multipliers (CU2, CU5, CU9)
  let multi = 1;
  multi *= Math.pow(1.25, cu.ClickUpgrade2);
  multi *= Math.pow(1.5,  cu.ClickUpgrade5);
  multi *= Math.pow(1.1,  cu.ClickUpgrade9);

  // CU3: scales with current click points (log curve so it doesn't explode)
  let cu3Bonus = 1;
  if (cu.ClickUpgrade3 > 0 && clickPoints > 0) {
    const power = 0.03 * cu.ClickUpgrade3; // tunable
    cu3Bonus = 1 + Math.log10(clickPoints + 1) * power;
  }

  // CU8: time bonus (seconds in current rebirth)
  let cu8Bonus = 1;
  if (cu.ClickUpgrade8 > 0) {
    const power = 0.005 * cu.ClickUpgrade8; // tunable
    cu8Bonus = 1 + rebirthSeconds * power;
  }

  return base * multi * cu3Bonus * cu8Bonus;
}

// ─── Rebirth Points Preview ───────────────────────────────────────────────────
export function calcRebirthGain(clickPoints, ru, cu) {
  // Base formula: sqrt of click points / 100
  let gain = Math.floor(Math.sqrt(clickPoints / 100));
  gain *= Math.pow(1.1,  cu.ClickUpgrade9);
  gain *= Math.pow(1.5,  ru.RebirthUpgrade7);
  return Math.max(1, gain);
}

// ─── Cooldowns ────────────────────────────────────────────────────────────────
export function calcClickCooldown(cu) {
  let cd = BASE_CLICK_COOLDOWN;
  cd *= Math.pow(0.9,  cu.ClickUpgrade4);
  cd *= Math.pow(0.75, cu.ClickUpgrade10);
  return Math.max(100, cd); // floor at 100ms
}

export function calcAutoCooldown(cu) {
  if (cu.ClickUpgrade7 === 0) return null; // locked
  let cd = BASE_AUTO_COOLDOWN;
  cd *= Math.pow(0.9,  cu.ClickUpgrade7);  // each level -10%
  cd *= Math.pow(0.75, cu.ClickUpgrade10); // CU10 -25%
  return Math.max(500, cd); // floor at 500ms
}

export function calcBigClickCooldown(ru) {
  let cd = BIG_CLICK_COOLDOWN;
  cd *= Math.pow(0.95, ru.RebirthUpgrade6);
  return cd;
}

// ─── Dynamic upgrade caps ─────────────────────────────────────────────────────
export function getUpgradeMax(key, ru, defs) {
  const def = defs.find((d) => d.key === key);
  if (!def) return 10;
  let cap = def.defaultMax;
  if (key === "ClickUpgrade1") cap += ru.RebirthUpgrade2 * 5;
  if (key === "ClickUpgrade2") cap += ru.RebirthUpgrade3 * 5;
  if (key === "ClickUpgrade5") cap += ru.RebirthUpgrade5 * 5;
  return cap;
}
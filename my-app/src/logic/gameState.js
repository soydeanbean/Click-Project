export const BASE_CLICK_COOLDOWN = 1000; // ms
export const BASE_AUTO_COOLDOWN  = 5000; // ms
export const BIG_CLICK_COOLDOWN  = 60000; // ms
export const REBIRTH_REQUIREMENT = 10000; // Click Points needed to rebirth

export const INITIAL_STATE = {
  Currencies: {
    ClickPoints: 0,
    RebirthPoints: 0,
  },
  ClickUpgrades: {
    ClickUpgrade1: 0,
    ClickUpgrade2: 0,
    ClickUpgrade3: 0,
    ClickUpgrade4: 0,
    ClickUpgrade5: 0,
    ClickUpgrade6: 0,
    ClickUpgrade7: 0,
    ClickUpgrade8: 0,
    ClickUpgrade9: 0,
    ClickUpgrade10: 0,
  },
  RebirthUpgrades: {
    RebirthUpgrade1: 0,
    RebirthUpgrade2: 0,
    RebirthUpgrade3: 0,
    RebirthUpgrade4: 0,
    RebirthUpgrade5: 0,
    RebirthUpgrade6: 0,
    RebirthUpgrade7: 0,
  },
  Stats: {
    totalRebirths: 0,
    rebirthStartTime: Date.now(), // timestamp of last rebirth (or game start)
  },
};

export function merge(target, source) {
  for (let key in source) {
    if (
      typeof source[key] === "object" &&
      source[key] !== null &&
      !Array.isArray(source[key])
    ) {
      if (!target[key]) target[key] = {};
      merge(target[key], source[key]);
    } else {
      target[key] = source[key];
    }
  }
}
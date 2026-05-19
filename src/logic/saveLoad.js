import { INITIAL_STATE, merge } from "./gameState";

const SAVE_KEY = "NumberProject_Data";

export function saveGame(game) {
  localStorage.setItem(SAVE_KEY, JSON.stringify(game));
}

export function loadGame() {
  try {
    const saved = JSON.parse(localStorage.getItem(SAVE_KEY));
    if (!saved) return structuredClone(INITIAL_STATE);
    const state = structuredClone(INITIAL_STATE);
    merge(state, saved);
    return state;
  } catch {
    return structuredClone(INITIAL_STATE);
  }
}
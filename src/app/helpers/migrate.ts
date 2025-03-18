import { merge } from 'lodash';
import { ensureAllHeroesHaveProgress } from './game-init';
import { blankGameState, gamestate, setGameState } from './state-game';
import { defaultOptions, options, setOptions } from './state-options';
import { blankUnlockState, setUnlockState, unlockstate } from './state-unlocks';

export function migrateGameState() {
  const state = gamestate();
  const newState = merge(blankGameState(), state);
  setGameState(newState);

  ensureAllHeroesHaveProgress();
}

export function migrateOptionsState() {
  const state = options();
  const newState = merge(defaultOptions(), state);
  setOptions(newState);
}

export function migrateUnlockState() {
  const state = unlockstate();
  const newState = merge(blankUnlockState(), state);
  setUnlockState(newState);
}

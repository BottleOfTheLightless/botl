import { merge } from 'lodash';
import { blankGameState, gamestate, setGameState } from './gamestate';
import { defaultOptions, options, setOptions } from './options';

export function migrateGameState() {
  const state = gamestate();
  const newState = merge(blankGameState(), state);

  setGameState(newState);
}

export function migrateOptionsState() {
  const state = options();
  const newState = merge(defaultOptions(), state);
  setOptions(newState);
}

import { gamestate, setGameState } from './gamestate';

export function isSetup(): boolean {
  const state = gamestate();

  return false;
}

export function finishSetup(): void {
  const state = gamestate();

  setGameState(state);
}

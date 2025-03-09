import {
  blankGameState,
  isGameStateReady,
  setGameState,
  updateGamestate,
} from './gamestate';
import { isSetup } from './setup';

export function isPlayingGame(): boolean {
  return window.location.href.includes('/game');
}

export function isGameOver(): boolean {
  return window.location.href.includes('/over');
}

export function doGameOver(): void {
  setGameState(blankGameState());
}

export function doGameloop(numTicks: number): void {
  if (!isSetup()) return;
  if (!isPlayingGame()) return;
  if (!isGameStateReady()) return;
  if (isGameOver()) return;

  updateGamestate((state) => {
    state.meta.numTicks += numTicks;

    return state;
  });
}

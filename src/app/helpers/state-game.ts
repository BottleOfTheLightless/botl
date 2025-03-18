import { Signal, signal, WritableSignal } from '@angular/core';
import { cloneDeep } from 'lodash';
import { GameState, PlayerId } from '../interfaces';
import { uuid } from './rng';

export function blankGameState(): GameState {
  return {
    meta: {
      version: 1,
      playerId: uuid() as PlayerId,
    },
    activeGameSlot: 0,
    activeGames: [],
    heroProgress: {},
  };
}

const _gamestate: WritableSignal<GameState> = signal(blankGameState());
export const gamestate: Signal<GameState> = _gamestate.asReadonly();

export const isGameStateReady = signal<boolean>(false);

export function setGameState(state: GameState): void {
  _gamestate.set(cloneDeep(state));
}

export function updateGamestate(func: (state: GameState) => GameState): void {
  const newState = func(gamestate());
  setGameState(newState);
}

export function myPlayerId(): PlayerId {
  return gamestate().meta.playerId;
}

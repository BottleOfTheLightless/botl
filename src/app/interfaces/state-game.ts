import { Branded } from './identifiable';

export type GameId = Branded<string, 'GameId'>;

export interface GameStateActiveGame {
  id: GameId;
  createdAt: number;
  lastPlayedAt: number;

  act: number;
  currentNode: number;
  currentMap: string;
}

export interface GameStateMeta {
  version: number;
}

export interface GameState {
  meta: GameStateMeta;

  activeGameSlot: number;
  activeGames: GameStateActiveGame[];
}

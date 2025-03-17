import { HeroPlayer, HeroProgress } from './hero';
import { Branded } from './identifiable';

export type GameId = Branded<string, 'GameId'>;

export interface GameStateActiveGame {
  id: GameId;
  createdAt: number;
  lastPlayedAt: number;

  act: number;
  currentNode: number;
  currentMap: string;

  heroes: HeroPlayer[];
}

export interface GameStateMeta {
  version: number;
  playerId: string;
}

export interface GameState {
  meta: GameStateMeta;

  activeGameSlot: number;
  activeGames: GameStateActiveGame[];

  heroProgress: Record<string, HeroProgress>;
}

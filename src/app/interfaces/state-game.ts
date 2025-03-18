import { HeroPlayer, HeroProgress } from './data-hero';
import { Branded } from './identifiable';

export type GameId = Branded<string, 'GameId'>;
export type PlayerId = Branded<string, 'PlayerId'>;

export interface GameStateActiveGame {
  id: GameId;
  createdAt: number;
  lastPlayedAt: number;

  act: number;
  stage: number;
  currentNode: number;
  currentMap: string;

  heroes: HeroPlayer[];
}

export interface GameStateMeta {
  version: number;
  playerId: PlayerId;
}

export interface GameState {
  meta: GameStateMeta;

  activeGameSlot: number;
  activeGames: GameStateActiveGame[];

  heroProgress: Record<string, HeroProgress>;
}

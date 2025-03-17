import { sample } from 'lodash';
import {
  GameId,
  GameStateActiveGame,
  HeroPlayer,
  HeroProgress,
  TiledMap,
  TiledMapNode,
  TiledMapNodeType,
} from '../interfaces';
import { allMapsByName, getPropertyFromMap } from './map';
import { uuid } from './rng';
import { gamestate, updateGamestate } from './state-game';

export function updateCurrentGame(
  func: (game: GameStateActiveGame) => GameStateActiveGame,
): void {
  updateGamestate((state) => {
    state.activeGames[state.activeGameSlot] = func(
      state.activeGames[state.activeGameSlot],
    );
    return state;
  });
}

export function newGame(): GameStateActiveGame {
  return {
    id: uuid() as GameId,
    createdAt: Date.now(),
    lastPlayedAt: Date.now(),
    act: 0,
    currentNode: 0,
    currentMap: '',
    heroes: [],
  };
}

export function startGame({
  slot,
  heroes,
}: {
  slot: number;
  heroes: HeroPlayer[];
}): void {
  const game = newGame();

  const startingMap = sample(availableStartingMaps())!;
  const startingNode = findNodeOnMapByType(startingMap, 'Start')!;

  game.act = 1;
  game.currentNode = startingNode.id;
  game.currentMap = getPropertyFromMap(startingMap, 'name') as string;
  game.heroes = heroes;

  updateGamestate((state) => {
    state.activeGames[slot] = game;
    return state;
  });
}

export function findNodeOnMapByType(
  map: TiledMap,
  type: TiledMapNodeType,
): TiledMapNode | undefined {
  return map.layers
    .flatMap((layer) => layer.objects)
    .find((node) => node.type === type);
}

export function findNodeOnMapById(
  map: TiledMap,
  id: number,
): TiledMapNode | undefined {
  return map.layers
    .flatMap((layer) => layer.objects)
    .find((node) => node.id === id);
}

export function availableStartingMaps(): TiledMap[] {
  return [...allMapsByName()]
    .filter(([_, entry]) => getPropertyFromMap(entry, 'isAct1'))
    .map((e) => e[1]) as TiledMap[];
}

export function currentGame(): GameStateActiveGame | undefined {
  return gamestate().activeGames[gamestate().activeGameSlot];
}

export function getHeroProgress(heroId: string): HeroProgress | undefined {
  return gamestate().heroProgress[heroId];
}

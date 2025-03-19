import { sample } from 'lodash';
import {
  GameId,
  GameStateActiveGame,
  HeroDefinition,
  HeroPlayer,
  HeroProgress,
  PlayerId,
  TiledMap,
  TiledMapNode,
  TiledMapNodeType,
} from '../interfaces';
import { getEntriesByType } from './content';
import { allMapsByName, getPropertyFromMap } from './map';
import { uuid } from './rng';
import { gamestate, updateGamestate } from './state-game';

export function updateCurrentGame(
  func: (game: GameStateActiveGame) => GameStateActiveGame,
): void {
  updateGamestate((state) => {
    state.activeGames[state.activeGameSlot] = {
      ...func(state.activeGames[state.activeGameSlot]),
      lastPlayedAt: Date.now(),
    };
    return state;
  });
}

export function newGame(): GameStateActiveGame {
  return {
    id: uuid() as GameId,
    createdAt: Date.now(),
    lastPlayedAt: Date.now(),
    act: 0,
    stage: 0,
    currentNode: 0,
    currentMap: '',
    heroes: [],
    waitingFor: [],
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
  game.stage = 1;
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
  return (
    [...allMapsByName()]
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .filter(([_, entry]) => getPropertyFromMap(entry, 'isAct1'))
      .map((e) => e[1]) as TiledMap[]
  );
}

export function makeCurrentGameInactive() {
  updateGamestate((state) => {
    state.activeGameSlot = -1;
    return state;
  });
}

export function currentGame(): GameStateActiveGame | undefined {
  return gamestate().activeGames[gamestate().activeGameSlot];
}

export function setHeroProgress(heroId: string, progress: HeroProgress): void {
  updateGamestate((state) => {
    state.heroProgress[heroId] = progress;
    return state;
  });
}

export function getHeroProgress(heroId: string): HeroProgress | undefined {
  return gamestate().heroProgress[heroId];
}

export function ensureAllHeroesHaveProgress(): void {
  const heroes = getEntriesByType<HeroDefinition>('hero');

  heroes.forEach((hero) => {
    const progress = getHeroProgress(hero.id);
    if (progress) return;

    setHeroProgress(hero.id, {});
  });
}

export function waitFor(ids: PlayerId[]): void {
  updateCurrentGame((game) => {
    game.waitingFor = ids;
    return game;
  });
}

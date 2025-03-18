import { Signal, signal, WritableSignal } from '@angular/core';
import { sortBy } from 'lodash';
import { MapDefinition, TiledMap, TiledMapNode } from '../interfaces';
import { getEntriesByType } from './content';
import { currentGame } from './game-init';

const _allMapsByName: WritableSignal<Map<string, TiledMap>> = signal(new Map());
export const allMapsByName: Signal<Map<string, TiledMap>> =
  _allMapsByName.asReadonly();

export function setAllMapsByName(state: Map<string, TiledMap>): void {
  _allMapsByName.set(new Map(state));
}

export function getPropertyFromMap(
  node: TiledMap | TiledMapNode,
  name: string,
) {
  const allNodes = node.properties.filter((p) => p.name.includes(name));
  if (allNodes.length === 1) {
    return allNodes[0].value;
  }

  if (allNodes.length > 1) {
    return sortBy(allNodes, 'name').map((p) => p.value);
  }

  return undefined;
}

export function currentMapData() {
  return getEntriesByType<MapDefinition>('map').find(
    (m) => m.name === currentGame()?.currentMap,
  );
}

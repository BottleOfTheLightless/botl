import { Signal, signal, WritableSignal } from '@angular/core';
import { sortBy } from 'lodash';
import {
  MapDefinition,
  TiledMap,
  TiledMapLayer,
  TiledMapNode,
} from '../interfaces';
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
  const shouldWrapAsArray = (node.properties ?? []).some(
    (p) => p.name.includes(name) && p.name.includes('.'),
  );

  const allNodes = (node.properties ?? []).filter((p) => p.name.includes(name));
  if (allNodes.length === 0) {
    return undefined;
  }

  if (allNodes.length > 1 || shouldWrapAsArray) {
    return sortBy(allNodes, 'name').map((p) => p.value);
  }

  if (allNodes.length === 1) {
    return allNodes[0].value;
  }

  return undefined;
}

export function currentMapData(): MapDefinition | undefined {
  return getEntriesByType<MapDefinition>('map').find(
    (m) => m.map === currentGame()?.currentMap,
  );
}

export function currentMapJson(): TiledMap | undefined {
  const mapData = currentMapData();
  if (!mapData) return undefined;

  return allMapsByName().get(mapData.map);
}

export function currentMapNodes() {
  return currentMapJson()?.layers[TiledMapLayer.MapNodes].objects;
}

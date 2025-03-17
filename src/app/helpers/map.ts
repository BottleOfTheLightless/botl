import { Signal, signal, WritableSignal } from '@angular/core';
import { sortBy } from 'lodash';
import { TiledMap, TiledMapNode } from '../interfaces';

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

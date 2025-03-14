import { signal, Signal, WritableSignal } from '@angular/core';
import { cloneDeep } from 'lodash';
import { Content, ContentType } from '../interfaces';

const _allIdsByName: WritableSignal<Record<string, string>> = signal({});
export const allIdsByName: Signal<Record<string, string>> =
  _allIdsByName.asReadonly();

const _allContentById: WritableSignal<Record<string, Content>> = signal({});
export const allContentById: Signal<Record<string, Content>> =
  _allContentById.asReadonly();

export function setAllIdsByName(state: Record<string, string>): void {
  _allIdsByName.set(cloneDeep(state));
}

export function setAllContentById(state: Record<string, Content>): void {
  _allContentById.set(cloneDeep(state));
}

export function getEntriesByType<T>(type: ContentType): T[] {
  return Object.values(allContentById()).filter(
    (entry) => entry.__type === type,
  ) as T[];
}

export function getEntry<T extends Content>(
  entryIdOrName: string,
): T | undefined {
  if (!entryIdOrName) return undefined;

  const idHash = allIdsByName();
  const entriesHash = allContentById();

  let ret: T = entriesHash[entryIdOrName] as T;

  if (idHash[entryIdOrName]) {
    ret = entriesHash[idHash[entryIdOrName]] as T;
  }

  return ret;
}

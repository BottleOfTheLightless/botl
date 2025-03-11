import { Signal, signal, WritableSignal } from '@angular/core';
import { cloneDeep } from 'lodash';
import { ContentType, UnlockState } from '../interfaces';
import { allContentById } from './content';

export function blankUnlockState(): UnlockState {
  return {
    hero: {},
  };
}

const _unlockstate: WritableSignal<UnlockState> = signal(blankUnlockState());
export const unlockstate: Signal<UnlockState> = _unlockstate.asReadonly();

export function setUnlockState(state: UnlockState): void {
  _unlockstate.set(cloneDeep(state));
}

export function updateUnlockState(
  func: (state: UnlockState) => UnlockState,
): void {
  const newState = func(unlockstate());
  setUnlockState(newState);
}

export function unlockDefaultItems() {
  const allContents = allContentById();

  const unlocked = Object.values(allContents).filter((c) => c.defaultUnlocked);
  unlockContents(unlocked.map((u) => ({ type: u.__type, id: u.id })));
}

export function unlockContents(
  contents: Array<{ type: ContentType; id: string }>,
): void {
  updateUnlockState((state) => {
    contents.forEach(({ type, id }) => {
      state[type][id] = true;
    });
    return state;
  });
}

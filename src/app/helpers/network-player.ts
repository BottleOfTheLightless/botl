import { Signal, signal, WritableSignal } from '@angular/core';
import { NetworkedPlayer, NetworkedPlayerState, PlayerId } from '../interfaces';

const _networkPlayerData: WritableSignal<NetworkedPlayerState> = signal({
  players: {},
});
export const networkedPlayerState: Signal<NetworkedPlayerState> =
  _networkPlayerData.asReadonly();

export function setPlayerDataForId(playerId: PlayerId, data: NetworkedPlayer) {
  _networkPlayerData.update((state) => {
    const players = structuredClone(state.players);
    players[playerId] = data;

    state.players = players;
    return state;
  });
}

export function getPlayerDataForId(
  playerId: PlayerId | undefined,
): NetworkedPlayer | undefined {
  if (!playerId) return undefined;

  return networkedPlayerState().players[playerId];
}

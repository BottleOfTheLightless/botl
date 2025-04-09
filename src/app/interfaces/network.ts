import { PlayerId } from './state-game';

export interface NetworkedPlayerState {
  players: Record<PlayerId, NetworkedPlayer>;
}

export interface NetworkedPlayer {
  id: PlayerId;
  name: string;
}

export interface GameStateMeta {
  version: number;
  isPaused: boolean;
  createdAt: number;
  numTicks: number;
}

export interface GameState {
  meta: GameStateMeta;
}

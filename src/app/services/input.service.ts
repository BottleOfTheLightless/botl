import { Injectable } from '@angular/core';
import { ICommand, IHeroPlayer, INetworkPlayer } from '../interfaces';

type PlayerId = 1 | 2 | 3 | 4;

@Injectable({
  providedIn: 'root',
})
export class InputService {
  public playerMap: Record<PlayerId, INetworkPlayer | undefined> = {
    1: undefined,
    2: undefined,
    3: undefined,
    4: undefined,
  };
  public playerControllingHeroes: Record<PlayerId, IHeroPlayer | undefined> = {
    1: undefined,
    2: undefined,
    3: undefined,
    4: undefined,
  };

  public registerPlayer(
    playerId: PlayerId,
    player: INetworkPlayer,
    hero: IHeroPlayer,
  ) {}

  public handleInput(playerId: PlayerId, command: ICommand) {}

  public sendInput(playerId: PlayerId, command: ICommand) {}

  public convertCommandFromPlayerToHero(
    playerId: PlayerId,
    command: ICommand,
  ) {}
}

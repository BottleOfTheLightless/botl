import { Injectable } from '@angular/core';
import { Command, HeroPlayer, NetworkPlayer } from '../interfaces';

type PlayerId = 1 | 2 | 3 | 4;

@Injectable({
  providedIn: 'root',
})
export class InputService {
  public playerMap: Record<PlayerId, NetworkPlayer | undefined> = {
    1: undefined,
    2: undefined,
    3: undefined,
    4: undefined,
  };
  public playerControllingHeroes: Record<PlayerId, HeroPlayer | undefined> = {
    1: undefined,
    2: undefined,
    3: undefined,
    4: undefined,
  };

  public registerPlayer(
    playerId: PlayerId,
    player: NetworkPlayer,
    hero: HeroPlayer,
  ) {}

  public handleInput(playerId: PlayerId, command: Command) {}

  public sendInput(playerId: PlayerId, command: Command) {}

  public convertCommandFromPlayerToHero(playerId: PlayerId, command: Command) {}
}

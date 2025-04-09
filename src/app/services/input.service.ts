import { effect, inject, Injectable } from '@angular/core';
import { CommandInput, currentGame } from '../helpers';
import { Command, HeroPlayer, PlayerId } from '../interfaces';
import { ContentService } from './content.service';
import { LoggerService } from './logger.service';

type PlayerSlot = 0 | 1 | 2 | 3;

@Injectable({
  providedIn: 'root',
})
export class InputService {
  private contentService = inject(ContentService);
  private logger = inject(LoggerService);

  private slotToPlayerId: Record<PlayerSlot, PlayerId | undefined> = {
    0: undefined,
    1: undefined,
    2: undefined,
    3: undefined,
  };

  private slotToPlayerData: Record<PlayerSlot, HeroPlayer | undefined> = {
    0: undefined,
    1: undefined,
    2: undefined,
    3: undefined,
  };

  constructor() {
    effect(() => {
      const isContentLoaded = this.contentService.hasLoaded();
      const game = currentGame();
      if (!game) {
        this.clearPlayers();
        return;
      }

      if (!isContentLoaded || this.hasRegisteredPlayers()) return;

      game.heroes.forEach((hero, index) => {
        this.registerPlayer(index as PlayerSlot, hero.controlledBy, hero);
      });
    });
  }

  init() {}

  public playerIdInSlot(slot: PlayerSlot): PlayerId | undefined {
    return this.slotToPlayerId[slot];
  }

  public hasRegisteredPlayers() {
    return Object.values(this.slotToPlayerId).some((id) => id !== undefined);
  }

  public clearPlayers() {
    this.logger.debug(`Input`, `Unregistering all player inputs.`);

    this.slotToPlayerId = {
      0: undefined,
      1: undefined,
      2: undefined,
      3: undefined,
    };

    this.slotToPlayerData = {
      0: undefined,
      1: undefined,
      2: undefined,
      3: undefined,
    };
  }

  public registerPlayer(
    playerSlot: PlayerSlot,
    playerId: PlayerId,
    hero: HeroPlayer,
  ) {
    this.slotToPlayerId[playerSlot] = playerId;
    this.slotToPlayerData[playerSlot] = hero;

    this.logger.debug(
      `Input`,
      `Player ${playerId} registered in slot ${playerSlot} as ${hero.name}`,
    );
  }

  // handle receiving an input from a player, possibly over a network
  public handleInput(playerId: PlayerId, command: Command) {
    this.logger.debug(`Input`, `Received command from ${playerId}`, command);
  }

  // handle sending an input to a player, possibly over a network
  public sendInput(playerId: PlayerId, command: Command) {
    this.logger.debug(`Input`, `Sending command from ${playerId}`, command);
  }

  public convertCommandFromPlayerToHero(playerId: PlayerId, command: Command) {
    CommandInput.next({ ...command, playerId });
  }
}

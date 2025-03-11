import { effect, inject, Injectable, signal } from '@angular/core';
import { LocalStorageService } from 'ngx-webstorage';
import {
  gamestate,
  getOption,
  isGameStateReady,
  migrateGameState,
  migrateOptionsState,
  migrateUnlockState,
  options,
  setGameState,
  setOptions,
  setUnlockState,
  unlockDefaultItems,
  unlockstate,
} from '../helpers';
import { GameOptions, GameState, UnlockState } from '../interfaces';
import { ContentService } from './content.service';
import { LoggerService } from './logger.service';

@Injectable({
  providedIn: 'root',
})
export class GamestateService {
  private localStorage = inject(LocalStorageService);
  private logger = inject(LoggerService);
  private contentService = inject(ContentService);

  public hasLoaded = signal<boolean>(false);

  constructor() {
    effect(() => {
      if (!this.contentService.hasLoaded() || this.hasLoaded()) return;
      console.log('[Gamestate] Migrating gamestate...');

      migrateGameState();
      migrateOptionsState();
      migrateUnlockState();

      unlockDefaultItems();

      console.log('[Gamestate] Gamestate migrated & loaded.');
      this.hasLoaded.set(true);
      isGameStateReady.set(true);
    });

    effect(() => {
      if (!this.hasLoaded()) return;

      const state = gamestate();

      if (getOption('debugConsoleLogStateUpdates')) {
        console.info('[State Update]', state);
      }

      this.saveGamestate(state);
    });

    effect(() => {
      if (!this.hasLoaded()) return;

      const optionsState = options();
      this.saveOptions(optionsState);
    });

    effect(() => {
      if (!this.hasLoaded()) return;

      const unlockState = unlockstate();
      this.saveUnlocks(unlockState);
    });
  }

  async init() {
    this.load();
  }

  load() {
    const state = this.localStorage.retrieve('gamestate') as GameState;
    if (state) {
      setGameState(state);
    }

    const options = this.localStorage.retrieve('options') as GameOptions;
    if (options) {
      setOptions(options);
    }

    const unlock = this.localStorage.retrieve('unlock') as UnlockState;
    if (unlock) {
      setUnlockState(unlock);
    }
  }

  saveGamestate(saveState: GameState) {
    this.localStorage.store('gamestate', saveState);
  }

  saveOptions(optionsState: GameOptions) {
    this.localStorage.store('options', optionsState);
  }

  saveUnlocks(unlockState: UnlockState) {
    this.localStorage.store('unlock', unlockState);
  }
}

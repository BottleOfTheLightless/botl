import { Component, computed, inject, input } from '@angular/core';
import { currentGame, getPlayerDataForId } from '../../helpers';
import { InputService } from '../../services/input.service';
import { HeroHeadiconComponent } from '../hero-headicon/hero-headicon.component';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-game-player-list-entry',
  imports: [HeroHeadiconComponent, IconComponent],
  templateUrl: './game-player-list-entry.component.html',
  styleUrl: './game-player-list-entry.component.scss',
})
export class GamePlayerListEntryComponent {
  private inputService = inject(InputService);

  public slot = input.required<0 | 1 | 2 | 3>();

  public playerId = computed(() =>
    this.inputService.playerIdInSlot(this.slot()),
  );
  public networkPlayerData = computed(() =>
    getPlayerDataForId(this.playerId()),
  );
  public characterData = computed(() => currentGame()?.heroes[this.slot()]);

  public displayedName = computed(
    () =>
      this.networkPlayerData()?.name ?? this.characterData()?.name ?? 'Unknown',
  );
}

import { Component } from '@angular/core';
import { GamePlayerListEntryComponent } from '../game-player-list-entry/game-player-list-entry.component';

@Component({
  selector: 'app-game-player-list',
  imports: [GamePlayerListEntryComponent],
  templateUrl: './game-player-list.component.html',
  styleUrl: './game-player-list.component.scss',
})
export class GamePlayerListComponent {
  public readonly playerSlots: (0 | 1 | 2 | 3)[] = [0, 1, 2, 3];
}

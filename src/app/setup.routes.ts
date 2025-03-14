import { Routes } from '@angular/router';
import { GameSetupCharacterChoiceComponent } from './pages/game-setup-character-choice/game-setup-character-choice.component';
import { GameSetupPlayerCountComponent } from './pages/game-setup-player-count/game-setup-player-count.component';

export const setupRoutes: Routes = [
  {
    component: GameSetupPlayerCountComponent,
    path: 'gamemode',
  },
  {
    component: GameSetupCharacterChoiceComponent,
    path: 'characters',
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: 'gamemode',
  },
];

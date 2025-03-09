import { Routes } from '@angular/router';
import { GameSetupComponent } from './pages/game-setup/game-setup.component';
import { OptionsComponent } from './pages/options/options.component';

export const gameRoutes: Routes = [
  {
    component: GameSetupComponent,
    path: 'setup',
  },
  {
    component: OptionsComponent,
    path: 'options',
    loadChildren: () =>
      import('./options.routes').then((routes) => routes.optionsRoutes),
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: 'town',
  },
];

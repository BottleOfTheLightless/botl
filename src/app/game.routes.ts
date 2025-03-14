import { Routes } from '@angular/router';

export const gameRoutes: Routes = [
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: '',
  },
];

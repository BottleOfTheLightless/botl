import { Component, computed, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SavefileImportComponent } from '../../components/savefile-import/savefile-import.component';
import { AnalyticsClickDirective } from '../../directives/analytics-click.directive';
import { setDiscordStatus } from '../../helpers';

@Component({
  selector: 'app-game-setup',
  imports: [FormsModule, SavefileImportComponent, AnalyticsClickDirective],
  templateUrl: './game-setup.component.html',
  styleUrl: './game-setup.component.scss',
})
export class GameSetupComponent implements OnInit {
  private router = inject(Router);

  public canSubmit = computed(() => false);

  ngOnInit() {
    setDiscordStatus({
      state: 'Starting a new run...',
    });
  }

  public play() {
    if (!this.canSubmit()) return;

    this.router.navigate(['/game']);
  }
}

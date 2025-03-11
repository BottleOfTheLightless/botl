import { Component, computed, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HeroHeadiconComponent } from '../../components/hero-headicon/hero-headicon.component';
import { AnalyticsClickDirective } from '../../directives/analytics-click.directive';
import { getEntriesByType, setDiscordStatus } from '../../helpers';
import { IHero } from '../../interfaces';

@Component({
  selector: 'app-game-setup',
  imports: [FormsModule, AnalyticsClickDirective, HeroHeadiconComponent],
  templateUrl: './game-setup.component.html',
  styleUrl: './game-setup.component.scss',
})
export class GameSetupComponent implements OnInit {
  private router = inject(Router);

  public canSubmit = computed(() => false);

  public allCharacters = computed(() => getEntriesByType<IHero>('hero'));

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

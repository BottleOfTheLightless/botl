import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { groupBy } from 'lodash';
import { DndModule } from 'ngx-drag-drop';
import { HeroHeadiconComponent } from '../../components/hero-headicon/hero-headicon.component';
import { IconComponent } from '../../components/icon/icon.component';
import { AnalyticsClickDirective } from '../../directives/analytics-click.directive';
import { getEntriesByType, isUnlocked, setDiscordStatus } from '../../helpers';
import { IHero } from '../../interfaces';

@Component({
  selector: 'app-game-setup',
  imports: [
    CommonModule,
    DndModule,
    FormsModule,
    AnalyticsClickDirective,
    HeroHeadiconComponent,
    IconComponent,
  ],
  templateUrl: './game-setup.component.html',
  styleUrl: './game-setup.component.scss',
})
export class GameSetupComponent implements OnInit {
  private router = inject(Router);

  public readonly characterCategories = [
    'Defender',
    'Attacker',
    'Caster',
    'Ranger',
    'Healer',
    'Hybrid',
  ];

  public allCharacters = computed(() =>
    groupBy(
      getEntriesByType<IHero>('hero').map((c) => ({
        hero: c,
        unlocked: isUnlocked('hero', c.id),
      })),
      (char) => (char.hero.subtype ? 'Hybrid' : char.hero.type),
    ),
  );

  public chosenCharacters = signal<(IHero | undefined)[]>([
    undefined,
    undefined,
    undefined,
    undefined,
  ]);

  public hasEnoughCharacters = signal<boolean>(false);

  public activeCharacter = signal<IHero | undefined>(undefined);

  ngOnInit() {
    setDiscordStatus({
      state: 'Starting a new run...',
    });
  }

  public setActiveHero(hero: IHero) {
    this.activeCharacter.set(hero);
  }

  public chooseCharacter(hero: IHero, slot: number) {
    const duplicateSlot = this.chosenCharacters().findIndex(
      (c) => c?.id === hero.id,
    );

    this.chosenCharacters.update((chars) => {
      if (duplicateSlot !== -1) {
        chars[duplicateSlot] = undefined;
      }

      chars[slot] = hero;
      return chars;
    });

    this.hasEnoughCharacters.set(
      this.chosenCharacters().filter(Boolean).length === 4,
    );
  }

  public play() {
    if (!this.hasEnoughCharacters()) return;

    this.router.navigate(['/game']);
  }
}

import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { groupBy, sampleSize } from 'lodash';
import { DndModule } from 'ngx-drag-drop';
import { ClassIconComponent } from '../../components/class-icon/class-icon.component';
import { HeroHeadiconComponent } from '../../components/hero-headicon/hero-headicon.component';
import { IconComponent } from '../../components/icon/icon.component';
import { AnalyticsClickDirective } from '../../directives/analytics-click.directive';
import {
  getEntriesByType,
  getEntry,
  getHeroProgress,
  isUnlocked,
  myPlayerId,
  setDiscordStatus,
  startGame,
} from '../../helpers';
import { HeroDefinition, HeroType } from '../../interfaces';

@Component({
  selector: 'app-game-setup',
  imports: [
    CommonModule,
    DndModule,
    FormsModule,
    AnalyticsClickDirective,
    HeroHeadiconComponent,
    IconComponent,
    ClassIconComponent,
  ],
  templateUrl: './game-setup-character-choice.component.html',
  styleUrl: './game-setup-character-choice.component.scss',
})
export class GameSetupCharacterChoiceComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  public readonly characterCategories: (HeroType | 'Hybrid')[] = [
    'Defender',
    'Attacker',
    'Caster',
    'Ranger',
    'Healer',
    'Hybrid',
  ];

  public playerCount = signal<number>(0);
  public chosenCharacters = signal<(HeroDefinition | undefined)[]>([
    undefined,
    undefined,
    undefined,
    undefined,
  ]);
  public hasEnoughCharacters = signal<boolean>(false);
  public activeCharacter = signal<HeroDefinition | undefined>(undefined);

  public availableCharacters = computed(() =>
    getEntriesByType<HeroDefinition>('hero').filter((c) =>
      isUnlocked('hero', c.id),
    ),
  );

  public allCharacters = computed(() =>
    groupBy(
      getEntriesByType<HeroDefinition>('hero').map((c) => ({
        hero: c,
        unlocked: isUnlocked('hero', c.id),
      })),
      (char) => (char.hero.subtype ? 'Hybrid' : char.hero.type),
    ),
  );

  ngOnInit() {
    const playerCount = this.route.snapshot.queryParamMap.get('players');
    const numPlayers = playerCount ? +playerCount : 1;
    this.playerCount.set(numPlayers);

    setDiscordStatus({
      state: 'Starting a new run...',
    });
  }

  public makeRandomTeam() {
    const chosenCharacters = sampleSize(this.availableCharacters(), 4);
    chosenCharacters.forEach((c, i) => {
      this.chooseCharacter(c, i);
    });
  }

  public setActiveHero(hero: HeroDefinition) {
    this.activeCharacter.set(hero);
  }

  public chooseCharacter(hero: HeroDefinition, slot: number) {
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

    const heroData = this.chosenCharacters().map((c) => {
      const heroDef = getEntry<HeroDefinition>(c!.id)!;

      return {
        ...heroDef,
        controlledBy: myPlayerId(),
        progress: getHeroProgress(heroDef.id)!,

        hp: heroDef.stats.hp ?? 50,
      };
    });

    startGame({
      slot: 0,
      heroes: heroData,
    });

    this.router.navigate(['/transition'], {
      queryParams: {
        transitionTo: 'game',
      },
    });
  }
}

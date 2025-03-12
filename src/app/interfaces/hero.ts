import { Identifiable } from './identifiable';

export type HeroType = 'Defender' | 'Attacker' | 'Healer' | 'Ranger' | 'Caster';

export interface HeroStats {
  hp: number;
}

export interface IHero extends Identifiable {
  name: string;
  description: string;

  headshotImageName: string;
  spritesheetImageName: string;

  type: HeroType;
  subtype?: HeroType;

  defaultUnlocked: boolean;

  stats: HeroStats;
}

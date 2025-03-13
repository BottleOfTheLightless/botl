import { Identifiable } from './identifiable';

export type HeroType = 'Defender' | 'Attacker' | 'Healer' | 'Ranger' | 'Caster';

export interface HeroStats {
  hp: number;
}

export interface IHeroDefinition extends Identifiable {
  name: string;
  description: string;

  headshotImageName: string;
  spritesheetImageName: string;

  type: HeroType;
  subtype?: HeroType;

  defaultUnlocked: boolean;

  stats: HeroStats;
}

export interface IHeroPlayer extends IHeroDefinition {}

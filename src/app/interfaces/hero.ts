import { Branded, Identifiable } from './identifiable';

export type HeroId = Branded<string, 'HeroId'>;

export type HeroType = 'Defender' | 'Attacker' | 'Healer' | 'Ranger' | 'Caster';

export interface HeroStats {
  hp: number;
}

export interface HeroDefinition extends Identifiable {
  id: HeroId;
  name: string;
  description: string;

  headshotImageName: string;
  spritesheetImageName: string;

  type: HeroType;
  subtype?: HeroType;

  defaultUnlocked: boolean;

  stats: HeroStats;
}

export interface HeroPlayer extends HeroDefinition {
  controlledBy: string;
}

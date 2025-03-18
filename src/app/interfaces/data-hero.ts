import { Branded, Content } from './identifiable';
import { PlayerId } from './state-game';

export type HeroId = Branded<string, 'HeroId'>;

export type HeroType = 'Defender' | 'Attacker' | 'Healer' | 'Ranger' | 'Caster';

export interface HeroStats {
  hp: number;
}

export interface HeroDefinition extends Content {
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

export interface HeroProgress {}

export interface HeroPlayer extends HeroDefinition {
  controlledBy: PlayerId;
  progress: HeroProgress;

  hp: number;
}

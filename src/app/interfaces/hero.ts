import { Identifiable } from './identifiable';

export type HeroType = 'Defender' | 'Attacker' | 'Healer' | 'Ranger' | 'Caster';

export interface IHero extends Identifiable {
  name: string;
  description: string;

  headshotImageName: string;
  spritesheetImageName: string;

  type: HeroType;

  defaultUnlocked: boolean;
}

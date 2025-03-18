import { HeroId } from './data-hero';
import { PlayerId } from './state-game';

export type CommandType = 'CHOOSE_HERO' | 'COMBAT_MOVE' | 'COMBAT_ACTION';

export interface Command {
  type: CommandType;
  playerId: PlayerId;
}

export interface ChooseHeroCommand extends Command {
  type: 'CHOOSE_HERO';
  heroId: HeroId;
}

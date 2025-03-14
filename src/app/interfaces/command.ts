export type CommandType = 'CHOOSE_HERO' | 'COMBAT_MOVE' | 'COMBAT_ACTION';

export interface Command {
  type: CommandType;
}

export interface ChooseHeroCommand extends Command {
  type: 'CHOOSE_HERO';
  heroId: string;
}

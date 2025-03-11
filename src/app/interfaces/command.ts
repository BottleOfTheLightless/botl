export type CommandType = 'CHOOSE_HERO' | 'COMBAT_MOVE' | 'COMBAT_ACTION';

export interface ICommand {
  type: CommandType;
}

export interface IChooseHeroCommand extends ICommand {
  type: 'CHOOSE_HERO';
  heroId: string;
}

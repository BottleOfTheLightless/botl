export type TiledMapNodeType = 'Start' | 'Any' | 'Town' | 'Treasure' | 'Boss';
export type TiledMapNodeImage =
  | 'All'
  | 'Encounter1'
  | 'Encounter2'
  | 'Encounter3'
  | 'Encounter4'
  | 'Encounter5'
  | 'Shop'
  | 'TreasureChest';

export enum TiledMapLayer {
  ImageLayer = 0,
  MapNodes = 1,
}

export interface TiledMap {
  width: number;
  height: number;
  tilewidth: number;
  tileheight: number;
  layers: TiledLayer[];
  properties: TiledProperty[];
}

export interface TiledLayer {
  id: number;
  objects: TiledMapNode[];
}

export interface TiledMapNode {
  id: number;
  name: string;
  type: TiledMapNodeType;
  x: number;
  y: number;
  properties: TiledProperty[];
}

export interface TiledProperty {
  name: string;
  value: number | string;
}

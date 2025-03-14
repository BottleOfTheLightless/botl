type TiledMapNodeType = 'Start' | 'Any' | 'Town' | 'Treasure' | 'Boss';

export interface TiledMap {
  width: number;
  height: number;
  tilewidth: number;
  tileheight: number;
  layers: TiledLayer[];
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
  properties: TiledMapNodeProperty[];
}

export interface TiledMapNodeProperty {
  name: string;
  value: number;
}

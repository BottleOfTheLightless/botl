export type ContentType = 'hero';

export interface Identifiable {
  id: string;
  name: string;
}

export interface Content extends Identifiable {
  defaultUnlocked?: boolean;
  __type: ContentType;
}

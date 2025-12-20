import { atom } from 'jotai';

export type SortOption =
  | 'default'
  | 'date'
  | 'questName'
  | 'turnCount'
  | 'collectionNo'
  | 'class'
  | 'rarity'
  | 'servantName';

export type SortOrder = 'asc' | 'desc';

export const selectedSortOptionAtom = atom<SortOption>('default');
export const sortOrderAtom = atom<SortOrder>('asc');

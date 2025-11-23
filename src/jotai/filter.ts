import { atom } from 'jotai';

export const selectedClassesAtom = atom<string[]>([]);
export const selectedRaritiesAtom = atom<string[]>([]);
export const minTurnCountAtom = atom<number | null>(null);
export const maxTurnCountAtom = atom<number | null>(null);
export const servantCollectionNoFilterAtom = atom<number | null>(null);
export const servantNameFilterAtom = atom<string>('');
export const noteFilterAtom = atom<string>('');
export const questNameFilterAtom = atom<string>('');

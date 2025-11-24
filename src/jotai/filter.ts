import { atom } from 'jotai';

export const selectedClassesAtom = atom<string[]>([]);
export const selectedRaritiesAtom = atom<string[]>([]);
export const minTurnCountAtom = atom<number | null>(null);
export const maxTurnCountAtom = atom<number | null>(null);
export const servantCollectionNoFilterAtom = atom<number | null>(null);
export const servantNameFilterAtom = atom<string>('');
export const noteFilterAtom = atom<string>('');
export const questNameFilterAtom = atom<string>('');

export const isFilteredAtom = atom((get) => {
  const selectedClasses = get(selectedClassesAtom);
  const selectedRarities = get(selectedRaritiesAtom);
  const minTurnCount = get(minTurnCountAtom);
  const maxTurnCount = get(maxTurnCountAtom);
  const servantCollectionNoFilter = get(servantCollectionNoFilterAtom);
  const servantNameFilter = get(servantNameFilterAtom);
  const noteFilter = get(noteFilterAtom);
  const questNameFilter = get(questNameFilterAtom);

  return (
    selectedClasses.length > 0 ||
    selectedRarities.length > 0 ||
    minTurnCount !== null ||
    maxTurnCount !== null ||
    servantCollectionNoFilter !== null ||
    servantNameFilter !== '' ||
    noteFilter !== '' ||
    questNameFilter !== ''
  );
});

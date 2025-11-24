import { atom } from 'jotai';

export interface SourceSettings {
  urlType: 'public' | 'shared';
  spreadsheetId: string | null;
  sheetGid: string | null;
  urlColumnIndex: number;
  noteColumns: { label: string | null; columnIndex: number }[];
  questName:
    | {
        mode: 'import';
        columnIndex: number;
      }
    | {
        mode: 'fixed';
        fixedName: string | null;
      };
  turnCount:
    | {
        mode: 'import';
        columnIndex: number;
      }
    | {
        mode: 'fixed';
        fixedCount: number | null;
      };
  servantIdentify:
    | {
        mode: 'collectionNo';
        collectionNoColumnIndex: number;
      }
    | {
        mode: 'name';
        nameColumnIndex: number;
      };
}

export const sourceSettingsDefault: SourceSettings = {
  urlType: 'public',
  spreadsheetId: null,
  sheetGid: null,
  questName: {
    mode: 'import',
    columnIndex: 0
  },
  turnCount: {
    mode: 'import',
    columnIndex: 1
  },
  servantIdentify: {
    mode: 'collectionNo',
    collectionNoColumnIndex: 2
  },
  urlColumnIndex: 3,
  noteColumns: []
};

export const sourceSettingsAtom = atom<SourceSettings>(sourceSettingsDefault);

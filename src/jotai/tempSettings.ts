import { atom } from 'jotai';
import { sourceSettingsDefault, type SourceSettings } from './sourceSettings';
import { focusAtom } from 'jotai-optics';

// フラットな一時設定用のアトム
interface TempSettings {
  urlType: 'public' | 'shared';
  spreadsheetId: string;
  sheetGid: string | null;
  questNameMode: 'import' | 'fixed';
  questNameColumnIndex: number;
  fixedQuestName: string | null;
  turnCountMode: 'import' | 'fixed';
  turnCountColumnIndex: number;
  fixedTurnCount: number | null;
  servantIdentifyMode: 'collectionNo' | 'name';
  servantIdColumnIndex: number;
  servantNameColumnIndex: number;
  columnIndex: number;
  dateColumnIndex: number | null;
  noteColumnIndices: number[];
}

export const convertSourceSettingsToTemp = (sourceSettings: SourceSettings): TempSettings => ({
  urlType: sourceSettings.dataSource.type,
  spreadsheetId: sourceSettings.dataSource.id ?? '',
  sheetGid: sourceSettings.dataSource.gid,
  questNameMode: sourceSettings.mapping.questName.mode,
  questNameColumnIndex: sourceSettings.mapping.questName.mode === 'import' ? sourceSettings.mapping.questName.col : 0,
  fixedQuestName: sourceSettings.mapping.questName.mode === 'fixed' ? sourceSettings.mapping.questName.name : null,
  turnCountMode: sourceSettings.mapping.turn.mode,
  turnCountColumnIndex: sourceSettings.mapping.turn.mode === 'import' ? sourceSettings.mapping.turn.col : 1,
  fixedTurnCount: sourceSettings.mapping.turn.mode === 'fixed' ? sourceSettings.mapping.turn.count : null,
  servantIdentifyMode: sourceSettings.mapping.servantIdentify.mode,
  servantIdColumnIndex:
    sourceSettings.mapping.servantIdentify.mode === 'collectionNo' ? sourceSettings.mapping.servantIdentify.col : 2,
  servantNameColumnIndex:
    sourceSettings.mapping.servantIdentify.mode === 'name' ? sourceSettings.mapping.servantIdentify.col : 2,
  columnIndex: sourceSettings.mapping.urlCol,
  dateColumnIndex: sourceSettings.mapping.dateCol,
  noteColumnIndices: sourceSettings.mapping.notes.map((col) => col.col)
});

export const tempSettingsAtom = atom<TempSettings>(convertSourceSettingsToTemp(sourceSettingsDefault));

export const tempUrlAtom = atom('');
export const tempUrlTypeAtom = focusAtom(tempSettingsAtom, (optic) => optic.prop('urlType'));
export const tempSpreadsheetIdAtom = focusAtom(tempSettingsAtom, (optic) => optic.prop('spreadsheetId'));
export const tempSheetGidAtom = focusAtom(tempSettingsAtom, (optic) => optic.prop('sheetGid'));

export const tempQuestNameModeAtom = focusAtom(tempSettingsAtom, (optic) => optic.prop('questNameMode'));
export const tempQuestNameColumnIndexAtom = focusAtom(tempSettingsAtom, (optic) => optic.prop('questNameColumnIndex'));
export const tempFixedQuestNameAtom = focusAtom(tempSettingsAtom, (optic) => optic.prop('fixedQuestName'));

export const tempTurnCountModeAtom = focusAtom(tempSettingsAtom, (optic) => optic.prop('turnCountMode'));
export const tempTurnCountColumnIndexAtom = focusAtom(tempSettingsAtom, (optic) => optic.prop('turnCountColumnIndex'));
export const tempFixedTurnCountAtom = focusAtom(tempSettingsAtom, (optic) => optic.prop('fixedTurnCount'));

export const tempServantIdentifyModeAtom = focusAtom(tempSettingsAtom, (optic) => optic.prop('servantIdentifyMode'));
export const tempServantIdColumnIndexAtom = focusAtom(tempSettingsAtom, (optic) => optic.prop('servantIdColumnIndex'));
export const tempServantNameColumnIndexAtom = focusAtom(tempSettingsAtom, (optic) =>
  optic.prop('servantNameColumnIndex')
);

export const tempColumnIndexAtom = focusAtom(tempSettingsAtom, (optic) => optic.prop('columnIndex'));

export const tempDateColumnIndexAtom = focusAtom(tempSettingsAtom, (optic) => optic.prop('dateColumnIndex'));

export const tempNoteColumnIndicesAtom = focusAtom(tempSettingsAtom, (optic) => optic.prop('noteColumnIndices'));

// エラー状態
export const tempErrorsAtom = atom<{
  url?: string;
  urlType?: string;
  spreadsheetId?: string;
  sheetGid?: string;
  columnIndex?: string;
  dateColumnIndex?: string;
  servantIdColumn?: string;
  servantNameColumn?: string;
  turnCountColumn?: string;
  fixedTurnCount?: string;
  noteColumn?: string;
  questNameColumn?: string;
  fixedQuestName?: string;
}>({});

export const tempUrlErrorAtom = focusAtom(tempErrorsAtom, (optic) => optic.prop('url'));
export const tempUrlTypeErrorAtom = focusAtom(tempErrorsAtom, (optic) => optic.prop('urlType'));
export const tempSpreadsheetIdErrorAtom = focusAtom(tempErrorsAtom, (optic) => optic.prop('spreadsheetId'));
export const tempSheetGidErrorAtom = focusAtom(tempErrorsAtom, (optic) => optic.prop('sheetGid'));
export const tempColumnIndexErrorAtom = focusAtom(tempErrorsAtom, (optic) => optic.prop('columnIndex'));
export const tempDateColumnIndexErrorAtom = focusAtom(tempErrorsAtom, (optic) => optic.prop('dateColumnIndex'));
export const tempServantIdColumnErrorAtom = focusAtom(tempErrorsAtom, (optic) => optic.prop('servantIdColumn'));
export const tempServantNameColumnErrorAtom = focusAtom(tempErrorsAtom, (optic) => optic.prop('servantNameColumn'));
export const tempTurnCountColumnErrorAtom = focusAtom(tempErrorsAtom, (optic) => optic.prop('turnCountColumn'));
export const tempFixedTurnCountErrorAtom = focusAtom(tempErrorsAtom, (optic) => optic.prop('fixedTurnCount'));
export const tempNoteColumnErrorAtom = focusAtom(tempErrorsAtom, (optic) => optic.prop('noteColumn'));
export const tempQuestNameColumnErrorAtom = focusAtom(tempErrorsAtom, (optic) => optic.prop('questNameColumn'));
export const tempFixedQuestNameErrorAtom = focusAtom(tempErrorsAtom, (optic) => optic.prop('fixedQuestName'));

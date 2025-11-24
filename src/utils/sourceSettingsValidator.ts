import type { SourceSettings } from '../jotai/sourceSettings';
import { sourceSettingsDefault } from '../jotai/sourceSettings';
import { validateSheetGid, validateSpreadsheetId, validateColumnIndex } from './spreadsheetValidator';

/**
 * クエリパラメータのキー定義
 */
export const QUERY_KEYS = {
  URL_TYPE: 'urlType',
  SPREADSHEET_ID: 'ssId',
  SHEET_GID: 'gid',
  URL_COL_IDX: 'urlIdx',
  QUEST_MODE: 'qstMode',
  QUEST_COL_IDX: 'qstIdx',
  QUEST_FIXED: 'qstFixed',
  TURN_MODE: 'turnMode',
  TURN_COL_IDX: 'turnIdx',
  TURN_FIXED: 'turnFixed',
  SERVANT_MODE: 'svtMode',
  SERVANT_COLLECTION_NO_IDX: 'svtNoIdx',
  SERVANT_NAME_IDX: 'svtNameIdx',
  NOTE_COLS: 'notes'
} as const;

/**
 * クエリパラメータからSourceSettingsオブジェクトをパースしてバリデーションする
 * バリデーション違反があった場合はデフォルト値に置き換える
 * @returns { settings: パース結果, hasInvalidValues: 不正な値があったか }
 */
export function parseSourceSettingsFromQuery(searchParams: URLSearchParams): {
  settings: SourceSettings;
  hasInvalidValues: boolean;
} {
  let hasInvalidValues = false;
  const settings: SourceSettings = { ...sourceSettingsDefault };

  try {
    // urlType
    const urlType = searchParams.get(QUERY_KEYS.URL_TYPE);
    if (urlType === 'public' || urlType === 'shared') {
      settings.urlType = urlType;
    } else if (urlType !== null) {
      hasInvalidValues = true;
    }

    // spreadsheetId
    const spreadsheetId = searchParams.get(QUERY_KEYS.SPREADSHEET_ID);
    if (spreadsheetId) {
      const validation = validateSpreadsheetId(spreadsheetId);
      if (validation.isValid) {
        settings.spreadsheetId = spreadsheetId;
      } else {
        hasInvalidValues = true;
      }
    }

    // sheetGid
    const sheetGid = searchParams.get(QUERY_KEYS.SHEET_GID);
    if (sheetGid) {
      const validation = validateSheetGid(sheetGid);
      if (validation.isValid) {
        settings.sheetGid = sheetGid;
      } else {
        hasInvalidValues = true;
      }
    }

    // urlColumnIndex
    const urlColumnIndex = searchParams.get(QUERY_KEYS.URL_COL_IDX);
    if (urlColumnIndex !== null) {
      const parsed = parseInt(urlColumnIndex, 10);
      const validation = validateColumnIndex(parsed);
      if (validation.isValid) {
        settings.urlColumnIndex = parsed;
      } else {
        hasInvalidValues = true;
      }
    }

    // questName
    const questNameMode = searchParams.get(QUERY_KEYS.QUEST_MODE);
    if (questNameMode === 'import') {
      const columnIndex = searchParams.get(QUERY_KEYS.QUEST_COL_IDX);
      if (columnIndex !== null) {
        const parsed = parseInt(columnIndex, 10);
        const validation = validateColumnIndex(parsed);
        if (validation.isValid) {
          settings.questName = { mode: 'import', columnIndex: parsed };
        } else {
          hasInvalidValues = true;
        }
      }
    } else if (questNameMode === 'fixed') {
      const fixedName = searchParams.get(QUERY_KEYS.QUEST_FIXED);
      // 20文字以下のバリデーション
      if (fixedName && fixedName.length <= 20) {
        settings.questName = { mode: 'fixed', fixedName };
      } else if (fixedName && fixedName.length > 20) {
        hasInvalidValues = true;
      } else {
        settings.questName = { mode: 'fixed', fixedName: null };
      }
    } else if (questNameMode !== null) {
      hasInvalidValues = true;
    }

    // turnCount
    const turnCountMode = searchParams.get(QUERY_KEYS.TURN_MODE);
    if (turnCountMode === 'import') {
      const columnIndex = searchParams.get(QUERY_KEYS.TURN_COL_IDX);
      if (columnIndex !== null) {
        const parsed = parseInt(columnIndex, 10);
        const validation = validateColumnIndex(parsed);
        if (validation.isValid) {
          settings.turnCount = { mode: 'import', columnIndex: parsed };
        } else {
          hasInvalidValues = true;
        }
      }
    } else if (turnCountMode === 'fixed') {
      const fixedCount = searchParams.get(QUERY_KEYS.TURN_FIXED);
      if (fixedCount !== null) {
        const parsed = parseInt(fixedCount, 10);
        // 0以上のバリデーション
        if (!isNaN(parsed) && parsed >= 0) {
          settings.turnCount = { mode: 'fixed', fixedCount: parsed };
        } else {
          hasInvalidValues = true;
        }
      } else {
        settings.turnCount = { mode: 'fixed', fixedCount: null };
      }
    } else if (turnCountMode !== null) {
      hasInvalidValues = true;
    }

    // servantIdentify
    const servantIdentifyMode = searchParams.get(QUERY_KEYS.SERVANT_MODE);
    if (servantIdentifyMode === 'collectionNo') {
      const columnIndex = searchParams.get(QUERY_KEYS.SERVANT_COLLECTION_NO_IDX);
      if (columnIndex !== null) {
        const parsed = parseInt(columnIndex, 10);
        const validation = validateColumnIndex(parsed);
        if (validation.isValid) {
          settings.servantIdentify = {
            mode: 'collectionNo',
            collectionNoColumnIndex: parsed
          };
        } else {
          hasInvalidValues = true;
        }
      }
    } else if (servantIdentifyMode === 'name') {
      const columnIndex = searchParams.get(QUERY_KEYS.SERVANT_NAME_IDX);
      if (columnIndex !== null) {
        const parsed = parseInt(columnIndex, 10);
        const validation = validateColumnIndex(parsed);
        if (validation.isValid) {
          settings.servantIdentify = { mode: 'name', nameColumnIndex: parsed };
        } else {
          hasInvalidValues = true;
        }
      }
    } else if (servantIdentifyMode !== null) {
      hasInvalidValues = true;
    }

    // noteColumns
    const noteColumnsParam = searchParams.get(QUERY_KEYS.NOTE_COLS);
    if (noteColumnsParam) {
      try {
        const parsed = JSON.parse(noteColumnsParam);
        if (Array.isArray(parsed)) {
          const validNoteColumns: { label: string | null; columnIndex: number }[] = [];
          let hasInvalidNote = false;

          for (const item of parsed) {
            if (
              typeof item === 'object' &&
              item !== null &&
              typeof item.columnIndex === 'number' &&
              (item.label === null || typeof item.label === 'string')
            ) {
              const validation = validateColumnIndex(item.columnIndex);
              if (validation.isValid) {
                validNoteColumns.push(item);
              } else {
                hasInvalidNote = true;
              }
            } else {
              hasInvalidNote = true;
            }
          }

          if (hasInvalidNote) {
            hasInvalidValues = true;
          }

          if (validNoteColumns.length > 0) {
            settings.noteColumns = validNoteColumns;
          }
        } else {
          hasInvalidValues = true;
        }
      } catch {
        hasInvalidValues = true;
      }
    }

    return { settings, hasInvalidValues };
  } catch (error) {
    console.error('Failed to parse source settings from query:', error);
    return { settings: sourceSettingsDefault, hasInvalidValues: true };
  }
}

/**
 * SourceSettingsオブジェクトをクエリパラメータに変換する
 */
export function sourceSettingsToQuery(settings: SourceSettings): Record<string, string> {
  const params: Record<string, string> = {};

  params[QUERY_KEYS.URL_TYPE] = settings.urlType;

  if (settings.spreadsheetId) {
    params[QUERY_KEYS.SPREADSHEET_ID] = settings.spreadsheetId;
  }

  if (settings.sheetGid) {
    params[QUERY_KEYS.SHEET_GID] = settings.sheetGid;
  }

  params[QUERY_KEYS.URL_COL_IDX] = settings.urlColumnIndex.toString();

  // questName
  if (settings.questName.mode === 'import') {
    params[QUERY_KEYS.QUEST_MODE] = 'import';
    params[QUERY_KEYS.QUEST_COL_IDX] = settings.questName.columnIndex.toString();
  } else {
    params[QUERY_KEYS.QUEST_MODE] = 'fixed';
    if (settings.questName.fixedName !== null) {
      params[QUERY_KEYS.QUEST_FIXED] = settings.questName.fixedName;
    }
  }

  // turnCount
  if (settings.turnCount.mode === 'import') {
    params[QUERY_KEYS.TURN_MODE] = 'import';
    params[QUERY_KEYS.TURN_COL_IDX] = settings.turnCount.columnIndex.toString();
  } else {
    params[QUERY_KEYS.TURN_MODE] = 'fixed';
    if (settings.turnCount.fixedCount !== null) {
      params[QUERY_KEYS.TURN_FIXED] = settings.turnCount.fixedCount.toString();
    }
  }

  // servantIdentify
  if (settings.servantIdentify.mode === 'collectionNo') {
    params[QUERY_KEYS.SERVANT_MODE] = 'collectionNo';
    params[QUERY_KEYS.SERVANT_COLLECTION_NO_IDX] = settings.servantIdentify.collectionNoColumnIndex.toString();
  } else {
    params[QUERY_KEYS.SERVANT_MODE] = 'name';
    params[QUERY_KEYS.SERVANT_NAME_IDX] = settings.servantIdentify.nameColumnIndex.toString();
  }

  // noteColumns
  if (settings.noteColumns.length > 0) {
    params[QUERY_KEYS.NOTE_COLS] = JSON.stringify(settings.noteColumns);
  }

  return params;
}

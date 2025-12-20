import { Button } from '@mui/material';
import { useAtomCallback } from 'jotai/utils';
import { useSearchParams } from 'react-router-dom';
import {
  convertSourceSettingsToQueryParams,
  sourceSettingsAtom,
  type SourceSettings
} from '../../jotai/sourceSettings';
import { tempSettingsAtom, tempErrorsAtom } from '../../jotai/tempSettings';
import {
  extractSpreadsheetId,
  validateSpreadsheetId,
  extractGidFromUrl,
  validateSheetGid,
  validateColumnIndex
} from '../../utils/spreadsheetValidator';
import { useCallback } from 'react';

export function SubmitButton({ onSuccess }: { onSuccess: () => void }) {
  const [, setSearchParams] = useSearchParams();

  const handleDecide = useAtomCallback(
    useCallback(
      (get, set) => {
        const tempSettings = get(tempSettingsAtom);

        // 全てのバリデーションを実行してエラーをまとめる
        const newErrors: {
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
        } = {};

        // URLタイプのバリデーション
        if (!tempSettings.urlType) {
          newErrors.urlType = '選択してください';
        }

        // スプレッドシートIDのバリデーション
        if (!!tempSettings.spreadsheetId) {
          const idValidation = validateSpreadsheetId(tempSettings.spreadsheetId);
          if (tempSettings.spreadsheetId && !idValidation.isValid) {
            newErrors.spreadsheetId = idValidation.error || '値が不正です';
          }
        }

        // シートGIDのバリデーション
        if (tempSettings.sheetGid) {
          const gidValidation = validateSheetGid(tempSettings.sheetGid);
          if (!gidValidation.isValid) {
            newErrors.sheetGid = gidValidation.error || '値が不正です';
          }
        }

        // 各列のバリデーション
        const columnValidation = validateColumnIndex(tempSettings.columnIndex);
        if (!columnValidation.isValid) {
          newErrors.columnIndex = columnValidation.error || undefined;
        }

        // 達成日列のバリデーション（nullを許容）
        if (tempSettings.dateColumnIndex !== null) {
          const dateColumnValidation = validateColumnIndex(tempSettings.dateColumnIndex);
          if (!dateColumnValidation.isValid) {
            newErrors.dateColumnIndex = dateColumnValidation.error || undefined;
          }
        }

        for (const idx of tempSettings.noteColumnIndices) {
          const noteValidation = validateColumnIndex(idx);
          if (!noteValidation.isValid) {
            newErrors.noteColumn = noteValidation.error || undefined;
            break;
          }
        }

        // サーヴァント識別方法に応じたバリデーション
        if (tempSettings.servantIdentifyMode === 'collectionNo') {
          const servantCollectionNoValidation = validateColumnIndex(tempSettings.servantIdColumnIndex);
          if (!servantCollectionNoValidation.isValid) {
            newErrors.servantIdColumn = servantCollectionNoValidation.error || undefined;
          }
        } else {
          const servantNameValidation = validateColumnIndex(tempSettings.servantNameColumnIndex);
          if (!servantNameValidation.isValid) {
            newErrors.servantNameColumn = servantNameValidation.error || undefined;
          }
        }

        // ターン数のバリデーション
        if (tempSettings.turnCountMode === 'import') {
          const turnCountValidation = validateColumnIndex(tempSettings.turnCountColumnIndex);
          if (!turnCountValidation.isValid) {
            newErrors.turnCountColumn = turnCountValidation.error || '選択してください';
          }
        } else {
          if (tempSettings.fixedTurnCount !== null && tempSettings.fixedTurnCount < 0) {
            newErrors.fixedTurnCount = '0以上の数値を入力してください';
          }
        }

        // クエスト名のバリデーション
        if (tempSettings.questNameMode === 'import') {
          const qValidation = validateColumnIndex(tempSettings.questNameColumnIndex);
          if (!qValidation.isValid) {
            newErrors.questNameColumn = qValidation.error || '選択してください';
          }
        }

        // エラーがある場合はエラーをセットして終了
        if (Object.keys(newErrors).length > 0) {
          set(tempErrorsAtom, newErrors);
          return;
        }

        // バリデーション成功 - エラーをクリアして設定を保存
        set(tempErrorsAtom, {});

        const sourceSettings: SourceSettings = {
          dataSource: {
            type: tempSettings.urlType!,
            id: extractSpreadsheetId(tempSettings.spreadsheetId!),
            gid: tempSettings.sheetGid ? tempSettings.sheetGid : extractGidFromUrl(tempSettings.spreadsheetId!) || null
          },
          mapping: {
            urlCol: tempSettings.columnIndex,
            dateCol: tempSettings.dateColumnIndex,
            notes: tempSettings.noteColumnIndices.map((col) => ({ label: null, col })),
            questName:
              tempSettings.questNameMode === 'import'
                ? { mode: 'import', col: tempSettings.questNameColumnIndex }
                : { mode: 'fixed', name: tempSettings.fixedQuestName || null },
            turn:
              tempSettings.turnCountMode === 'import'
                ? { mode: 'import', col: tempSettings.turnCountColumnIndex }
                : { mode: 'fixed', count: tempSettings.fixedTurnCount || null },
            servantIdentify:
              tempSettings.servantIdentifyMode === 'collectionNo'
                ? { mode: 'collectionNo', col: tempSettings.servantIdColumnIndex }
                : { mode: 'name', col: tempSettings.servantNameColumnIndex }
          }
        };
        set(sourceSettingsAtom, sourceSettings);
        setSearchParams(convertSourceSettingsToQueryParams(sourceSettings), { replace: true });
        onSuccess();
      },
      [setSearchParams, onSuccess]
    )
  );

  return (
    <Button variant="contained" onClick={handleDecide} sx={{ minWidth: '80px' }}>
      決定
    </Button>
  );
}

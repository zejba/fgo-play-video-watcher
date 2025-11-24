import { Button } from '@mui/material';
import { useAtomCallback } from 'jotai/utils';
import { useSearchParams } from 'react-router-dom';
import { sourceSettingsAtom, type SourceSettings } from '../../jotai/sourceSettings';
import { tempSettingsAtom, tempErrorsAtom } from '../../jotai/tempSettings';
import { sourceSettingsToQuery } from '../../utils/sourceSettingsValidator';
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

        // スプレッドシートIDの抽出とバリデーション
        const extractedId = tempSettings.spreadsheetId ? extractSpreadsheetId(tempSettings.spreadsheetId) : null;
        if (!!extractedId) {
          const idValidation = validateSpreadsheetId(extractedId);
          if (extractedId && !idValidation.isValid) {
            newErrors.spreadsheetId = idValidation.error || '値が不正です';
          }
        }

        // URLからGIDを抽出（GIDが未入力の場合のみ）
        let finalGid = tempSettings.sheetGid;
        if (!tempSettings.sheetGid && tempSettings.spreadsheetId) {
          const extractedGid = extractGidFromUrl(tempSettings.spreadsheetId);
          if (extractedGid) {
            finalGid = extractedGid;
          }
        }

        // シートGIDのバリデーション
        if (finalGid) {
          const gidValidation = validateSheetGid(finalGid);
          if (!gidValidation.isValid) {
            newErrors.sheetGid = gidValidation.error || '値が不正です';
          }
        }

        // 各列のバリデーション
        const columnValidation = validateColumnIndex(tempSettings.columnIndex);
        if (!columnValidation.isValid) {
          newErrors.columnIndex = columnValidation.error || undefined;
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
        } else {
          if ((tempSettings.fixedQuestName?.length ?? 0) > 20) {
            newErrors.fixedQuestName = '20文字以下で入力してください';
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
          urlType: tempSettings.urlType,
          spreadsheetId: extractedId,
          sheetGid: finalGid,
          urlColumnIndex: tempSettings.columnIndex,
          servantIdentify:
            tempSettings.servantIdentifyMode === 'collectionNo'
              ? { mode: 'collectionNo', collectionNoColumnIndex: tempSettings.servantIdColumnIndex }
              : { mode: 'name', nameColumnIndex: tempSettings.servantNameColumnIndex },
          noteColumns: tempSettings.noteColumnIndices.map((idx) => ({
            label: null,
            columnIndex: idx
          })),
          questName:
            tempSettings.questNameMode === 'import'
              ? { mode: 'import', columnIndex: tempSettings.questNameColumnIndex }
              : { mode: 'fixed', fixedName: tempSettings.fixedQuestName || null },
          turnCount:
            tempSettings.turnCountMode === 'import'
              ? { mode: 'import', columnIndex: tempSettings.turnCountColumnIndex }
              : { mode: 'fixed', fixedCount: tempSettings.fixedTurnCount }
        };
        set(sourceSettingsAtom, sourceSettings);
        setSearchParams(sourceSettingsToQuery(sourceSettings), { replace: true });
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

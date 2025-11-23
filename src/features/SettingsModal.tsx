import {
  Dialog,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  FormHelperText
} from '@mui/material';
import { useState } from 'react';
import { styled } from '@mui/material/styles';
import { useAtom } from 'jotai';
import { sourceSettingsAtom } from '../jotai/sourceSettings';
import {
  validateSpreadsheetId,
  validateColumnIndex,
  validateSheetGid,
  extractSpreadsheetId,
  extractGidFromUrl,
  parseSpreadsheetUrl
} from '../utils/spreadsheetValidator';

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
}

const columnOptions = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N'] as const;

const FormRow = styled('div')(({ theme }) => ({
  display: 'flex',
  columnGap: 12,
  alignItems: 'flex-start',
  flexWrap: 'wrap',
  [theme.breakpoints.up('md')]: {
    flexWrap: 'nowrap'
  }
}));

const Half = styled('div')(({ theme }) => ({
  display: 'flex',
  rowGap: 12,
  width: '100%',
  [theme.breakpoints.up('md')]: {
    width: '50%'
  }
}));

const StyledFormControl = styled(FormControl)({
  width: '100%',
  marginBottom: 16
});

const ErrorText = styled('div')(({ theme }) => ({
  color: theme.palette.error.main,
  fontSize: '0.75rem',
  marginTop: 4,
  marginLeft: 14
}));

const UrlInputRow = styled('div')({
  display: 'flex',
  gap: 8,
  alignItems: 'flex-start',
  marginBottom: 16
});

const SpreadsheetInfoBox = styled('div')(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: 8,
  padding: 16,
  marginBottom: 16,
  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.02)'
}));

export function SettingsModal({ open, onClose }: SettingsModalProps) {
  const [settings, setSettings] = useAtom(sourceSettingsAtom);

  const [tempUrl, setTempUrl] = useState('');
  const [tempUrlType, setTempUrlType] = useState(settings.urlType);
  const [tempSpreadsheetId, setTempSpreadsheetId] = useState(settings.spreadsheetId);
  const [tempSheetGid, setTempSheetGid] = useState(settings.sheetGid);
  const [tempColumnIndex, setTempColumnIndex] = useState(settings.urlColumnIndex);
  const [tempServantIdColumnIndex, setTempServantIdColumnIndex] = useState(
    settings.servantIdentify.mode === 'collectionNo' ? settings.servantIdentify.collectionNoColumnIndex : 2
  );
  const [tempServantNameColumnIndex, setTempServantNameColumnIndex] = useState(
    settings.servantIdentify.mode === 'name' ? settings.servantIdentify.nameColumnIndex : 2
  );
  const [tempServantIdentifyMode, setTempServantIdentifyMode] = useState(settings.servantIdentify.mode);
  const [tempTurnCountColumnIndex, setTempTurnCountColumnIndex] = useState(
    settings.turnCount.mode === 'import' ? settings.turnCount.columnIndex : 1
  );
  const [tempNoteColumnIndex, setTempNoteColumnIndex] = useState(settings.noteColumnIndex);
  const [tempTurnCountMode, setTempTurnCountMode] = useState(settings.turnCount.mode);
  const [tempFixedTurnCount, setTempFixedTurnCount] = useState<number | null>(
    settings.turnCount.mode === 'fixed' ? settings.turnCount.fixedCount : null
  );
  const [tempQuestNameMode, setTempQuestNameMode] = useState(settings.questName.mode);
  const [tempQuestNameColumnIndex, setTempQuestNameColumnIndex] = useState(
    settings.questName.mode === 'import' ? settings.questName.columnIndex : 0
  );
  const [tempFixedQuestName, setTempFixedQuestName] = useState<string | null>(
    settings.questName.mode === 'fixed' ? settings.questName.fixedName : null
  );
  const [errors, setErrors] = useState<{
    url?: string;
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
  }>({});

  const handleConvertUrl = () => {
    if (!tempUrl.trim()) {
      setErrors((prev) => ({ ...prev, url: '入力してください' }));
      return;
    }

    const parsed = parseSpreadsheetUrl(tempUrl);
    if (!parsed.urlType || !parsed.spreadsheetId) {
      setErrors((prev) => ({ ...prev, url: '形式が正しくありません' }));
      return;
    }

    setTempUrlType(parsed.urlType);
    setTempSpreadsheetId(parsed.spreadsheetId);
    setTempSheetGid(parsed.sheetGid);
    setErrors((prev) => ({
      ...prev,
      url: undefined,
      urlType: undefined,
      spreadsheetId: undefined,
      sheetGid: undefined
    }));
  };

  const handleDecide = () => {
    // 全てのバリデーションを実行してエラーをまとめる
    const newErrors: {
      urlType?: string;
      validation?: string;
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
    if (!tempUrlType) {
      newErrors.urlType = '選択してください';
    }

    // スプレッドシートIDの抽出とバリデーション
    const extractedId = tempSpreadsheetId ? extractSpreadsheetId(tempSpreadsheetId) : null;
    if (!!extractedId) {
      const idValidation = validateSpreadsheetId(extractedId);
      if (extractedId && !idValidation.isValid) {
        newErrors.validation = idValidation.error || '値が不正です';
      }
    }

    // URLからGIDを抽出（GIDが未入力の場合のみ）
    let finalGid = tempSheetGid;
    if (!tempSheetGid && tempSpreadsheetId) {
      const extractedGid = extractGidFromUrl(tempSpreadsheetId);
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
    const columnValidation = validateColumnIndex(tempColumnIndex);
    if (!columnValidation.isValid) {
      newErrors.columnIndex = columnValidation.error || undefined;
    }

    if (tempNoteColumnIndex !== null) {
      const noteValidation = validateColumnIndex(tempNoteColumnIndex);
      if (!noteValidation.isValid) {
        newErrors.noteColumn = noteValidation.error || undefined;
      }
    }

    // サーヴァント識別方法に応じたバリデーション
    if (tempServantIdentifyMode === 'collectionNo') {
      const servantCollectionNoValidation = validateColumnIndex(tempServantIdColumnIndex);
      if (!servantCollectionNoValidation.isValid) {
        newErrors.servantIdColumn = servantCollectionNoValidation.error || undefined;
      }
    } else {
      const servantNameValidation = validateColumnIndex(tempServantNameColumnIndex);
      if (!servantNameValidation.isValid) {
        newErrors.servantNameColumn = servantNameValidation.error || undefined;
      }
    }

    // ターン数のバリデーション
    if (tempTurnCountMode === 'import') {
      const turnCountValidation = validateColumnIndex(tempTurnCountColumnIndex);
      if (!turnCountValidation.isValid) {
        newErrors.turnCountColumn = turnCountValidation.error || '選択してください';
      }
    } else {
      if (tempFixedTurnCount !== null && tempFixedTurnCount < 0) {
        newErrors.fixedTurnCount = '0以上の数値を入力してください';
      }
    }

    // クエスト名のバリデーション
    if (tempQuestNameMode === 'import') {
      const qValidation = validateColumnIndex(tempQuestNameColumnIndex);
      if (!qValidation.isValid) {
        newErrors.questNameColumn = qValidation.error || '選択してください';
      }
    } else {
      if ((tempFixedQuestName?.length ?? 0) > 20) {
        newErrors.fixedQuestName = '20文字以下で入力してください';
      }
    }

    // エラーがある場合はエラーをセットして終了
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // バリデーション成功 - エラーをクリアして設定を保存
    setErrors({});
    setSettings({
      urlType: tempUrlType,
      spreadsheetId: extractedId,
      sheetGid: finalGid,
      urlColumnIndex: tempColumnIndex,
      servantIdentify:
        tempServantIdentifyMode === 'collectionNo'
          ? { mode: 'collectionNo', collectionNoColumnIndex: tempServantIdColumnIndex }
          : { mode: 'name', nameColumnIndex: tempServantNameColumnIndex },
      noteColumnIndex: tempNoteColumnIndex,
      questName:
        tempQuestNameMode === 'import'
          ? { mode: 'import', columnIndex: tempQuestNameColumnIndex }
          : { mode: 'fixed', fixedName: tempFixedQuestName || null },
      turnCount:
        tempTurnCountMode === 'import'
          ? { mode: 'import', columnIndex: tempTurnCountColumnIndex }
          : { mode: 'fixed', fixedCount: tempFixedTurnCount }
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>データソース設定</DialogTitle>
      <DialogContent sx={{ paddingTop: '8px' }}>
        <DialogContentText sx={{ marginBottom: '16px' }}>
          Googleスプレッドシートは「ウェブへの公開」または「リンクを知っている全員に共有」で全体公開したものを指定してください。
        </DialogContentText>
        <UrlInputRow>
          <TextField
            label="スプレッドシートURL"
            value={tempUrl}
            onChange={(e) => {
              setTempUrl(e.target.value);
              setErrors((prev) => ({ ...prev, url: undefined }));
            }}
            variant="outlined"
            size="small"
            error={!!errors.url}
            helperText={errors.url}
            sx={{ flex: 1 }}
          />
          <Button variant="outlined" onClick={handleConvertUrl} sx={{ height: 40, minWidth: 80 }}>
            抽出
          </Button>
        </UrlInputRow>
        <SpreadsheetInfoBox>
          <FormControl variant="outlined" size="small" fullWidth error={!!errors.urlType} sx={{ marginBottom: '12px' }}>
            <InputLabel>タイプ</InputLabel>
            <Select
              value={tempUrlType ?? ''}
              label="タイプ"
              onChange={(e) => {
                setTempUrlType(e.target.value as 'public' | 'shared');
                setErrors((prev) => ({ ...prev, urlType: undefined }));
              }}
            >
              <MenuItem value="public">ウェブへの公開</MenuItem>
              <MenuItem value="shared">リンク共有</MenuItem>
            </Select>
            {errors.urlType && <ErrorText>{errors.urlType}</ErrorText>}
          </FormControl>
          <TextField
            label="スプレッドシートID"
            value={tempSpreadsheetId}
            onChange={(e) => {
              setTempSpreadsheetId(e.target.value);
              setErrors((prev) => ({ ...prev, spreadsheetId: undefined }));
            }}
            fullWidth
            variant="outlined"
            size="small"
            error={!!errors.spreadsheetId}
            helperText={errors.spreadsheetId}
            sx={{ marginBottom: '12px' }}
          />
          <TextField
            label="シートGID (オプション)"
            value={tempSheetGid ?? ''}
            onChange={(e) => {
              setTempSheetGid(e.target.value || null);
              setErrors((prev) => ({ ...prev, sheetGid: undefined }));
            }}
            fullWidth
            variant="outlined"
            size="small"
            placeholder="0"
            error={!!errors.sheetGid}
            helperText={errors.sheetGid}
          />
        </SpreadsheetInfoBox>
        <FormRow>
          <Half>
            <StyledFormControl variant="outlined">
              <InputLabel>クエスト名取得方法</InputLabel>
              <Select
                size="small"
                value={tempQuestNameMode}
                label="クエスト名取得方法"
                onChange={(e) => {
                  const mode = e.target.value as 'import' | 'fixed';
                  setTempQuestNameMode(mode);
                  setErrors((prev) => ({ ...prev, questNameColumn: undefined, fixedQuestName: undefined }));
                }}
              >
                <MenuItem value="import">シート参照</MenuItem>
                <MenuItem value="fixed">固定値</MenuItem>
              </Select>
            </StyledFormControl>
          </Half>

          <Half>
            {tempQuestNameMode === 'import' && (
              <StyledFormControl variant="outlined" error={!!errors.questNameColumn}>
                <InputLabel>列名</InputLabel>
                <Select
                  size="small"
                  value={tempQuestNameColumnIndex}
                  label="列名"
                  onChange={(e) => {
                    setTempQuestNameColumnIndex(Number(e.target.value));
                    setErrors((prev) => ({ ...prev, questNameColumn: undefined }));
                  }}
                >
                  {columnOptions.map((col, idx) => (
                    <MenuItem key={col} value={idx}>
                      {col}列
                    </MenuItem>
                  ))}
                </Select>
                {errors.questNameColumn && <ErrorText>{errors.questNameColumn}</ErrorText>}
              </StyledFormControl>
            )}
            {tempQuestNameMode === 'fixed' && (
              <TextField
                label="クエスト名（オプション）"
                value={tempFixedQuestName ?? ''}
                onChange={(e) => {
                  setTempFixedQuestName(e.target.value === '' ? null : e.target.value);
                  setErrors((prev) => ({ ...prev, fixedQuestName: undefined }));
                }}
                size="small"
                error={!!errors.fixedQuestName}
                helperText={errors.fixedQuestName}
                sx={{ width: '100%', marginBottom: '16px' }}
              />
            )}
          </Half>
        </FormRow>
        <FormRow>
          <Half>
            <StyledFormControl variant="outlined">
              <InputLabel>ターン数取得方法</InputLabel>
              <Select
                size="small"
                value={tempTurnCountMode}
                label="ターン数取得方法"
                onChange={(e) => {
                  const mode = e.target.value as 'import' | 'fixed';
                  setTempTurnCountMode(mode);
                  setErrors((prev) => ({ ...prev, turnCountColumn: undefined, fixedTurnCount: undefined }));
                }}
              >
                <MenuItem value="import">シート参照</MenuItem>
                <MenuItem value="fixed">固定値</MenuItem>
              </Select>
            </StyledFormControl>
          </Half>

          <Half>
            {tempTurnCountMode === 'import' && (
              <StyledFormControl variant="outlined" error={!!errors.turnCountColumn}>
                <InputLabel>列名</InputLabel>
                <Select
                  size="small"
                  value={tempTurnCountColumnIndex}
                  label="列名"
                  onChange={(e) => {
                    setTempTurnCountColumnIndex(Number(e.target.value));
                    setErrors((prev) => ({ ...prev, turnCountColumn: undefined }));
                  }}
                >
                  {columnOptions.map((col, idx) => (
                    <MenuItem key={col} value={idx}>
                      {col}列
                    </MenuItem>
                  ))}
                </Select>
                {errors.turnCountColumn && <ErrorText>{errors.turnCountColumn}</ErrorText>}
              </StyledFormControl>
            )}
            {tempTurnCountMode === 'fixed' && (
              <TextField
                label="ターン数（オプション）"
                type="number"
                value={tempFixedTurnCount ?? ''}
                onChange={(e) => {
                  setTempFixedTurnCount(!!e.target.value ? Number(e.target.value) : null);
                  setErrors((prev) => ({ ...prev, fixedTurnCount: undefined }));
                }}
                size="small"
                error={!!errors.fixedTurnCount}
                helperText={errors.fixedTurnCount}
                sx={{ width: '100%', marginBottom: '16px' }}
              />
            )}
          </Half>
        </FormRow>
        <FormRow>
          <Half>
            <StyledFormControl variant="outlined">
              <InputLabel>サーヴァント識別方法</InputLabel>
              <Select
                size="small"
                value={tempServantIdentifyMode}
                label="サーヴァント識別方法"
                onChange={(e) => {
                  const mode = e.target.value as 'collectionNo' | 'name';
                  setTempServantIdentifyMode(mode);
                  setErrors((prev) => ({ ...prev, servantIdColumn: undefined }));
                }}
              >
                <MenuItem value="collectionNo">マテリアルNo.</MenuItem>
                <MenuItem value="name">名前</MenuItem>
              </Select>
            </StyledFormControl>
          </Half>
          <Half>
            {tempServantIdentifyMode === 'collectionNo' ? (
              <StyledFormControl variant="outlined" error={!!errors.servantIdColumn}>
                <InputLabel>列名</InputLabel>
                <Select
                  size="small"
                  value={tempServantIdColumnIndex}
                  label="列名"
                  onChange={(e) => {
                    setTempServantIdColumnIndex(Number(e.target.value));
                    setErrors((prev) => ({ ...prev, servantIdColumn: undefined }));
                  }}
                >
                  {columnOptions.map((col, idx) => (
                    <MenuItem key={col} value={idx}>
                      {col}列
                    </MenuItem>
                  ))}
                </Select>
                {errors.servantIdColumn && <ErrorText>{errors.servantIdColumn}</ErrorText>}
              </StyledFormControl>
            ) : (
              <StyledFormControl variant="outlined" error={!!errors.servantNameColumn}>
                <InputLabel>列名</InputLabel>
                <Select
                  size="small"
                  value={tempServantNameColumnIndex}
                  label="列名"
                  onChange={(e) => {
                    setTempServantNameColumnIndex(Number(e.target.value));
                    setErrors((prev) => ({ ...prev, servantNameColumn: undefined }));
                  }}
                >
                  {columnOptions.map((col, idx) => (
                    <MenuItem key={col} value={idx}>
                      {col}列
                    </MenuItem>
                  ))}
                </Select>
                {errors.servantNameColumn && <ErrorText>{errors.servantNameColumn}</ErrorText>}
              </StyledFormControl>
            )}
          </Half>
        </FormRow>
        <StyledFormControl variant="outlined" error={!!errors.columnIndex}>
          <InputLabel>動画(X/YouTube/Bilibili)URLの列名</InputLabel>
          <Select
            size="small"
            value={tempColumnIndex}
            label="動画(X/YouTube/Bilibili)URLの列名"
            onChange={(e) => {
              setTempColumnIndex(Number(e.target.value));
              setErrors((prev) => ({ ...prev, columnIndex: undefined }));
            }}
          >
            {columnOptions.map((col, idx) => (
              <MenuItem key={col} value={idx}>
                {col}列
              </MenuItem>
            ))}
          </Select>
          <FormHelperText>動画URLがないか、形式が異なる行は無視されます</FormHelperText>
          {errors.columnIndex && <ErrorText>{errors.columnIndex}</ErrorText>}
        </StyledFormControl>
        <StyledFormControl variant="outlined" error={!!errors.noteColumn}>
          <InputLabel>補足の列名（オプション）</InputLabel>
          <Select
            size="small"
            value={tempNoteColumnIndex ?? ''}
            label="補足の列名（オプション）"
            onChange={(e) => {
              setTempNoteColumnIndex(e.target.value || e.target.value === 0 ? Number(e.target.value) : null);
              setErrors((prev) => ({ ...prev, noteColumn: undefined }));
            }}
          >
            <MenuItem value={''}>なし</MenuItem>
            {columnOptions.map((col, idx) => (
              <MenuItem key={col} value={idx}>
                {col}列
              </MenuItem>
            ))}
          </Select>
          {errors.noteColumn && <ErrorText>{errors.noteColumn}</ErrorText>}
        </StyledFormControl>
      </DialogContent>
      <DialogActions sx={{ padding: '4px 16px 12px 16px' }}>
        <Button onClick={onClose} sx={{ color: '#666' }}>
          キャンセル
        </Button>
        <Button variant="contained" onClick={handleDecide} sx={{ minWidth: '80px' }}>
          決定
        </Button>
      </DialogActions>
    </Dialog>
  );
}

import { TextField, Select, MenuItem, FormControl, InputLabel, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useAtom, useSetAtom } from 'jotai';
import {
  tempUrlAtom,
  tempUrlTypeAtom,
  tempSpreadsheetIdAtom,
  tempSheetGidAtom,
  tempUrlErrorAtom,
  tempUrlTypeErrorAtom,
  tempSpreadsheetIdErrorAtom,
  tempSheetGidErrorAtom
} from '../../jotai/tempSettings';
import { parseSpreadsheetUrl } from '../../utils/spreadsheetValidator';

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

const ErrorText = styled('div')(({ theme }) => ({
  color: theme.palette.error.main,
  fontSize: '0.75rem',
  marginTop: 4,
  marginLeft: 14
}));

// URL入力フィールド
function UrlInputField() {
  const [tempUrl, setTempUrl] = useAtom(tempUrlAtom);
  const [error, setError] = useAtom(tempUrlErrorAtom);

  return (
    <TextField
      label="スプレッドシートURL"
      value={tempUrl}
      onChange={(e) => {
        setTempUrl(e.target.value);
        setError(undefined);
      }}
      variant="outlined"
      size="small"
      error={!!error}
      helperText={error}
      sx={{ flex: 1 }}
    />
  );
}

// URL抽出ボタン
function UrlConvertButton() {
  const [tempUrl] = useAtom(tempUrlAtom);
  const setTempUrlType = useSetAtom(tempUrlTypeAtom);
  const setTempSpreadsheetId = useSetAtom(tempSpreadsheetIdAtom);
  const setTempSheetGid = useSetAtom(tempSheetGidAtom);
  const [, setUrlError] = useAtom(tempUrlErrorAtom);
  const [, setUrlTypeError] = useAtom(tempUrlTypeErrorAtom);
  const [, setSpreadsheetIdError] = useAtom(tempSpreadsheetIdErrorAtom);
  const [, setSheetGidError] = useAtom(tempSheetGidErrorAtom);

  const handleConvertUrl = () => {
    if (!tempUrl.trim()) {
      setUrlError('入力してください');
      return;
    }

    const parsed = parseSpreadsheetUrl(tempUrl);
    if (!parsed.urlType || !parsed.spreadsheetId) {
      setUrlError('形式が正しくありません');
      return;
    }

    setTempUrlType(parsed.urlType);
    setTempSpreadsheetId(parsed.spreadsheetId);
    setTempSheetGid(parsed.sheetGid);
    setUrlError(undefined);
    setUrlTypeError(undefined);
    setSpreadsheetIdError(undefined);
    setSheetGidError(undefined);
  };

  return (
    <Button variant="outlined" onClick={handleConvertUrl} sx={{ height: 40, minWidth: 80 }}>
      抽出
    </Button>
  );
}

// URLタイプ選択
function UrlTypeSelect() {
  const [tempUrlType, setTempUrlType] = useAtom(tempUrlTypeAtom);
  const [error, setError] = useAtom(tempUrlTypeErrorAtom);

  return (
    <FormControl variant="outlined" size="small" fullWidth error={!!error} sx={{ marginBottom: '12px' }}>
      <InputLabel>タイプ</InputLabel>
      <Select
        value={tempUrlType ?? ''}
        label="タイプ"
        onChange={(e) => {
          setTempUrlType(e.target.value as 'public' | 'shared');
          setError(undefined);
        }}
      >
        <MenuItem value="public">ウェブへの公開</MenuItem>
        <MenuItem value="shared">リンク共有</MenuItem>
      </Select>
      {error && <ErrorText>{error}</ErrorText>}
    </FormControl>
  );
}

// スプレッドシートID入力
function SpreadsheetIdField() {
  const [tempSpreadsheetId, setTempSpreadsheetId] = useAtom(tempSpreadsheetIdAtom);
  const [error, setError] = useAtom(tempSpreadsheetIdErrorAtom);

  return (
    <TextField
      label="スプレッドシートID"
      value={tempSpreadsheetId}
      onChange={(e) => {
        setTempSpreadsheetId(e.target.value);
        setError(undefined);
      }}
      fullWidth
      variant="outlined"
      size="small"
      error={!!error}
      helperText={error}
      sx={{ marginBottom: '12px' }}
    />
  );
}

// シートGID入力
function SheetGidField() {
  const [tempSheetGid, setTempSheetGid] = useAtom(tempSheetGidAtom);
  const [error, setError] = useAtom(tempSheetGidErrorAtom);

  return (
    <TextField
      label="シートGID (オプション)"
      value={tempSheetGid ?? ''}
      onChange={(e) => {
        setTempSheetGid(e.target.value || null);
        setError(undefined);
      }}
      fullWidth
      variant="outlined"
      size="small"
      placeholder="0"
      error={!!error}
      helperText={error}
    />
  );
}

// スプレッドシートID系エリア全体
export function SpreadsheetIdArea() {
  return (
    <>
      <UrlInputRow>
        <UrlInputField />
        <UrlConvertButton />
      </UrlInputRow>
      <SpreadsheetInfoBox>
        <UrlTypeSelect />
        <SpreadsheetIdField />
        <SheetGidField />
      </SpreadsheetInfoBox>
    </>
  );
}

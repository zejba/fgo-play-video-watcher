import { TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useAtom, useSetAtom } from 'jotai';
import {
  tempQuestNameModeAtom,
  tempQuestNameColumnIndexAtom,
  tempFixedQuestNameAtom,
  tempQuestNameColumnErrorAtom,
  tempFixedQuestNameErrorAtom
} from '../../jotai/tempSettings';
import { columnOptions } from '../../utils/columnOptions';
import { FormRow } from './FormRow';

const Half = styled('div')(({ theme }) => ({
  display: 'flex',
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

// クエスト名取得方法選択
function QuestNameModeSelect() {
  const [tempQuestNameMode, setTempQuestNameMode] = useAtom(tempQuestNameModeAtom);
  const setQuestNameColumnError = useSetAtom(tempQuestNameColumnErrorAtom);
  const setFixedQuestNameError = useSetAtom(tempFixedQuestNameErrorAtom);

  return (
    <StyledFormControl variant="outlined">
      <InputLabel>クエスト名取得方法</InputLabel>
      <Select
        size="small"
        value={tempQuestNameMode}
        label="クエスト名取得方法"
        onChange={(e) => {
          const mode = e.target.value as 'import' | 'fixed';
          setTempQuestNameMode(mode);
          setQuestNameColumnError(undefined);
          setFixedQuestNameError(undefined);
        }}
      >
        <MenuItem value="import">シート参照</MenuItem>
        <MenuItem value="fixed">固定値</MenuItem>
      </Select>
    </StyledFormControl>
  );
}

// クエスト名列選択
function QuestNameColumnSelect() {
  const [tempQuestNameColumnIndex, setTempQuestNameColumnIndex] = useAtom(tempQuestNameColumnIndexAtom);
  const [error, setError] = useAtom(tempQuestNameColumnErrorAtom);

  return (
    <StyledFormControl variant="outlined" error={!!error}>
      <InputLabel>列名</InputLabel>
      <Select
        size="small"
        value={tempQuestNameColumnIndex}
        label="列名"
        onChange={(e) => {
          setTempQuestNameColumnIndex(Number(e.target.value));
          setError(undefined);
        }}
      >
        {columnOptions.map((col) => (
          <MenuItem key={col.value} value={col.value}>
            {col.label}
          </MenuItem>
        ))}
      </Select>
      {error && <ErrorText>{error}</ErrorText>}
    </StyledFormControl>
  );
}

// 固定クエスト名入力
function FixedQuestNameField() {
  const [tempFixedQuestName, setTempFixedQuestName] = useAtom(tempFixedQuestNameAtom);
  const [error, setError] = useAtom(tempFixedQuestNameErrorAtom);

  return (
    <TextField
      label="クエスト名（オプション）"
      value={tempFixedQuestName ?? ''}
      onChange={(e) => {
        setTempFixedQuestName(e.target.value === '' ? null : e.target.value);
        setError(undefined);
      }}
      size="small"
      error={!!error}
      helperText={error}
      sx={{ width: '100%', marginBottom: '16px' }}
    />
  );
}

// クエスト名エリア全体
export function QuestNameArea() {
  const [tempQuestNameMode] = useAtom(tempQuestNameModeAtom);

  return (
    <FormRow>
      <Half>
        <QuestNameModeSelect />
      </Half>
      <Half>{tempQuestNameMode === 'import' ? <QuestNameColumnSelect /> : <FixedQuestNameField />}</Half>
    </FormRow>
  );
}

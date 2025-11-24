import { TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useAtom } from 'jotai';
import {
  tempTurnCountModeAtom,
  tempTurnCountColumnIndexAtom,
  tempFixedTurnCountAtom,
  tempTurnCountColumnErrorAtom,
  tempFixedTurnCountErrorAtom
} from '../../jotai/tempSettings';

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

// ターン数取得方法選択
function TurnCountModeSelect() {
  const [tempTurnCountMode, setTempTurnCountMode] = useAtom(tempTurnCountModeAtom);
  const [, setTurnCountColumnError] = useAtom(tempTurnCountColumnErrorAtom);
  const [, setFixedTurnCountError] = useAtom(tempFixedTurnCountErrorAtom);

  return (
    <StyledFormControl variant="outlined">
      <InputLabel>ターン数取得方法</InputLabel>
      <Select
        size="small"
        value={tempTurnCountMode}
        label="ターン数取得方法"
        onChange={(e) => {
          const mode = e.target.value as 'import' | 'fixed';
          setTempTurnCountMode(mode);
          setTurnCountColumnError(undefined);
          setFixedTurnCountError(undefined);
        }}
      >
        <MenuItem value="import">シート参照</MenuItem>
        <MenuItem value="fixed">固定値</MenuItem>
      </Select>
    </StyledFormControl>
  );
}

// ターン数列選択
function TurnCountColumnSelect() {
  const [tempTurnCountColumnIndex, setTempTurnCountColumnIndex] = useAtom(tempTurnCountColumnIndexAtom);
  const [error, setError] = useAtom(tempTurnCountColumnErrorAtom);

  return (
    <StyledFormControl variant="outlined" error={!!error}>
      <InputLabel>列名</InputLabel>
      <Select
        size="small"
        value={tempTurnCountColumnIndex}
        label="列名"
        onChange={(e) => {
          setTempTurnCountColumnIndex(Number(e.target.value));
          setError(undefined);
        }}
      >
        {columnOptions.map((col, idx) => (
          <MenuItem key={col} value={idx}>
            {col}列
          </MenuItem>
        ))}
      </Select>
      {error && <ErrorText>{error}</ErrorText>}
    </StyledFormControl>
  );
}

// 固定ターン数入力
function FixedTurnCountField() {
  const [tempFixedTurnCount, setTempFixedTurnCount] = useAtom(tempFixedTurnCountAtom);
  const [error, setError] = useAtom(tempFixedTurnCountErrorAtom);

  return (
    <TextField
      label="ターン数（オプション）"
      type="number"
      value={tempFixedTurnCount ?? ''}
      onChange={(e) => {
        setTempFixedTurnCount(!!e.target.value ? Number(e.target.value) : null);
        setError(undefined);
      }}
      size="small"
      error={!!error}
      helperText={error}
      sx={{ width: '100%', marginBottom: '16px' }}
    />
  );
}

// ターン数エリア全体
export function TurnCountArea() {
  const [tempTurnCountMode] = useAtom(tempTurnCountModeAtom);

  return (
    <FormRow>
      <Half>
        <TurnCountModeSelect />
      </Half>
      <Half>{tempTurnCountMode === 'import' ? <TurnCountColumnSelect /> : <FixedTurnCountField />}</Half>
    </FormRow>
  );
}

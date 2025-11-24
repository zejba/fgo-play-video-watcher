import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useAtom } from 'jotai';
import {
  tempServantIdentifyModeAtom,
  tempServantIdColumnIndexAtom,
  tempServantNameColumnIndexAtom,
  tempServantIdColumnErrorAtom,
  tempServantNameColumnErrorAtom
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

// サーヴァント識別方法選択
function ServantIdentifyModeSelect() {
  const [tempServantIdentifyMode, setTempServantIdentifyMode] = useAtom(tempServantIdentifyModeAtom);
  const [, setServantIdColumnError] = useAtom(tempServantIdColumnErrorAtom);
  const [, setServantNameColumnError] = useAtom(tempServantNameColumnErrorAtom);

  return (
    <StyledFormControl variant="outlined">
      <InputLabel>サーヴァント識別方法</InputLabel>
      <Select
        size="small"
        value={tempServantIdentifyMode}
        label="サーヴァント識別方法"
        onChange={(e) => {
          const mode = e.target.value as 'collectionNo' | 'name';
          setTempServantIdentifyMode(mode);
          setServantIdColumnError(undefined);
          setServantNameColumnError(undefined);
        }}
      >
        <MenuItem value="collectionNo">マテリアルNo.</MenuItem>
        <MenuItem value="name">名前</MenuItem>
      </Select>
    </StyledFormControl>
  );
}

// サーヴァントID列選択
function ServantIdColumnSelect() {
  const [tempServantIdColumnIndex, setTempServantIdColumnIndex] = useAtom(tempServantIdColumnIndexAtom);
  const [error, setError] = useAtom(tempServantIdColumnErrorAtom);

  return (
    <StyledFormControl variant="outlined" error={!!error}>
      <InputLabel>列名</InputLabel>
      <Select
        size="small"
        value={tempServantIdColumnIndex}
        label="列名"
        onChange={(e) => {
          setTempServantIdColumnIndex(Number(e.target.value));
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

// サーヴァント名列選択
function ServantNameColumnSelect() {
  const [tempServantNameColumnIndex, setTempServantNameColumnIndex] = useAtom(tempServantNameColumnIndexAtom);
  const [error, setError] = useAtom(tempServantNameColumnErrorAtom);

  return (
    <StyledFormControl variant="outlined" error={!!error}>
      <InputLabel>列名</InputLabel>
      <Select
        size="small"
        value={tempServantNameColumnIndex}
        label="列名"
        onChange={(e) => {
          setTempServantNameColumnIndex(Number(e.target.value));
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

// サーヴァントエリア全体
export function ServantArea() {
  const [tempServantIdentifyMode] = useAtom(tempServantIdentifyModeAtom);

  return (
    <FormRow>
      <Half>
        <ServantIdentifyModeSelect />
      </Half>
      <Half>
        {tempServantIdentifyMode === 'collectionNo' ? <ServantIdColumnSelect /> : <ServantNameColumnSelect />}
      </Half>
    </FormRow>
  );
}

import { Select, MenuItem, FormControl, InputLabel, FormHelperText } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useAtom } from 'jotai';
import { tempColumnIndexAtom, tempColumnIndexErrorAtom } from '../../jotai/tempSettings';

const columnOptions = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N'] as const;

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

// 動画URL列選択
export function VideoUrlArea() {
  const [tempColumnIndex, setTempColumnIndex] = useAtom(tempColumnIndexAtom);
  const [error, setError] = useAtom(tempColumnIndexErrorAtom);

  return (
    <StyledFormControl variant="outlined" error={!!error}>
      <InputLabel>動画(X/YouTube/Bilibili)URLの列名</InputLabel>
      <Select
        size="small"
        value={tempColumnIndex}
        label="動画(X/YouTube/Bilibili)URLの列名"
        onChange={(e) => {
          setTempColumnIndex(Number(e.target.value));
          setError(undefined);
        }}
      >
        {columnOptions.map((col, idx) => (
          <MenuItem key={col} value={idx}>
            {col}列
          </MenuItem>
        ))}
      </Select>
      <FormHelperText>動画URLがないか、形式が異なる行は無視されます</FormHelperText>
      {error && <ErrorText>{error}</ErrorText>}
    </StyledFormControl>
  );
}

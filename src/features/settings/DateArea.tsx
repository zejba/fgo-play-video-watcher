import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useAtom } from 'jotai';
import { tempDateColumnIndexAtom, tempDateColumnIndexErrorAtom } from '../../jotai/tempSettings';

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

// 達成日列選択
export function DateArea() {
  const [tempDateColumnIndex, setTempDateColumnIndex] = useAtom(tempDateColumnIndexAtom);
  const [error, setError] = useAtom(tempDateColumnIndexErrorAtom);

  return (
    <StyledFormControl variant="outlined" error={!!error}>
      <InputLabel>達成日の列名</InputLabel>
      <Select
        size="small"
        value={tempDateColumnIndex === null ? 'none' : tempDateColumnIndex}
        label="達成日の列名"
        onChange={(e) => {
          const value = e.target.value;
          if (value === 'none') {
            setTempDateColumnIndex(null);
          } else {
            setTempDateColumnIndex(Number(value));
          }
          setError(undefined);
        }}
      >
        <MenuItem value="none">なし</MenuItem>
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

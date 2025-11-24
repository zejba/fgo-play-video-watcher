import { FormControl, InputLabel } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useAtom } from 'jotai';
import { tempNoteColumnIndicesAtom, tempNoteColumnErrorAtom } from '../../jotai/tempSettings';
import { MultiSelectFilter } from '../../components/MultiSelectFilter';

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

// 補足列選択
export function NoteArea() {
  const [tempNoteColumnIndices, setTempNoteColumnIndices] = useAtom(tempNoteColumnIndicesAtom);
  const [error, setError] = useAtom(tempNoteColumnErrorAtom);

  return (
    <StyledFormControl variant="outlined" error={!!error} size="small">
      <InputLabel>補足の列名（複数可）</InputLabel>
      <MultiSelectFilter
        label="補足の列名（複数可）"
        options={columnOptions.map((col, idx) => ({ value: idx.toString(), label: `${col}列` }))}
        selectedValues={tempNoteColumnIndices.map(String)}
        onChange={(values) => {
          setTempNoteColumnIndices(values.map(Number));
          setError(undefined);
        }}
      />
      {error && <ErrorText>{error}</ErrorText>}
    </StyledFormControl>
  );
}

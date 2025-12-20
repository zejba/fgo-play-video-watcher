import { TextField, Autocomplete } from '@mui/material';
import { useAtom, useAtomValue } from 'jotai';
import { questNameFilterAtom } from '../jotai/filter';
import { questNameOptionsAtom } from '../jotai/result';
import { truncate } from '../utils/truncate';

export function QuestNameFilter() {
  const [questNameFilter, setQuestNameFilter] = useAtom(questNameFilterAtom);
  const options = useAtomValue(questNameOptionsAtom);

  return (
    <Autocomplete
      options={options}
      freeSolo
      getOptionLabel={(option) => option}
      isOptionEqualToValue={(option, value) => option === value}
      value={questNameFilter}
      onChange={(_, newValue) => setQuestNameFilter(newValue ?? '')}
      renderOption={(props, option) => (
        <li {...props} title={option}>
          {truncate(option)}
        </li>
      )}
      renderInput={(params) => <TextField {...params} label="クエスト" size="small" fullWidth />}
    />
  );
}

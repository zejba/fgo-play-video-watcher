import { TextField, Autocomplete } from '@mui/material';
import { useAtom, useAtomValue } from 'jotai';
import { questNameFilterAtom } from '../jotai/filter';
import { sourceSettingsAtom } from '../jotai/sourceSettings';
import { csvRowsAtom } from '../jotai/result';
import { useMemo } from 'react';
import { truncate } from '../utils/truncate';

export function QuestNameFilter() {
  const [questNameFilter, setQuestNameFilter] = useAtom(questNameFilterAtom);
  const settings = useAtomValue(sourceSettingsAtom);
  const { data: csvRows } = useAtomValue(csvRowsAtom);

  const options = useMemo(() => {
    if (!csvRows) return [] as string[];
    const set = new Set<string>();
    csvRows.forEach((row) => {
      const q = row[settings.questNameColumnIndex];
      if (q) set.add(q);
    });
    return Array.from(set).sort();
  }, [csvRows, settings.questNameColumnIndex]);

  return (
    <Autocomplete
      options={options}
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

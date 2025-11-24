import { TextField, Autocomplete } from '@mui/material';
import { useAtom, useAtomValue } from 'jotai';
import { questNameFilterAtom } from '../jotai/filter';
import { sourceSettingsAtom } from '../jotai/sourceSettings';
import { csvRowsAtom } from '../jotai/result';
import { useMemo } from 'react';
import { truncate } from '../utils/truncate';

export function QuestNameFilter() {
  const [questNameFilter, setQuestNameFilter] = useAtom(questNameFilterAtom);
  const questName = useAtomValue(sourceSettingsAtom).mapping.questName;
  const { data: csvRows } = useAtomValue(csvRowsAtom);

  const options: string[] = useMemo(() => {
    if (!csvRows) return [];
    if (questName.mode !== 'import') {
      return [];
    }
    const set = new Set<string>();
    csvRows.forEach((row) => {
      const q = row[questName.col];
      if (q) set.add(q);
    });
    return Array.from(set).sort();
  }, [csvRows, questName]);
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

import { TextField } from '@mui/material';
import { useAtom } from 'jotai';
import { noteFilterAtom } from '../jotai/filter';

export function NoteFilter() {
  const [noteFilter, setNoteFilter] = useAtom(noteFilterAtom);

  return (
    <TextField
      label="補足文"
      value={noteFilter}
      onChange={(e) => setNoteFilter(e.target.value)}
      fullWidth
      placeholder="部分一致で検索"
      size="small"
    />
  );
}

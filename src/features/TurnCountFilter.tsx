import { TextField } from '@mui/material';
import { useAtom } from 'jotai';
import { minTurnCountAtom, maxTurnCountAtom } from '../jotai/filter';

export function TurnCountFilter() {
  const [minTurnCount, setMinTurnCount] = useAtom(minTurnCountAtom);
  const [maxTurnCount, setMaxTurnCount] = useAtom(maxTurnCountAtom);

  return (
    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
      <TextField
        label="最小ターン数"
        type="number"
        value={minTurnCount ?? ''}
        onChange={(e) => setMinTurnCount(e.target.value ? parseInt(e.target.value, 10) : null)}
        fullWidth
        size="small"
      />
      <span style={{ flexShrink: 0 }}>〜</span>
      <TextField
        label="最大ターン数"
        type="number"
        value={maxTurnCount ?? ''}
        onChange={(e) => setMaxTurnCount(e.target.value ? parseInt(e.target.value, 10) : null)}
        fullWidth
        size="small"
      />
    </div>
  );
}

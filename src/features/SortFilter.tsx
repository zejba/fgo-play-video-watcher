import { styled, FormControl, Select, MenuItem } from '@mui/material';
import { useAtom, useAtomValue } from 'jotai';
import { useMemo } from 'react';
import { selectedSortOptionAtom, sortOrderAtom, type SortOption, type SortOrder } from '../jotai/sort';
import { sourceSettingsAtom } from '../jotai/sourceSettings';

const Container = styled('div')(() => ({
  maxWidth: '1000px',
  margin: '0 auto',
  padding: '12px',
  display: 'flex',
  gap: '12px'
}));

export function SortFilter() {
  const [selectedSort, setSelectedSort] = useAtom(selectedSortOptionAtom);
  const [sortOrder, setSortOrder] = useAtom(sortOrderAtom);
  const settings = useAtomValue(sourceSettingsAtom);

  const handleSortChange = (event: { target: { value: string } }) => {
    setSelectedSort(event.target.value as SortOption);
  };

  const handleOrderChange = (event: { target: { value: string } }) => {
    setSortOrder(event.target.value as SortOrder);
  };

  // 表示するソートオプションを動的に決定
  const sortOptions = useMemo(() => {
    const hasDate = settings.mapping.dateCol !== null;
    const hasQuestName = settings.mapping.questName.mode === 'import';
    const hasTurnCount = settings.mapping.turn.mode === 'import';
    const isCollectionNoMode = settings.mapping.servantIdentify.mode === 'collectionNo';
    const isNameMode = settings.mapping.servantIdentify.mode === 'name';

    return [
      { value: 'default' as const, label: '元データ順' },
      hasDate && { value: 'date' as const, label: '達成日順' },
      hasQuestName && { value: 'questName' as const, label: 'クエスト名順' },
      hasTurnCount && { value: 'turnCount' as const, label: 'ターン数順' },
      isCollectionNoMode && { value: 'collectionNo' as const, label: 'マテリアルNo.順' },
      isCollectionNoMode && { value: 'class' as const, label: 'クラス順' },
      isCollectionNoMode && { value: 'rarity' as const, label: 'レアリティ順' },
      isNameMode && { value: 'servantName' as const, label: 'サーヴァント名順' }
    ].filter((option): option is { value: SortOption; label: string } => option !== false);
  }, [
    settings.mapping.dateCol,
    settings.mapping.questName.mode,
    settings.mapping.turn.mode,
    settings.mapping.servantIdentify.mode
  ]);

  return (
    <Container>
      <FormControl size="small" style={{ minWidth: 180 }}>
        <Select value={selectedSort} onChange={handleSortChange}>
          {sortOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl size="small" style={{ minWidth: 80 }}>
        <Select value={sortOrder} onChange={handleOrderChange}>
          <MenuItem value="asc">昇順</MenuItem>
          <MenuItem value="desc">降順</MenuItem>
        </Select>
      </FormControl>
    </Container>
  );
}

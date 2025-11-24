import { useState } from 'react';
import { styled, IconButton } from '@mui/material';
import { useAtomValue } from 'jotai';
import { ServantNameFilter } from './ServantNameFilter';
import { QuestNameFilter } from './QuestNameFilter';
import { ClassFilter } from './ClassFilter';
import { RarityFilter } from './RarityFilter';
import { TurnCountFilter } from './TurnCountFilter';
import { sourceSettingsAtom } from '../jotai/sourceSettings';
import { NoteFilter } from './NoteFilter';
import { isFilteredAtom } from '../jotai/filter';
import { ExpandMore, FilterAlt } from '@mui/icons-material';

const Container = styled('div')(() => ({
  maxWidth: '1000px',
  margin: '0 auto 20px',
  backgroundColor: '#f5f5f5',
  borderRadius: '8px',
  border: '1px solid #e0e0e0'
}));

const Header = styled('div')(() => ({
  display: 'flex',
  alignItems: 'center',
  padding: '8px 16px'
}));

const Title = styled('h2')(() => ({
  margin: '0px auto 0px 4px',
  fontSize: '16px',
  fontWeight: 600,
  color: '#333'
}));

const ToggleIcon = styled(ExpandMore)<{ isOpen: boolean }>(({ isOpen }) => ({
  transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
  transition: 'transform 0.2s ease'
}));

const Content = styled('div')<{ isOpen: boolean }>(({ isOpen }) => ({
  display: isOpen ? 'block' : 'none',
  padding: '0 16px 16px'
}));

const FilterGrid = styled('div')(() => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '12px'
}));

const ClassRarityRow = styled('div')(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
  gap: '12px',
  [theme.breakpoints.down('md')]: {
    gridTemplateColumns: '1fr'
  }
}));

function FilteredIcon() {
  const isFiltered = useAtomValue(isFilteredAtom);
  return <FilterAlt color={isFiltered ? 'primary' : 'disabled'} fontSize="small" style={{ marginTop: '2px' }} />;
}

export function FilterArea() {
  const [isOpen, setIsOpen] = useState(true);
  const settings = useAtomValue(sourceSettingsAtom);

  return (
    <Container>
      <Header>
        <FilteredIcon />
        <Title>絞り込み</Title>
        <IconButton size="small" onClick={() => setIsOpen(!isOpen)}>
          <ToggleIcon isOpen={isOpen} />
        </IconButton>
      </Header>
      <Content isOpen={isOpen}>
        <FilterGrid>
          {settings.mapping.questName.mode === 'import' && <QuestNameFilter />}
          {settings.mapping.turn.mode === 'import' && <TurnCountFilter />}
          <ServantNameFilter />
          {settings.mapping.servantIdentify.mode === 'collectionNo' && (
            <ClassRarityRow>
              <ClassFilter />
              <RarityFilter />
            </ClassRarityRow>
          )}
          <NoteFilter />
        </FilterGrid>
      </Content>
    </Container>
  );
}

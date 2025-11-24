import { styled } from '@mui/material';
import { useAtomValue } from 'jotai';
import { sourceSettingsAtom } from '../jotai/sourceSettings';

const Container = styled('div')(() => ({
  maxWidth: '1000px',
  margin: '0 auto 16px',
  backgroundColor: '#fff',
  border: '1px solid #e0e0e0',
  borderRadius: '8px',
  display: 'flex',
  gap: '12px',
  alignItems: 'center',
  justifyContent: 'flex-start'
}));

const Text = styled('div')(() => ({
  padding: '12px 16px',
  fontSize: '18px',
  fontWeight: 700,
  color: '#333'
}));

export function BasicInfoArea() {
  const settings = useAtomValue(sourceSettingsAtom);

  const questName = settings.mapping.questName.mode === 'fixed' ? settings.mapping.questName.name : null;
  const turnCount = settings.mapping.turn.mode === 'fixed' ? settings.mapping.turn.count : null;

  if (questName === null && turnCount === null) {
    return null;
  }

  return (
    <Container>
      <Text>
        {questName ? `${questName} ` : ''}
        {turnCount ? `${turnCount}T` : ''}
      </Text>
    </Container>
  );
}

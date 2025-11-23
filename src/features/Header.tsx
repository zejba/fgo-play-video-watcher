import { useState } from 'react';
import { IconButton, styled } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import { SettingsModal } from './SettingsModal';

const Container = styled('div')(() => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '12px',
  marginBottom: '24px',
  backgroundColor: '#fff',
  borderBottom: '1px solid #e0e0e0',
  boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
}));

const Title = styled('h1')(() => ({
  margin: 0,
  fontSize: '24px',
  fontWeight: 700,
  letterSpacing: '0.5px'
}));

const SettingsButton = styled(IconButton)(() => ({
  color: '#666',
  '&:hover': {
    color: '#1976d2',
    backgroundColor: 'rgba(25, 118, 210, 0.08)'
  }
}));

export function Header() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <Container>
        <Title>FGO Play Video Watcher</Title>
        <SettingsButton onClick={() => setModalOpen(true)} size="large">
          <SettingsIcon />
        </SettingsButton>
      </Container>
      {modalOpen && <SettingsModal open={modalOpen} onClose={() => setModalOpen(false)} />}
    </>
  );
}

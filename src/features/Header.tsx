import { useCallback, useState } from 'react';
import { IconButton, styled } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import { SettingsModal } from './SettingsModal';
import { convertSourceSettingsToTemp, tempErrorsAtom, tempSettingsAtom } from '../jotai/tempSettings';
import { useAtomValue, useSetAtom } from 'jotai';
import { sourceSettingsAtom } from '../jotai/sourceSettings';
import { csvRowsAtom } from '../jotai/result';
import { Cached } from '@mui/icons-material';

const Container = styled('div')(() => ({
  display: 'flex',
  alignItems: 'center',
  padding: '12px',
  marginBottom: '24px',
  backgroundColor: '#fff',
  borderBottom: '1px solid #e0e0e0',
  boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
}));

const Title = styled('h1')(({ theme }) => ({
  margin: 0,
  fontSize: '24px',
  fontWeight: 700,
  letterSpacing: '0.5px',
  [theme.breakpoints.down('sm')]: {
    fontSize: '20px'
  }
}));

const StyledIconButton = styled(IconButton)(() => ({
  color: '#666',
  '&:hover': {
    color: '#1976d2',
    backgroundColor: 'rgba(25, 118, 210, 0.08)'
  }
}));

export function Header() {
  const [modalOpen, setModalOpen] = useState(false);

  const setTempSettings = useSetAtom(tempSettingsAtom);
  const sourceSettings = useAtomValue(sourceSettingsAtom);
  const setTempErrors = useSetAtom(tempErrorsAtom);

  const handleOpen = useCallback(() => {
    setTempSettings(convertSourceSettingsToTemp(sourceSettings));
    setTempErrors({});
    setModalOpen(true);
  }, [setTempSettings, sourceSettings, setTempErrors]);

  const { refetch, isRefetching, isEnabled } = useAtomValue(csvRowsAtom);

  return (
    <>
      <Container>
        <Title>FGO Play Video Watcher</Title>
        <StyledIconButton
          onClick={() => void refetch()}
          title="データソースを更新"
          loading={isRefetching}
          disabled={!isEnabled}
          style={{ marginLeft: 'auto' }}
        >
          <Cached />
        </StyledIconButton>
        <StyledIconButton onClick={handleOpen} title="設定モーダルを開く">
          <SettingsIcon />
        </StyledIconButton>
      </Container>
      <SettingsModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}

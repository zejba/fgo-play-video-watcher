import { useState } from 'react';
import { Dialog, Button, DialogTitle, DialogContent, DialogActions, IconButton, Box } from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { SpreadsheetIdArea } from './settings/SpreadsheetIdArea';
import { QuestNameArea } from './settings/QuestNameArea';
import { TurnCountArea } from './settings/TurnCountArea';
import { ServantArea } from './settings/ServantArea';
import { VideoUrlArea } from './settings/VideoUrlArea';
import { DateArea } from './settings/DateArea';
import { NoteArea } from './settings/NoteArea';
import { SubmitButton } from './settings/SubmitButton';
import { UsageModal } from './UsageModal';

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
}

export function SettingsModal({ open, onClose }: SettingsModalProps) {
  const [usageModalOpen, setUsageModalOpen] = useState(false);

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <span>データソース設定</span>
            <IconButton
              onClick={() => setUsageModalOpen(true)}
              size="small"
              sx={{ color: 'primary.main', marginLeft: '2px' }}
              aria-label="使い方を表示"
              title="使い方を表示"
            >
              <HelpOutlineIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <SpreadsheetIdArea />
          <QuestNameArea />
          <TurnCountArea />
          <ServantArea />
          <VideoUrlArea />
          <DateArea />
          <NoteArea />
        </DialogContent>
        <DialogActions sx={{ padding: '4px 16px 12px 16px' }}>
          <Button onClick={onClose} sx={{ color: '#666' }}>
            キャンセル
          </Button>
          <SubmitButton onSuccess={onClose} />
        </DialogActions>
      </Dialog>

      <UsageModal open={usageModalOpen} onClose={() => setUsageModalOpen(false)} />
    </>
  );
}

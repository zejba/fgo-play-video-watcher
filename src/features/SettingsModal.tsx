import { Dialog, Button, DialogTitle, DialogContent, DialogActions, DialogContentText } from '@mui/material';
import { SpreadsheetIdArea } from './settings/SpreadsheetIdArea';
import { QuestNameArea } from './settings/QuestNameArea';
import { TurnCountArea } from './settings/TurnCountArea';
import { ServantArea } from './settings/ServantArea';
import { VideoUrlArea } from './settings/VideoUrlArea';
import { NoteArea } from './settings/NoteArea';
import { SubmitButton } from './settings/SubmitButton';

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
}

export function SettingsModal({ open, onClose }: SettingsModalProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>データソース設定</DialogTitle>
      <DialogContent sx={{ paddingTop: '8px' }}>
        <DialogContentText sx={{ marginBottom: '16px' }}>
          Googleスプレッドシートは「ウェブへの公開」または「リンクを知っている全員に共有」で全体公開したものを指定してください。
        </DialogContentText>
        <SpreadsheetIdArea />
        <QuestNameArea />
        <TurnCountArea />
        <ServantArea />
        <VideoUrlArea />
        <NoteArea />
      </DialogContent>
      <DialogActions sx={{ padding: '4px 16px 12px 16px' }}>
        <Button onClick={onClose} sx={{ color: '#666' }}>
          キャンセル
        </Button>
        <SubmitButton onSuccess={onClose} />
      </DialogActions>
    </Dialog>
  );
}

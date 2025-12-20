import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box } from '@mui/material';

interface UsageModalProps {
  open: boolean;
  onClose: () => void;
}

export function UsageModal({ open, onClose }: UsageModalProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>使い方</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, paddingTop: 1 }}>
          <Box>
            <Typography variant="h6" gutterBottom>
              0. スプレッドシートの公開設定
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              スプレッドシートのデータで読み取るためには、以下のいずれかの方法でスプレッドシートを公開する必要があります。
            </Typography>
            <Typography component="span" variant="caption" color="warning.main" sx={{ mb: 1 }}>
              注意:
              公開されたデータは誰でもアクセス可能になり、設定によってはGoogleアカウントの名前やメールアドレスが表示される可能性があります。
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1, mt: 2 }}>
              方法1: ウェブに公開（推奨）
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ ml: 2, mb: 1 }}>
              1. 「ファイル」{'>'}「共有」{'>'}「ウェブに公開」を選択
              <br />
              2. 「公開」をクリックして確定
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1, mt: 2 }}>
              方法2: リンクを知っている全員に共有
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
              1. 右上の「共有」ボタンをクリック
              <br />
              2. 「一般的なアクセス」を「リンクを知っている全員」に変更
            </Typography>
          </Box>

          <Box>
            <Typography variant="h6" gutterBottom>
              1. スプレッドシートIDの設定
            </Typography>
            <Typography variant="body2" color="text.secondary">
              スプレッドシートIDなどのシート情報は、URLから抽出して設定するか、手動で入力してください。
            </Typography>
          </Box>
          <Box>
            <Typography variant="h6" gutterBottom>
              2. クエスト名の設定
            </Typography>
            <Typography variant="body2" color="text.secondary">
              クエスト名は共通にするか、各行から取得するかを選択できます。
              <br />
              各行から取得する場合は、対応する列を選択してください。
            </Typography>
          </Box>

          <Box>
            <Typography variant="h6" gutterBottom>
              3. ターン数の設定
            </Typography>
            <Typography variant="body2" color="text.secondary">
              ターン数は共通にするか、各行から取得するかを選択できます。
              <br />
              各行から取得する場合は、対応する列を選択してください。
            </Typography>
          </Box>

          <Box>
            <Typography variant="h6" gutterBottom>
              4. サーヴァント識別方法の設定
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <br />
              サーヴァントはマテリアルNo.で識別するか、値をそのまま名前として表示するかを選択できます。
              <br />
              マテリアルNo.で識別すると、クラスやレアリティなどの表示・絞り込みが可能になります。
              <br />
              選択した識別方法に対応する列を右側で指定してください。
            </Typography>
          </Box>

          <Box>
            <Typography variant="h6" gutterBottom>
              5. 動画URLの設定
            </Typography>
            <Typography variant="body2" color="text.secondary">
              動画URLは各行から取得します。 対応する列を選択してください。
              <br />
              動画はX/YouTube/Bilibiliに対応しています。
              <br />
              いずれかの形式に合致しない文字列が入力されている場合、その行は無視されます。
            </Typography>
          </Box>

          <Box>
            <Typography variant="h6" gutterBottom>
              6. 備考の設定
            </Typography>
            <Typography variant="body2" color="text.secondary">
              備考は複数列を結合して設定できます。 対応する列をすべて選択してください。
            </Typography>
          </Box>

          <Box>
            <Typography variant="h6" gutterBottom>
              7. 達成日の設定
            </Typography>
            <Typography variant="body2" color="text.secondary">
              達成日は各行から取得します。 対応する列を選択してください。
              <br />
              達成日を設定することで、時系列での絞り込みやソートが可能になります。
              <br />
              形式: YYYY-MM-DD（例: 2025-12-20）またはYYYY/MM/DD（例: 2025/12/20）
            </Typography>
          </Box>

          <Box>
            <Typography variant="h6" gutterBottom>
              8. 共有
            </Typography>
            <Typography variant="body2" color="text.secondary">
              データソースの設定はURLのパラメータで管理しているため、設定を変更した後にURLを共有することで、同じ設定を他のユーザーと共有できます。
            </Typography>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ padding: '8px 24px 16px 24px' }}>
        <Button onClick={onClose} variant="contained">
          閉じる
        </Button>
      </DialogActions>
    </Dialog>
  );
}

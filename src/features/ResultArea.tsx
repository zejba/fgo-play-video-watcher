import { useAtomValue } from 'jotai';
import { styled, Pagination, useMediaQuery, useTheme, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { csvRowsAtom, allDataAtom, filteredDataAtom } from '../jotai/result';
import { ResultContainer } from './ResultContainer';
import { useState, useMemo, useEffect } from 'react';

const Container = styled('div')(() => ({
  maxWidth: '1000px',
  margin: '0 auto'
}));

const PaginationContainer = styled('div')(() => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '20px',
  padding: '0 0 20px 0px',
  flexWrap: 'wrap'
}));

const MessageContainer = styled('div')(() => ({
  maxWidth: '1000px',
  margin: '0 auto',
  padding: '40px 20px',
  textAlign: 'center',
  fontSize: '16px',
  color: '#666'
}));

const ErrorMessage = styled('div')(() => ({
  color: '#d32f2f',
  fontSize: '16px',
  fontWeight: 600
}));

export function ResultArea() {
  const { isEnabled, isPending, isError } = useAtomValue(csvRowsAtom);
  const allData = useAtomValue(allDataAtom);
  const filteredData = useAtomValue(filteredDataAtom);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const totalPages = useMemo(() => Math.ceil(filteredData.length / itemsPerPage), [filteredData.length, itemsPerPage]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredData.slice(startIndex, endIndex);
  }, [filteredData, currentPage, itemsPerPage]);

  // フィルタ条件が変わったらページを1にリセット
  useEffect(() => {
    setCurrentPage(1);
  }, [filteredData.length]);

  const handlePageChange = (_event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0 });
  };

  const handleItemsPerPageChange = (event: { target: { value: number } }) => {
    setItemsPerPage(event.target.value);
    setCurrentPage(1);
  };

  // スプレッドシートIDが未設定の場合の表示
  if (!isEnabled) {
    return <MessageContainer>スプレッドシートIDを設定してください</MessageContainer>;
  }

  // エラー状態の表示
  if (isError) {
    return (
      <MessageContainer>
        <ErrorMessage>データの取得に失敗しました</ErrorMessage>
        <div style={{ marginTop: '8px', fontSize: '14px' }}>
          スプレッドシートIDが正しいか、公開設定がされているか確認してください
        </div>
      </MessageContainer>
    );
  }

  // 読み込み中の表示
  if (isPending) {
    return <MessageContainer>データを取得中...</MessageContainer>;
  }

  // データが空の場合の表示
  if (allData.length === 0) {
    return (
      <MessageContainer>
        スプレッドシートにデータが見つかりませんでした
        <div style={{ marginTop: '8px', fontSize: '14px' }}>指定した列にデータが存在するか確認してください</div>
      </MessageContainer>
    );
  }

  // フィルタ適用後にデータが空の場合
  if (filteredData.length === 0) {
    return <MessageContainer>絞り込み条件に一致するデータが見つかりませんでした</MessageContainer>;
  }

  return (
    <Container>
      {totalPages > 1 && (
        <PaginationContainer>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            size={isSmallScreen ? 'small' : 'large'}
            siblingCount={isSmallScreen ? 0 : 1}
            boundaryCount={1}
          />
          <FormControl size="small">
            <InputLabel id="items-per-page-label">表示件数</InputLabel>
            <Select
              labelId="items-per-page-label"
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
              label="表示件数"
              sx={{ minWidth: 100 }}
            >
              <MenuItem value={10}>10件</MenuItem>
              <MenuItem value={20}>20件</MenuItem>
              <MenuItem value={50}>50件</MenuItem>
            </Select>
          </FormControl>
        </PaginationContainer>
      )}
      <ResultContainer data={paginatedData} />
      {filteredData.length > 0 && (
        <PaginationContainer>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            size={isSmallScreen ? 'small' : 'large'}
            siblingCount={isSmallScreen ? 0 : 1}
            boundaryCount={1}
          />
          <FormControl size="small">
            <InputLabel id="items-per-page-label-bottom">表示件数</InputLabel>
            <Select
              labelId="items-per-page-label-bottom"
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
              label="表示件数"
              sx={{ minWidth: 100 }}
            >
              <MenuItem value={10}>10件</MenuItem>
              <MenuItem value={20}>20件</MenuItem>
              <MenuItem value={50}>50件</MenuItem>
            </Select>
          </FormControl>
        </PaginationContainer>
      )}
    </Container>
  );
}

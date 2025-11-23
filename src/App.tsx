import { QueryClientProvider } from '@tanstack/react-query';
import { Routes, Route, HashRouter } from 'react-router-dom';
import { TopPage } from './features/TopPage';
import { QueryClient } from '@tanstack/react-query';

const queryClient = new QueryClient();

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <HashRouter>
        <Routes>
          <Route path="/" element={<TopPage />} />
        </Routes>
      </HashRouter>
    </QueryClientProvider>
  );
}

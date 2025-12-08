import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import EditionsListPage from './features/editions/EditionsListPage';
import EditionFormPage from './features/editions/EditionFormPage';
import EditionDetailsPage from './features/editions/EditionDetailsPage';

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/editions" replace />} />
          <Route path="/editions" element={<EditionsListPage />} />
          <Route path="/editions/new" element={<EditionFormPage />} />
          <Route path="/editions/:id" element={<EditionDetailsPage />} />
          <Route path="/editions/:id/edit" element={<EditionFormPage />} />
          {/* по аналогии добавить recipients/subscriptions */}
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

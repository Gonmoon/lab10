import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/common/Layout';
import LoadingSpinner from './components/common/LoadingSpinner';

// Ленивая загрузка страниц
const HomePage = React.lazy(() => import('./pages/HomePage'));
const EditionsPage = React.lazy(() => import('./pages/EditionsPage'));
const RecipientsPage = React.lazy(() => import('./pages/RecipientsPage'));
const SubscriptionsPage = React.lazy(() => import('./pages/SubscriptionsPage'));

const App: React.FC = () => {
  return (
    <Layout>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/editions/*" element={<EditionsPage />} />
          <Route path="/recipients/*" element={<RecipientsPage />} />
          <Route path="/subscriptions/*" element={<SubscriptionsPage />} />
        </Routes>
      </Suspense>
    </Layout>
  );
};

export default App;
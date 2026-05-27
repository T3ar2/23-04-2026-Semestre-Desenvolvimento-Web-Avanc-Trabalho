import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { Layout } from './ui/Layout';
import { RequireAuth } from './routes/RequireAuth';
import { AlunoPage } from './pages/AlunoPage';

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
          <Route path="/aluno" element={
            <RequireAuth>
              <AlunoPage />
            </RequireAuth>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
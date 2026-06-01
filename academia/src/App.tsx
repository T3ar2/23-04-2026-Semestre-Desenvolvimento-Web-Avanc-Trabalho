import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { Layout } from "./ui/Layout";
import { RequireAuth } from "./routes/RequireAuth";
import { AdicionarAlunoPage } from "./pages/alunoPage/AdicionarAlunoPage";
import { ListaAlunosPage } from "./pages/alunoPage/ListaAlunosPage";
import { AtualizarAlunoPage } from "./pages/alunoPage/AtualizarAlunoPage";
import { AdicionarExercicioPage } from "./pages/exercicioPage/AdicionarExercicioPage";
import { AtualizarExercicioPage } from "./pages/exercicioPage/AtualizarExercicioPage";
import { ListaExerciciosPage } from "./pages/exercicioPage/ListaExerciciosPage";

import { AdicionarPlanoTreinoPage } from './pages/planosTreinoPage/AdicionarPlanoTreinoPage';

import { ListaRegistrosTreinoPage } from './pages/registroTreinoPage/ListaRegistrosTreinoPage';
import { AdicionarRegistroTreinoPage } from './pages/registroTreinoPage/AdicionarRegistroTreinoPage';
import { AtualizarRegistroTreinoPage } from './pages/registroTreinoPage/AtualizarRegistroTreinoPage';

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/adiciona-aluno"
          element={
            <RequireAuth>
              <AdicionarAlunoPage />
            </RequireAuth>
          }
        />
        <Route path="/lista-alunos" element={
          <RequireAuth>
            <ListaAlunosPage />
          </RequireAuth>
        } />

        <Route path="/atualizar-aluno/:id" element={
          <RequireAuth>
            <AtualizarAlunoPage />
          </RequireAuth>
        } />

        <Route
          path="/adiciona-exercicio"
          element={
            <RequireAuth>
              <AdicionarExercicioPage />
            </RequireAuth>
          }
        />
        <Route path="/lista-exercicios" element={
          <RequireAuth>
            <ListaExerciciosPage />
          </RequireAuth>
        } />

        <Route path="/atualizar-exercicio/:id" element={
          <RequireAuth>
            <AtualizarExercicioPage />
          </RequireAuth>
        } />

        <Route path="*" element={<Navigate to="/" replace />} />

        <Route path="/plano-treino" element={
          <RequireAuth>
            <PlanoTreinoPage />
          </RequireAuth>
        }
        />

        <Route path="/registro-treino" element={
          <RequireAuth>
            <ListaRegistrosTreinoPage />
          </RequireAuth>
        } />
        <Route path="/registro-treino/novo" element={
          <RequireAuth>
            <AdicionarRegistroTreinoPage />
          </RequireAuth>
        } />
        <Route path="/registro-treino/editar/:id" element={
          <RequireAuth>
            <AtualizarRegistroTreinoPage />
          </RequireAuth>
        } />
      </Route>
    </Routes>
  );
}

export default App;

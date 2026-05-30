import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { Layout } from "./ui/Layout";
import { RequireAuth } from "./routes/RequireAuth";
import { AdicionarAlunoPage } from "./pages/alunoPage/AdicionarAlunoPage";
import { ListaAlunosPage } from "./pages/alunoPage/ListaAlunosPage";
import { AtualizarAlunoPage } from "./pages/alunoPage/AtualizarAlunoPage";

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
          }/>

           <Route path="/atualizar-aluno/:id" element={
            <RequireAuth>
              <AtualizarAlunoPage />
            </RequireAuth>
          }/>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;

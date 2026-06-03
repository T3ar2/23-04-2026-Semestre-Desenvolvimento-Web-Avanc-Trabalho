import React from 'react';

export function HomePage() {
  const baseUrl =
    process.env.REACT_APP_API_BASE_URL ?? 'https://localhost:5001';

  return (
    <div className="page">

      <div className="card">
      <h2 className="page-title">Home</h2>
        <p>
          <strong>URL da API:</strong>{' '}
          <code>{baseUrl}</code>
        </p>

        <p className="muted">
          Bem vindo! Cadastre-se ou faça login para acessar as funcionalidades de gerenciamento de alunos, exercícios, planos de treino e registros de treino.
        </p>
      </div>
    </div>
  );
}
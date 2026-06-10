import React, { useEffect, useMemo, useState } from "react";
import { AlunoDto } from "../../api/types";
import {
  listarAlunos,
  removerAluno,
} from "../../api/aluno";
import "../../css/ListaAlunos.css";
import { useNavigate } from "react-router-dom";

export function ListaAlunosPage() {
  const [aluno, setAluno] = useState<AlunoDto[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const sortedAluno = useMemo(
    () => [...aluno].sort((a, b) => a.nome.localeCompare(b.nome)),
    [aluno],
  );

  async function refresh() {
    setError(null);
    setLoading(true);
    try {
      const [alun] = await Promise.all([listarAlunos()]);
      setAluno(alun);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ??
          err?.message ??
          "Falha ao carregar dados.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void refresh();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
  }

  return (
    <div className="hero">
      <div className="panel">
        <div className="panel-header">
          <h1 className="panel-title">Gerenciar <strong>Alunos</strong></h1>
          <p className="panel-subtitle">Acesso total aos perfis, histórico e informações de contato dos alunos</p>
          <button className="panel-close" title="Fechar" onClick={() => navigate('/')}>✕</button>
        </div>

        <div className="panel-body">
          {error && <div className="form-error">{error}</div>}
          {loading && <div className="loading">Carregando...</div>}

          <button className="btn-new" onClick={() => navigate('/adiciona-aluno')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="16" />
              <line x1="8" y1="12" x2="16" y2="12" />
            </svg>
            Cadastrar novo aluno
          </button>

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Nome</th>
                  <th>CPF</th>
                  <th>E-mail</th>
                  <th>Data de Nascimento</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {sortedAluno.map((p) => (
                  <tr key={p.id}>
                    <td>{p.id}</td>
                    <td>{p.nome}</td>
                    <td>{p.cpf}</td>
                    <td>{p.email}</td>
                    <td>
                      {p.nascimento && !Number.isNaN(new Date(p.nascimento).getTime())
                        ? new Date(p.nascimento).toLocaleDateString("pt-BR")
                        : "-"}
                    </td>
                    <td>
                      <button 
                        className="action-btn" 
                        title="Editar"
                        onClick={() => navigate(`/atualizar-aluno/${p.id}`)}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </button>
                      <button 
                        className="action-btn delete" 
                        title="Excluir"
                        onClick={async () => {
                          if (!window.confirm(`Remover aluno "${p.nome}"?`)) return;
                          try {
                            await removerAluno(p.id);
                            await refresh();
                          } catch (err: any) {
                            setError(
                              err?.response?.data?.message ??
                                err?.message ??
                                "Falha ao remover aluno."
                            );
                          }
                        }}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                          <path d="M10 11v6M14 11v6" />
                          <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
                {!loading && sortedAluno.length === 0 && (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '20px' }}>Nenhum aluno encontrado.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
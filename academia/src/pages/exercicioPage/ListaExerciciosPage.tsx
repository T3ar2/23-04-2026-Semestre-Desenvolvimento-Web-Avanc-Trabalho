import React, { useEffect, useMemo, useState } from "react";
import { ExercicioDto } from "../../api/types";
import "../../css/ListaExercicio.css";
import { useNavigate } from "react-router-dom";
import { listarExercicios, removerExercicio } from "../../api/exercicio";

export function ListaExerciciosPage() {
  const [exercicios, setExercicios] = useState<ExercicioDto[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const sortedExercicio = useMemo(
    () => [...exercicios].sort((a, b) => a.nome.localeCompare(b.nome)),
    [exercicios],
  );

  async function refresh() {
    setError(null);
    setLoading(true);
    try {
      const [exercicios] = await Promise.all([listarExercicios()]);
      setExercicios(exercicios);
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

  return (
    <div className="hero">
      <div className="panel">
        <div className="panel-header">
          <h1 className="panel-title">Biblioteca de <strong>Exercícios</strong></h1>
          <p className="panel-subtitle">Mantenha um catálogo completo de exercícios com detalhes técnicos e vídeos</p>
          <button className="panel-close" title="Fechar" onClick={() => navigate(-1)}>✕</button>
        </div>

        <div className="panel-body">
          {error && <div className="form-error">{error}</div>}
          {loading && <div className="loading">Carregando...</div>}

          <button className="btn-new" onClick={() => navigate('/adiciona-exercicio')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="16" />
              <line x1="8" y1="12" x2="16" y2="12" />
            </svg>
            Cadastrar novo exercício
          </button>

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Nome</th>
                  <th>Grupo Muscular</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {sortedExercicio.map((p) => (
                  <tr key={p.id}>
                    <td>{p.id}</td>
                    <td>{p.nome}</td>
                    <td>{p.grupoMuscular}</td>
                    <td>
                      <button 
                        className="action-btn" 
                        title="Editar"
                        onClick={() => navigate(`/atualizar-exercicio/${p.id}`)}
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
                          if (!window.confirm(`Remover exercício "${p.nome}"?`)) return;
                          try {
                            await removerExercicio(p.id);
                            await refresh();
                          } catch (err: any) {
                            setError(
                              err?.response?.data?.message ??
                                err?.message ??
                                "Falha ao remover exercício."
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
                {!loading && sortedExercicio.length === 0 && (
                  <tr>
                    <td colSpan={4} style={{ textAlign: 'center', padding: '20px' }}>Nenhum exercício encontrado.</td>
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
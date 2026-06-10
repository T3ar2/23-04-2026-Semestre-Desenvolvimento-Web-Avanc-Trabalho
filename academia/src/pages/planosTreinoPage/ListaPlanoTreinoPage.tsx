import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { listarPlanosTreino, removerPlanoTreino } from "../../api/planoTreino";
import { listarAlunos } from "../../api/aluno";
import { PlanoTreinoDto, AlunoDto } from "../../api/types";
import "../../css/ListaPlanosTreino.css";

export function ListaPlanosTreinoPage() {
  const navigate = useNavigate();
  const [planos, setPlanos] = useState<PlanoTreinoDto[]>([]);
  const [alunos, setAlunos] = useState<AlunoDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  function toggleExpand(id: number) {
    setExpandedId(expandedId === id ? null : id);
  }

  async function carregarDados() {
    setLoading(true);
    setError(null);
    try {
      const [listaPlanos, listaAlunos] = await Promise.all([
        listarPlanosTreino(),
        listarAlunos(),
      ]);
      setPlanos(listaPlanos);
      setAlunos(listaAlunos);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ??
          err?.message ??
          "Falha ao carregar dados",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void carregarDados();
  }, []);

  async function handleRemover(id: number, nome: string) {
    if (!window.confirm(`Remover plano "${nome}"?`)) return;
    try {
      await removerPlanoTreino(id);
      await carregarDados();
    } catch (err: any) {
      setError(
        err?.response?.data?.message ?? err?.message ?? "Falha ao remover",
      );
    }
  }

  return (
    <div className="page-body">
      <div className="card">
        <div className="card-header">
          <div className="card-header-left">
            <button type="button" className="btn-back" title="Voltar" onClick={() => navigate(-1)}>
              <svg viewBox="0 0 24 24"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" /></svg>
            </button>
            <span className="card-title"><strong>Planos</strong> de treino</span>
          </div>
          <span className="card-subtitle">Crie, edite e personalize as rotinas semanais de treino</span>
          <button type="button" className="btn-close" title="Fechar" onClick={() => navigate('/')}>✕</button>
        </div>

        <div className="card-body">
          <button className="btn-new" onClick={() => navigate("/plano-treino/novo")}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="16" />
              <line x1="8" y1="12" x2="16" y2="12" />
            </svg>
            Criar novo plano
          </button>

          {error && <div className="form-error">{error}</div>}
          {loading && <div className="loading">Carregando...</div>}

          <div className="table-wrapper">
            <div className="table-head">
              <span></span>
              <span>#</span>
              <span>Nome do Plano</span>
              <span>Aluno</span>
              <span>Detalhes</span>
              <span>Ações</span>
            </div>

            <div className="table-body">
              {planos.map((p) => {
                const alunoVinculado = alunos.find((a) => a.id === p.alunoId);
                const isExpanded = expandedId === p.id;

                return (
                  <React.Fragment key={p.id}>
                    <div className="table-row">
                      <div>
                        <button className={`btn-toggle ${isExpanded ? 'open' : ''}`} onClick={() => toggleExpand(p.id)} title="Ver detalhes">
                          <svg viewBox="0 0 24 24"><path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/></svg>
                        </button>
                      </div>
                      <div className="cell-num">{p.id}</div>
                      <div className="cell-text"><strong>{p.nomeTreino}</strong></div>
                      <div className="cell-text">{alunoVinculado?.nome ?? `ID: ${p.alunoId}`}</div>
                      <div className="cell-text">{p.exerciciosPlanejados?.length || 0} exercícios</div>
                      <div className="cell-actions">
                        <button className="btn-action" title="Editar" onClick={() => navigate(`/plano-treino/editar/${p.id}`)}>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                        </button>
                        <button className="btn-action delete" title="Excluir" onClick={() => handleRemover(p.id, p.nomeTreino)}>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" /></svg>
                        </button>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="detail-panel">
                        <div className="detail-title">Exercícios desse treino</div>
                        {p.exerciciosPlanejados?.length === 0 ? (
                          <div className="detail-item">Nenhum exercício cadastrado.</div>
                        ) : (
                          p.exerciciosPlanejados?.map((ep, i) => (
                            <div key={i} className="detail-item">
                              • {ep.nomeExercicio} - {ep.series} séries x {ep.repeticoes} repetições
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
              {!loading && planos.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '20px', color: 'var(--navy)' }}>Nenhum plano encontrado.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

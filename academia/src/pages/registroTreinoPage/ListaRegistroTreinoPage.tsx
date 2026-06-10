import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { listarRegistrosTreino, removerRegistroTreino } from "../../api/registroTreino";
import { listarAlunos } from "../../api/aluno";
import { RegistroTreinoResponseDto, AlunoDto } from "../../api/types";
import "../../css/ListaRegistroTreino.css";

export function ListaRegistrosTreinoPage() {
  const navigate = useNavigate();
  const [registros, setRegistros] = useState<RegistroTreinoResponseDto[]>([]);
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
      const [listaRegistros, listaAlunos] = await Promise.all([
        listarRegistrosTreino(),
        listarAlunos(),
      ]);
      setRegistros(listaRegistros);
      setAlunos(listaAlunos);
    } catch (err: any) {
      setError(err?.response?.data?.message ?? err?.message ?? "Falha ao carregar dados.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void carregarDados();
  }, []);

  async function handleRemover(id: number) {
    if (!window.confirm("Remover registro de treino?")) return;
    try {
      await removerRegistroTreino(id);
      await carregarDados();
    } catch (err: any) {
      setError(err?.response?.data?.message ?? err?.message ?? "Falha ao remover.");
    }
  }

  return (
    <div className="page-body">
      <div className="card">
        <div className="card-header">
          <div className="card-header-left">
            <button type="button" className="btn-back" title="Voltar" onClick={() => navigate('/')}>
              <svg viewBox="0 0 24 24"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" /></svg>
            </button>
            <span className="card-title"><strong>Histórico</strong> de treinos</span>
          </div>
          <span className="card-subtitle">Visualize o desempenho e a frequência dos alunos</span>
          <button type="button" className="btn-close" title="Fechar" onClick={() => navigate('/')}>✕</button>
        </div>

        <div className="list-body">
          <button className="btn-new" onClick={() => navigate("/registro-treino/novo")}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="16" />
              <line x1="8" y1="12" x2="16" y2="12" />
            </svg>
            Registrar treino
          </button>

          {error && <div className="form-error">{error}</div>}
          {loading && <div className="loading">Carregando...</div>}

          <div className="table-wrapper">
            <div className="table-head">
              <span></span>
              <span>#</span>
              <span>Aluno</span>
              <span>Plano de Treino</span>
              <span>Data e Hora</span>
              <span>Ações</span>
            </div>

            <div className="table-body">
              {registros.map((r) => {
                const alunoVinculado = alunos.find((a) => a.id === r.alunoId);
                const isExpanded = expandedId === r.id;
                const dataFormatada = new Date(r.dataExecucao).toLocaleString("pt-BR", { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });

                return (
                  <React.Fragment key={r.id}>
                    <div className="table-row">
                      <div>
                        <button className={`btn-toggle ${isExpanded ? 'open' : ''}`} onClick={() => toggleExpand(r.id)} title="Ver detalhes">
                          <svg viewBox="0 0 24 24"><path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/></svg>
                        </button>
                      </div>
                      <div className="cell-num">{r.id}</div>
                      <div className="cell-text"><strong>{alunoVinculado?.nome ?? r.alunoId}</strong></div>
                      <div className="cell-text">{r.planoTreinoId ? `Plano #${r.planoTreinoId}` : "Avulso"}</div>
                      <div className="cell-text">{dataFormatada}</div>
                      <div className="cell-actions">
                        <button className="btn-action" title="Editar" onClick={() => navigate(`/registro-treino/editar/${r.id}`)}>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                        </button>
                        <button className="btn-action delete" title="Excluir" onClick={() => handleRemover(r.id)}>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" /></svg>
                        </button>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="detail-panel">
                        {r.exerciciosRealizados.length > 0 ? (
                          <>
                            <div className="detail-head">
                              <span>Detalhes da execução</span>
                              <span>Séries</span>
                              <span>Repetições</span>
                              <span>Carga</span>
                            </div>
                            {r.exerciciosRealizados.map((er, i) => (
                              <div key={i} className="detail-exercise-row">
                                <span>{er.nomeExercicio}</span>
                                <span>{er.series}</span>
                                <span>{er.repeticoes}</span>
                                <span>{er.carga} kg</span>
                              </div>
                            ))}
                          </>
                        ) : (
                          <div className="detail-exercise-row">
                            <span>Nenhum exercício registrado.</span>
                          </div>
                        )}
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
              {!loading && registros.length === 0 && (
                <div style={{ textAlign: 'center', padding: '20px', color: 'var(--navy)' }}>Nenhum registro de treino encontrado.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
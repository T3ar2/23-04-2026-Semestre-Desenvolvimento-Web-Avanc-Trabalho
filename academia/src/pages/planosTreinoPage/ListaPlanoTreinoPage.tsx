import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { listarPlanosTreino, removerPlanoTreino } from "../../api/planoTreino";
import { listarAlunos } from "../../api/aluno";
import { PlanoTreinoDto, AlunoDto } from "../../api/types";

export function ListaPlanosTreinoPage() {
  const navigate = useNavigate();
  const [planos, setPlanos] = useState<PlanoTreinoDto[]>([]);
  const [alunos, setAlunos] = useState<AlunoDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      setError(err?.response?.data?.message ?? err?.message ?? "Falha ao carregar dados");
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
      setError(err?.response?.data?.message ?? err?.message ?? "Falha ao remover");
    }
  }

  return (
    <div className="page">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2 className="page-title" style={{ margin: 0 }}>Planos de Treino</h2>
        <button className="btn-primary" onClick={() => navigate("/plano-treino/novo")}>
          Novo Plano
        </button>
      </div>

      {error && <div className="form-error">{error}</div>}
      {loading && <div className="loading">Carregando...</div>}

      <div className="list">
        {planos.map((p) => {
          const alunoVinculado = alunos.find((a) => a.id === p.alunoId);

          return (
            <div key={p.id} className="list-item">
              <div>
                <strong>{p.nomeTreino}</strong> <span className="muted">#{p.id}</span>
                <div className="muted">Aluno: {alunoVinculado?.nome ?? p.alunoId}</div>
              </div>

              <div className="form-actions">
                <button
                  className="btn-outline"
                  onClick={() => navigate(`/plano-treino/editar/${p.id}`)}
                >
                  Editar
                </button>
                <button
                  className="btn-danger"
                  onClick={() => handleRemover(p.id, p.nomeTreino)}
                >
                  Excluir
                </button>
              </div>
            </div>
          );
        })}

        {!loading && planos.length === 0 && (
          <div className="empty-state">Nenhum plano encontrado.</div>
        )}
      </div>
    </div>
  );
}
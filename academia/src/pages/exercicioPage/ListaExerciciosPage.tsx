import React, { useEffect, useMemo, useState } from "react";
import { ExercicioDto } from "../../api/types";
import "../../cssDeTeste/ListaExercicio.css";
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
    <div className="page">
      <h2 className="page-title">Painel de Listagem de Exercicios</h2>

      {error && <div className="form-error">{error}</div>}
      {loading && <div className="loading">Carregando...</div>}

      <div className="top-bar">
        <button className="btn-primary" onClick={() => navigate('/adiciona-exercicio')}>
          Criar Novo Exercício
        </button>
      </div>

      <div className="table-container">
        
        <div className="grid-row table-header">
          <div>Código do Exercício</div>
          <div>Nome</div>
          <div>Grupo Muscular</div>
          <div>Email</div>
        </div>

        <div className="table-body">
          {sortedExercicio.map((p) => (
            <div key={p.id} className="grid-row list-item">
              
              <div className="muted">{p.id}</div>
              
              <div><strong>{p.nome}</strong></div>
              
              <div className="muted">{p.grupoMuscular}</div>

              <div className="form-actions">
                <button
                  className="btn-outline"
                  type="button"
                  onClick={() => navigate(`/atualizar-exercicio/${p.id}`)}
                >
                  Editar
                </button>

                <button
                  className="btn-danger"
                  type="button"
                  onClick={async () => {
                    if (!window.confirm(`Remover exercício "${p.nome}"?`)) return;

                    try {
                      await removerExercicio(p.id);
                      await refresh();
                    } catch (err: any) {
                      setError(
                        err?.response?.data?.message ??
                          err?.message ??
                          "Falha ao remover exercício.",
                      );
                    }
                  }}
                >
                  Remover
                </button>
              </div>
              
            </div>
          ))}

          {!loading && sortedExercicio.length === 0 && (
            <div className="empty-state">Nenhum exercício encontrado.</div>
          )}
        </div>
      </div>
    </div>
  );
}
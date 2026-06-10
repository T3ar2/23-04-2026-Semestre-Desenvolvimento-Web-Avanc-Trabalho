import React, { useEffect, useMemo, useState } from "react";
import "../../css/CadastrarExercicio.css";
import { useNavigate } from "react-router-dom";
import { ExercicioDto } from "../../api/types";
import { criarExercicio, listarExercicios } from "../../api/exercicio";

export function AdicionarExercicioPage() {
  const [exercicio, setExercicio] = useState<ExercicioDto[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [nome, setNome] = useState("");
  const [grupoMuscular, setGrupoMuscular] = useState("");
  
  const navigate = useNavigate();

  const sortedExercicio = useMemo(
    () => [...exercicio].sort((a, b) => a.nome.localeCompare(b.nome)),
    [exercicio],
  );

  async function refresh() {
    setError(null);
    setLoading(true);
    try {
      const [exerc] = await Promise.all([listarExercicios()]);
      setExercicio(exerc);
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

  function resetForm() {
    setNome("");
    setGrupoMuscular("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    try {
      const payloadExercicio = {
        nome,
        grupoMuscular,
      };

      await criarExercicio(payloadExercicio);
    
      resetForm();
      await refresh();
      navigate("/lista-exercicios");
    } catch (err: any) {
      setError(
        err?.response?.data?.message ??
          err?.message ??
          "Falha ao salvar produto.",
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
            <span className="card-title"><strong>Cadastrar</strong> novo exercício</span>
          </div>
          <span className="card-subtitle">Mantenha o catálogo de exercícios atualizado</span>
          <button type="button" className="btn-close" title="Fechar" onClick={() => navigate('/lista-exercicios')}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="card-body">
            <div className="form-group">
              <label className="form-label" htmlFor="nome">Nome do Exercício:</label>
              <input
                id="nome"
                type="text"
                className="form-input"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="grupoMuscular">Grupo Muscular:</label>
              <input
                id="grupoMuscular"
                type="text"
                className="form-input"
                value={grupoMuscular}
                maxLength={200}
                onChange={(e) => setGrupoMuscular(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="card-footer">
            <button className="btn-cadastrar" type="submit" disabled={!nome.trim() || !grupoMuscular.trim()}>
              Cadastrar
            </button>
          </div>
        </form>
      </div>
      {error && <div className="form-error" style={{ position: 'absolute', bottom: 20 }}>{error}</div>}
    </div>
  );
}

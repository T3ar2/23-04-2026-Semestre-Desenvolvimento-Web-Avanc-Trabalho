import React, { useEffect, useState } from "react";
import "../../css/AtualizarExercicio.css";
import { useNavigate, useParams } from "react-router-dom";
import { ExercicioDto } from "../../api/types";
import { atualizarExercicio, listarExercicioPorId } from "../../api/exercicio";

export function AtualizarExercicioPage() {
  const { id } = useParams<{ id: string }>(); 
  const navigate = useNavigate();

  const [exercicio, setExercicio] = useState<ExercicioDto | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const [nome, setNome] = useState("");
  const [grupoMuscular, setGrupoMuscular] = useState("");
  useEffect(() => {
    async function carregarAluno() {
      if (!id) return; 
      
      setError(null);
      setLoading(true);
      
      try {
        const dadosAluno = await listarExercicioPorId(Number(id));
        setExercicio(dadosAluno);
        setNome(dadosAluno.nome);
        setGrupoMuscular(dadosAluno.grupoMuscular);

      } catch (err: any) {
        setError(
          err?.response?.data?.message ??
            err?.message ??
            "Falha ao carregar os dados do exercicio."
        );
      } finally {
        setLoading(false);
      }
    }

    void carregarAluno();
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!id) return;

    setError(null);

    try {
      const payloadAluno = {
        nome,
        grupoMuscular,
      };

      await atualizarExercicio(Number(id), payloadAluno);
      navigate("/lista-exercicios");
    } catch (err: any) {
      setError(
        err?.response?.data?.message ??
          err?.message ??
          "Falha ao atualizar aluno."
      );
    }
  }

  if (loading) {
      return <div className="loading">Carregando dados do exercicio...</div>;
  }

  return (
    <div className="page-body">
      <div className="card">
        <div className="card-header">
          <div className="card-header-left">
            <button type="button" className="btn-back" title="Voltar" onClick={() => navigate(-1)}>
              <svg viewBox="0 0 24 24"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" /></svg>
            </button>
            <span className="card-title"><strong>Atualizar</strong> exercício</span>
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
              Atualizar
            </button>
          </div>
        </form>
      </div>
      {error && <div className="form-error" style={{ position: 'absolute', bottom: 20 }}>{error}</div>}
    </div>
  );
}
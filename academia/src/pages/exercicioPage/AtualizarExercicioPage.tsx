import React, { useEffect, useState } from "react";
import "../../cssDeTeste/AlunoPage.css";
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
    <div className="page">
      <h2 className="page-title">Atualizar Exercicio</h2>

      <form className="card" onSubmit={handleSubmit}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gap: 12,
          }}
        >
          <div className="form-group">
            <label htmlFor="nome">Nome</label>
            <input
              id="nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="grupoMuscular">Grupo Muscular</label>
            <input
              id="grupoMuscular"
              value={grupoMuscular}
              onChange={(e) => setGrupoMuscular(e.target.value)}
            />
          </div>
        </div>

        <div className="form-actions">
          <button className="btn-primary" type="submit" disabled={!nome.trim()}>
            Atualizar
          </button>

          <button className="btn-danger" type="button" onClick={() => navigate("/lista-exercicios")}>
            Cancelar
          </button>
        </div>
      </form>

      {error && <div className="form-error">{error}</div>}
    </div>
  );
}
import React, { useEffect, useMemo, useState } from "react";
import "../../cssDeTeste/AlunoPage.css";
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
      navigate("/lista-alunos");
    } catch (err: any) {
      setError(
        err?.response?.data?.message ??
          err?.message ??
          "Falha ao salvar produto.",
      );
    }
  }

  const mascaraCpf = (valor: string) => {
    return valor
      .replace(/\D/g, "")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})/, "$1-$2")
      .replace(/(-\d{2})\d+?$/, "$1");
  };

  return (
    <div className="page">
      <h2 className="page-title">Adicionar novo Aluno</h2>

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
            <label>Grupo Muscular</label>
            <input
              id="grupoMuscular"
              value={grupoMuscular}
              maxLength={200}
              onChange={(e) => setGrupoMuscular (e.target.value)}
            />
          </div>
        </div>

        <div className="form-actions">
          <button className="btn-primary" type="submit" disabled={!nome.trim()}>
            {"Criar"}
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

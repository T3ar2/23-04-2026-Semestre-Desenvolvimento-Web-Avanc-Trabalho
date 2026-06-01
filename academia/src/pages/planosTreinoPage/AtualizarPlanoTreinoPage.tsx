import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { atualizarPlanoTreino, listarPlanoTreinoPorId } from "../../api/planoTreino";
import { listarAlunos } from "../../api/aluno";
import { listarExercicios } from "../../api/exercicio";
import { AlunoDto } from "../../api/types";

export function AtualizarPlanoTreinoPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [alunos, setAlunos] = useState<AlunoDto[]>([]);
  const [exercicios, setExercicios] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [nomeTreino, setNomeTreino] = useState("");
  const [alunoId, setAlunoId] = useState<number | "">("");
  const [exerciciosPlanejados, setExerciciosPlanejados] = useState<
    { exercicioId: number | ""; series: number; repeticoes: number }[]
  >([]);

  async function carregarDados() {
    if (!id) return;
    setLoading(true);
    try {
      const [plano, listaAlunos, listaExercicios] = await Promise.all([
        listarPlanoTreinoPorId(Number(id)),
        listarAlunos(),
        listarExercicios(),
      ]);
      
      setAlunos(listaAlunos);
      setExercicios(listaExercicios);
      
      setNomeTreino(plano.nomeTreino);
      setAlunoId(plano.alunoId);
      setExerciciosPlanejados(
        plano.exerciciosPlanejados.map((ep) => ({
          exercicioId: ep.exercicioId,
          series: ep.series,
          repeticoes: ep.repeticoes,
        }))
      );
    } catch (err: any) {
      setError(err?.response?.data?.message ?? err?.message ?? "Falha ao carregar dados");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void carregarDados();
  }, [id]);

  function addExercicio() {
    setExerciciosPlanejados([
      ...exerciciosPlanejados,
      { exercicioId: "", series: 0, repeticoes: 0 },
    ]);
  }

  function removeExercicio(index: number) {
    const novaLista = [...exerciciosPlanejados];
    novaLista.splice(index, 1);
    setExerciciosPlanejados(novaLista);
  }

  function updateExercicio(index: number, field: string, value: string) {
    const novaLista = [...exerciciosPlanejados];
    novaLista[index] = { ...novaLista[index], [field]: Number(value) };
    setExerciciosPlanejados(novaLista);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!id || !alunoId) {
      setError("Dados inválidos para atualização");
      return;
    }

    try {
      const payload = {
        nomeTreino,
        alunoId: Number(alunoId),
        exerciciosPlanejados: exerciciosPlanejados.map((ex) => ({
          exercicioId: Number(ex.exercicioId),
          series: Number(ex.series),
          repeticoes: Number(ex.repeticoes),
        })),
      };

      await atualizarPlanoTreino(Number(id), payload);
      navigate("/plano-treino");
    } catch (err: any) {
      setError(err?.response?.data?.message ?? err?.message ?? "Falha ao atualizar plano de treino");
    }
  }

  return (
    <div className="page">
      <h2 className="page-title">Editar Plano de Treino</h2>

      <form className="card" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="nomeTreino">Nome do Treino</label>
          <input
            id="nomeTreino"
            value={nomeTreino}
            onChange={(e) => setNomeTreino(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="alunoId">Aluno</label>
          <select
            id="alunoId"
            value={alunoId}
            onChange={(e) => setAlunoId(Number(e.target.value))}
            required
          >
            <option value="">Selecione um aluno</option>
            {alunos.map((a) => (
              <option key={a.id} value={a.id}>
                {a.nome}
              </option>
            ))}
          </select>
        </div>

        <h3>Exercícios Planejados</h3>
        {exerciciosPlanejados.map((item, index) => (
          <div
            key={index}
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr 1fr auto",
              gap: 12,
              marginBottom: 12,
            }}
          >
            <select
              value={item.exercicioId}
              onChange={(e) =>
                updateExercicio(index, "exercicioId", e.target.value)
              }
              required
            >
              <option value="">Selecione o exercício</option>
              {exercicios.map((ex) => (
                <option key={ex.id} value={ex.id}>
                  {ex.nome}
                </option>
              ))}
            </select>

            <input
              type="number"
              min="1"
              placeholder="Séries"
              value={item.series || ""}
              onChange={(e) => updateExercicio(index, "series", e.target.value)}
              required
            />

            <input
              type="number"
              min="1"
              placeholder="Repetições"
              value={item.repeticoes || ""}
              onChange={(e) =>
                updateExercicio(index, "repeticoes", e.target.value)
              }
              required
            />

            <button
              type="button"
              className="btn-danger"
              onClick={() => removeExercicio(index)}
            >
              X
            </button>
          </div>
        ))}

        <button
          type="button"
          className="btn-outline"
          onClick={addExercicio}
          style={{ marginBottom: 20 }}
        >
          + Adicionar Exercício
        </button>

        <div className="form-actions">
          <button
            className="btn-primary"
            type="submit"
            disabled={!nomeTreino.trim() || !alunoId || loading}
          >
            Salvar Alterações
          </button>
          <button
            className="btn-secondary"
            type="button"
            onClick={() => navigate("/plano-treino")}
          >
            Cancelar
          </button>
        </div>
      </form>

      {error && <div className="form-error">{error}</div>}
      {loading && <div className="loading">Carregando...</div>}
    </div>
  );
}
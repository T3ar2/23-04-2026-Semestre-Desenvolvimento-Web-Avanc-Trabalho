import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { atualizarRegistroTreino, listarRegistroTreinoPorId } from "../../api/registroTreino";
import { listarAlunos } from "../../api/aluno";
import { listarExercicios } from "../../api/exercicio";
import { listarPlanosTreino } from "../../api/planoTreino";
import { AlunoDto, PlanoTreinoDto } from "../../api/types";

export function AtualizarRegistroTreinoPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [alunos, setAlunos] = useState<AlunoDto[]>([]);
  const [exercicios, setExercicios] = useState<any[]>([]);
  const [planosTreino, setPlanosTreino] = useState<PlanoTreinoDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [alunoId, setAlunoId] = useState<number | "">("");
  const [planoTreinoId, setPlanoTreinoId] = useState<number | "">("");
  const [dataExecucao, setDataExecucao] = useState("");
  const [exerciciosRealizados, setExerciciosRealizados] = useState<
    { exercicioId: number | ""; series: number; repeticoes: number; carga: number }[]
  >([]);

  async function carregarDados() {
    if (!id) {
      return;
    }

    setLoading(true);
    try {
      const [registro, listaAlunos, listaExercicios, listaPlanos] = await Promise.all([
        listarRegistroTreinoPorId(Number(id)),
        listarAlunos(),
        listarExercicios(),
        listarPlanosTreino(),
      ]);

      setAlunos(listaAlunos);
      setExercicios(listaExercicios);
      setPlanosTreino(listaPlanos);

      setAlunoId(registro.alunoId);
      setPlanoTreinoId(registro.planoTreinoId || "");

      const dataFormatada = registro.dataExecucao.substring(0, 16);
      setDataExecucao(dataFormatada);

      setExerciciosRealizados(
        registro.exerciciosRealizados.map((er) => ({
          exercicioId: er.exercicioId,
          series: er.series,
          repeticoes: er.repeticoes,
          carga: er.carga,
        }))
      );
    } catch (err: any) {
      setError(err?.response?.data?.message ?? err?.message ?? "Falha ao carregar dados.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void carregarDados();
  }, [id]);

  function addExercicio() {
    setExerciciosRealizados([
      ...exerciciosRealizados,
      { exercicioId: "", series: 0, repeticoes: 0, carga: 0 },
    ]);
  }

  function removeExercicio(index: number) {
    const novaLista = [...exerciciosRealizados];
    novaLista.splice(index, 1);
    setExerciciosRealizados(novaLista);
  }

  function updateExercicio(index: number, field: string, value: string) {
    const novaLista = [...exerciciosRealizados];
    novaLista[index] = { ...novaLista[index], [field]: Number(value) };
    setExerciciosRealizados(novaLista);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!id) {
      return;
    }

    if (!alunoId) {
      setError("Selecione um aluno.");
      return;
    }

    if (!dataExecucao) {
      setError("Informe a data de execução.");
      return;
    }

    try {
      const payload = {
        alunoId: Number(alunoId),
        planoTreinoId: planoTreinoId ? Number(planoTreinoId) : null,
        dataExecucao: `${dataExecucao}`,
        exerciciosRealizados: exerciciosRealizados.map((ex) => ({
          exercicioId: Number(ex.exercicioId),
          series: Number(ex.series),
          repeticoes: Number(ex.repeticoes),
          carga: Number(ex.carga),
        })),
      };

      await atualizarRegistroTreino(Number(id), payload);
      navigate("/registro-treino");
    } catch (err: any) {
      setError(err?.response?.data?.message ?? err?.message ?? "Falha ao atualizar registro.");
    }
  }

  return (
    <div className="page">
      <h2 className="page-title">Editar Registro de Treino</h2>

      <form className="card" onSubmit={handleSubmit}>
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

        <div className="form-group">
          <label htmlFor="planoTreinoId">Plano de Treino</label>
          <select
            id="planoTreinoId"
            value={planoTreinoId}
            onChange={(e) => setPlanoTreinoId(Number(e.target.value))}
          >
            <option value="">Nenhum</option>
            {planosTreino
              .filter((p) => p.alunoId === alunoId || !alunoId)
              .map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nomeTreino}
                </option>
              ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="dataExecucao">Data de Execução</label>
          <input
            id="dataExecucao"
            type="datetime-local"
            value={dataExecucao}
            onChange={(e) => setDataExecucao(e.target.value)}
            required
          />
        </div>

        <h3>Exercícios Realizados</h3>
        {exerciciosRealizados.map((item, index) => (
          <div
            key={index}
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr 1fr 1fr auto",
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

            <input
              type="number"
              min="0"
              step="0.1"
              placeholder="Carga (kg)"
              value={item.carga || ""}
              onChange={(e) => updateExercicio(index, "carga", e.target.value)}
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
            disabled={!alunoId || !dataExecucao || loading}
          >
            Salvar Alterações
          </button>
          <button
            className="btn-secondary"
            type="button"
            onClick={() => navigate("/registro-treino")}
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
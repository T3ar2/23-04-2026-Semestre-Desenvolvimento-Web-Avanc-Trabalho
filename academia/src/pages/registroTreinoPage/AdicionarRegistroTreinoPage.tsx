import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { criarRegistroTreino } from "../../api/registroTreino";
import { listarAlunos } from "../../api/aluno";
import { listarExercicios } from "../../api/exercicio";
import { listarPlanosTreino, listarPlanoTreinoPorId } from "../../api/planoTreino";
import { AlunoDto, PlanoTreinoDto } from "../../api/types";

export function AdicionarRegistroTreinoPage() {
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

  async function carregarDadosIniciais() {
    setLoading(true);
    try {
      const [listaAlunos, listaExercicios, listaPlanos] = await Promise.all([
        listarAlunos(),
        listarExercicios(),
        listarPlanosTreino(),
      ]);
      setAlunos(listaAlunos);
      setExercicios(listaExercicios);
      setPlanosTreino(listaPlanos);
    } catch (err: any) {
      setError(err?.response?.data?.message ?? err?.message ?? "Falha ao carregar dados.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void carregarDadosIniciais();
  }, []);

  async function handlePlanoTreinoChange(idStr: string) {
    const id = Number(idStr);
    setPlanoTreinoId(id || "");
    
    if (!id) {
      return;
    }

    setLoading(true);
    try {
      const plano = await listarPlanoTreinoPorId(id);
      const exerciciosMapeados = plano.exerciciosPlanejados.map((ep) => ({
        exercicioId: ep.exercicioId,
        series: ep.series,
        repeticoes: ep.repeticoes,
        carga: 0,
      }));
      setExerciciosRealizados(exerciciosMapeados);
    } catch (err: any) {
      setError("Falha ao carregar o plano de treino selecionado.");
    } finally {
      setLoading(false);
    }
  }

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
        dataExecucao: new Date(dataExecucao).toISOString(),
        exerciciosRealizados: exerciciosRealizados.map((ex) => ({
          exercicioId: Number(ex.exercicioId),
          series: Number(ex.series),
          repeticoes: Number(ex.repeticoes),
          carga: Number(ex.carga),
        })),
      };

      await criarRegistroTreino(payload);
      navigate("/registro-treino");
    } catch (err: any) {
      setError(err?.response?.data?.message ?? err?.message ?? "Falha ao salvar registro.");
    }
  }

  return (
    <div className="page">
      <h2 className="page-title">Novo Registro de Treino</h2>

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
            onChange={(e) => handlePlanoTreinoChange(e.target.value)}
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
            Salvar Registro
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
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { criarRegistroTreino } from "../../api/registroTreino";
import { listarAlunos } from "../../api/aluno";
import { listarExercicios } from "../../api/exercicio";
import { listarPlanosTreino, listarPlanoTreinoPorId } from "../../api/planoTreino";
import { AlunoDto, PlanoTreinoDto } from "../../api/types";
import "../../css/RegistrarTreino.css";

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
        dataExecucao: `${dataExecucao}`,
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
    <div className="page-body">
      <div className="card">
        <div className="card-header">
          <div className="card-header-left">
            <button className="btn-back" title="Voltar" onClick={() => navigate(-1)}>
              <svg viewBox="0 0 24 24"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" /></svg>
            </button>
            <span className="card-title"><strong>Registrar</strong> execução de treino</span>
          </div>
          <span className="card-subtitle">Monitore a frequência e o desempenho dos alunos nos treinos agendados</span>
          <button className="btn-close" title="Fechar" onClick={() => navigate('/registro-treino')}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="card-body">
            <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
              <div className="form-group">
                <label className="form-label" htmlFor="alunoId">Aluno selecionado:</label>
                <select
                  id="alunoId"
                  className="form-input"
                  value={alunoId}
                  onChange={(e) => setAlunoId(Number(e.target.value))}
                  required
                >
                  <option value="">Selecione um aluno</option>
                  {alunos.map((a) => (
                    <option key={a.id} value={a.id}>{a.nome}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="dataExecucao">Data e hora do treino:</label>
                <input
                  id="dataExecucao"
                  type="datetime-local"
                  className="form-input"
                  value={dataExecucao}
                  onChange={(e) => setDataExecucao(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="planoTreinoId">Treino realizado (Opcional):</label>
                <select
                  id="planoTreinoId"
                  className="form-input"
                  value={planoTreinoId}
                  onChange={(e) => handlePlanoTreinoChange(e.target.value)}
                >
                  <option value="">Treino Avulso / Nenhum</option>
                  {planosTreino
                    .filter((p) => p.alunoId === alunoId || !alunoId)
                    .map((p) => (
                      <option key={p.id} value={p.id}>{p.nomeTreino}</option>
                    ))}
                </select>
              </div>
            </div>

            <div className="exercises-section">
              <span className="exercises-title">Detalhes dos exercícios</span>

              <div className="table-wrapper">
                <div className="table-head">
                  <span>Exercício</span>
                  <span>Séries</span>
                  <span>Repetições</span>
                  <span>Carga</span>
                  <span></span>
                </div>

                <div className="table-body">
                  {exerciciosRealizados.map((item, index) => (
                    <div key={index} className="exercise-row">
                      <select
                        className="exercise-input exercise-name-input"
                        value={item.exercicioId}
                        onChange={(e) => updateExercicio(index, "exercicioId", e.target.value)}
                        required
                      >
                        <option value="">Selecione...</option>
                        {exercicios.map((ex) => (
                          <option key={ex.id} value={ex.id}>{ex.nome}</option>
                        ))}
                      </select>

                      <input
                        type="number"
                        className="exercise-input"
                        min="1"
                        placeholder="—"
                        value={item.series || ""}
                        onChange={(e) => updateExercicio(index, "series", e.target.value)}
                        required
                      />

                      <input
                        type="number"
                        className="exercise-input"
                        min="1"
                        placeholder="—"
                        value={item.repeticoes || ""}
                        onChange={(e) => updateExercicio(index, "repeticoes", e.target.value)}
                        required
                      />

                      <input
                        type="number"
                        className="exercise-input"
                        min="0"
                        step="0.5"
                        placeholder="kg"
                        value={item.carga || ""}
                        onChange={(e) => updateExercicio(index, "carga", e.target.value)}
                        required
                      />

                      <button
                        type="button"
                        className="btn-delete-row"
                        onClick={() => removeExercicio(index)}
                      >
                        X
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <button type="button" className="btn-add-row" onClick={addExercicio}>
                <svg viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" /></svg>
                Adicionar exercício
              </button>
            </div>
          </div>

          <div className="card-footer">
            <button className="btn-register" type="submit" disabled={!alunoId || !dataExecucao || loading}>
              Registrar
            </button>
          </div>
        </form>

      </div>
      {error && <div className="form-error" style={{ position: 'absolute', bottom: 20 }}>{error}</div>}
      {loading && <div className="loading" style={{ position: 'absolute', bottom: 20 }}>Carregando...</div>}
    </div>
  );
}
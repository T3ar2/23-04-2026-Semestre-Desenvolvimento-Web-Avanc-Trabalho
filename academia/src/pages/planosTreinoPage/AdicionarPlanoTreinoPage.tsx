import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { criarPlanoTreino } from "../../api/planoTreino";
import { listarAlunos } from "../../api/aluno";
import { listarExercicios } from "../../api/exercicio";
import { AlunoDto } from "../../api/types";
import "../../css/CadastrarPlanoTreino.css";

export function AdicionarPlanoTreinoPage() {
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
    setLoading(true);
    try {
      const [listaAlunos, listaExercicios] = await Promise.all([
        listarAlunos(),
        listarExercicios(),
      ]);
      setAlunos(listaAlunos);
      setExercicios(listaExercicios);
    } catch (err: any) {
      setError(err?.response?.data?.message ?? err?.message ?? "Falha ao carregar dados");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void carregarDados();
  }, []);

  // function addExercicio() {
  //   setExerciciosPlanejados([
  //     ...exerciciosPlanejados,
  //     { exercicioId: "", series: 0, repeticoes: 0 },
  //   ]);
  // }

  // function removeExercicio(index: number) {
  //   const novaLista = [...exerciciosPlanejados];
  //   novaLista.splice(index, 1);
  //   setExerciciosPlanejados(novaLista);
  // }

  // function updateExercicio(index: number, field: string, value: string) {
  //   const novaLista = [...exerciciosPlanejados];
  //   novaLista[index] = { ...novaLista[index], [field]: Number(value) };
  //   setExerciciosPlanejados(novaLista);
  // }
  function toggleExercicio(exercicioId: number) {
    const index = exerciciosPlanejados.findIndex(e => e.exercicioId === exercicioId);
    if (index >= 0) {
      const novaLista = [...exerciciosPlanejados];
      novaLista.splice(index, 1);
      setExerciciosPlanejados(novaLista);
    } else {
      setExerciciosPlanejados([...exerciciosPlanejados, { exercicioId, series: 1, repeticoes: 1 }]);
    }
  }

  function updateExercicioDetails(exercicioId: number, field: string, value: string) {
    const novaLista = [...exerciciosPlanejados];
    const index = novaLista.findIndex(e => e.exercicioId === exercicioId);
    if (index >= 0) {
      novaLista[index] = { ...novaLista[index], [field]: Number(value) };
      setExerciciosPlanejados(novaLista);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!alunoId) {
      setError("Selecione um aluno");
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

      await criarPlanoTreino(payload);
      navigate("/plano-treino");
    } catch (err: any) {
      setError(err?.response?.data?.message ?? err?.message ?? "Falha ao salvar");
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
            <span className="card-title"><strong>Cadastrar</strong> novo treino</span>
          </div>
          <span className="card-subtitle">Personalize a rotina de exercícios do aluno</span>
          <button type="button" className="btn-close" title="Fechar" onClick={() => navigate('/plano-treino')}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="card-body">
            <div className="form-column">
              <div className="form-group">
                <label className="form-label" htmlFor="nomeTreino">Nome do plano:</label>
                <input
                  id="nomeTreino"
                  type="text"
                  className="form-input"
                  value={nomeTreino}
                  onChange={(e) => setNomeTreino(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="alunoId">Vincular a um aluno:</label>
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
            </div>

            <div className="exercises-column">
              <label className="form-label">Exercícios disponíveis:</label>
              <div className="checklist-wrapper">
                {exercicios.map((ex) => {
                  const planejado = exerciciosPlanejados.find(e => e.exercicioId === ex.id);
                  const isChecked = !!planejado;

                  return (
                    <div key={ex.id} className={`checkbox-item ${isChecked ? 'checked' : ''}`}>
                      <div className="custom-checkbox" onClick={() => toggleExercicio(ex.id)}>
                        {isChecked ? (
                          <svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" /></svg>
                        ) : (
                          <div className="empty-box"></div>
                        )}
                        <span>{ex.nome}</span>
                      </div>
                      
                      <div className="exercise-config">
                        <input
                          type="number"
                          className="config-input"
                          placeholder="Séries"
                          min="1"
                          value={planejado?.series || ""}
                          onChange={(e) => updateExercicioDetails(ex.id, "series", e.target.value)}
                          disabled={!isChecked}
                          required={isChecked}
                        />
                        <input
                          type="number"
                          className="config-input"
                          placeholder="Reps"
                          min="1"
                          value={planejado?.repeticoes || ""}
                          onChange={(e) => updateExercicioDetails(ex.id, "repeticoes", e.target.value)}
                          disabled={!isChecked}
                          required={isChecked}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="card-footer">
            <button className="btn-cadastrar" type="submit" disabled={!nomeTreino.trim() || !alunoId || loading}>
              Cadastrar
            </button>
          </div>
        </form>
      </div>
      {error && <div className="form-error" style={{ position: 'absolute', bottom: 20 }}>{error}</div>}
      {loading && <div className="loading" style={{ position: 'absolute', bottom: 20 }}>Carregando...</div>}
    </div>
  );
}
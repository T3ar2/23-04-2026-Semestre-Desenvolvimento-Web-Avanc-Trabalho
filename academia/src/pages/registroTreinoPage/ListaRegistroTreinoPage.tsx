import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { listarRegistrosTreino, removerRegistroTreino } from "../../api/registroTreino";
import { listarAlunos } from "../../api/aluno";
import { RegistroTreinoResponseDto, AlunoDto } from "../../api/types";

export function ListaRegistrosTreinoPage() {
  const navigate = useNavigate();
  const [registros, setRegistros] = useState<RegistroTreinoResponseDto[]>([]);
  const [alunos, setAlunos] = useState<AlunoDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function carregarDados() {
    setLoading(true);
    setError(null);
    try {
      const [listaRegistros, listaAlunos] = await Promise.all([
        listarRegistrosTreino(),
        listarAlunos(),
      ]);
      setRegistros(listaRegistros);
      setAlunos(listaAlunos);
    } catch (err: any) {
      setError(err?.response?.data?.message ?? err?.message ?? "Falha ao carregar dados.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void carregarDados();
  }, []);

  async function handleRemover(id: number) {
    if (!window.confirm("Remover registro de treino?")) return;
    try {
      await removerRegistroTreino(id);
      await carregarDados();
    } catch (err: any) {
      setError(err?.response?.data?.message ?? err?.message ?? "Falha ao remover.");
    }
  }

  return (
    <div className="page">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2 className="page-title" style={{ margin: 0 }}>Registros de Treino</h2>
        <button className="btn-primary" onClick={() => navigate("/registro-treino/novo")}>
          Novo Registro
        </button>
      </div>

      {error && <div className="form-error">{error}</div>}
      {loading && <div className="loading">Carregando...</div>}

      <div className="list">
        {registros.map((r) => {
          const alunoVinculado = alunos.find((a) => a.id === r.alunoId);
          const dataFormatada = new Date(r.dataExecucao).toLocaleString("pt-BR");

          return (
            <div key={r.id} className="list-item">
              <div>
                <strong>Data: {dataFormatada}</strong> <span className="muted">#{r.id}</span>
                <div className="muted">Aluno: {alunoVinculado?.nome ?? r.alunoId}</div>
                
                <div style={{ marginTop: 8 }}>
                  <strong>Exercícios Realizados:</strong>
                  <ul style={{ margin: 0, paddingLeft: 20 }}>
                    {r.exerciciosRealizados.map((er, i) => (
                      <li key={i} className="muted">
                        {er.nomeExercicio} | {er.series} séries x {er.repeticoes} repetições | {er.carga} kg
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="form-actions">
                <button
                  className="btn-outline"
                  onClick={() => navigate(`/registro-treino/editar/${r.id}`)}
                >
                  Editar
                </button>
                <button
                  className="btn-danger"
                  onClick={() => handleRemover(r.id)}
                >
                  Excluir
                </button>
              </div>
            </div>
          );
        })}

        {!loading && registros.length === 0 && (
          <div className="empty-state">Nenhum registro de treino encontrado.</div>
        )}
      </div>
    </div>
  );
}
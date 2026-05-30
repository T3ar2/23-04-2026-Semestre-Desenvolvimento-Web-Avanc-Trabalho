import React, { useEffect, useMemo, useState } from "react";
import { AlunoDto } from "../../api/types";
import {
  atualizarAluno,
  criarAluno,
  listarAlunos,
  removerAluno,
} from "../../api/aluno";
import "../../cssDeTeste/ListaAlunos.css";
import { useNavigate } from "react-router-dom";

export function ListaAlunosPage() {
  const [aluno, setAluno] = useState<AlunoDto[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<AlunoDto | null>(null);
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");
  const [nascimento, setNascimento] = useState("");
  const navigate = useNavigate();

  const sortedAluno = useMemo(
    () => [...aluno].sort((a, b) => a.nome.localeCompare(b.nome)),
    [aluno],
  );

  async function refresh() {
    setError(null);
    setLoading(true);
    try {
      const [alun] = await Promise.all([listarAlunos()]);
      setAluno(alun);
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
  }

  return (
    <div className="page">
      <h2 className="page-title">Painel de Listagem de Alunos</h2>

      {error && <div className="form-error">{error}</div>}
      {loading && <div className="loading">Carregando...</div>}

      <div className="top-bar">
        <button className="btn-primary" onClick={() => navigate('/adiciona-aluno')}>
          Criar Novo Aluno
        </button>
      </div>

      <div className="table-container">
        
        <div className="grid-row table-header">
          <div>Código do Aluno</div>
          <div>Nome</div>
          <div>CPF</div>
          <div>Email</div>
          <div>Data de Nascimento</div>
          <div className="text-center">Cards Funcionais</div>
        </div>

        <div className="table-body">
          {sortedAluno.map((p) => (
            <div key={p.id} className="grid-row list-item">
              
              <div className="muted">{p.id}</div>
              
              <div><strong>{p.nome}</strong></div>
              
              <div className="muted">{p.cpf}</div>
              
              <div className="muted">{p.email}</div>
              
              <div className="muted">
                {p.nascimento && !Number.isNaN(new Date(p.nascimento).getTime())
                  ? new Date(p.nascimento).toLocaleDateString("pt-BR")
                  : "-"}
              </div>

              <div className="form-actions">
                <button
                  className="btn-outline"
                  type="button"
                  onClick={() => navigate(`/atualizar-aluno/${p.id}`)}
                >
                  Editar
                </button>

                <button
                  className="btn-danger"
                  type="button"
                  onClick={async () => {
                    if (!window.confirm(`Remover aluno "${p.nome}"?`)) return;

                    try {
                      await removerAluno(p.id);
                      await refresh();
                    } catch (err: any) {
                      setError(
                        err?.response?.data?.message ??
                          err?.message ??
                          "Falha ao remover aluno.",
                      );
                    }
                  }}
                >
                  Remover
                </button>
              </div>
              
            </div>
          ))}

          {!loading && sortedAluno.length === 0 && (
            <div className="empty-state">Nenhum aluno encontrado.</div>
          )}
        </div>
      </div>
    </div>
  );
}
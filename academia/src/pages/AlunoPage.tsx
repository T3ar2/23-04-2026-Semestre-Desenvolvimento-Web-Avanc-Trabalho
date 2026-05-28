import React, { useEffect, useMemo, useState } from "react";
import { AlunoDto } from "../api/types";
import { atualizarAluno, criarAluno, listarAlunos, removerAluno } from "../api/aluno";

export function AlunoPage() {
  const [aluno, setAluno] = useState<AlunoDto[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<AlunoDto | null>(null);
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");
  const [nascimento, setnascimento] = useState(Date);

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

  function resetForm() {
    setEditing(null);
    setNome("");
    setCpf("");
    setEmail("");
    setnascimento(Date);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    try {
      const payload = {
        nome,
        cpf,
        email,
        nascimento: new Date(nascimento),
      };

      if (editing) {
        await atualizarAluno(editing.id, payload);
      } else {
        await criarAluno(payload);
      }

      resetForm();
      await refresh();
    } catch (err: any) {
      setError(
        err?.response?.data?.message ??
          err?.message ??
          "Falha ao salvar produto.",
      );
    }
  }

  return (
    <div className="page">
      <h2 className="page-title">Alunos</h2>

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
            <label htmlFor="cpf">CPF</label>
            <input
              id="cpf"
              value={cpf}
              onChange={(e) => setCpf(e.target.value)}
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="nascimento">Data de Nascimento</label>
          <input
            id="nascimento"
            type="date"
            value={nascimento}
            onChange={(e) => setnascimento(e.target.value)}
          />
        </div>

        <div className="form-actions">
          <button className="btn-primary" type="submit" disabled={!nome.trim()}>
            {editing ? "Atualizar" : "Criar"}
          </button>

          {editing && (
            <button className="btn-secondary" type="button" onClick={resetForm}>
              Cancelar
            </button>
          )}
        </div>
      </form>

      {error && <div className="form-error">{error}</div>}
      {loading && <div className="loading">Carregando...</div>}

      <div className="list">
        {sortedAluno.map((p) => (
          <div key={p.id} className="list-item">
            <div>
              <strong>{p.nome}</strong> <span className="muted">#{p.id}</span>
              <div className="muted">
                cpf: {p.cpf}
              </div>
              <div className="muted">
                email: {p.email}
              </div>
              <div className="muted">
                data de nascimento: {p.nascimento ? new Date(p.nascimento).toLocaleDateString() : 'N/A'}
              </div>
            </div>

            <div className="form-actions">
              <button
                className="btn-outline"
                type="button"
                onClick={() => {
                  setEditing(p);
                  setNome(p.nome);
                  setCpf(p.cpf);
                  setEmail(p.email);
                  setnascimento(p.nascimento.toISOString().split("T")[0]);
                }}
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
  );
}

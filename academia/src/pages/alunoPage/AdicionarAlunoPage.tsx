import React, { useEffect, useMemo, useState } from "react";
import { AlunoDto } from "../../api/types";
import { criarAluno, listarAlunos } from "../../api/aluno";
import "../../css/CadastrarAluno.css";
import { useNavigate } from "react-router-dom";

export function AdicionarAlunoPage() {
  const [aluno, setAluno] = useState<AlunoDto[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
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

  function resetForm() {
    setNome("");
    setCpf("");
    setEmail("");
    setNascimento("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    try {
      const payloadAluno = {
        nome,
        cpf,
        email,
        nascimento: new Date(nascimento),
      };

      await criarAluno(payloadAluno);

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
    <div className="page-body">
      <div className="card">
        <div className="card-header">
          <div className="card-header-left">
            <button
              type="button"
              className="btn-back"
              title="Voltar"
              onClick={() => navigate(-1)}
            >
              <svg viewBox="0 0 24 24">
                <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
              </svg>
            </button>
            <span className="card-title">
              <strong>Cadastrar</strong> novo aluno
            </span>
          </div>
          <span className="card-subtitle">
            Acesso total aos perfis, histórico e informações de contato dos
            alunos
          </span>
          <button
            type="button"
            className="btn-close"
            title="Fechar"
            onClick={() => navigate("/lista-alunos")}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="card-body">
            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="nome">
                  Nome completo:
                </label>
                <input
                  id="nome"
                  type="text"
                  className="form-input"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="email">
                  E-mail:
                </label>
                <input
                  id="email"
                  type="email"
                  className="form-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="nascimento">
                  Data de Nascimento:
                </label>
                <input
                  id="nascimento"
                  type="date"
                  className="form-input"
                  value={nascimento}
                  onChange={(e) => setNascimento(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="cpf">
                  CPF:
                </label>
                <input
                  id="cpf"
                  type="text"
                  className="form-input"
                  value={cpf}
                  maxLength={14}
                  onChange={(e) => setCpf(mascaraCpf(e.target.value))}
                  placeholder="000.000.000-00"
                  required
                />
              </div>
            </div>
          </div>

          <div className="card-footer">
            <button
              type="submit"
              className="btn-cadastrar"
              disabled={!nome.trim()}
            >
              Cadastrar
            </button>
          </div>
        </form>
      </div>
      {error && (
        <div
          className="form-error"
          style={{ position: "absolute", bottom: 20 }}
        >
          {error}
        </div>
      )}
    </div>
  );
}

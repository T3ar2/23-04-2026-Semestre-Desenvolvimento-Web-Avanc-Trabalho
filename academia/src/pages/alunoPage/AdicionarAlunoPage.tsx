import React, { useEffect, useMemo, useState } from "react";
import { AlunoDto } from "../../api/types";
import {
  atualizarAluno,
  criarAluno,
  listarAlunos,
  removerAluno,
} from "../../api/aluno";
import "../../cssDeTeste/AlunoPage.css";
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
            <label htmlFor="cpf">CPF</label>
            <input
              id="cpf"
              value={cpf}
              maxLength={14}
              onChange={(e) => setCpf(mascaraCpf(e.target.value))}
              placeholder="000.000.000-00"
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
            onChange={(e) => setNascimento(e.target.value)}
          />
        </div>

        <div className="form-actions">
          <button className="btn-primary" type="submit" disabled={!nome.trim()}>
            {"Criar"}
          </button>

            <button className="btn-danger" type="button" onClick={() => navigate("/lista-alunos")}>
              Cancelar
            </button>
        </div>
      </form>

      {error && <div className="form-error">{error}</div>}
    </div>
  );
}

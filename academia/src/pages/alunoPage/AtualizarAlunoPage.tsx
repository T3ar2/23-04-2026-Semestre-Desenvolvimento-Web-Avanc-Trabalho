import React, { useEffect, useState } from "react";
import { atualizarAluno, listarAlunoPorId } from "../../api/aluno";
import "../../cssDeTeste/AlunoPage.css";
import { useNavigate, useParams } from "react-router-dom";
import { AlunoDto } from "../../api/types";
import { PatternFormat } from 'react-number-format';

export function AtualizarAlunoPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [aluno, setAluno] = useState<AlunoDto | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");
  const [nascimento, setNascimento] = useState("");

  useEffect(() => {
    async function carregarAluno() {
      if (!id) return;

      setError(null);
      setLoading(true);

      try {
        const dadosAluno = await listarAlunoPorId(Number(id));
        setAluno(dadosAluno);
        setNome(dadosAluno.nome);
        setCpf(dadosAluno.cpf);
        setEmail(dadosAluno.email);

        if (dadosAluno.nascimento) {
          const dataFormatada = new Date(dadosAluno.nascimento)
            .toISOString()
            .split("T")[0];
          setNascimento(dataFormatada);
        }
      } catch (err: any) {
        setError(
          err?.response?.data?.message ??
            err?.message ??
            "Falha ao carregar os dados do aluno.",
        );
      } finally {
        setLoading(false);
      }
    }

    void carregarAluno();
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!id) return;

    setError(null);

    try {
      const payloadAluno = {
        nome,
        cpf,
        email,
        nascimento: new Date(nascimento),
      };

      await atualizarAluno(Number(id), payloadAluno);
      navigate("/lista-alunos");
    } catch (err: any) {
      setError(
        err?.response?.data?.message ??
          err?.message ??
          "Falha ao atualizar aluno.",
      );
    }
  }

  if (loading) {
    return <div className="loading">Carregando dados do aluno...</div>;
  }

  return (
    <div className="page">
      <h2 className="page-title">Atualizar Aluno</h2>

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
            <PatternFormat
              id="cpf"
              format="###.###.###-##"
              mask="_"
              placeholder="000.000.000-00"
              value={cpf}
              onValueChange={(values) => {
                setCpf(values.formattedValue);
              }}
              className="form-control"
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
            Atualizar
          </button>

          <button
            className="btn-danger"
            type="button"
            onClick={() => navigate("/lista-alunos")}
          >
            Cancelar
          </button>
        </div>
      </form>

      {error && <div className="form-error">{error}</div>}
    </div>
  );
}

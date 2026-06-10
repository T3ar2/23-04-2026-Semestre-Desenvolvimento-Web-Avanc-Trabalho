import React, { useEffect, useState } from "react";
import { atualizarAluno, listarAlunoPorId } from "../../api/aluno";
import "../../css/AtualizarAluno.css";
import { useNavigate, useParams } from "react-router-dom";
import { AlunoDto } from "../../api/types";
    // import { PatternFormat } from 'react-number-format';
    /* <PatternFormat
              id="cpf"
              format="###.###.###-##"
              mask="_"
              placeholder="000.000.000-00"
              value={cpf}
              onValueChange={(values) => {
                setCpf(values.formattedValue);
              }}
              className="form-control"
            /> */

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

  function formatarCpf(valor: string) {
    let v = valor.replace(/\D/g, "");
    if (v.length > 11) v = v.slice(0, 11);
    v = v.replace(/(\d{3})(\d)/, "$1.$2");
    v = v.replace(/(\d{3})(\d)/, "$1.$2");
    v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    return v;
  }

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
    <div className="page-body">
      <div className="card">
        <div className="card-header">
          <div className="card-header-left">
            <button type="button" className="btn-back" title="Voltar" onClick={() => navigate(-1)}>
              <svg viewBox="0 0 24 24"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" /></svg>
            </button>
            <span className="card-title"><strong>Atualizar</strong> dados do aluno</span>
          </div>
          <span className="card-subtitle">Acesso total aos perfis, histórico e informações de contato dos alunos</span>
          <button type="button" className="btn-close" title="Fechar" onClick={() => navigate('/lista-alunos')}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="card-body">
            <div className="form-group">
              <label className="form-label" htmlFor="nome">Nome completo:</label>
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
              <label className="form-label" htmlFor="email">E-mail:</label>
              <input
                id="email"
                type="email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="nascimento">Data de Nascimento:</label>
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
                <label className="form-label" htmlFor="cpf">CPF:</label>
                <input
                  id="cpf"
                  type="text"
                  className="form-input"
                  value={cpf}
                  maxLength={14}
                  onChange={(e) => setCpf(formatarCpf(e.target.value))}
                  placeholder="000.000.000-00"
                  required
                />
              </div>
            </div>
          </div>

          <div className="card-footer">
            <button type="submit" className="btn-cadastrar" disabled={!nome.trim()}>
              Atualizar
            </button>
          </div>
        </form>
      </div>
      {error && <div className="form-error" style={{ position: 'absolute', bottom: 20 }}>{error}</div>}
    </div>
  );
}

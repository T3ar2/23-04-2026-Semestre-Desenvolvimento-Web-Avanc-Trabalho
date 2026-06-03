import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../api/signup';

export function SignUpPage() {
  const navigate = useNavigate();
  const [nome, setNome] = useState('');
  const [loginValue, setLoginValue] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await register(nome, loginValue, senha);
      navigate('/login');
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ??
        err?.message ??
        'Falha ao cadastrar. Verifique os dados e tente novamente.';
      setError(String(msg));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page">
      <form className="card" onSubmit={handleSubmit} style={{ maxWidth: 420 }}>
        <h2 className="page-title">Cadastro</h2>

        <div className="form-group">
          <label htmlFor="nome">Nome</label>
          <input
            id="nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            autoComplete="name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="login">Usuário</label>
          <input
            id="login"
            value={loginValue}
            onChange={(e) => setLoginValue(e.target.value)}
            autoComplete="username"
          />
        </div>

        <div className="form-group">
          <label htmlFor="senha">Senha</label>
          <input
            id="senha"
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            autoComplete="new-password"
          />
        </div>

        <div className="form-actions">
          <button
            className="btn-primary"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Cadastrando...' : 'Cadastrar'}
          </button>
        </div>

        {error && <div className="form-error">{error}</div>}
      </form>
    </div>
  );
}
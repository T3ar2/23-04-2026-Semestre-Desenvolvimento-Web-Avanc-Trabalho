import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../api/signup';
import '../css/SignUp.css';

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
    <div className="signup-body">
      <form className="signup-card" onSubmit={handleSubmit}>
        <div className="signup-header">
          <h2 className="signup-title">Cadastro de Usuário</h2>
        </div>

        <div className="signup-content">
          <div className="signup-group">
            <label className="signup-label" htmlFor="nome">Nome Completo</label>
            <input
              id="nome"
              className="signup-input"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              autoComplete="name"
              required
            />
          </div>

          <div className="signup-group">
            <label className="signup-label" htmlFor="login">Usuário</label>
            <input
              id="login"
              className="signup-input"
              value={loginValue}
              onChange={(e) => setLoginValue(e.target.value)}
              autoComplete="username"
              required
            />
          </div>

          <div className="signup-group">
            <label className="signup-label" htmlFor="senha">Senha</label>
            <input
              id="senha"
              type="password"
              className="signup-input"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              autoComplete="new-password"
              required
            />
          </div>
        </div>

        <div className="signup-footer">
          <button
            className="btn-signup"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Cadastrando...' : 'Cadastrar'}
          </button>
          {error && <div className="signup-error">{error}</div>}
        </div>
      </form>
    </div>
  );
}
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/auth';
import '../css/Login.css';

export function LoginPage() {
  const navigate = useNavigate();
  const [loginValue, setLoginValue] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(loginValue, senha);
      navigate('/');
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ??
        err?.message ??
        'Falha ao autenticar. Verifique usuário/senha e se a API está rodando.';
      setError(String(msg));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-body">
      <form className="login-card" onSubmit={handleSubmit}>
        <div className="login-header">
          <h2 className="login-title">Acesso ao Sistema</h2>
        </div>

        <div className="login-content">
          <div className="login-group">
            <label className="login-label" htmlFor="login">Usuário</label>
            <input
              id="login"
              className="login-input"
              value={loginValue}
              onChange={(e) => setLoginValue(e.target.value)}
              autoComplete="username"
              required
            />
          </div>

          <div className="login-group">
            <label className="login-label" htmlFor="senha">Senha</label>
            <input
              id="senha"
              type="password"
              className="login-input"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>
        </div>

        <div className="login-footer">
          <button
            className="btn-login"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
          {error && <div className="login-error">{error}</div>}
        </div>
      </form>
    </div>
  );
}
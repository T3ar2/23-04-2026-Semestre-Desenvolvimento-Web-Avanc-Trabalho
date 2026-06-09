import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { isAuthenticated, logout } from '../api/auth';
import '../css/Header.css';

export function Layout() {
  const navigate = useNavigate();
  const auth = isAuthenticated();

  return (
    <div className="app-container">
      <header className="header">
        <Link to="/" className="logo">
          <span className="gym">GYM</span>
          <span className="flow">FLOW</span>
        </Link>

        <nav className="header-icons">
          <Link to="/" title="Home">
            <img src="../imgs/icone_home.svg" alt="Home" width="28" height="28" />
          </Link>

          {!auth ? (
            <Link to="/login" title="Entrar">
              <img src="../imgs/icone_login.svg" alt="Entrar" width="28" height="28" />
            </Link>
          ) : (
            <img 
              src="../imgs/icone_logout.svg" 
              alt="Sair" 
              width="28" 
              height="28" 
              style={{ cursor: 'pointer' }}
              onClick={() => {
                logout();
                navigate('/login');
              }} 
            />
          )}
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { isAuthenticated, logout } from '../api/auth';
import '../css/Header.css';
import iconeHome from '../imgs/icone_home.png';
import iconeLogout from '../imgs/icone_logout.png';

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
          {auth ? (
            <>
              <Link to="/" title="Home">
                <img src={iconeHome} alt="Home" width="48" height="28" />
              </Link>
              <img 
                src={iconeLogout} 
                alt="Sair" 
                width="48" 
                height="28" 
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  logout();
                  navigate('/login');
                }} 
              />
            </>
          ) : (
            <>
              <Link to="/login" className="header-text-link">Login</Link>
              <Link to="/signup" className="header-text-link">Cadastrar-se</Link>
            </>
          )}
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
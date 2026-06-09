import React from 'react';
import { Link } from 'react-router-dom';
import '../css/Home.css';

export function HomePage() {
  return (
    <div className="hero">
      <div className="cards-grid">
        <Link to="/lista-alunos" className="card">
          <div className="card-body">
            <p className="card-description">
              Acesso total aos perfis, histórico e informações de contato dos alunos
            </p>
            <div className="card-icon-placeholder">
              icone_alunos.svg<br />(grupo de pessoas)
            </div>
          </div>
          <div className="card-footer">
            <span>Gerenciar <strong>Alunos</strong></span>
          </div>
        </Link>

        <Link to="/plano-treino" className="card">
          <div className="card-body">
            <p className="card-description">
              Crie, edite e personalize as rotinas semanais de treino para a sua equipe
            </p>
            <div className="card-icon-placeholder">
              icone_planos.svg<br />(documento)
            </div>
          </div>
          <div className="card-footer">
            <span><strong>Planos</strong> de Treino</span>
          </div>
        </Link>

        <Link to="/lista-exercicios" className="card">
          <div className="card-body">
            <p className="card-description">
              Mantenha um catálogo completo de exercícios com detalhes técnicos e vídeos
            </p>
            <div className="card-icon-placeholder">
              icone_exercicios.svg<br />(haltere)
            </div>
          </div>
          <div className="card-footer">
            <span>Biblioteca de <strong>Exercícios</strong></span>
          </div>
        </Link>

        <Link to="/registro-treino" className="card">
          <div className="card-body">
            <p className="card-description">
              Monitore a frequência e o desempenho dos alunos nos treinos agendados
            </p>
            <div className="card-icon-placeholder">
              icone_registro.svg<br />(arquivo/caixa)
            </div>
          </div>
          <div className="card-footer">
            <span><strong>Registro</strong> de Treinos</span>
          </div>
        </Link>
      </div>
    </div>
  );
}
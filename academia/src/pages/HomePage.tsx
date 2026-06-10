import React from 'react';
import { Link } from 'react-router-dom';
import '../css/Home.css';
import iconeAlunos from '../imgs/icone_alunos.png';
import iconePlanos from '../imgs/icone_planos.png';
import iconeExercicios from '../imgs/icone_exercicios.png';
import iconeRegistro from '../imgs/icone_registros.png';

export function HomePage() {
  return (
    <div className="hero">
      <div className="cards-grid">
        <Link to="/lista-alunos" className="card">
          <div className="card-body">
            <p className="card-description">
              Acesso total aos perfis, histórico e informações de contato dos alunos
            </p>
            <img src={iconeAlunos} alt="Ícone de Alunos" className="card-icon" />
          </div>
          <div className="card-footer">
            <span><strong>Gerenciar Alunos</strong></span>
          </div>
        </Link>

        <Link to="/plano-treino" className="card">
          <div className="card-body">
            <p className="card-description">
              Crie, edite e personalize as rotinas semanais de treino para a sua equipe
            </p>
            <img src={iconePlanos} alt="Ícone de Planos" className="card-icon" />
          </div>
          <div className="card-footer">
            <span><strong>Planos de Treino</strong></span>
          </div>
        </Link>

        <Link to="/lista-exercicios" className="card">
          <div className="card-body">
            <p className="card-description">
              Mantenha um catálogo completo de exercícios com detalhes técnicos e vídeos
            </p>
            <img src={iconeExercicios} alt="Ícone de Exercícios" className="card-icon" />
          </div>
          <div className="card-footer">
            <span><strong>Biblioteca de Exercícios</strong></span>
          </div>
        </Link>

        <Link to="/registro-treino" className="card">
          <div className="card-body">
            <p className="card-description">
              Monitore a frequência e o desempenho dos alunos nos treinos agendados
            </p>
            <img src={iconeRegistro} alt="Ícone de Registro de Treinos" className="card-icon" />
          </div>
          <div className="card-footer">
            <span><strong>Registro de Treinos</strong></span>
          </div>
        </Link>
      </div>
    </div>
  );
}
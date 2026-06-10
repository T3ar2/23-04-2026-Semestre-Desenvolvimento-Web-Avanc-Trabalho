import React from 'react';
import { Link } from 'react-router-dom';
import '../css/Home.css';
import iconeAlunos from '../imgs/icone_alunos.png';
import iconePlanos from '../imgs/icone_planos.png';
import iconeExercicios from '../imgs/icone_exercicios.png';
import iconeRegistro from '../imgs/icone_registros.png';

export function HomePage() {
  return (
    <div className="gf-home-wrapper">
      <div className="gf-home-grid">
        <Link to="/lista-alunos" className="gf-action-card">
          <div className="gf-action-body">
            <p className="gf-action-desc">
              Acesso total aos perfis, histórico e informações de contato dos alunos
            </p>
            <img src={iconeAlunos} alt="Ícone de Alunos" className="gf-action-icon-alunos" />
          </div>
          <div className="gf-action-footer">
            <span className="gf-action-title"><strong>Gerenciar Alunos</strong></span>
          </div>
        </Link>

        <Link to="/plano-treino" className="gf-action-card">
          <div className="gf-action-body">
            <p className="gf-action-desc">
              Crie, edite e personalize as rotinas semanais de treino para a sua equipe
            </p>
            <img src={iconePlanos} alt="Ícone de Planos" className="gf-action-icon-planos" />
          </div>
          <div className="gf-action-footer">
            <span className="gf-action-title"><strong>Planos de Treino</strong></span>
          </div>
        </Link>

        <Link to="/lista-exercicios" className="gf-action-card">
          <div className="gf-action-body">
            <p className="gf-action-desc">
              Mantenha um catálogo completo de exercícios com detalhes técnicos e vídeos
            </p>
            <img src={iconeExercicios} alt="Ícone de Exercícios" className="gf-action-icon-exercicios" />
          </div>
          <div className="gf-action-footer">
            <span className="gf-action-title"><strong>Biblioteca de Exercícios</strong></span>
          </div>
        </Link>

        <Link to="/registro-treino" className="gf-action-card">
          <div className="gf-action-body">
            <p className="gf-action-desc">
              Monitore a frequência e o desempenho dos alunos nos treinos agendados
            </p>
            <img src={iconeRegistro} alt="Ícone de Registro de Treinos" className="gf-action-icon-registros"/>
          </div>
          <div className="gf-action-footer">
            <span className="gf-action-title"><strong>Registro de Treinos</strong></span>
          </div>
        </Link>
      </div>
    </div>
  );
}
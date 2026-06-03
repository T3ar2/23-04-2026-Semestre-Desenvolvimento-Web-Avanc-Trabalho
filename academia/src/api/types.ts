export type LoginResponse = {
    token: string;
    nome: string;
    usuario: string;
}

export type CadastroUsuarioPayload = {
  nome: string;
  login: string;
  senhaHash: string;
  role: string;
}

export type AlunoDto = {
    id: number;
    nome: string;
    cpf: string;
    email: string;
    nascimento: Date;
}

export type ExercicioDto = {
    id: number;
    nome: string;
    grupoMuscular: string;
}


// planos de treino

export type ExercicioPlanejadoCreateDto = {
  exercicioId: number;
  series: number;
  repeticoes: number;
}

export type ExercicioPlanejadoResponseDto = {
  exercicioId: number;
  nomeExercicio: string;
  series: number;
  repeticoes: number;
}

export type PlanoTreinoCreateDto = {
  nomeTreino: string;
  alunoId: number;
  exerciciosPlanejados: ExercicioPlanejadoCreateDto[];
}

export type PlanoTreinoDto = {
  id: number;
  nomeTreino: string;
  alunoId: number;
  exerciciosPlanejados: ExercicioPlanejadoResponseDto[];
}

export type ExercicioPlanejadoUpdateDto = {
  exercicioId: number;
  series: number;
  repeticoes: number;
}

export type PlanoTreinoUpdateDto = {
  nomeTreino: string;
  alunoId: number;
  exerciciosPlanejados: ExercicioPlanejadoUpdateDto[];
}

// registro de treino

export type ExercicioRealizadoCreateDto = {
  exercicioId: number;
  series: number;
  repeticoes: number;
  carga: number;
}

export type ExercicioRealizadoResponseDto = {
  exercicioId: number;
  nomeExercicio: string;
  series: number;
  repeticoes: number;
  carga: number;
}

export type RegistroTreinoCreateDto = {
  alunoId: number;
  planoTreinoId?: number | null;
  dataExecucao: string;
  exerciciosRealizados: ExercicioRealizadoCreateDto[];
}

export type RegistroTreinoResponseDto = {
  id: number;
  alunoId: number;
  planoTreinoId?: number | null;
  dataExecucao: string;
  exerciciosRealizados: ExercicioRealizadoResponseDto[];
}

export type ExercicioRealizadoUpdateDto = {
  exercicioId: number;
  series: number;
  repeticoes: number;
  carga: number;
}

export type RegistroTreinoUpdateDto = {
  alunoId: number;
  planoTreinoId?: number | null;
  dataExecucao: string;
  exerciciosRealizados: ExercicioRealizadoUpdateDto[];
}

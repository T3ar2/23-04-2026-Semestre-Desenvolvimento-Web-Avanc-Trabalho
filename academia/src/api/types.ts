export type LoginResponse = {
    token: string;
    nome: string;
    usuario: string;
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
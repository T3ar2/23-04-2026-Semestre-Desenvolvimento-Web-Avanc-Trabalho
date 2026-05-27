import { http } from "./http";
import { AlunoDto } from "./types";


export async function listarAlunos() {
  const { data } = await http.get<AlunoDto[]>('/api/Aluno');
  return data;
}

export async function listarAlunoPorId(id: number) {
  const { data } = await http.get<{ id: number }>(`/api/Aluno/${id}`);
  return data;
}

export async function criarAluno(payload: { nome: string; cpf: string; email: string, dataNascimento: Date }) {
  const { data } = await http.post<{ id: number }>('/api/Aluno', payload);
  return data;
}

export async function atualizarAluno(id: number, payload: { nome: string; cpf: string; email: string, dataNascimento: Date }) {
  await http.put(`/api/Aluno/${id}`, payload);
}

export async function removerAluno(id: number) {
  await http.delete(`/api/Aluno/${id}`);
}
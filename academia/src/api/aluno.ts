import { http } from "./http";
import { AlunoDto } from "./types";


export async function listarAlunos() {
  const { data } = await http.get<AlunoDto[]>('/api/Aluno');
  return data;
}

export async function listarAlunoPorId(id: number) {
  const { data } = await http.get<AlunoDto>(`/api/Aluno/${id}`);
  return data;
}

export async function criarAluno(payload: Omit<AlunoDto, 'id'>) {
  const { data } = await http.post<AlunoDto>('/api/Aluno', payload);
  return data;
}

export async function atualizarAluno(id: number, payload: Omit<AlunoDto, 'id'>) {
  await http.put(`/api/Aluno/${id}`, payload);
}

export async function removerAluno(id: number) {
  await http.delete(`/api/Aluno/${id}`);
}
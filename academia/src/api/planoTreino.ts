import { http } from "./http";
import { PlanoTreinoDto, PlanoTreinoCreateDto, PlanoTreinoUpdateDto } from "./types";

export async function listarPlanosTreino() {
  const { data } = await http.get<PlanoTreinoDto[]>('/api/PlanoTreino');
  return data;
}

export async function listarPlanoTreinoPorId(id: number) {
  const { data } = await http.get<PlanoTreinoDto>(`/api/PlanoTreino/${id}`);
  return data;
}

export async function criarPlanoTreino(payload: PlanoTreinoCreateDto) {
  const { data } = await http.post<number>('/api/PlanoTreino', payload);
  return data;
}

export async function atualizarPlanoTreino(id: number, payload: PlanoTreinoUpdateDto) {
  await http.put(`/api/PlanoTreino/${id}`, payload);
}

export async function removerPlanoTreino(id: number) {
  await http.delete(`/api/PlanoTreino/${id}`);
}

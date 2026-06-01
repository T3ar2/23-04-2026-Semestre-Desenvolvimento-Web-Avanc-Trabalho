import { http } from "./http";
import { RegistroTreinoResponseDto, RegistroTreinoCreateDto, RegistroTreinoUpdateDto } from "./types";

export async function listarRegistrosTreino() {
  const { data } = await http.get<RegistroTreinoResponseDto[]>('/api/RegistroTreino');
  return data;
}

export async function listarRegistroTreinoPorId(id: number) {
  const { data } = await http.get<RegistroTreinoResponseDto>(`/api/RegistroTreino/${id}`);
  return data;
}

export async function criarRegistroTreino(payload: RegistroTreinoCreateDto) {
  const { data } = await http.post<number>('/api/RegistroTreino', payload);
  return data;
}

export async function atualizarRegistroTreino(id: number, payload: RegistroTreinoUpdateDto) {
  await http.put(`/api/RegistroTreino/${id}`, payload);
}

export async function removerRegistroTreino(id: number) {
  await http.delete(`/api/RegistroTreino/${id}`);
}
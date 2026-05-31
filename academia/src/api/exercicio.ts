import { http } from "./http";
import { ExercicioDto } from "./types";


export async function listarExercicios() {
  const { data } = await http.get<ExercicioDto[]>('/api/Exercicio');
  return data;
}

export async function listarExercicioPorId(id: number) {
  const { data } = await http.get<ExercicioDto>(`/api/Exercicio/${id}`);
  return data;
}

export async function criarExercicio(payload: Omit<ExercicioDto, 'id'>) {
  const { data } = await http.post<ExercicioDto>('/api/Exercicio', payload);
  return data;
}

export async function atualizarExercicio(id: number, payload: Omit<ExercicioDto, 'id'>) {
  await http.put(`/api/Exercicio/${id}`, payload);
}

export async function removerExercicio(id: number) {
  await http.delete(`/api/Exercicio/${id}`);
}
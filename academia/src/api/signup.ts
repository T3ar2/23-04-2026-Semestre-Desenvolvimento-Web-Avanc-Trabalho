import { http } from './http';
import { CadastroUsuarioPayload } from './types';

export async function register(nome: string, login: string, senhaHash: string) {
  const payload: CadastroUsuarioPayload = {
    nome,
    login,
    senhaHash,
    role: 'Admin' 
  };

  const { data } = await http.post('/api/login', payload);
  return data;
}
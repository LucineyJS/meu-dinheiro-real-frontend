
export interface UsuarioCadastro {
  nome: string;
  email: string;
  senhaHash: string;
}

export interface UsuarioLogin {
  email: string;
  senhaHash: string;
}

export interface AuthResponse {
  token: string;
}

export interface Categoria {
  id?: number;
  nome: string;
  tipo: 'RECEITA' | 'DESPESA';
  icone: string;
}

export interface Lancamento {
  id?: number;
  valor: number;
  descricao: string;
  tipo: 'RECEITA' | 'DESPESA';
  dataLancamento: string;
  status: 'EFETIVADO' | 'PENDENTE';
  idCategoria: number;
}
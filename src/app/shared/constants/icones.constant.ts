export interface IconeOpcao {
  nome: string;
  exibicao: string;
}

export const LISTA_ICONES: IconeOpcao[] = [
  // --- GANHOS / RECEITAS ---
  { nome: 'attach_money', exibicao: 'Salário / Renda Principal' },
  { nome: 'work', exibicao: 'Freelance / Trabalho Extra' },
  { nome: 'trending_up', exibicao: 'Rendimentos / Investimentos' },
  { nome: 'savings', exibicao: 'Poupança / Guardar Dinheiro' },
  { nome: 'card_giftcard', exibicao: 'Presente / Bônus / Premiação' },
  { nome: 'currency_exchange', exibicao: 'Reembolso / Devolução' },

  // --- GASTOS ESSENCIAIS & FIXOS ---
  { nome: 'home', exibicao: 'Moradia / Aluguel / Condomínio' },
  { nome: 'lightbulb', exibicao: 'Contas (Luz / Água / Gás / Internet)' },
  { nome: 'shopping_cart', exibicao: 'Supermercado / Feira' },
  { nome: 'medical_services', exibicao: 'Saúde / Farmácia / Plano' },
  { nome: 'school', exibicao: 'Educação / Cursos / Escola' },
  { nome: 'receipt_long', exibicao: 'Boletos / Impostos / Taxas' },

  // --- TRANSPORTE & VEÍCULOS ---
  { nome: 'directions_car', exibicao: 'Carro / Combustível / IPVA' },
  { nome: 'directions_bus', exibicao: 'Transporte Público / Uber' },
  { nome: 'build', exibicao: 'Manutenção / Oficina' },

  // --- ESTILO DE VIDA & LAZER ---
  { nome: 'restaurant', exibicao: 'Restaurante / Alimentação' },
  { nome: 'local_cafe', exibicao: 'Café / Lanches / Delivery' },
  { nome: 'shopping_bag', exibicao: 'Compras / Roupas / Acessórios' },
  { nome: 'sports_esports', exibicao: 'Lazer / Jogos / Assinaturas' },
  { nome: 'fitness_center', exibicao: 'Academia / Esportes' },
  { nome: 'content_cut', exibicao: 'Cuidado Pessoal / Beleza' },
  { nome: 'pets', exibicao: 'Pet Shop / Veterinário' },

  // --- DIVERSOS / PADRÃO ---
  { nome: 'credit_card', exibicao: 'Cartão de Crédito' },
  { nome: 'account_balance_wallet', exibicao: 'Carteira / Dinheiro em Espécie' },
  { nome: 'label', exibicao: 'Outros / Diversos' }
];

export function getNomeExibicaoIcone(nomeIcone?: string): string {
  const iconeEncontrado = LISTA_ICONES.find(item => item.nome === nomeIcone);
  return iconeEncontrado ? iconeEncontrado.exibicao : 'Outros / Diversos';
}

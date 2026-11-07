/**
 * Repositório Isolado de Dados Mockados e Simulador de Triagem IA (Spring AI Fallback)
 * Mantido exclusivamente em `src/mocks/` como referência até a conexão definitiva
 * com o Backend Java (Spring Boot + Spring Data JPA + Spring Security + Spring AI).
 */

import { Chamado, Usuario, IntegranteGrupo, CategoriaChamado, PrioridadeChamado } from '../types';
import { INTEGRANTES_EQUIPE } from '../config/version';

export const DEMO_USER: Usuario = {
  id: 'usr_fiap_001',
  nome: 'Lucas Gabriel Cidadão',
  email: 'cidadao.fiap@zelafix.com.br',
  cpf: '123.456.789-00',
  telefone: '(11) 98765-4321',
  bairro: 'Bela Vista / Paulista',
  createdAt: '2026-02-15T10:00:00.000Z',
  avatarUrl:
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
};

export const INTEGRANTES_GRUPO: IntegranteGrupo[] = INTEGRANTES_EQUIPE;

export const FOTOS_OCORRENCIAS_MOCK = [
  {
    rotulo: 'Buraco',
    url: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
  },
  {
    rotulo: 'Poste Apagado',
    url: 'https://images.unsplash.com/photo-1780415493361-07c5a78dbaef?auto=format&fit=crop&w=800&q=80',
  },
  {
    rotulo: 'Bueiro',
    url: 'https://images.unsplash.com/photo-1581375922343-ac6b40caf5e3?auto=format&fit=crop&w=800&q=80',
  },
  {
    rotulo: 'Entulho',
    url: 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=800&q=80',
  },
  {
    rotulo: 'Árvore/Galho',
    url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80',
  },
];

/**
 * Simula a resposta do serviço de IA Generativa do Backend Java (Spring AI)
 * quando o servidor ainda não está conectado.
 */
export function simularTriagemSpringAi(
  categoria: CategoriaChamado,
  titulo: string,
  descricao: string
): {
  prioridade: PrioridadeChamado;
  parecerIa: string;
  orgaoResponsavel: string;
} {
  const texto = `${titulo} ${descricao}`.toLowerCase();
  const temTermoCritico =
    texto.includes('risco') ||
    texto.includes('perigo') ||
    texto.includes('acidente') ||
    texto.includes('fiação') ||
    texto.includes('alagamento') ||
    texto.includes('profundo') ||
    texto.includes('cadeirante') ||
    texto.includes('idoso');

  switch (categoria) {
    case 'Buraco na Rua':
      return {
        prioridade: temTermoCritico ? 'Crítica' : 'Alta',
        orgaoResponsavel: 'Subprefeitura — Equipe de Pavimentação e Tapa-Buraco',
        parecerIa:
          'Triagem IA (Visão + Spring AI): Deformação asfáltica detectada na via. Risco de acidentes para motociclistas e danos mecânicos. Recomendado reparo prioritário com massa asfáltica.',
      };
    case 'Bueiro Entupido':
      return {
        prioridade: temTermoCritico ? 'Crítica' : 'Alta',
        orgaoResponsavel: 'Subprefeitura — Drenagem Urbana e Hidrojateamento',
        parecerIa:
          'Triagem IA (Visão + Spring AI): Obstrução de boca de lobo identificada. Risco elevado de bolsão d’água e alagamento em dias de chuva. Recomendada desobstrução preventiva.',
      };
    case 'Iluminação Pública':
      return {
        prioridade: 'Alta',
        orgaoResponsavel: 'Central Ilumina SP — Manutenção de Rede LED',
        parecerIa:
          'Triagem IA (Visão + Spring AI): Ponto escuro identificado em via pública, comprometendo a segurança noturna de pedestres e moradores. Encaminhado para substituição de luminária.',
      };
    case 'Poda de Árvore':
      return {
        prioridade: temTermoCritico ? 'Crítica' : 'Média',
        orgaoResponsavel: 'Defesa Civil & Equipe de Manejo Arbóreo',
        parecerIa:
          'Triagem IA (Visão + Spring AI): Interferência arbórea identificada no espaço urbano. Caso haja contato com rede elétrica, requer ação conjunta com a concessionária de energia.',
      };
    case 'Vazamento de Água':
      return {
        prioridade: 'Alta',
        orgaoResponsavel: 'Concessionária de Saneamento (Sabesp) & Fiscalização Municipal',
        parecerIa:
          'Triagem IA (Visão + Spring AI): Vazamento ativo em via pública com desperdício hídrico e risco de solapamento do asfalto.',
      };
    case 'Sinalização e Trânsito':
      return {
        prioridade: temTermoCritico ? 'Crítica' : 'Alta',
        orgaoResponsavel: 'CET — Engenharia de Tráfego e Sinalização',
        parecerIa:
          'Triagem IA (Visão + Spring AI): Falha de sinalização viária com impacto direto na segurança do cruzamento e travessia de pedestres.',
      };
    case 'Entulho e Descarte Irregular':
      return {
        prioridade: 'Média',
        orgaoResponsavel: 'Subprefeitura — Limpeza Pública e Fiscalização Ambiental',
        parecerIa:
          'Triagem IA (Visão + Spring AI): Acúmulo irregular de resíduos sólidos na calçada/via, prejudicando a mobilidade peatonal e higiene do bairro.',
      };
    default:
      return {
        prioridade: temTermoCritico ? 'Alta' : 'Baixa',
        orgaoResponsavel: 'Central de Zeladoria Municipal 156',
        parecerIa:
          'Triagem IA (Visão + Spring AI): Solicitação de manutenção urbana catalogada e encaminhada para vistoria técnica da regional.',
      };
  }
}

export const INITIAL_MOCK_CHAMADOS: Chamado[] = [
  {
    id: 'chm_001',
    protocolo: 'ZEL-2026-0891',
    titulo: 'Buraco profundo na faixa de ônibus',
    descricao:
      'Buraco de aproximadamente 40cm de diâmetro na faixa exclusiva de ônibus, danificando amortecedores e gerando risco de acidentes para motociclistas.',
    categoria: 'Buraco na Rua',
    status: 'Aberto',
    prioridade: 'Crítica',
    apoiosCount: 34,
    apoiadoPeloUsuario: true,
    orgaoResponsavel: 'SPTrans & Subprefeitura Sé — Equipe Tapa-Buraco',
    parecerIa:
      'Triagem IA (Visão + Spring AI): Cratera profunda detectada em corredor arterial de tráfego intenso. Risco severo de queda para motociclistas e danos a coletivos. Atendimento emergencial recomendado em até 24h.',
    localizacao: {
      logradouro: 'Avenida Paulista',
      numero: '1106',
      bairro: 'Bela Vista',
      cidade: 'São Paulo',
      cep: '01310-100',
      pontoReferencia: 'Em frente ao Edifício FIESP e estação Trianon-Masp',
      latitude: -23.5629,
      longitude: -46.6544,
    },
    fotoUrl:
      'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
    dataAbertura: '2026-11-03T14:30:00.000Z',
    dataAtualizacao: '2026-11-03T14:30:00.000Z',
    autorId: 'usr_fiap_001',
    autorNome: 'Lucas Gabriel Cidadão',
    historico: [
      {
        id: 'hist_001',
        data: '2026-11-03T14:30:00.000Z',
        novoStatus: 'Aberto',
        observacao:
          'Chamado protocolado pelo cidadão via aplicativo móvel e classificado como Prioridade Crítica pela IA.',
        autorNome: 'Lucas Gabriel Cidadão',
      },
    ],
  },
  {
    id: 'chm_005',
    protocolo: 'ZEL-2026-0810',
    titulo: 'Galho de grande porte com risco de queda sobre fiação',
    descricao:
      'Árvore antiga com galho rachado após vendaval. O galho está apoiado sobre a fiação de média tensão e pode se desprender.',
    categoria: 'Poda de Árvore',
    status: 'Em Andamento',
    prioridade: 'Crítica',
    apoiosCount: 29,
    apoiadoPeloUsuario: false,
    orgaoResponsavel: 'Defesa Civil SP & Concessionária de Energia',
    parecerIa:
      'Triagem IA (Visão + Spring AI): Identificado galho estrutural comprometido em contato com rede aérea. Risco crítico de rompimento de cabo elétrico e interdição de via.',
    localizacao: {
      logradouro: 'Rua Haddock Lobo',
      numero: '420',
      bairro: 'Cerqueira César',
      cidade: 'São Paulo',
      cep: '01414-001',
      pontoReferencia: 'Próximo à esquina com Oscar Freire',
      latitude: -23.5658,
      longitude: -46.6652,
    },
    fotoUrl:
      'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80',
    dataAbertura: '2026-11-01T16:45:00.000Z',
    dataAtualizacao: '2026-11-02T11:00:00.000Z',
    autorId: 'usr_fiap_001',
    autorNome: 'Lucas Gabriel Cidadão',
    historico: [
      {
        id: 'hist_005_1',
        data: '2026-11-01T16:45:00.000Z',
        novoStatus: 'Aberto',
        observacao: 'Alerta emitido pelo cidadão.',
        autorNome: 'Lucas Gabriel Cidadão',
      },
      {
        id: 'hist_005_2',
        data: '2026-11-02T11:00:00.000Z',
        statusAnterior: 'Aberto',
        novoStatus: 'Em Andamento',
        observacao:
          'Equipe da Defesa Civil e Enel agendadas para poda com desligamento preventivo.',
        autorNome: 'Defesa Civil SP',
      },
    ],
  },
  {
    id: 'chm_002',
    protocolo: 'ZEL-2026-0875',
    titulo: 'Poste com lâmpada queimada há 4 noites',
    descricao:
      'Iluminação pública totalmente inoperante no trecho entre a Rua Peixoto Gomide e Alameda Ministro Rocha Azevedo, gerando insegurança para pedestres e estudantes no período noturno.',
    categoria: 'Iluminação Pública',
    status: 'Em Andamento',
    prioridade: 'Alta',
    apoiosCount: 21,
    apoiadoPeloUsuario: false,
    orgaoResponsavel: 'Central Ilumina SP — Manutenção Elétrica',
    parecerIa:
      'Triagem IA (Visão + Spring AI): Falha de luminária LED constatada em zona de alto fluxo peatonal noturno. Impacto direto na segurança viária e de pedestres.',
    localizacao: {
      logradouro: 'Alameda Santos',
      numero: '1800',
      bairro: 'Cerqueira César',
      cidade: 'São Paulo',
      cep: '01418-102',
      pontoReferencia: 'Esquina com Ministro Rocha Azevedo',
      latitude: -23.5601,
      longitude: -46.6592,
    },
    fotoUrl:
      'https://images.unsplash.com/photo-1780415493361-07c5a78dbaef?auto=format&fit=crop&w=800&q=80',
    dataAbertura: '2026-10-31T21:10:00.000Z',
    dataAtualizacao: '2026-11-02T09:15:00.000Z',
    autorId: 'usr_fiap_002',
    autorNome: 'Mariana Lima',
    historico: [
      {
        id: 'hist_002_1',
        data: '2026-10-31T21:10:00.000Z',
        novoStatus: 'Aberto',
        observacao: 'Solicitação registrada no sistema.',
        autorNome: 'Mariana Lima',
      },
      {
        id: 'hist_002_2',
        data: '2026-11-02T09:15:00.000Z',
        statusAnterior: 'Aberto',
        novoStatus: 'Em Andamento',
        observacao: 'Equipe de manutenção elétrica despachada para vistoria no local.',
        autorNome: 'Central Ilumina SP',
      },
    ],
  },
  {
    id: 'chm_004',
    protocolo: 'ZEL-2026-0832',
    titulo: 'Descarte ilegal de entulho e móveis velhos',
    descricao:
      'Sofá abandonado, restos de gesso e madeira descartados irregularmente na calçada pública, impedindo passagem de cadeirantes e pedestres.',
    categoria: 'Entulho e Descarte Irregular',
    status: 'Aberto',
    prioridade: 'Média',
    apoiosCount: 15,
    apoiadoPeloUsuario: false,
    orgaoResponsavel: 'Subprefeitura — Limpeza Urbana / Cata-Bagulho',
    parecerIa:
      'Triagem IA (Visão + Spring AI): Obstrução de passeio público por resíduos volumosos. Compromete a acessibilidade (NBR 9050) e favorece proliferação de vetores.',
    localizacao: {
      logradouro: 'Rua Bela Cintra',
      numero: '950',
      bairro: 'Consolação',
      cidade: 'São Paulo',
      cep: '01415-000',
      pontoReferencia: 'Ao lado do terreno baldio',
      latitude: -23.5574,
      longitude: -46.6621,
    },
    fotoUrl:
      'https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=800&q=80',
    dataAbertura: '2026-11-04T08:20:00.000Z',
    dataAtualizacao: '2026-11-04T08:20:00.000Z',
    autorId: 'usr_fiap_003',
    autorNome: 'Carolina Mendes',
    historico: [
      {
        id: 'hist_004_1',
        data: '2026-11-04T08:20:00.000Z',
        novoStatus: 'Aberto',
        observacao: 'Denúncia de descarte clandestino registrada.',
        autorNome: 'Carolina Mendes',
      },
    ],
  },
  {
    id: 'chm_003',
    protocolo: 'ZEL-2026-0850',
    titulo: 'Bueiro entupido com risco iminente de alagamento',
    descricao:
      'Boca de lobo completamente obstruída com folhas secas, garrafas plásticas e terra. Durante chuvas moderadas a calçada já transborda.',
    categoria: 'Bueiro Entupido',
    status: 'Resolvido',
    prioridade: 'Alta',
    apoiosCount: 18,
    apoiadoPeloUsuario: true,
    orgaoResponsavel: 'Subprefeitura Sé — Drenagem e Águas Pluviais',
    parecerIa:
      'Triagem IA (Visão + Spring AI): Obstrução severa de boca de lobo identificada. Alta probabilidade de alagamento localizado em caso de precipitação acima de 15mm.',
    localizacao: {
      logradouro: 'Rua Augusta',
      numero: '1508',
      bairro: 'Consolação',
      cidade: 'São Paulo',
      cep: '01304-001',
      pontoReferencia: 'Próximo à padaria Bella Augusta',
      latitude: -23.5539,
      longitude: -46.6577,
    },
    fotoUrl:
      'https://images.unsplash.com/photo-1581375922343-ac6b40caf5e3?auto=format&fit=crop&w=800&q=80',
    dataAbertura: '2026-10-25T11:00:00.000Z',
    dataAtualizacao: '2026-10-28T16:40:00.000Z',
    autorId: 'usr_fiap_001',
    autorNome: 'Lucas Gabriel Cidadão',
    feedbackResolucao:
      'Equipe de limpeza urbana realizou hidrojateamento e desobstrução da galeria pluvial. Grade substituída e canal desobstruído com sucesso.',
    historico: [
      {
        id: 'hist_003_1',
        data: '2026-10-25T11:00:00.000Z',
        novoStatus: 'Aberto',
        observacao: 'Ocorrência enviada.',
        autorNome: 'Lucas Gabriel Cidadão',
      },
      {
        id: 'hist_003_2',
        data: '2026-10-26T08:00:00.000Z',
        statusAnterior: 'Aberto',
        novoStatus: 'Em Andamento',
        observacao: 'Ordem de serviço nº 44102 emitida para a concessionária.',
        autorNome: 'Subprefeitura Sé',
      },
      {
        id: 'hist_003_3',
        data: '2026-10-28T16:40:00.000Z',
        statusAnterior: 'Em Andamento',
        novoStatus: 'Resolvido',
        observacao: 'Serviço concluído e vistoriado pela fiscalização.',
        autorNome: 'Subprefeitura Sé',
      },
    ],
  },
];

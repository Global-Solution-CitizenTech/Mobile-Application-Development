/**
 * Dados Iniciais e Mock para Demonstração e Avaliação
 * Simula ocorrências reais de zeladoria urbana em São Paulo
 */

import { Chamado, Usuario, IntegranteGrupo } from '../types';

export const DEMO_USER: Usuario = {
  id: 'usr_fiap_001',
  nome: 'Lucas Gabriel Cidadão',
  email: 'cidadao.fiap@citizentech.com.br',
  cpf: '123.456.789-00',
  telefone: '(11) 98765-4321',
  bairro: 'Bela Vista / Paulista',
  createdAt: '2026-02-15T10:00:00.000Z',
  avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
};

export const INTEGRANTES_GRUPO: IntegranteGrupo[] = [
  {
    nome: 'Enzo Okuizumi',
    rm: '561432',
    turma: '2TDSPG',
    funcao: 'Mobile Developer & Arquiteto React Native',
    github: 'https://github.com/EnzoOkuizumiFiap',
    linkedin: 'https://www.linkedin.com/in/enzo-okuizumi-b60292256/',
  },
  {
    nome: 'Gustavo Okada',
    rm: '563428',
    turma: '2TDSPG',
    funcao: 'Backend Developer & API Integration',
    github: 'https://github.com/Gdev3356',
    linkedin: 'https://www.linkedin.com/in/gustavo-okada-53a3b8359/',
  },
  {
    nome: 'Lucas Barros Gouveia',
    rm: '566422',
    turma: '2TDSPG',
    funcao: 'Fullstack Developer & Database Architect',
    github: 'https://github.com/LuzBGouveia',
    linkedin: 'https://www.linkedin.com/in/lucas-barros-gouveia-09b147355/',
  },
  {
    nome: 'Luna de Carvalho Guimarães',
    rm: '562290',
    turma: '2TDSPG',
    funcao: 'UI/UX Designer & Mobile Frontend Specialist',
    github: 'https://github.com/lunaguima',
    linkedin: 'https://www.linkedin.com/in/luna-guimar%C3%A3es-b0ba82309/',
  },
  {
    nome: 'Milton Marcelino',
    rm: '564836',
    turma: '2TDSPG',
    funcao: 'DevOps & Quality Assurance (QA)',
    github: 'https://github.com/MiltonMarcelino',
    linkedin: 'https://www.linkedin.com/in/milton-marcelino-250298142',
  },
];

export const INITIAL_MOCK_CHAMADOS: Chamado[] = [
  {
    id: 'chm_001',
    protocolo: 'ZEL-2026-0891',
    titulo: 'Buraco profundo na faixa de ônibus',
    descricao:
      'Buraco de aproximadamente 40cm de diâmetro na faixa exclusiva de ônibus, danificando amortecedores e gerando risco de acidentes para motociclistas.',
    categoria: 'Buraco na Rua',
    status: 'Aberto',
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
        observacao: 'Chamado protocolado pelo cidadão via aplicativo móvel.',
        autorNome: 'Lucas Gabriel Cidadão',
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
      'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=800&q=80',
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
    id: 'chm_003',
    protocolo: 'ZEL-2026-0850',
    titulo: 'Bueiro entupido com risco iminente de alagamento',
    descricao:
      'Boca de lobo completamente obstruída com folhas secas, garrafas plásticas e terra. Durante chuvas moderadas a calçada já transborda.',
    categoria: 'Bueiro Entupido',
    status: 'Resolvido',
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
      'https://images.unsplash.com/photo-1584463699042-4541cb9154a4?auto=format&fit=crop&w=800&q=80',
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
  {
    id: 'chm_004',
    protocolo: 'ZEL-2026-0832',
    titulo: 'Descarte ilegal de entulho e móveis velhos',
    descricao:
      'Sofá abandonado, restos de gesso e madeira descartados irregularmente na calçada pública, impedindo passagem de cadeirantes e pedestres.',
    categoria: 'Entulho e Descarte Irregular',
    status: 'Aberto',
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
    id: 'chm_005',
    protocolo: 'ZEL-2026-0810',
    titulo: 'Galho de grande porte com risco de queda sobre fiação',
    descricao:
      'Árvore antiga com galho rachado após vendaval. O galho está apoiado sobre a fiação de média tensão e pode se desprender.',
    categoria: 'Poda de Árvore',
    status: 'Em Andamento',
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
        observacao: 'Equipe da Defesa Civil e Enel agendadas para poda com desligamento preventivo.',
        autorNome: 'Defesa Civil SP',
      },
    ],
  },
];


import Constants from 'expo-constants';
import { IntegranteGrupo } from '../types';

export interface GitCommitMetadata {
  commitHash: string;
  shortCommitHash: string;
  commitDate: string;
  branch: string;
  commitMessage: string;
}

const dynamicGitInfo = Constants.expoConfig?.extra?.gitCommit as
  | Partial<GitCommitMetadata>
  | undefined;

const FALLBACK_HASH =
  process.env.EXPO_PUBLIC_COMMIT_HASH || '516b8b92afbb31a075c1f5befbc59cc9ebc5fcc8';

export const GIT_COMMIT_INFO: GitCommitMetadata = {
  commitHash: dynamicGitInfo?.commitHash || FALLBACK_HASH,
  shortCommitHash: dynamicGitInfo?.shortCommitHash || FALLBACK_HASH.slice(0, 7),
  commitDate: dynamicGitInfo?.commitDate || '2026-11-06',
  branch: dynamicGitInfo?.branch || 'main',
  commitMessage:
    dynamicGitInfo?.commitMessage ||
    'feat(mobile): arquitetura TanStack Query + Zod + UI Clean',
};

export const INTEGRANTES_EQUIPE: IntegranteGrupo[] = [
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

export const APP_VERSION_INFO = {
  appName: 'ZelaFix',
  tagline: 'Zeladoria Urbana Colaborativa & Cidades Sustentáveis (ODS 11)',
  version: '1.0.0',
  buildNumber: '12',
  sprint: 'Global Solution 2026/2',
  disciplina: 'Mobile Application Development',
  instituicao: 'FIAP - 2TDSPG',
  challenge: 'ZelaFix — Tecnologia com o cidadão no centro da inovação',
  commitHash: GIT_COMMIT_INFO.commitHash,
  shortCommitHash: GIT_COMMIT_INFO.shortCommitHash,
  commitDate: GIT_COMMIT_INFO.commitDate,
  branch: GIT_COMMIT_INFO.branch,
  commitMessage: GIT_COMMIT_INFO.commitMessage,
  target: 'Firebase App Distribution / APK Android',
  equipe: INTEGRANTES_EQUIPE,
} as const;

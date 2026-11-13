import Constants from 'expo-constants';
import type { GitCommitMetadata, IntegranteGrupo } from '@/types/version';

const dynamicGitInfo = Constants.expoConfig?.extra?.gitCommit as Partial<GitCommitMetadata> | undefined;

const FALLBACK_HASH = 'local-dev';
const fallbackHash = dynamicGitInfo?.commitHash || FALLBACK_HASH;

export const GIT_COMMIT_INFO: GitCommitMetadata = {
  commitHash: fallbackHash,
  shortCommitHash: dynamicGitInfo?.shortCommitHash || fallbackHash.slice(0, 7),
  commitDate: dynamicGitInfo?.commitDate || '',
  branch: dynamicGitInfo?.branch || 'main',
  commitMessage: dynamicGitInfo?.commitMessage || 'Build local (metadados Git indisponíveis)',
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
  version: Constants.expoConfig?.version ?? '1.0.0',
  buildNumber: String(
    Constants.expoConfig?.android?.versionCode ??
      Constants.expoConfig?.ios?.buildNumber ??
      'dev'
  ),
};

export interface IntegranteGrupo {
  nome: string;
  rm: string;
  turma: string;
  funcao: string;
  github: string;
  linkedin: string;
}

export interface GitCommitMetadata {
  commitHash: string;
  shortCommitHash: string;
  commitDate: string;
  branch: string;
  commitMessage: string;
}

export interface AppVersionInfo {
  appName: string;
  tagline: string;
  version: string;
  buildNumber: string;
}

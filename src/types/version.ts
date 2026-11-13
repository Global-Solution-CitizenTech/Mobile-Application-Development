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

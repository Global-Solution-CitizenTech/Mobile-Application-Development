import type { GitCommitMetadata } from '../types/version.ts';

const FALLBACK_HASH = 'local-dev';
const DEFAULT_BRANCH = 'main';
const DEFAULT_COMMIT_MESSAGE = 'Build local (metadados Git indisponíveis)';

function isPlainRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function readNonEmptyString(record: Record<string, unknown>, key: string): string | undefined {
  const value = record[key];
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

export function parseGitCommitMetadata(extra: unknown): GitCommitMetadata {
  const rawCommit = isPlainRecord(extra) ? extra['gitCommit'] : undefined;
  const gitCommit = isPlainRecord(rawCommit) ? rawCommit : undefined;

  const commitHash = (gitCommit && readNonEmptyString(gitCommit, 'commitHash')) ?? FALLBACK_HASH;
  const shortCommitHash =
    (gitCommit && readNonEmptyString(gitCommit, 'shortCommitHash')) ?? commitHash.slice(0, 7);
  const commitDate = (gitCommit && readNonEmptyString(gitCommit, 'commitDate')) ?? '';
  const branch = (gitCommit && readNonEmptyString(gitCommit, 'branch')) ?? DEFAULT_BRANCH;
  const commitMessage =
    (gitCommit && readNonEmptyString(gitCommit, 'commitMessage')) ?? DEFAULT_COMMIT_MESSAGE;

  return {
    commitHash,
    shortCommitHash,
    commitDate,
    branch,
    commitMessage,
  };
}

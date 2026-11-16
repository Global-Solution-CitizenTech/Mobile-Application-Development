import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { parseGitCommitMetadata } from '../src/config/versionParser.ts';

describe('version metadata parser', () => {
  it('returns safe fallback metadata when extra is missing or malformed', () => {
    const fallback = {
      commitHash: 'local-dev',
      shortCommitHash: 'local-d',
      commitDate: '',
      branch: 'main',
      commitMessage: 'Build local (metadados Git indisponíveis)',
    };

    assert.deepEqual(parseGitCommitMetadata(undefined), fallback);
    assert.deepEqual(parseGitCommitMetadata(null), fallback);
    assert.deepEqual(parseGitCommitMetadata('invalid'), fallback);
    assert.deepEqual(parseGitCommitMetadata([]), fallback);
    assert.deepEqual(parseGitCommitMetadata({ gitCommit: 'not-an-object' }), fallback);
    assert.deepEqual(parseGitCommitMetadata({ gitCommit: ['array'] }), fallback);
  });

  it('parses complete gitCommit metadata from expoConfig.extra', () => {
    const parsed = parseGitCommitMetadata({
      gitCommit: {
        commitHash: 'abc1234567890def',
        shortCommitHash: 'abc1234',
        commitDate: '2026-11-16T10:00:00Z',
        branch: 'feat/modularization',
        commitMessage: 'refactor: centralize types and utils',
      },
    });

    assert.deepEqual(parsed, {
      commitHash: 'abc1234567890def',
      shortCommitHash: 'abc1234',
      commitDate: '2026-11-16T10:00:00Z',
      branch: 'feat/modularization',
      commitMessage: 'refactor: centralize types and utils',
    });
  });

  it('ignores non-string or blank fields and derives shortCommitHash from commitHash', () => {
    const parsed = parseGitCommitMetadata({
      gitCommit: {
        commitHash: '  9f8e7d6c5b4a  ',
        shortCommitHash: '   ',
        commitDate: 12345,
        branch: null,
        commitMessage: '',
      },
    });

    assert.deepEqual(parsed, {
      commitHash: '9f8e7d6c5b4a',
      shortCommitHash: '9f8e7d6',
      commitDate: '',
      branch: 'main',
      commitMessage: 'Build local (metadados Git indisponíveis)',
    });
  });
});

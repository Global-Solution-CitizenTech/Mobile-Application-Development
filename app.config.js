const { execSync } = require('child_process');

function getGitMetadata(fallback) {
  const envCommitHash =
    process.env.EAS_BUILD_GIT_COMMIT_HASH || process.env.EXPO_PUBLIC_COMMIT_HASH || '';
  try {
    const commitHash = execSync('git rev-parse HEAD', {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
    const shortCommitHash = commitHash.slice(0, 7);
    const branch = execSync('git rev-parse --abbrev-ref HEAD', {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
    const commitDate = execSync('git log -1 --format=%cI', {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
    const rawCommitMessage = execSync('git log -1 --format=%s', {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
    const cleanMsg = rawCommitMessage.replace(/[\r\n]+/g, ' ').trim();
    const commitMessage =
      cleanMsg.length <= 60 ? cleanMsg : `${cleanMsg.slice(0, 60).trim()}...`;

    return { commitHash, shortCommitHash, branch, commitDate, commitMessage };
  } catch (_error) {
    const hash =
      envCommitHash ||
      fallback?.commitHash ||
      '516b8b92afbb31a075c1f5befbc59cc9ebc5fcc8';
    return {
      commitHash: hash,
      shortCommitHash: hash.slice(0, 7),
      branch: process.env.EAS_BUILD_GIT_BRANCH || fallback?.branch || 'main',
      commitDate: fallback?.commitDate || new Date().toISOString(),
      commitMessage: fallback?.commitMessage || 'Release Build FIAP GS 2026/2',
    };
  }
}

module.exports = ({ config }) => ({
  ...config,
  extra: {
    ...config.extra,
    gitCommit: getGitMetadata(config.extra?.gitCommit),
  },
});

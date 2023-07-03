import config, { releaseRules } from 'storydocker-utilities/.releaserc.mjs';

const plugins = config.plugins.map(plugin => {
  if (Array.isArray(plugin) && plugin[0] === 'semantic-release-gitmoji') {
    return [
      'semantic-release-gitmoji',
      {
        tagFormat: 'scottnath-dot-com@v${version}',
        releaseRules,
      }
    ];
  }
  if (plugin === '@semantic-release/npm') return;
  return plugin;
}).filter(plugin => plugin !== undefined);


export default {
  ...config,
  plugins,
  branches: [
    { name: 'main' },
    { name: 'setup', channel: 'setup', prerelease: true },
  ],
};
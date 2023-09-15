const config = require('storydocker-utilities/releases');

const plugins = config.plugins.map(plugin => {
  if (Array.isArray(plugin) && plugin[0] === 'semantic-release-gitmoji') {
    return [
      'semantic-release-gitmoji',
      {
        tagFormat: 'scottnath-components@v${version}',
      }
    ];
  }
  if (plugin === '@semantic-release/npm') return;
  return plugin;
}).filter(plugin => plugin !== undefined);


module.exports = {
  ...config,
  plugins
};
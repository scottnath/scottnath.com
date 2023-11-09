// import { setCustomElementsManifest } from '@storybook/web-components';
// import customElements from '../src/custom-elements.json';

global.attrGen = (args) => Object.entries(args)
.filter(([key, value]) => value)
.map(([key, value]) => `\n  ${key}="${value}"`)
.join(' ');

// setCustomElementsManifest(customElements);
/** @type { import('@storybook/web-components').Preview } */
const preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
};

export default preview;

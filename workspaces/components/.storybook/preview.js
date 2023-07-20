import { setCustomElementsManifest } from '@storybook/web-components';
import customElements from '../src/custom-elements.json';

setCustomElementsManifest(customElements);
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

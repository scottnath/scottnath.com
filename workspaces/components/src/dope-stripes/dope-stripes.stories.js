
import './index.js';

export default {
  title: 'Dope stripes',
  component: 'dope-stripes',
  tags: ['autodocs'],
  render: (args) => {
  
    return `
      <style>
        dope-stripes::part(stripes) {
          ${args.styles}
        }
      </style>

      <dope-stripes stripes="${args.stripes}"></dope-stripes>
    `;
  }
};

export const Stripes = {
  args: {
    stripes: [
      'red', 'blue', 'yellow', 'green'
    ],
  },
}

export const ColorScheme = {
  args: {
    styles: `--left-width: 7em;
    --angle-width: 73px;
    --stripe-height: 16px;
    --stripe-angle: 20deg;
    `,
    stripes: ['#ffd273', '#ffbf57', '#ffa43b', '#ff8920', '#ff6e05'],
  }
}
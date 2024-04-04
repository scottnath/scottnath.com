
import './index.js';
import './stripe.js';

/**
 * Convert css variables to a string
 */
const stylez = (args={}) => {
  return Object.entries(args)
    .filter((entry) => entry[0].startsWith('--'))
    .map((entry) => `${entry[0]}: ${entry[1]};`)
    .join('\n');
}

const stripeLinkStyles = `
dope-stripe:hover {
  filter: invert(1);
}
.stripe-link {
  --pad-r: .2em;
  font-size: 1em;
  color: var(--stripe-color);
  filter: invert(1);
  display: flex;
  flex-direction: row-reverse;
  height: 100%;
  padding-right: var(--pad-r); 
  width: calc(100% - var(--pad-r));
  * {
    align-self: last baseline;
  }
}
`;

export default {
  title: 'Dope stripes',
  component: 'dope-stripes',
  tags: ['autodocs'],
  render: (args) => {
    const styleArgs = stylez(args)
    return `
      <style>
        dope-stripe {
          ${styleArgs}
        }
        ${stripeLinkStyles}
      </style>

      <dope-stripes stripes="${args.stripes}">${args.slotz || ''}</dope-stripes>
    `;
  }
};

export const Stripe = {
  component: 'dope-stripe',
  argTypes: {
    // '--angle-x-start': { control: { type: 'range', min: 1, max: 100 } },
    '--angle-x-start': { control: { type: 'text', value: '35%' } },
    '--angle-width': { control: { type: 'text', value: '5%' } },
    '--angle-y-end': { control: { type: 'text', value: '40px' } },
    '--stripe-height': { control: { type: 'text', value: '35%' } },
    '--stripe-color': { control: { type: 'color' } },
  },
  render: (args) => {
    console.log('styleArgs', Object.entries(args))
    const styleArgs = stylez(args)
    
    return `
      <style>
        dope-stripe {
          --stripe-height: 1.5em
        }
        dope-stripe::part(stripe) {
          display: block;
        }
        ${stripeLinkStyles}
      </style>

      <dope-stripe color="${args.color}" style="${styleArgs}">${args.slotz || ''}</dope-stripe>
    `;
  },
}

export const StripeStyled = {
  ...Stripe,
  args: {
    '--stripe-color': 'blue',
    '--angle-x-start': '7em',
    '--angle-width': '73px',
  }
}
export const StripeWithSlot = {
  ...Stripe,
  args: {
    slotz: `<a href="#" class="stripe-link"><span>Meow Meow</span></a>`,
  }
}

export const Stripes = {
  args: {
    stripes: [
      'red', 'blue', 'yellow', 'green'
    ],
  },
}

export const ColorScheme = {
  args: {
    stripes: ['#ffd273', '#ffbf57', '#ffa43b', '#ff8920', '#ff6e05'],
  }
}

export const StripesWithSlot = {
  args: {
    '--stripe-height': '1.5em',
    slotz: `
      <dope-stripe color="#ffd273"></dope-stripe>
      <dope-stripe color="#ffbf57"><a href="#1" class="stripe-link"><span>Hello Hello</span></a></dope-stripe>
      <dope-stripe color="#ffa43b"><a href="#2" class="stripe-link"><span>Hello Hello Hello</span></a></dope-stripe>
      <dope-stripe color="#ff8920"><a href="#3" class="stripe-link"><span>Hello Hello Hello Hello</span></a></dope-stripe>
      <dope-stripe color="#ff6e05"><a href="#4" class="stripe-link"><span>Hello Hello Hello Hello Hello</span></a></dope-stripe>
    `,
  }
}

export const Mixed = {
  args: {
    '--stripe-height': '1.5em',
    stripes: ['#ffd273'],
    slotz: `
      <dope-stripe color="#ffbf57"><a href="#1" class="stripe-link"><span>Hello Hello</span></a></dope-stripe>
      <dope-stripe color="#ffa43b"><a href="#2" class="stripe-link"><span>Hello Hello Hello</span></a></dope-stripe>
      <dope-stripe color="#ff8920"><a href="#3" class="stripe-link"><span>Hello Hello Hello Hello</span></a></dope-stripe>
      <dope-stripe color="#ff6e05"><a href="#4" class="stripe-link"><span>Hello Hello Hello Hello Hello</span></a></dope-stripe>
    `,
  }
}

/**
 * Creates one stripe
 * @param {string} color - The color of the stripe
 * @returns {string} - The HTML for the stripe
 */
export const stripe = (color) => {
  return `<div class="stripe" style="--stripe-color: ${color}"><span></span></div>`
}

/**
 * Creates a set of stripes
 * @param {string[]} stripes - An array of colors to use for the stripes
 * @returns {string} - The HTML for the stripes
 */
const html = (stripes) => {
  return `<div class="stripes" part="stripes">
    ${Array.isArray(stripes) && stripes.length > 0 ? stripes.map(stripe).join('') : ''}
  </div>`;
}

export default html;
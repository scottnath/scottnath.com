
/**
 * Creates one timeline item
 * @param {string} color - The color of the stripe
 * @returns {string} - The HTML for the stripe
 */
export const item = (datetime) => {
  return `<dt><time>${datetime}</time></dt><dd><slot></slot></dd>`
}

/**
 * Creates a set of stripes
 * @param {string[]} stripes - An array of colors to use for the stripes
 * @returns {string} - The HTML for the stripes
 */
const html = (items) => {
  return `<dl>
    ${Array.isArray(items) && items.length > 0 ? items.map(item).join('') : ''}
  </dl>`;
}

export default html;
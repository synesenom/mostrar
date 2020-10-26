/**
 * Extracts all class and ID selectors for an element.
 *
 * @method extractSelectors
 * @param {HTMLElement} el The node to extract selectors for.
 * @return {string[]} Array of strings representing the valid selectors for this node.
 */
export default function (el) {
    return ['#' + el.id].concat(el.classList.toString().split(' ').map(c => '.' + c).sort())
}
